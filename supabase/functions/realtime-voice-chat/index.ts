
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { 
      status: 426,
      headers: corsHeaders 
    });
  }

  // Vérifier la clé API Google Gemini
  const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    console.error("❌ GOOGLE_GEMINI_API_KEY manquante");
    return new Response("Google Gemini API Key required", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  console.log("✅ Démarrage du chat vocal avec Google Gemini Flash");
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let isConnected = false;
  let conversationHistory: Array<{role: string, content: string}> = [];

  // Fonction pour envoyer des messages de manière sécurisée
  const safeSend = (ws: WebSocket | null, data: any): boolean => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      ws.send(message);
      return true;
    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
      return false;
    }
  };

  // Fonction pour convertir l'audio en texte (Speech-to-Text avec OpenAI Whisper)
  const speechToText = async (audioBase64: string): Promise<string> => {
    try {
      // Conversion base64 vers blob audio
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Créer FormData avec le fichier audio
      const formData = new FormData();
      const audioBlob = new Blob([bytes], { type: 'audio/webm' });
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`STT error: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('❌ Erreur Speech-to-Text:', error);
      return '';
    }
  };

  // Fonction pour générer une réponse avec Google Gemini Flash (modèle mis à jour)
  const generateGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Ajouter le message utilisateur à l'historique
      conversationHistory.push({ role: 'user', content: userMessage });

      // Construire le prompt avec l'historique
      const systemPrompt = `Tu es Clara, une assistante vocale IA française très amicale et professionnelle de Thalya. 
Tu parles français naturellement et réponds de manière concise et utile. 
Tu es optimisée pour les conversations vocales, donc garde tes réponses courtes et naturelles.
Évite les listes à puces et privilégie un langage conversationnel.`;

      const conversationContext = conversationHistory
        .slice(-10) // Garder seulement les 10 derniers échanges
        .map(msg => `${msg.role === 'user' ? 'Utilisateur' : 'Clara'}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationContext}\n\nClara:`;

      // Utiliser le nouveau modèle Gemini 1.5 Flash
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
            topP: 0.9,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur Gemini API:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu traiter votre demande.";

      // Ajouter la réponse IA à l'historique
      conversationHistory.push({ role: 'assistant', content: aiResponse });

      return aiResponse;
    } catch (error) {
      console.error('❌ Erreur génération Gemini:', error);
      return "Désolé, je rencontre une difficulté technique. Pouvez-vous répéter votre question ?";
    }
  };

  // Fonction pour convertir le texte en audio avec ElevenLabs
  const textToSpeech = async (text: string): Promise<string | null> => {
    try {
      const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
      if (!ELEVENLABS_API_KEY) {
        console.error('❌ Clé ElevenLabs manquante');
        return null;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      });

      if (!response.ok) {
        console.error('❌ Erreur TTS:', response.status);
        return null;
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      return base64Audio;
    } catch (error) {
      console.error('❌ Erreur Text-to-Speech:', error);
      return null;
    }
  };

  // Traitement complet des messages audio
  const processAudioMessage = async (audioBase64: string) => {
    const startTime = Date.now();
    
    try {
      // 1. Speech-to-Text
      console.log('🎤 Début Speech-to-Text...');
      const sttStartTime = Date.now();
      const transcription = await speechToText(audioBase64);
      const sttLatency = Date.now() - sttStartTime;
      
      if (!transcription.trim()) {
        console.log('❌ Aucun texte détecté dans l\'audio');
        return;
      }

      console.log(`📝 Transcription: "${transcription}" (${sttLatency}ms)`);
      
      // Envoyer la transcription au client
      safeSend(socket, {
        type: 'transcription',
        text: transcription,
        latency: sttLatency
      });

      // 2. Génération de réponse avec Gemini
      console.log('🤖 Génération réponse Gemini...');
      const aiStartTime = Date.now();
      const aiResponse = await generateGeminiResponse(transcription);
      const aiLatency = Date.now() - aiStartTime;
      
      console.log(`🧠 Réponse IA: "${aiResponse}" (${aiLatency}ms)`);

      // 3. Text-to-Speech
      console.log('🔊 Génération audio...');
      const ttsStartTime = Date.now();
      const audioData = await textToSpeech(aiResponse);
      const ttsLatency = Date.now() - ttsStartTime;
      
      const totalLatency = Date.now() - startTime;

      // Envoyer la réponse complète au client
      safeSend(socket, {
        type: 'audio_response',
        response: aiResponse,
        audioData: audioData,
        latency: totalLatency,
        breakdown: {
          stt: sttLatency,
          ai: aiLatency,
          tts: ttsLatency
        }
      });

      console.log(`✅ Traitement complet: ${totalLatency}ms (STT: ${sttLatency}ms, IA: ${aiLatency}ms, TTS: ${ttsLatency}ms)`);

    } catch (error) {
      console.error('❌ Erreur traitement audio:', error);
      safeSend(socket, {
        type: 'error',
        message: 'Erreur lors du traitement de votre message vocal'
      });
    }
  };

  // Traitement des messages texte
  const processTextMessage = async (text: string) => {
    const startTime = Date.now();
    
    try {
      console.log(`📝 Message texte reçu: "${text}"`);

      // Génération de réponse avec Gemini
      const aiStartTime = Date.now();
      const aiResponse = await generateGeminiResponse(text);
      const aiLatency = Date.now() - aiStartTime;

      // Text-to-Speech
      const ttsStartTime = Date.now();
      const audioData = await textToSpeech(aiResponse);
      const ttsLatency = Date.now() - ttsStartTime;
      
      const totalLatency = Date.now() - startTime;

      // Envoyer la réponse au client
      safeSend(socket, {
        type: 'audio_response',
        response: aiResponse,
        audioData: audioData,
        latency: totalLatency,
        breakdown: {
          ai: aiLatency,
          tts: ttsLatency
        }
      });

      console.log(`✅ Réponse texte générée: ${totalLatency}ms (IA: ${aiLatency}ms, TTS: ${ttsLatency}ms)`);

    } catch (error) {
      console.error('❌ Erreur traitement texte:', error);
      safeSend(socket, {
        type: 'error',
        message: 'Erreur lors du traitement de votre message'
      });
    }
  };

  // Gestion des événements du client
  socket.onopen = () => {
    console.log("🎉 Client connecté au chat vocal Gemini");
    isConnected = true;
    
    safeSend(socket, {
      type: 'connection_status',
      status: 'connected',
      message: 'Chat vocal Gemini 1.5 Flash activé',
      engine: 'Google Gemini 1.5 Flash'
    });
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`📨 Message reçu: ${data.type}`);
      
      switch (data.type) {
        case 'ping':
          safeSend(socket, {
            type: 'pong',
            timestamp: Date.now(),
            connected: isConnected,
            engine: 'Google Gemini 1.5 Flash'
          });
          break;
          
        case 'audio_message':
          if (data.audio) {
            await processAudioMessage(data.audio);
          }
          break;
          
        case 'text_message':
          if (data.message) {
            await processTextMessage(data.message);
          }
          break;
          
        default:
          console.log(`⚠️ Type de message non reconnu: ${data.type}`);
      }
      
    } catch (error) {
      console.error("❌ Erreur parsing message client:", error);
      safeSend(socket, {
        type: 'error',
        message: 'Message invalide'
      });
    }
  };

  socket.onclose = () => {
    console.log("🔌 Client déconnecté");
    isConnected = false;
  };

  socket.onerror = (error) => {
    console.error("❌ Erreur WebSocket:", error);
    isConnected = false;
  };

  return response;
});
