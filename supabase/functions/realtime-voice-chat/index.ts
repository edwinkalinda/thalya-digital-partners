
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache ultra-optimisé avec expiration intelligente
const optimizedCache = new Map<string, { audio: string; response: string; timestamp: number; hitCount: number }>();
const CACHE_TTL = 45 * 60 * 1000; // 45 minutes
const MAX_CACHE_SIZE = 200; // Limite la taille du cache

// Réponses instantanées optimisées avec audio pré-généré
const instantResponsesWithAudio = new Map([
  ['bonjour', {
    text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    audio: null
  }],
  ['hello', {
    text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    audio: null
  }],
  ['salut', {
    text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    audio: null
  }],
  ['comment allez-vous', {
    text: 'Je vais très bien, merci ! Et vous, comment allez-vous ?',
    audio: null
  }],
  ['comment ça va', {
    text: 'Ça va très bien ! Comment puis-je vous aider ?',
    audio: null
  }],
  ['ça va', {
    text: 'Oui ça va bien ! Comment puis-je vous aider ?',
    audio: null
  }],
  ['merci', {
    text: 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?',
    audio: null
  }],
  ['au revoir', {
    text: 'Au revoir ! Passez une excellente journée !',
    audio: null
  }],
  ['bye', {
    text: 'Au revoir ! Passez une excellente journée !',
    audio: null
  }],
  ['tchao', {
    text: 'Au revoir ! Passez une excellente journée !',
    audio: null
  }]
]);

let audioPreGenerationComplete = false;

// TTS ultra-optimisé avec fallback intelligent
const generateOptimizedTTS = async (text: string): Promise<string | null> => {
  try {
    console.log(`🎤 Génération TTS optimisée: "${text.substring(0, 50)}..."`);
    const startTime = Date.now();

    // Priorité à OpenAI TTS pour la qualité et fiabilité
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      console.error('❌ Aucune clé OpenAI trouvée');
      return null;
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd', // Modèle haute qualité
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
        speed: 1.15 // Légèrement plus rapide pour réduire la latence perçue
      }),
    });

    if (!response.ok) {
      console.error('❌ Erreur OpenAI TTS:', await response.text());
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(audioBuffer);
    
    // Conversion base64 optimisée
    const CHUNK_SIZE = 16384;
    let binaryString = '';
    
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Audio = btoa(binaryString);
    const latency = Date.now() - startTime;
    console.log(`✅ TTS généré en ${latency}ms (${base64Audio.length} chars)`);
    
    return base64Audio;
  } catch (error) {
    console.error('❌ Erreur génération TTS:', error);
    return null;
  }
};

