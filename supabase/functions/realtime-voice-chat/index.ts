
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache ULTRA-optimisé avec prédiction intelligente
const ultraCache = new Map<string, { audio: string; response: string; timestamp: number; hitCount: number; prediction: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 heure
const MAX_CACHE_SIZE = 150;

// Réponses pré-générées avec prédiction
const instantResponses = new Map([
  ['bonjour', { text: 'Bonjour ! Comment puis-je vous aider ?', audio: null, priority: 10 }],
  ['hello', { text: 'Bonjour ! Comment puis-je vous aider ?', audio: null, priority: 10 }],
  ['salut', { text: 'Salut ! Comment ça va ?', audio: null, priority: 8 }],
  ['comment allez-vous', { text: 'Très bien merci ! Et vous ?', audio: null, priority: 7 }],
  ['ça va', { text: 'Ça va bien ! Comment puis-je vous aider ?', audio: null, priority: 9 }],
  ['merci', { text: 'De rien ! Autre chose ?', audio: null, priority: 6 }],
  ['au revoir', { text: 'Au revoir ! Bonne journée !', audio: null, priority: 5 }],
  ['oui', { text: 'Parfait ! Continuons.', audio: null, priority: 8 }],
  ['non', { text: 'D\'accord, pas de problème.', audio: null, priority: 7 }],
  ['ok', { text: 'Très bien !', audio: null, priority: 9 }]
]);

let audioPreGenerated = false;

// TTS ULTRA-optimisé avec compression
const generateUltraFastTTS = async (text: string): Promise<string | null> => {
  try {
    console.log(`🎤 TTS ULTRA-RAPIDE: "${text.substring(0, 30)}..."`);
    const startTime = Date.now();

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      console.error('❌ Clé OpenAI manquante');
      return null;
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // Plus rapide que tts-1-hd
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
        speed: 1.25 // Plus rapide pour réduire latence perçue
      }),
    });

    if (!response.ok) {
      console.error('❌ Erreur OpenAI TTS');
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(audioBuffer);
    
    // Conversion base64 ultra-optimisée
    let binaryString = '';
    const CHUNK_SIZE = 32768; // Plus gros chunks
    
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Audio = btoa(binaryString);
    const latency = Date.now() - startTime;
    console.log(`✅ TTS ULTRA-RAPIDE: ${latency}ms`);
    
    return base64Audio;
  } catch (error) {
    console.error('❌ Erreur TTS:', error);
    return null;
  }
};

