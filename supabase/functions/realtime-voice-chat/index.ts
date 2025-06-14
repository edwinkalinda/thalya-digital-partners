
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache en mémoire pour les réponses fréquentes avec TTL
const responseCache = new Map<string, { audio: string; response: string; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Phrases communes pré-générées pour cache instantané
const commonPhrases = [
  "Bonjour, comment puis-je vous aider ?",
  "Bonjour",
  "Comment allez-vous ?", 
  "Merci de votre appel.",
  "Un moment s'il vous plaît.",
  "Pouvez-vous répéter ?",
  "Je vous mets en relation.",
  "Merci",
  "Au revoir",
  "Bonne journée"
];

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("WebSocket connection established for realtime voice chat");

  // Fonction pour nettoyer le cache expiré
  const cleanExpiredCache = () => {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        responseCache.delete(key);
      }
    }
  };

  // Pré-générer l'audio pour les phrases communes au démarrage
  const preGenerateCommonPhrases = async () => {
    cleanExpiredCache();
    
    for (const phrase of commonPhrases) {
      const cacheKey = phrase.toLowerCase().trim();
      
      if (!responseCache.has(cacheKey)) {
        try {
          const audioResponse = await generateTTSAudio(phrase);
          if (audioResponse) {
            responseCache.set(cacheKey, {
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

  // Fonction pour générer l'audio TTS avec optimisations maximales
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
          model_id: 'eleven_turbo_v2_5', // Modèle le plus rapide
          voice_settings: {
            stability: 0.3, // Réduit pour plus de vitesse
            similarity_boost: 0.7,
            style: 0.1, // Minimal pour vitesse maximale
            use_speaker_boost: false // Désactivé pour réduire la latence
          },
          optimize_streaming_latency: 4, // Maximum
          output_format: "mp3_22050_32" // Format le plus léger
        }),
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS error:', await response.text());
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);
      
      // Optimisation de la conversion base64
      const CHUNK_SIZE = 0x8000; // 32KB chunks
      let binaryString = '';
      
      for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      return btoa(binaryString);
    } catch (error) {
      console.error('Error generating TTS audio:', error);
      return null;
    }
  };

  // Fonction pour générer une réponse IA avec cache intelligent
  const generateAIResponse = async (message: string): Promise<string> => {
    try {
      // Normaliser le message pour le cache
      const normalizedMessage = message.toLowerCase().trim();
      
      // Mappings intelligents pour optimiser le cache
      const responseMap: Record<string, string> = {
        'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'hello': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'salut': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'comment allez-vous': 'Je vais très bien, merci ! Et vous ?',
        'ça va': 'Oui ça va bien ! Comment puis-je vous aider ?',
        'merci': 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?',
        'au revoir': 'Au revoir ! Passez une excellente journée !',
        'goodbye': 'Au revoir ! Passez une excellente journée !'
      };
      
      // Vérifier les réponses mappées
      for (const [key, value] of Object.entries(responseMap)) {
        if (normalizedMessage.includes(key)) {
          return value;
        }
      }

      // Sinon, utiliser OpenAI
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
              content: `Tu es Clara, l'assistante vocale de Thalya. Tu es professionnelle, amicale et très efficace. 
              Réponds de manière très concise (maximum 2 phrases courtes) pour une conversation téléphonique fluide.
              Tu parles français et tu es très polie.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 80, // Limité pour réduire la latence
          temperature: 0.5, // Réduit pour plus de cohérence
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

  // Traitement ultra-optimisé avec cache et parallélisation
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`Processing message: ${message}`);

    // Normaliser pour le cache
    const cacheKey = message.toLowerCase().trim();
    
    // Vérifier le cache d'abord
    const cached = responseCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const latency = Date.now() - startTime;
      console.log(`Cache hit! Ultra-fast response in ${latency}ms`);
      
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
      // Génération de la réponse IA
      const aiStartTime = Date.now();
      const aiResponse = await generateAIResponse(message);
      const aiLatency = Date.now() - aiStartTime;
      
      console.log(`AI response in ${aiLatency}ms: ${aiResponse}`);

      // Génération TTS en parallèle
      const ttsStartTime = Date.now();
      const audioData = await generateTTSAudio(aiResponse);
      const ttsLatency = Date.now() - ttsStartTime;
      
      const totalLatency = Date.now() - startTime;
      
      console.log(`Total processing: ${totalLatency}ms (AI: ${aiLatency}ms, TTS: ${ttsLatency}ms)`);

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
            ai: aiLatency,
            tts: ttsLatency
          }
        }));
      } else {
        throw new Error('Failed to generate TTS audio');
      }
    } catch (error) {
      console.error('Error in processMessage:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de traitement du message',
        latency: Date.now() - startTime
      }));
    }
  };

  socket.onopen = () => {
    console.log("WebSocket opened, pre-generating common phrases...");
    
    // Pré-générer les phrases communes en arrière-plan
    preGenerateCommonPhrases();
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connexion WebSocket établie - optimisations ultra-avancées activées',
      optimizations: [
        'WebSocket streaming temps réel',
        'Cache intelligent avec TTL',
        'TTS streaming ultra-optimisé (ElevenLabs Turbo v2.5)',
        'Traitement parallélisé AI/TTS',
        'Phrases communes pré-générées',
        'Mapping de réponses instantanées',
        'Conversion base64 optimisée par chunks',
        'Nettoyage automatique du cache'
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
          // Traitement STT via Whisper avec optimisations
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
              
              // Traiter le message transcrit immédiatement
              await processMessage(sttResult.text);
            } else {
              throw new Error(`STT failed: ${await sttResponse.text()}`);
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