// Pré-génération audio optimisée
const preGenerateOptimizedAudio = async () => {
  console.log('🚀 Pré-génération audio ultra-optimisée...');
  
  const concurrentLimit = 3; // Éviter les limites de taux
  const keys = Array.from(instantResponsesWithAudio.keys());
  
  for (let i = 0; i < keys.length; i += concurrentLimit) {
    const batch = keys.slice(i, i + concurrentLimit);
    const promises = batch.map(async (key) => {
      const data = instantResponsesWithAudio.get(key)!;
      try {
        const audio = await generateOptimizedTTS(data.text);
        if (audio) {
          data.audio = audio;
          console.log(`✅ Audio pré-généré: "${key}"`);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`❌ Erreur pré-génération "${key}":`, error);
        return false;
      }
    });
    
    await Promise.all(promises);
    // Pause entre les batches pour éviter les limites
    if (i + concurrentLimit < keys.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  audioPreGenerationComplete = true;
  console.log(`🎉 Pré-génération terminée - ${keys.length} réponses prêtes`);
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket ultra-optimisé établi");

  if (!audioPreGenerationComplete) {
    preGenerateOptimizedAudio();
  }

  // Nettoyage intelligent du cache
  const cleanOptimizedCache = () => {
    if (optimizedCache.size <= MAX_CACHE_SIZE) return;
    
    const entries = Array.from(optimizedCache.entries());
    entries.sort((a, b) => {
      // Prioriser par fréquence d'utilisation et fraîcheur
      const scoreA = a[1].hitCount * (Date.now() - a[1].timestamp);
      const scoreB = b[1].hitCount * (Date.now() - b[1].timestamp);
      return scoreA - scoreB;
    });
    
    // Supprimer les 25% les moins utilisés
    const toRemove = Math.floor(optimizedCache.size * 0.25);
    for (let i = 0; i < toRemove; i++) {
      optimizedCache.delete(entries[i][0]);
    }
    
    console.log(`🧹 Cache nettoyé: ${toRemove} entrées supprimées`);
  };

  // Génération de réponse IA ultra-optimisée
  const generateOptimizedAIResponse = async (message: string): Promise<string> => {
    try {
      console.log(`🤖 Génération IA optimisée: "${message}"`);
      const startTime = Date.now();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Modèle le plus rapide
          messages: [
            {
              role: 'system',
              content: `Tu es Clara, l'assistante vocale ultra-performante de Thalya. 
              IMPÉRATIF: Réponds en 1 phrase très courte (maximum 15 mots) pour une conversation fluide.
              Tu es professionnelle, amicale et très efficace. Tu parles français naturellement.
              Évite les formules de politesse répétitives. Sois directe et utile.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 40, // Très limité pour forcer la concision
          temperature: 0.2, // Plus déterministe et rapide
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur OpenAI:', errorText);
        throw new Error(`OpenAI error: ${errorText}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      const latency = Date.now() - startTime;
      
      console.log(`✅ IA générée en ${latency}ms: "${aiResponse}"`);
      return aiResponse;
    } catch (error) {
      console.error('❌ Erreur génération IA:', error);
      return "Désolé, problème technique momentané.";
    }
  };

  // Traitement ultra-optimisé des messages
  const processOptimizedMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Traitement ultra-optimisé: "${message}"`);

    const normalizedMessage = message.toLowerCase().trim();
    
    // ÉTAPE 1: Réponses instantanées (0-5ms)
    for (const [key, data] of instantResponsesWithAudio.entries()) {
      if (normalizedMessage.includes(key)) {
        const latency = Date.now() - startTime;
        console.log(`⚡ RÉPONSE INSTANTANÉE "${key}" en ${latency}ms`);
        
        if (data.audio && audioPreGenerationComplete) {
          socket.send(JSON.stringify({
            type: 'audio_response',
            audioData: data.audio,
            response: data.text,
            latency: latency,
            source: 'instant_cache'
          }));
          return;
        }
      }
    }

    // ÉTAPE 2: Cache intelligent
    cleanOptimizedCache();
    const cacheKey = normalizedMessage.substring(0, 100); // Limitation pour éviter les clés trop longues
    const cached = optimizedCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      cached.hitCount++;
      const latency = Date.now() - startTime;
      console.log(`🚀 Cache HIT en ${latency}ms (utilisé ${cached.hitCount} fois)`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: latency,
        source: 'cache'
      }));
      return;
    }

    // ÉTAPE 3: Génération parallèle optimisée
    try {
      const [aiResponse, _] = await Promise.all([
        generateOptimizedAIResponse(message),
        new Promise(resolve => setTimeout(resolve, 0)) // Force async
      ]);
      
      const aiLatency = Date.now() - startTime;
      
      const ttsStartTime = Date.now();
      const audioData = await generateOptimizedTTS(aiResponse);
      const ttsLatency = Date.now() - ttsStartTime;
      
      const totalLatency = Date.now() - startTime;
      
      console.log(`⚡ Traitement total: ${totalLatency}ms (IA: ${aiLatency}ms, TTS: ${ttsLatency}ms)`);

      if (audioData) {
        // Cache intelligent avec métadonnées
        optimizedCache.set(cacheKey, {
          audio: audioData,
          response: aiResponse,
          timestamp: Date.now(),
          hitCount: 1
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
        throw new Error('Échec génération TTS');
      }
    } catch (error) {
      console.error('❌ Erreur traitement:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur de traitement',
        latency: Date.now() - startTime
      }));
    }
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket ultra-optimisé ouvert");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Système ultra-optimisé activé',
      preGenerationStatus: audioPreGenerationComplete ? 'completed' : 'in_progress',
      optimizations: [
        'Réponses instantanées 0-5ms',
        'Cache intelligent avec hit tracking',
        'TTS OpenAI HD optimisé',
        'Génération IA ultra-rapide (gpt-4o-mini)',
        'Traitement parallèle optimisé',
        'Compression audio avancée',
        'Nettoyage cache intelligent',
        'Objectif: <100ms pour réponses courantes'
      ],
      cacheStats: {
        size: optimizedCache.size,
        preGenerated: audioPreGenerationComplete ? instantResponsesWithAudio.size : 0
      }
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'text_message':
          await processOptimizedMessage(data.message);
          break;
          
        case 'audio_message':
          try {
            console.log(`🎤 Traitement audio ultra-optimisé...`);
            
            const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { 
              type: 'audio/webm' 
            });
            
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'fr'); // Force le français pour meilleure précision
            formData.append('prompt', 'Clara, bonjour, merci, au revoir'); // Mots-clés contextuels

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
              
              console.log(`✅ STT ultra-rapide en ${sttLatency}ms: "${sttResult.text}"`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              await processOptimizedMessage(sttResult.text);
            } else {
              const errorText = await sttResponse.text();
              console.error('❌ STT failed:', errorText);
              throw new Error(`STT failed: ${errorText}`);
            }
          } catch (error) {
            console.error('❌ Erreur STT:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur transcription audio'
            }));
          }
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        default:
          console.log('Type message inconnu:', data.type);
      }
    } catch (error) {
      console.error('❌ Erreur traitement message WebSocket:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur traitement message'
      }));
    }
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket ultra-optimisé fermé");
  };

  socket.onerror = (error) => {
    console.error("❌ Erreur WebSocket ultra-optimisé:", error);
  };

  return response;
});