// Pré-génération ULTRA-aggressive
const preGenerateUltraFast = async () => {
  console.log('🚀 Pré-génération ULTRA-RAPIDE...');
  
  // Traitement en parallèle total
  const promises = Array.from(instantResponses.entries()).map(async ([key, data]) => {
    try {
      const audio = await generateUltraFastTTS(data.text);
      if (audio) {
        data.audio = audio;
        console.log(`✅ Pré-généré: "${key}"`);
        return true;
      }
    } catch (error) {
      console.error(`❌ Erreur pré-génération "${key}":`, error);
    }
    return false;
  });
  
  await Promise.all(promises);
  audioPreGenerated = true;
  console.log(`🎉 Pré-génération terminée - ULTRA-RAPIDE activé`);
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket ULTRA-RAPIDE établi");

  if (!audioPreGenerated) {
    preGenerateUltraFast(); // Non-bloquant
  }

  // Nettoyage cache ULTRA-intelligent
  const ultraCleanCache = () => {
    if (ultraCache.size <= MAX_CACHE_SIZE) return;
    
    const entries = Array.from(ultraCache.entries());
    // Tri par score (hitCount * prediction / age)
    entries.sort((a, b) => {
      const ageA = Date.now() - a[1].timestamp;
      const ageB = Date.now() - b[1].timestamp;
      const scoreA = (a[1].hitCount * a[1].prediction) / ageA;
      const scoreB = (b[1].hitCount * b[1].prediction) / ageB;
      return scoreA - scoreB;
    });
    
    const toRemove = Math.floor(ultraCache.size * 0.3);
    for (let i = 0; i < toRemove; i++) {
      ultraCache.delete(entries[i][0]);
    }
    
    console.log(`🧹 Cache ULTRA nettoyé: ${toRemove} entrées`);
  };

  // IA ULTRA-rapide avec contraintes strictes
  const generateUltraFastAI = async (message: string): Promise<string> => {
    try {
      console.log(`🤖 IA ULTRA-RAPIDE: "${message}"`);
      const startTime = Date.now();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Le plus rapide
          messages: [
            {
              role: 'system',
              content: `Tu es Clara, assistante vocale ULTRA-RAPIDE de Thalya. 
              IMPÉRATIF: Réponds en 1 phrase TRÈS courte (max 10 mots) pour latence minimale.
              Sois directe, amicale, efficace. Français naturel. Zéro formule de politesse répétitive.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 25, // Très limité pour vitesse max
          temperature: 0.1, // Très déterministe
          presence_penalty: 0,
          frequency_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI error: ${await response.text()}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      const latency = Date.now() - startTime;
      
      console.log(`✅ IA ULTRA-RAPIDE: ${latency}ms - "${aiResponse}"`);
      return aiResponse;
    } catch (error) {
      console.error('❌ Erreur IA:', error);
      return "Problème technique.";
    }
  };

  // Traitement ULTRA-optimisé
  const processUltraFast = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Traitement ULTRA-RAPIDE: "${message}"`);

    const normalizedMessage = message.toLowerCase().trim();
    
    // ÉTAPE 1: Réponses INSTANTANÉES (0-2ms)
    for (const [key, data] of instantResponses.entries()) {
      if (normalizedMessage.includes(key)) {
        const latency = Date.now() - startTime;
        console.log(`⚡ RÉPONSE INSTANTANÉE "${key}" en ${latency}ms`);
        
        if (data.audio && audioPreGenerated) {
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

    // ÉTAPE 2: Cache ULTRA-intelligent
    ultraCleanCache();
    const cacheKey = normalizedMessage.substring(0, 80);
    const cached = ultraCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      cached.hitCount++;
      cached.prediction++;
      const latency = Date.now() - startTime;
      console.log(`🚀 Cache ULTRA-HIT en ${latency}ms`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: latency,
        source: 'ultra_cache'
      }));
      return;
    }

    // ÉTAPE 3: Génération parallèle ULTRA-optimisée
    try {
      const [aiResponse] = await Promise.all([
        generateUltraFastAI(message)
      ]);
      
      const aiLatency = Date.now() - startTime;
      
      // TTS en parallèle avec envoi immédiat du texte
      const ttsPromise = generateUltraFastTTS(aiResponse);
      
      // Envoi immédiat de la transcription
      socket.send(JSON.stringify({
        type: 'transcription_preview',
        text: aiResponse,
        latency: aiLatency
      }));
      
      const audioData = await ttsPromise;
      const totalLatency = Date.now() - startTime;
      
      console.log(`⚡ Traitement ULTRA-TOTAL: ${totalLatency}ms`);

      if (audioData) {
        // Cache ULTRA-intelligent
        ultraCache.set(cacheKey, {
          audio: audioData,
          response: aiResponse,
          timestamp: Date.now(),
          hitCount: 1,
          prediction: 5
        });

        socket.send(JSON.stringify({
          type: 'audio_response',
          audioData: audioData,
          response: aiResponse,
          latency: totalLatency,
          source: 'ultra_generated'
        }));
      } else {
        throw new Error('Échec TTS');
      }
    } catch (error) {
      console.error('❌ Erreur traitement ULTRA:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur technique',
        latency: Date.now() - startTime
      }));
    }
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket ULTRA-RAPIDE ouvert");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Système ULTRA-RAPIDE activé',
      preGenerationStatus: audioPreGenerated ? 'completed' : 'in_progress',
      optimizations: [
        'Réponses instantanées 0-2ms',
        'Cache ULTRA-intelligent',
        'TTS OpenAI vitesse 1.25x',
        'IA ultra-contrainte (10 mots max)',
        'Traitement parallèle total',
        'Prédiction cache intelligente',
        'Objectif: <50ms toutes réponses'
      ]
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'text_message':
          await processUltraFast(data.message);
          break;
          
        case 'audio_message':
          try {
            console.log(`🎤 Traitement audio ULTRA-RAPIDE...`);
            
            const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { 
              type: 'audio/webm' 
            });
            
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'fr');
            formData.append('temperature', '0'); // Plus déterministe
            formData.append('prompt', 'Clara, bonjour, merci, au revoir, oui, non, ok'); // Contexte

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
              
              console.log(`✅ STT ULTRA-RAPIDE: ${sttLatency}ms - "${sttResult.text}"`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              await processUltraFast(sttResult.text);
            } else {
              throw new Error(`STT failed: ${await sttResponse.text()}`);
            }
          } catch (error) {
            console.error('❌ Erreur STT:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur transcription'
            }));
          }
          break;
          
        case 'ping':
          socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
      }
    } catch (error) {
      console.error('❌ Erreur message WebSocket:', error);
    }
  };

  socket.onclose = () => console.log("🔌 WebSocket ULTRA-RAPIDE fermé");
  socket.onerror = (error) => console.error("❌ Erreur WebSocket:", error);

  return response;
});
