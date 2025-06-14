
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket connecté pour chat vocal temps réel");

  let openAISocket: WebSocket | null = null;
  let isConnected = false;

  // Connexion à l'API OpenAI Realtime
  const connectToOpenAI = async () => {
    try {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      console.log("🔌 Connexion à OpenAI Realtime API...");
      
      openAISocket = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
        [],
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1"
          }
        }
      );

      openAISocket.onopen = () => {
        console.log("✅ Connecté à OpenAI Realtime API");
        isConnected = true;
        
        // Envoyer la configuration de session
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: "Tu es Clara, une réceptionniste IA française amicale et professionnelle. Réponds de manière naturelle et concise. Tu aides les clients avec leurs questions et tu peux les diriger vers les bonnes personnes.",
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 800
            },
            temperature: 0.7,
            max_response_output_tokens: 300
          }
        };
        
        openAISocket?.send(JSON.stringify(sessionConfig));
        console.log("📤 Configuration de session envoyée");
        
        // Notifier le client que tout est prêt
        socket.send(JSON.stringify({
          type: 'connection_established',
          message: 'Chat vocal temps réel activé',
          status: 'ready'
        }));
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          console.log(`📨 OpenAI Event: ${data.type}`);
          
          // Transférer tous les événements au client
          socket.send(event.data);
          
        } catch (error) {
          console.error('❌ Erreur parsing OpenAI message:', error);
        }
      };

      openAISocket.onclose = (event) => {
        console.log(`🔌 OpenAI WebSocket fermé: ${event.code} ${event.reason}`);
        isConnected = false;
        
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Connexion OpenAI fermée'
        }));
      };

      openAISocket.onerror = (error) => {
        console.error('❌ Erreur OpenAI WebSocket:', error);
        isConnected = false;
        
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Erreur connexion OpenAI'
        }));
      };

    } catch (error) {
      console.error('❌ Erreur connexion OpenAI:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: `Erreur OpenAI: ${error.message}`
      }));
    }
  };

  socket.onopen = () => {
    console.log("🎉 Client WebSocket connecté");
    connectToOpenAI();
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`📨 Client Event: ${data.type}`);
      
      if (data.type === 'ping') {
        socket.send(JSON.stringify({ 
          type: 'pong', 
          timestamp: Date.now() 
        }));
        return;
      }

      // Transférer tous les messages au serveur OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(JSON.stringify(data));
        console.log(`📤 Message transféré à OpenAI: ${data.type}`);
      } else {
        console.error('❌ OpenAI WebSocket non connecté');
        socket.send(JSON.stringify({
          type: 'error',
          message: 'OpenAI non connecté'
        }));
      }
      
    } catch (error) {
      console.error('❌ Erreur parsing client message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Format de message invalide'
      }));
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client WebSocket fermé");
    if (openAISocket) {
      openAISocket.close();
    }
  };
  
  socket.onerror = (error) => {
    console.error("❌ Erreur Client WebSocket:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
