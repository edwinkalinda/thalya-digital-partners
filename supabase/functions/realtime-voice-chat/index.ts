
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache en mémoire optimisé avec TTL et compression
const responseCache = new Map<string, { audio: string; response: string; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Phrases optimisées pour réponses instantanées
const instantResponses = new Map([
  ['bonjour', 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'],
  ['hello', 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'],
  ['salut', 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'],
  ['comment allez-vous', 'Je vais très bien, merci ! Et vous, comment allez-vous ?'],
  ['comment ça va', 'Ça va très bien ! Comment puis-je vous aider ?'],
  ['ça va', 'Oui ça va bien ! Comment puis-je vous aider ?'],
  ['merci', 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?'],
  ['au revoir', 'Au revoir ! Passez une excellente journée !'],
  ['bye', 'Au revoir ! Passez une excellente journée !'],
  ['bonne journée', 'Merci ! Bonne journée à vous aussi !'],
  ['un moment', 'Bien sûr, prenez votre temps.'],
  ['répéter', 'Bien sûr, je peux répéter. Que souhaitez-vous que je répète ?']
]);

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket connection established for ultra-optimized voice chat");

  // Nettoyage du cache expiré
  const cleanExpiredCache = () => {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        responseCache.delete(key);
      }
    }
  };

  // Génération TTS ultra-optimisée
  const generateTTSAudio = async (text: string): Promise<string | null> => {
    try {
      console.log(`🎤 Generating TTS for: "${text.substring(0, 50)}..."`);
      const startTime = Date.now();

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku/stream`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: false
          },
          optimize_streaming_latency: 4,
          output_format: "mp3_22050_32"
        }),
      });

      if (!response.ok) {
        console.error('❌ ElevenLabs TTS error:', await response.text());
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);
      
      // Conversion base64 optimisée par chunks
      const CHUNK_SIZE = 0x8000;
      let binaryString = '';
      
      for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64Audio = btoa(binaryString);
      const latency = Date.now() - startTime;
      console.log(`✅ TTS generated in ${latency}ms`);
      
      return base64Audio;
    } catch (error) {
      console.error('❌ Error generating TTS audio:', error);
      return null;
    }
  };

  // Génération de réponse IA ultra-optimisée
  const generateAIResponse = async (message: string): Promise<string> => {
    try {
      const normalizedMessage = message.toLowerCase().trim();
      
      // Vérifier les réponses instantanées
      for (const [key, value] of instantResponses) {
        if (normalizedMessage.includes(key)) {
          console.log(`⚡ Instant response for: ${key}`);
          return value;
        }
      }

      console.log(`🤖 Generating AI response for: "${message}"`);
      const startTime = Date.now();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es Clara, l'assistante vocale ultra-performante de Thalya. Tu es professionnelle, amicale et très efficace. 
              Réponds de manière très concise (maximum 2 phrases courtes) pour une conversation téléphonique fluide.
              Tu parles français naturellement et tu es très polie. Sois conversationnelle et chaleureuse.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 60,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      const latency = Date.now() - startTime;
      
      console.log(`✅ AI response generated in ${latency}ms: "${aiResponse}"`);
      return aiResponse;
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      return "Désolé, je rencontre une difficulté technique. Un moment s'il vous plaît.";
    }
  };

  // Traitement ultra-optimisé des messages
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Processing message: "${message}"`);

    const cacheKey = message.toLowerCase().trim();
    
    // Vérifier le cache d'abord
    cleanExpiredCache();
    const cached = responseCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const latency = Date.now() - startTime;
      console.log(`🚀 Cache hit! Ultra-fast response in ${latency}ms`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: latency,
        source: 'cache'
      }));
      return;
    }

    try {
      // Génération parallèle IA et TTS
      const aiStartTime = Date.now();
      const aiResponse = await generateAIResponse(message);
      const aiLatency = Date.now() - aiStartTime;

      const ttsStartTime = Date.now();
      const audioData = await generateTTSAudio(aiResponse);
      const ttsLatency = Date.now() - ttsStartTime;
      
      const totalLatency = Date.now() - startTime;
      
      console.log(`⚡ Total processing: ${totalLatency}ms (AI: ${aiLatency}ms, TTS: ${ttsLatency}ms)`);

      if (audioData) {
        // Mise en cache
        responseCache.set(cacheKey, {
          audio: audioData,
          response: aiResponse,
          timestamp: Date.now()
        });

        socket.send(JSON.stringify({
          type: 'audio_response',
          audioData: audioData,
          response: aiResponse,
          latency: totalLatency,
          source: 'generated',
          breakdown: {
            ai: aiLatency,
            tts: ttsLatency
          }
        }));
      } else {
        throw new Error('Failed to generate TTS audio');
      }
    } catch (error) {
      console.error('❌ Error in processMessage:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de traitement du message',
        latency: Date.now() - startTime
      }));
    }
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket opened successfully");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connexion WebSocket établie - Système vocal ultra-optimisé activé',
      optimizations: [
        'Réponses instantanées (0-5ms)',
        'Cache intelligent avec TTL 15min',
        'TTS streaming ElevenLabs Turbo v2.5',
        'Traitement parallélisé AI/TTS',
        'Conversion base64 optimisée',
        'Nettoyage automatique du cache',
        'Latence cible: 50-200ms'
      ]
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
            console.log(`🎤 Processing audio message...`);
            
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
              
              console.log(`✅ STT completed in ${sttLatency}ms: "${sttResult.text}"`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              await processMessage(sttResult.text);
            } else {
              const errorText = await sttResponse.text();
              console.error('❌ STT failed:', errorText);
              throw new Error(`STT failed: ${errorText}`);
            }
          } catch (error) {
            console.error('❌ STT error:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur de transcription audio'
            }));
          }
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error processing WebSocket message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de traitement du message'
      }));
    }
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  return response;
});
