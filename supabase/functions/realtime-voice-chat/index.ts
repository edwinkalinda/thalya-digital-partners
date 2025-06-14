import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation des messages entrants
const validateMessage = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!data.type || typeof data.type !== 'string') return false;
  
  // Validation spécifique par type
  switch (data.type) {
    case 'input_audio_buffer.append':
      return typeof data.audio === 'string' && data.audio.length > 0;
    case 'text_message':
      return typeof data.message === 'string' && data.message.trim().length > 0;
    case 'ping':
      return true;
    default:
      return true; // Laisser passer les autres types pour flexibilité
  }
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { 
      status: 426,
      headers: corsHeaders 
    });
  }

  // Vérifier immédiatement la clé API OpenAI
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
    console.error("❌ ERREUR CRITIQUE: OPENAI_API_KEY non configurée ou vide");
    return new Response("OpenAI API Key not configured", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  console.log("✅ Clé OpenAI API détectée, longueur:", OPENAI_API_KEY.length);
  console.log("🔑 Préfixe de la clé:", OPENAI_API_KEY.substring(0, 7) + "...");

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 Client WebSocket connecté");

  let openAISocket: WebSocket | null = null;
  let connectionState = {
    isConnected: false,
    sessionConfigured: false,
    reconnectAttempts: 0,
    lastError: null as string | null
  };
  const maxReconnectAttempts = 3;
  let reconnectTimeout: number | null = null;

  // Fonction pour nettoyer les ressources
  const cleanup = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (openAISocket && openAISocket.readyState !== WebSocket.CLOSED) {
      try {
        openAISocket.close(1000, "Cleanup");
      } catch (error) {
        console.error("Erreur lors du nettoyage OpenAI WebSocket:", error);
      }
    }
    openAISocket = null;
    connectionState.isConnected = false;
    connectionState.sessionConfigured = false;
  };

  // Fonction pour envoyer des messages en sécurité avec retry
  const safeSend = (ws: WebSocket | null, data: any, retries = 1): boolean => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket non disponible pour l'envoi");
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      ws.send(message);
      return true;
    } catch (error) {
      console.error(`Erreur envoi message (tentative ${2 - retries}):`, error);
      
      if (retries > 0 && ws.readyState === WebSocket.OPEN) {
        setTimeout(() => safeSend(ws, data, retries - 1), 100);
      }
      return false;
    }
  };

  // Fonction pour gérer les erreurs OpenAI avec plus de détails
  const handleOpenAIError = (error: any, context = "") => {
    console.error(`❌ Erreur OpenAI ${context}:`, error);
    
    let errorMessage = 'Erreur de connexion OpenAI';
    let shouldReconnect = false;
    
    if (error && typeof error === 'object') {
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      
      // Gestion spéciale pour les erreurs d'authentification
      if (errorMessage.includes('Missing bearer or basic authentication')) {
        errorMessage = 'Clé API OpenAI non configurée ou invalide';
        shouldReconnect = false; // Pas de reconnexion pour les erreurs d'auth
        
        safeSend(socket, {
          type: 'error',
          message: 'Configuration OpenAI requise',
          details: 'Veuillez configurer votre clé API OpenAI dans les secrets Supabase',
          fatal: true
        });
        return { errorMessage, shouldReconnect };
      }
      
      // Déterminer si on doit reconnecter basé sur le type d'erreur
      const errorStr = errorMessage.toLowerCase();
      shouldReconnect = errorStr.includes('connection') || 
                      errorStr.includes('network') || 
                      errorStr.includes('timeout');
    } else if (typeof error === 'string') {
      errorMessage = error;
      shouldReconnect = error.includes('connection');
    }
    
    connectionState.lastError = errorMessage;
    
    safeSend(socket, {
      type: 'error',
      message: errorMessage,
      context: context,
      canRetry: shouldReconnect
    });
    
    return { errorMessage, shouldReconnect };
  };

  // Connexion à l'API OpenAI Realtime avec meilleure gestion d'erreur
  const connectToOpenAI = async () => {
    if (connectionState.reconnectAttempts >= maxReconnectAttempts) {
      console.error("❌ Trop de tentatives de reconnexion");
      safeSend(socket, {
        type: 'error',
        message: 'Connexion OpenAI impossible après plusieurs tentatives',
        fatal: true
      });
      return;
    }

    try {
      console.log(`🔌 Tentative de connexion OpenAI (${connectionState.reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      // Nettoyer toute connexion existante
      if (openAISocket) {
        openAISocket.close();
        openAISocket = null;
      }
      
      const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
      
      // Vérifier à nouveau la clé API avant de créer la connexion
      if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
        throw new Error('Clé API OpenAI manquante ou vide');
      }
      
      console.log("📡 Création WebSocket OpenAI avec URL:", url);
      console.log("🔐 En-têtes d'autorisation configurés");
      
      // Créer le WebSocket avec les en-têtes corrects
      openAISocket = new WebSocket(url);
      
      // Ajouter les en-têtes après création (méthode alternative pour Deno)
      if (openAISocket.readyState === WebSocket.CONNECTING) {
        console.log("🔗 WebSocket en cours de connexion...");
      }

      // Timeout pour la connexion
      const connectionTimeout = setTimeout(() => {
        if (openAISocket && openAISocket.readyState === WebSocket.CONNECTING) {
          console.error("⏰ Timeout de connexion OpenAI");
          openAISocket.close();
          handleOpenAIError("Timeout de connexion OpenAI", "connexion");
        }
      }, 15000);

      openAISocket.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("✅ WebSocket OpenAI ouvert, envoi de l'autorisation...");
        
        // Envoyer immédiatement un message d'autorisation si nécessaire
        try {
          // Pour l'API Realtime, l'autorisation se fait via query params ou headers
          // Essayons de fermer et recréer avec la bonne méthode
          openAISocket?.close();
          
          // Recréer avec authorization dans l'URL
          const authorizedUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
          console.log("🔄 Recréation avec autorisation dans headers...");
          
          // Utiliser fetch pour tester d'abord l'autorisation
          fetch("https://api.openai.com/v1/models", {
            headers: {
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json"
            }
          }).then(async (testResponse) => {
            console.log("🧪 Test autorisation OpenAI:", testResponse.status);
            if (testResponse.ok) {
              console.log("✅ Autorisation OpenAI validée");
              
              // Créer le WebSocket avec une approche différente
              const wsUrl = new URL(authorizedUrl);
              openAISocket = new WebSocket(wsUrl.toString(), [], {
                headers: {
                  "Authorization": `Bearer ${OPENAI_API_KEY}`,
                  "OpenAI-Beta": "realtime=v1"
                }
              });
              
              openAISocket.onopen = () => {
                console.log("✅ Connecté à OpenAI Realtime API avec succès");
                connectionState.isConnected = true;
                connectionState.reconnectAttempts = 0;
                connectionState.lastError = null;
                
                safeSend(socket, {
                  type: 'connection_status',
                  status: 'connected',
                  message: 'Connexion OpenAI établie avec succès'
                });
              };
              
              // ... keep existing code (handlers pour messages, erreurs, etc.)
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
                      console.log("📤 Configuration de session envoyée avec succès");
                    }
                  }
                  
                  // Configuration confirmée
                  if (data.type === 'session.updated') {
                    console.log("⚙️ Session configurée avec succès");
                    
                    safeSend(socket, {
                      type: 'session_ready',
                      message: 'Chat vocal temps réel prêt - Authentification OpenAI réussie'
                    });
                  }

                  // Gestion des erreurs OpenAI
                  if (data.type === 'error') {
                    console.error("❌ Erreur OpenAI:", data);
                    handleOpenAIError(data.error || data, "réponse");
                    return;
                  }
                  
                  // Transférer l'événement au client
                  safeSend(socket, data);
                  
                } catch (error) {
                  console.error('❌ Erreur parsing OpenAI message:', error);
                  handleOpenAIError(error, "parsing");
                }
              };

              openAISocket.onclose = (event) => {
                clearTimeout(connectionTimeout);
                console.log(`🔌 OpenAI WebSocket fermé: ${event.code} ${event.reason || 'Aucune raison'}`);
                connectionState.isConnected = false;
                connectionState.sessionConfigured = false;
                
                // Message plus spécifique selon le code d'erreur
                let closeMessage = `Connexion OpenAI fermée: ${event.reason || 'Connexion interrompue'}`;
                if (event.code === 3000) {
                  closeMessage = 'Erreur d\'authentification OpenAI - Vérifiez votre clé API';
                }
                
                safeSend(socket, {
                  type: 'connection_status',
                  status: 'disconnected',
                  message: closeMessage,
                  code: event.code
                });
                
                // Retry après un délai si ce n'est pas une fermeture volontaire ou erreur d'auth
                if (event.code !== 1000 && event.code !== 3000 && connectionState.reconnectAttempts < maxReconnectAttempts) {
                  connectionState.reconnectAttempts++;
                  const delay = Math.min(2000 * Math.pow(2, connectionState.reconnectAttempts - 1), 10000);
                  
                  console.log(`🔄 Programmation reconnexion dans ${delay}ms...`);
                  reconnectTimeout = setTimeout(() => {
                    console.log(`🔄 Reconnexion OpenAI automatique...`);
                    connectToOpenAI();
                  }, delay);
                } else if (event.code === 3000) {
                  safeSend(socket, {
                    type: 'error',
                    message: 'Erreur d\'authentification OpenAI',
                    details: 'Votre clé API OpenAI est invalide ou expirée',
                    fatal: true
                  });
                }
              };

              openAISocket.onerror = (error) => {
                clearTimeout(connectionTimeout);
                console.error('❌ Erreur OpenAI WebSocket:', error);
                connectionState.reconnectAttempts++;
                const { shouldReconnect } = handleOpenAIError(error, "connexion");
                
                if (shouldReconnect && connectionState.reconnectAttempts < maxReconnectAttempts) {
                  const delay = Math.min(2000 * Math.pow(2, connectionState.reconnectAttempts - 1), 5000);
                  reconnectTimeout = setTimeout(() => connectToOpenAI(), delay);
                }
              };
              
            } else {
              const errorText = await testResponse.text();
              console.error("❌ Test autorisation échoué:", testResponse.status, errorText);
              throw new Error(`Autorisation OpenAI échouée: ${testResponse.status}`);
            }
          }).catch((error) => {
            console.error("❌ Erreur test autorisation:", error);
            handleOpenAIError(error, "test autorisation");
          });
          
        } catch (error) {
          console.error("❌ Erreur setup autorisation:", error);
          handleOpenAIError(error, "setup autorisation");
        }
      };

      openAISocket.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log(`🔌 WebSocket initial fermé: ${event.code} ${event.reason || 'Aucune raison'}`);
        // Le nouveau WebSocket sera créé dans onopen
      };

      openAISocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('❌ Erreur WebSocket initial:', error);
        handleOpenAIError(error, "connexion initiale");
      };

    } catch (error) {
      console.error('❌ Erreur connexion OpenAI:', error);
      connectionState.reconnectAttempts++;
      handleOpenAIError(error, "initialisation");
    }
  };

  socket.onopen = () => {
    console.log("🎉 Client WebSocket connecté, démarrage connexion OpenAI");
    connectToOpenAI();
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`📨 Client Event: ${data.type}`);
      
      // Validation du message
      if (!validateMessage(data)) {
        console.error('❌ Message invalide reçu:', data);
        safeSend(socket, {
          type: 'error',
          message: 'Format de message invalide',
          received: data.type || 'unknown'
        });
        return;
      }
      
      if (data.type === 'ping') {
        safeSend(socket, { 
          type: 'pong', 
          timestamp: Date.now(),
          serverTime: new Date().toISOString(),
          openaiConnected: connectionState.isConnected,
          sessionReady: connectionState.sessionConfigured
        });
        return;
      }

      // Vérifier l'état de la connexion avant de transférer
      if (!openAISocket || openAISocket.readyState !== WebSocket.OPEN) {
        console.error('❌ OpenAI WebSocket non disponible, état:', openAISocket?.readyState);
        safeSend(socket, {
          type: 'error',
          message: 'OpenAI non connecté, reconnexion en cours...',
          state: openAISocket?.readyState || 'null',
          lastError: connectionState.lastError
        });
        
        // Tenter une reconnexion si pas déjà en cours
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

      // Validation spécifique pour les données audio
      if (data.type === 'input_audio_buffer.append' && data.audio) {
        try {
          // Vérifier que c'est un base64 valide
          atob(data.audio);
        } catch (error) {
          console.error('❌ Données audio base64 invalides');
          safeSend(socket, {
            type: 'error',
            message: 'Données audio invalides'
          });
          return;
        }
      }

      // Transférer le message à OpenAI
      if (safeSend(openAISocket, data)) {
        console.log(`📤 Message transféré à OpenAI: ${data.type}`);
      } else {
        console.error('❌ Échec transfert message à OpenAI');
        safeSend(socket, {
          type: 'error',
          message: 'Impossible de transférer le message',
          messageType: data.type
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur parsing client message:', error);
      safeSend(socket, {
        type: 'error',
        message: 'Erreur de traitement du message',
        details: error.message
      });
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client WebSocket fermé");
    cleanup();
  };
  
  socket.onerror = (error) => {
    console.error("❌ Erreur Client WebSocket:", error);
    cleanup();
  };

  return response;
});
