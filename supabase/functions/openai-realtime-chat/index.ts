
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    console.error('OpenAI API key not found')
    return new Response('OpenAI API key not configured', { 
      status: 500,
      headers: corsHeaders 
    })
  }

  // Handle WebSocket upgrade
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    let openaiWs: WebSocket | null = null
    
    socket.onopen = () => {
      console.log("Client WebSocket connected")
      
      // Connect to OpenAI Realtime API
      openaiWs = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", {
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "OpenAI-Beta": "realtime=v1"
        }
      })
      
      openaiWs.onopen = () => {
        console.log("Connected to OpenAI Realtime API")
      }
      
      openaiWs.onmessage = (event) => {
        try {
          // Forward OpenAI messages to client with minimal latency
          socket.send(event.data)
        } catch (error) {
          console.error("Error forwarding OpenAI message:", error)
        }
      }
      
      openaiWs.onclose = (event) => {
        console.log("OpenAI WebSocket closed:", event.code, event.reason)
        if (socket.readyState === WebSocket.OPEN) {
          socket.close()
        }
      }
      
      openaiWs.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error)
        if (socket.readyState === WebSocket.OPEN) {
          socket.close()
        }
      }
    }
    
    socket.onmessage = (event) => {
      try {
        // Forward client messages to OpenAI with minimal latency
        if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data)
        }
      } catch (error) {
        console.error("Error forwarding client message:", error)
      }
    }
    
    socket.onclose = () => {
      console.log("Client WebSocket disconnected")
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close()
      }
    }
    
    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error)
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close()
      }
    }
    
    return response
  }

  return new Response('WebSocket endpoint', { 
    status: 400,
    headers: corsHeaders 
  })
})
