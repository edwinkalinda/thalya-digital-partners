
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Réponses ultra-rapides sans API
const quickResponses = new Map([
  ['bonjour', 'Bonjour ! Comment allez-vous ?'],
  ['hello', 'Hello ! How are you?'],
  ['salut', 'Salut ! Ça va ?'],
  ['merci', 'Je vous en prie !'],
  ['merci beaucoup', 'Avec plaisir !'],
  ['ok', 'Parfait !'],
  ['oui', 'Très bien !'],
  ['non', 'D\'accord, je comprends.'],
  ['au revoir', 'Au revoir ! À bientôt !'],
  ['comment ça va', 'Ça va très bien, merci !'],
  ['ça va', 'Oui, très bien !'],
  ['test', 'Test réussi ! Tout fonctionne.'],
  ['aide', 'Je suis là pour vous aider !'],
  ['help', 'I\'m here to help you!']
]);

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket ultra-simple connecté");

  // Traitement instantané sans STT
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Message reçu: "${message}"`);

    const normalizedMessage = message.toLowerCase().trim();
    
    // Recherche de réponse rapide
    for (const [key, response] of quickResponses.entries()) {
      if (normalizedMessage.includes(key)) {
        const latency = Date.now() - startTime;
        console.log(`⚡ Réponse instantanée (${latency}ms): ${response}`);
        
        socket.send(JSON.stringify({
          type: 'instant_response',
          response: response,
          latency: latency,
          source: 'instant'
        }));
        return;
      }
    }

    // Réponse par défaut si aucune correspondance
    const defaultResponse = "Je vous écoute attentivement.";
    const latency = Date.now() - startTime;
    
    console.log(`💬 Réponse par défaut (${latency}ms): ${defaultResponse}`);
    
    socket.send(JSON.stringify({
      type: 'instant_response',
      response: defaultResponse,
      latency: latency,
      source: 'default'
    }));
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket ultra-simple prêt");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Système ultra-simple activé',
      status: 'ready',
      features: ['Réponses instantanées', 'Zero latence', 'Messages texte uniquement']
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`📨 Reçu:`, data.type);
      
      switch (data.type) {
        case 'text_message':
          await processMessage(data.message);
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ 
            type: 'pong', 
            timestamp: Date.now(),
            status: 'healthy'
          }));
          break;
          
        default:
          console.log(`⚠️ Type de message non supporté: ${data.type}`);
          socket.send(JSON.stringify({
            type: 'error',
            message: `Type ${data.type} non supporté. Utilisez 'text_message'.`
          }));
      }
    } catch (error) {
      console.error('❌ Erreur parsing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Format de message invalide'
      }));
    }
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket fermé proprement");
  };
  
  socket.onerror = (error) => {
    console.error("❌ Erreur WebSocket:", error);
  };

  return response;
});
