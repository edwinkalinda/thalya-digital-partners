
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { 
      status: 426,
      headers: corsHeaders 
    });
  }

  // Vérifier la clé API OpenAI
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY manquante");
    return new Response("OpenAI API Key required", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  console.log("✅ Démarrage du proxy WebSocket OpenAI Realtime");
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let isConnected = false;
  let sessionConfigured = false;
  let ephemeralToken: string | null = null;

  // Fonction pour envoyer des messages de manière sécurisée
  const safeSend = (ws: WebSocket | null, data: any): boolean => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      ws.send(message);
      return true;
    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
      return false;
    }
  };

  // Créer une session éphémère OpenAI
  const createEphemeralSession = async (): Promise<string | null> => {
    try {
      console.log("🔑 Création d'une session éphémère OpenAI...");
      
      const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-10-01",
          voice: "alloy",
          instructions: "Tu es Clara, une réceptionniste IA française très amicale et professionnelle. Tu parles français naturellement et réponds de manière concise et utile.",
          modalities: ["text", "audio"],
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          temperature: 0.8,
          max_response_output_tokens: 150
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur création session:", response.status, errorText);
        return null;
      }

      const sessionData = await response.json();
      console.log("✅ Session éphémère créée:", sessionData.id);
      
      return sessionData.client_secret?.value || null;
    } catch (error) {
      console.error("❌ Erreur lors de la création de session éphémère:", error);
      return null;
    }
  };

  // Connecter à OpenAI Realtime API avec token éphémère
  const connectToOpenAI = async () => {
    try {
      // Créer d'abord une session éphémère
      ephemeralToken = await createEphemeralSession();
      
      if (!ephemeralToken) {
        console.error("❌ Impossible de créer une session éphémère");
        safeSend(socket, {
          type: 'error',
          message: 'Impossible de créer une session OpenAI'
        });
        return;
      }

      console.log("🔌 Connexion à OpenAI Realtime avec token éphémère...");
      
      // Utiliser le token éphémère pour la connexion WebSocket
      const wsUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
      
      openAISocket = new WebSocket(wsUrl, [], {
        headers: {
          "Authorization": `Bearer ${ephemeralToken}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      openAISocket.onopen = () => {
        console.log("✅ Connexion OpenAI établie avec token éphémère");
        isConnected = true;
        sessionConfigured = true; // Session déjà configurée via REST API
        
        safeSend(socket, {
          type: 'connection_status',
          status: 'connected',
          message: 'Connexion OpenAI réussie avec session pré-configurée'
        });

        safeSend(socket, {
          type: 'session_ready',
          message: 'Chat vocal prêt'
        });
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`📨 OpenAI -> Client: ${data.type}`);
          
          // Transférer tous les événements au client
          safeSend(socket, data);
          
        } catch (error) {
          console.error("❌ Erreur parsing message OpenAI:", error);
        }
      };

      openAISocket.onclose = (event) => {
        console.log(`🔌 OpenAI fermé: ${event.code} ${event.reason}`);
        isConnected = false;
        sessionConfigured = false;
        
        safeSend(socket, {
          type: 'connection_status',
          status: 'disconnected',
          message: 'Connexion OpenAI fermée',
          code: event.code,
          reason: event.reason
        });
      };

      openAISocket.onerror = (error) => {
        console.error("❌ Erreur OpenAI WebSocket:", error);
        safeSend(socket, {
          type: 'error',
          message: 'Erreur connexion OpenAI'
        });
      };

    } catch (error) {
      console.error("❌ Erreur création WebSocket:", error);
      safeSend(socket, {
        type: 'error',
        message: 'Impossible de se connecter à OpenAI'
      });
    }
  };

  // Gestion des événements du client
  socket.onopen = () => {
    console.log("🎉 Client connecté");
    connectToOpenAI();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`📨 Client -> OpenAI: ${data.type}`);
      
      // Gérer les pings
      if (data.type === 'ping') {
        safeSend(socket, {
          type: 'pong',
          timestamp: Date.now(),
          openaiConnected: isConnected,
          sessionReady: sessionConfigured
        });
        return;
      }

      // Vérifier que OpenAI est connecté
      if (!openAISocket || openAISocket.readyState !== WebSocket.OPEN) {
        console.error("❌ OpenAI non connecté");
        safeSend(socket, {
          type: 'error',
          message: 'OpenAI non connecté'
        });
        return;
      }

      // Transférer le message à OpenAI
      safeSend(openAISocket, data);
      
    } catch (error) {
      console.error("❌ Erreur parsing message client:", error);
      safeSend(socket, {
        type: 'error',
        message: 'Message invalide'
      });
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client déconnecté");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Erreur client WebSocket:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
