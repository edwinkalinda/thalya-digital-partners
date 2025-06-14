
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache en mémoire pour les réponses fréquentes
const responseCache = new Map<string, { audio: string; response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Phrases communes pré-générées
const commonPhrases = [
  "Bonjour, comment puis-je vous aider ?",
  "Merci de votre appel.",
  "Un moment s'il vous plaît.",
  "Pouvez-vous répéter ?",
  "Je vous mets en relation.",
];

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("WebSocket connection established for realtime voice chat");

  // Pré-générer l'audio pour les phrases communes au démarrage
  const preGenerateCommonPhrases = async () => {
    for (const phrase of commonPhrases) {
      if (!responseCache.has(phrase)) {
        try {
          const audioResponse = await generateTTSAudio(phrase);
          if (audioResponse) {
            responseCache.set(phrase, {
              audio: audioResponse,
              response: phrase,
              timestamp: Date.now()
            });
            console.log(`Pre-generated audio for: ${phrase.substring(0, 30)}...`);
          }
        } catch (error) {
          console.error(`Failed to pre-generate audio for "${phrase}":`, error);
        }
      }
    }
  };

  // Fonction pour générer l'audio TTS avec streaming
  const generateTTSAudio = async (text: string): Promise<string | null> => {
    try {
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
            stability: 0.4,
            similarity_boost: 0.7,
            style: 0.1,
            use_speaker_boost: false
          },
          optimize_streaming_latency: 4,
          output_format: "mp3_22050_32"
        }),
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS error:', await response.text());
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);
      let binaryString = '';
      
      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      
      return btoa(binaryString);
    } catch (error) {
      console.error('Error generating TTS audio:', error);
      return null;
    }
  };

  // Fonction pour générer une réponse IA
  const generateAIResponse = async (message: string): Promise<string> => {
    try {
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
              content: `Tu es Clara, l'assistante vocale de Thalya. Tu es professionnelle, amicale et efficace. 
              Réponds de manière très concise (maximum 2 phrases) pour une conversation téléphonique fluide.
              Tu parles français et tu es très polie.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${await response.text()}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "Désolé, je rencontre une difficulté technique. Un moment s'il vous plaît.";
    }
  };

  // Traitement en parallèle optimisé
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`Processing message: ${message}`);

    // Vérifier le cache d'abord
    const cacheKey = message.toLowerCase().trim();
    const cached = responseCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`Cache hit for message, latency: ${Date.now() - startTime}ms`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: Date.now() - startTime,
        source: 'cache'
      }));
      return;
    }

    // Génération parallèle de la réponse IA et préparation TTS
    const [aiResponse] = await Promise.all([
      generateAIResponse(message),
    ]);

    const midTime = Date.now();
    console.log(`AI response generated in ${midTime - startTime}ms: ${aiResponse}`);

    // Génération audio TTS streamée
    const audioData = await generateTTSAudio(aiResponse);
    
    const endTime = Date.now();
    const totalLatency = endTime - startTime;
    const ttsLatency = endTime - midTime;
    
    console.log(`Total processing latency: ${totalLatency}ms (AI: ${midTime - startTime}ms, TTS: ${ttsLatency}ms)`);

    if (audioData) {
      // Mettre en cache pour les prochaines fois
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
          ai: midTime - startTime,
          tts: ttsLatency
        }
      }));
    } else {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de génération audio',
        latency: totalLatency
      }));
    }
  };

  socket.onopen = () => {
    console.log("WebSocket opened, pre-generating common phrases...");
    preGenerateCommonPhrases();
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connexion WebSocket établie - streaming vocal optimisé activé',
      optimizations: [
        'WebSocket streaming temps réel',
        'Cache intelligent des réponses',
        'TTS streaming avec latence ultra-optimisée',
        'Traitement parallélisé',
        'Phrases communes pré-générées'
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
          // Traitement STT via Whisper
          try {
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
              
              console.log(`STT completed in ${sttLatency}ms: ${sttResult.text}`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              // Traiter le message transcrit
              await processMessage(sttResult.text);
            } else {
              throw new Error('STT failed');
            }
          } catch (error) {
            console.error('STT error:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur de transcription audio'
            }));
          }
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong' }));
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de traitement du message'
      }));
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});
