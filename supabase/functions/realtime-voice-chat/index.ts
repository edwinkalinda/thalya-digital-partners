
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
  
  console.log("🚀 Client WebSocket connecté");

  let openAISocket: WebSocket | null = null;
  let connectionState = {
    isConnected: false,
    sessionConfigured: false,
    reconnectAttempts: 0
  };
  const maxReconnectAttempts = 3;

  // Fonction pour envoyer des messages en sécurité
  const safeSend = (ws: WebSocket | null, data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        ws.send(message);
        return true;
      } catch (error) {
        console.error("❌ Erreur envoi message:", error);
        return false;
      }
    }
    return false;
  };

  // Fonction pour gérer les erreurs OpenAI de manière robuste
  const handleOpenAIError = (error: any) => {
    console.error('❌ Erreur OpenAI:', error);
    
    let errorMessage = 'Erreur de connexion OpenAI';
    
    if (error && typeof error === 'object') {
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    safeSend(socket, {
      type: 'error',
      message: errorMessage
    });
    
    return errorMessage;
  };

  // Connexion à l'API OpenAI Realtime avec retry logic
  const connectToOpenAI = async () => {
    if (connectionState.reconnectAttempts >= maxReconnectAttempts) {
      console.error("❌ Trop de tentatives de reconnexion");
      safeSend(socket, {
        type: 'error',
        message: 'Connexion OpenAI impossible après plusieurs tentatives'
      });
      return;
    }

    try {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      console.log(`🔌 Tentative de connexion OpenAI (${connectionState.reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
      
      openAISocket = new WebSocket(url, [], {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      openAISocket.onopen = () => {
        console.log("✅ Connecté à OpenAI Realtime API");
        connectionState.isConnected = true;
        connectionState.reconnectAttempts = 0;
        
        safeSend(socket, {
          type: 'connection_status',
          status: 'connected',
          message: 'Connexion OpenAI établie'
        });
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`📨 OpenAI Event: ${data.type}`);
          
          // Configuration automatique de la session
          if (data.type === 'session.created' && !connectionState.sessionConfigured) {
            console.log("🎉 Session créée, envoi de la configuration...");
            
            const sessionConfig = {
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: "Tu es Clara, une réceptionniste IA française très amicale et professionnelle. Tu parles français naturellement. Réponds de manière concise et utile.",
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
                  silence_duration_ms: 1000
                },
                temperature: 0.8,
                max_response_output_tokens: 150
              }
            };
            
            if (safeSend(openAISocket, sessionConfig)) {
              connectionState.sessionConfigured = true;
              console.log("📤 Configuration de session envoyée");
            }
          }
          
          // Configuration confirmée
          if (data.type === 'session.updated') {
            console.log("⚙️ Session configurée avec succès");
            
            safeSend(socket, {
              type: 'session_ready',
              message: 'Chat vocal temps réel prêt'
            });
          }
          
          // Transférer l'événement au client
          safeSend(socket, data);
          
        } catch (error) {
          console.error('❌ Erreur parsing OpenAI message:', error);
          handleOpenAIError(error);
        }
      };

      openAISocket.onclose = (event) => {
        console.log(`🔌 OpenAI WebSocket fermé: ${event.code} ${event.reason || 'Aucune raison'}`);
        connectionState.isConnected = false;
        connectionState.sessionConfigured = false;
        
        safeSend(socket, {
          type: 'connection_status',
          status: 'disconnected',
          message: `Connexion OpenAI fermée: ${event.reason || 'Connexion interrompue'}`
        });
        
        // Retry après un délai si ce n'est pas une fermeture volontaire
        if (event.code !== 1000 && connectionState.reconnectAttempts < maxReconnectAttempts) {
          connectionState.reconnectAttempts++;
          setTimeout(() => {
            console.log(`🔄 Reconnexion OpenAI dans 2s...`);
            connectToOpenAI();
          }, 2000);
        }
      };

      openAISocket.onerror = (error) => {
        console.error('❌ Erreur OpenAI WebSocket:', error);
        connectionState.reconnectAttempts++;
        handleOpenAIError(error);
      };

    } catch (error) {
      console.error('❌ Erreur connexion OpenAI:', error);
      connectionState.reconnectAttempts++;
      handleOpenAIError(error);
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
        safeSend(socket, { 
          type: 'pong', 
          timestamp: Date.now() 
        });
        return;
      }

      // Vérifier l'état de la connexion avant de transférer
      if (!openAISocket || openAISocket.readyState !== WebSocket.OPEN) {
        console.error('❌ OpenAI WebSocket non disponible, état:', openAISocket?.readyState);
        safeSend(socket, {
          type: 'error',
          message: 'OpenAI non connecté, reconnexion en cours...'
        });
        
        // Tenter une reconnexion
        if (!connectionState.isConnected && connectionState.reconnectAttempts < maxReconnectAttempts) {
          connectToOpenAI();
        }
        return;
      }

      if (!connectionState.sessionConfigured) {
        console.error('❌ Session OpenAI non configurée');
        safeSend(socket, {
          type: 'error',
          message: 'Session non configurée, patientez...'
        });
        return;
      }

      // Transférer le message à OpenAI
      if (safeSend(openAISocket, data)) {
        console.log(`📤 Message transféré à OpenAI: ${data.type}`);
      } else {
        console.error('❌ Échec transfert message à OpenAI');
        safeSend(socket, {
          type: 'error',
          message: 'Impossible de transférer le message'
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur parsing client message:', error);
      safeSend(socket, {
        type: 'error',
        message: 'Format de message invalide'
      });
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client WebSocket fermé");
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close(1000, "Client disconnected");
    }
  };
  
  socket.onerror = (error) => {
    console.error("❌ Erreur Client WebSocket:", error);
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close(1000, "Client error");
    }
  };

  return response;
});
