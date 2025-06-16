
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, connection',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle WebSocket upgrade
  if (req.headers.get('upgrade') === 'websocket') {
    const { socket, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    socket.onopen = async () => {
      console.log('Client WebSocket connected');
      
      try {
        const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
        if (!OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY not set');
        }

        // Connexion à l'API Realtime d'OpenAI
        openaiWs = new WebSocket(
          'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'realtime=v1'
            }
          }
        );

        openaiWs.onopen = () => {
          console.log('Connected to OpenAI Realtime API');
        };

        openaiWs.onmessage = (event) => {
          // Relayer les messages d'OpenAI vers le client
          socket.send(event.data);
        };

        openaiWs.onclose = () => {
          console.log('OpenAI WebSocket closed');
          socket.close();
        };

        openaiWs.onerror = (error) => {
          console.error('OpenAI WebSocket error:', error);
          socket.close();
        };

      } catch (error) {
        console.error('Error connecting to OpenAI:', error);
        socket.close();
      }
    };

    socket.onmessage = (event) => {
      // Relayer les messages du client vers OpenAI
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log('Client WebSocket disconnected');
      if (openaiWs) {
        openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
      if (openaiWs) {
        openaiWs.close();
      }
    };

    return response;
  }

  return new Response('WebSocket endpoint', {
    headers: corsHeaders,
  });
});
