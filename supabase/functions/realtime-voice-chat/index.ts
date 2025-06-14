
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting intelligent
const rateLimiter = {
  stt: { requests: 0, resetTime: 0, maxRequests: 2 }, // Plus conservateur
  tts: { requests: 0, resetTime: 0, maxRequests: 2 },
  chat: { requests: 0, resetTime: 0, maxRequests: 8 }
};

const checkRateLimit = (service: 'stt' | 'tts' | 'chat'): boolean => {
  const now = Date.now();
  const limiter = rateLimiter[service];
  
  // Reset si 60 secondes passées
  if (now > limiter.resetTime) {
    limiter.requests = 0;
    limiter.resetTime = now + 60000;
  }
  
  if (limiter.requests >= limiter.maxRequests) {
    console.log(`⚠️ Rate limit atteint pour ${service}, attente...`);
    return false;
  }
  
  limiter.requests++;
  return true;
};

// Cache ULTRA-optimisé avec prédiction intelligente
const ultraCache = new Map<string, { audio: string; response: string; timestamp: number; hitCount: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 heure
const MAX_CACHE_SIZE = 100;

// Réponses pré-générées avec audio
const instantResponses = new Map([
  ['bonjour', { text: 'Bonjour ! Comment allez-vous ?', audio: null, priority: 10 }],
  ['hello', { text: 'Hello ! How are you ?', audio: null, priority: 10 }],
  ['salut', { text: 'Salut ! Ça va ?', audio: null, priority: 8 }],
  ['ça va', { text: 'Ça va bien ! Et vous ?', audio: null, priority: 9 }],
  ['comment allez-vous', { text: 'Très bien merci ! Et vous ?', audio: null, priority: 7 }],
  ['merci', { text: 'De rien !', audio: null, priority: 6 }],
  ['au revoir', { text: 'Au revoir ! Bonne journée !', audio: null, priority: 5 }],
  ['oui', { text: 'Parfait !', audio: null, priority: 8 }],
  ['non', { text: 'D\'accord.', audio: null, priority: 7 }],
  ['ok', { text: 'Très bien !', audio: null, priority: 9 }]
]);

// Détection de spam/boucles
const spamDetection = new Map<string, { count: number, lastTime: number }>();

const isSpam = (message: string): boolean => {
  const normalized = message.toLowerCase().trim();
  const now = Date.now();
  const spam = spamDetection.get(normalized) || { count: 0, lastTime: 0 };
  
  // Reset si plus de 30 secondes
  if (now - spam.lastTime > 30000) {
    spam.count = 0;
  }
  
  spam.count++;
  spam.lastTime = now;
  spamDetection.set(normalized, spam);
  
  // Considéré comme spam si plus de 3 fois en 30 secondes
  if (spam.count > 3) {
    console.log(`🚫 Spam détecté: "${normalized}" (${spam.count} fois)`);
    return true;
  }
  
  return false;
};

let audioPreGenerated = false;

// TTS avec rate limiting et retry
const generateOptimizedTTS = async (text: string): Promise<string | null> => {
  try {
    if (!checkRateLimit('tts')) {
      console.log('⚠️ TTS rate limit atteint, utilisation du cache uniquement');
      return null;
    }

    console.log(`🎤 TTS optimisé: "${text.substring(0, 30)}..."`);
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
        model: 'tts-1', // Plus rapide
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
        speed: 1.1 // Légèrement plus rapide
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur OpenAI TTS:', errorText);
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(audioBuffer);
    
    // Conversion base64 optimisée
    let binaryString = '';
    const CHUNK_SIZE = 32768;
    
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Audio = btoa(binaryString);
    const latency = Date.now() - startTime;
    console.log(`✅ TTS généré en ${latency}ms`);
    
    return base64Audio;
  } catch (error) {
    console.error('❌ Erreur TTS:', error);
    return null;
  }
};

// Pré-génération avec rate limiting
const preGenerateAudio = async () => {
  console.log('🚀 Pré-génération audio...');
  
  let generated = 0;
  for (const [key, data] of instantResponses.entries()) {
    if (generated >= 3) { // Limite pour éviter rate limit
      console.log('⚠️ Arrêt pré-génération pour éviter rate limit');
      break;
    }
    
    try {
      const audio = await generateOptimizedTTS(data.text);
      if (audio) {
        data.audio = audio;
        generated++;
        console.log(`✅ Audio pré-généré: "${key}"`);
        // Pause entre générations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Erreur pré-génération "${key}":`, error);
    }
  }
  
  audioPreGenerated = true;
  console.log(`🎉 Pré-génération terminée - ${generated} réponses prêtes`);
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("🚀 WebSocket établi avec rate limiting");

  if (!audioPreGenerated) {
    preGenerateAudio(); // Non-bloquant
  }

  // Nettoyage cache intelligent
  const cleanCache = () => {
    if (ultraCache.size <= MAX_CACHE_SIZE) return;
    
    const entries = Array.from(ultraCache.entries());
    entries.sort((a, b) => a[1].hitCount - b[1].hitCount);
    
    const toRemove = Math.floor(ultraCache.size * 0.3);
    for (let i = 0; i < toRemove; i++) {
      ultraCache.delete(entries[i][0]);
    }
    
    console.log(`🧹 Cache nettoyé: ${toRemove} entrées`);
  };

  // IA optimisée avec rate limiting
  const generateOptimizedAI = async (message: string): Promise<string> => {
    try {
      if (!checkRateLimit('chat')) {
        console.log('⚠️ Chat rate limit atteint, réponse générique');
        return "Je vous écoute.";
      }

      console.log(`🤖 IA optimisée: "${message}"`);
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
              content: `Tu es Clara, assistante vocale optimisée de Thalya. 
              IMPÉRATIF: Réponds en 1 phrase TRÈS courte (max 8 mots français).
              Sois naturelle, amicale, directe. Évite les répétitions.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 20,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur OpenAI Chat:', errorText);
        return "Désolée, problème technique.";
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      const latency = Date.now() - startTime;
      
      console.log(`✅ IA générée en ${latency}ms: "${aiResponse}"`);
      return aiResponse;
    } catch (error) {
      console.error('❌ Erreur IA:', error);
      return "Problème technique.";
    }
  };

  // Traitement avec rate limiting et anti-spam
  const processMessage = async (message: string) => {
    const startTime = Date.now();
    console.log(`📝 Traitement: "${message}"`);

    const normalizedMessage = message.toLowerCase().trim();
    
    // Détection spam
    if (isSpam(normalizedMessage)) {
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: null,
        response: "Merci de varier vos questions.",
        latency: Date.now() - startTime,
        source: 'spam_detection'
      }));
      return;
    }
    
    // ÉTAPE 1: Réponses instantanées
    for (const [key, data] of instantResponses.entries()) {
      if (normalizedMessage.includes(key)) {
        const latency = Date.now() - startTime;
        console.log(`⚡ Réponse instantanée "${key}" en ${latency}ms`);
        
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

    // ÉTAPE 2: Cache intelligent
    cleanCache();
    const cacheKey = normalizedMessage.substring(0, 50);
    const cached = ultraCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      cached.hitCount++;
      const latency = Date.now() - startTime;
      console.log(`🚀 Cache hit en ${latency}ms`);
      
      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: cached.audio,
        response: cached.response,
        latency: latency,
        source: 'cache'
      }));
      return;
    }

    // ÉTAPE 3: Génération avec rate limiting
    try {
      const aiResponse = await generateOptimizedAI(message);
      const aiLatency = Date.now() - startTime;
      
      // Envoi immédiat du texte
      socket.send(JSON.stringify({
        type: 'transcription_preview',
        text: aiResponse,
        latency: aiLatency
      }));
      
      // TTS en arrière-plan
      const audioData = await generateOptimizedTTS(aiResponse);
      const totalLatency = Date.now() - startTime;
      
      console.log(`⚡ Traitement total: ${totalLatency}ms`);

      // Cache avec audio
      if (audioData) {
        ultraCache.set(cacheKey, {
          audio: audioData,
          response: aiResponse,
          timestamp: Date.now(),
          hitCount: 1
        });
      }

      socket.send(JSON.stringify({
        type: 'audio_response',
        audioData: audioData,
        response: aiResponse,
        latency: totalLatency,
        source: audioData ? 'generated' : 'text_only'
      }));

    } catch (error) {
      console.error('❌ Erreur traitement:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur technique temporaire',
        latency: Date.now() - startTime
      }));
    }
  };

  socket.onopen = () => {
    console.log("🎉 WebSocket ouvert avec optimisations");
    
    socket.send(JSON.stringify({
      type: 'connection_established',
      message: 'Système optimisé avec rate limiting',
      preGenerationStatus: audioPreGenerated ? 'completed' : 'in_progress',
      optimizations: [
        'Rate limiting intelligent',
        'Détection anti-spam',
        'Cache avec priorités',
        'Réponses instantanées',
        'Génération parallèle'
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
            if (!checkRateLimit('stt')) {
              console.log('⚠️ STT rate limit atteint, ignoré');
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Trop de requêtes, patientez un moment'
              }));
              return;
            }

            console.log(`🎤 Traitement audio...`);
            
            const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { 
              type: 'audio/webm' 
            });
            
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'fr');
            formData.append('prompt', 'Clara, bonjour, salut, merci, au revoir, oui, non, ok, comment allez-vous');

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
              
              console.log(`✅ STT en ${sttLatency}ms: "${sttResult.text}"`);
              
              socket.send(JSON.stringify({
                type: 'transcription',
                text: sttResult.text,
                latency: sttLatency
              }));
              
              await processMessage(sttResult.text);
            } else {
              const errorText = await sttResponse.text();
              console.error('❌ Erreur STT:', errorText);
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Erreur transcription, réessayez'
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
      console.error('❌ Erreur message WebSocket:', error);
    }
  };

  socket.onclose = () => console.log("🔌 WebSocket fermé");
  socket.onerror = (error) => console.error("❌ Erreur WebSocket:", error);

  return response;
});
