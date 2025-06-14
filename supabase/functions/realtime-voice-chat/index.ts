
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache ultra-simple
const simpleCache = new Map<string, { response: string; audio: string; timestamp: number }>();

// Réponses instantanées pré-générées (sans audio pour éviter rate limit)
const instantText = new Map([
  ['bonjour', 'Bonjour !'],
  ['hello', 'Hello !'],
  ['salut', 'Salut !'],
  ['merci', 'De rien !'],
  ['ok', 'Parfait !'],
  ['oui', 'Très bien !'],
  ['non', 'D\'accord.'],
  ['au revoir', 'Au revoir !']
]);

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket simple connecté");

  // Traitement ultra-rapide sans rate limiting
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Message: "${message}"`);

    const normalizedMessage = message.toLowerCase().trim();
    
    // ÉTAPE 1: Réponses instantanées (0ms)
    for (const [key, text] of instantText.entries()) {
      if (normalizedMessage.includes(key)) {
        const latency = Date.now() - startTime;
        console.log(`⚡ Réponse instantanée: ${latency}ms`);
        
        socket.send(JSON.stringify({
          type: 'audio_response',
          audioData: null,
          response: text,
          latency: latency,
          source: 'instant'
        }));
        return;
      }
    }

    // ÉTAPE 2: Cache simple
    const cacheKey = normalizedMessage.substring(0, 20);
    const cached = simpleCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutes
      const latency = Date.now() - startTime;
      console.log(`🚀 Cache: ${latency}ms`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: latency,
        source: 'cache'
      }));
      return;
    }

    // ÉTAPE 3: IA simple (sans rate limiting strict)
    try {
      const aiResponse = await generateSimpleAI(message);
      const aiLatency = Date.now() - startTime;
      
      console.log(`🤖 IA: ${aiLatency}ms`);
      
      // Cache la réponse
      simpleCache.set(cacheKey, {
        response: aiResponse,
        audio: '',
        timestamp: Date.now()
      });

      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: null,
        response: aiResponse,
        latency: aiLatency,
        source: 'ai'
      }));

    } catch (error) {
      console.error('❌ Erreur IA:', error);
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: null,
        response: "Je vous écoute.",
        latency: Date.now() - startTime,
        source: 'fallback'
      }));
    }
  };

  // IA simplifiée
  const generateSimpleAI = async (message: string): Promise<string> => {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Clé OpenAI manquante');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Réponds en 1 phrase très courte (max 5 mots français). Sois naturelle et directe.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 15,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur OpenAI');
    }

    const result = await response.json();
    return result.choices[0].message.content;
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket simple prêt");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Système simplifié ultra-rapide',
      optimizations: ['Cache instantané', 'Réponses pré-générées', 'IA simplifiée']
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'text_message':
          await processMessage(data.message);
          break;
          
        case 'audio_message':
          try {
            console.log(`🎤 Audio reçu...`);
            
            const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { 
              type: 'audio/webm' 
            });
            
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'fr');

            const sttStartTime = Date.now();
            const sttResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
              },
              body: formData,
            });

            if (sttResponse.ok) {
              const sttResult = await sttResponse.json();
              const sttLatency = Date.now() - sttStartTime;
              
              console.log(`✅ STT: ${sttLatency}ms - "${sttResult.text}"`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              await processMessage(sttResult.text);
            } else {
              console.error('❌ Erreur STT');
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Erreur transcription'
              }));
            }
          } catch (error) {
            console.error('❌ Erreur audio:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur traitement audio'
            }));
          }
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
      }
    } catch (error) {
      console.error('❌ Erreur message:', error);
    }
  };

  socket.onclose = () => console.log("🔌 WebSocket fermé");
  socket.onerror = (error) => console.error("❌ Erreur WebSocket:", error);

  return response;
});
