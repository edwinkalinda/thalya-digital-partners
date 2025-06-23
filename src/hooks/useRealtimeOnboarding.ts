
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  profession: string;
  needs: string;
  tone: string;
  language: string;
  useCase: string;
  email?: string;
  businessName?: string;
}

interface UseRealtimeOnboardingReturn {
  isConnected: boolean;
  isConnecting: boolean;
  currentStep: 'welcome' | 'questioning' | 'summary' | 'email' | 'generating' | 'testing' | 'completed';
  currentQuestion: number;
  onboardingData: Partial<OnboardingData>;
  isSpeaking: boolean;
  isUserSpeaking: boolean;
  audioLevel: number;
  startOnboarding: () => Promise<void>;
  endOnboarding: () => void;
}

const QUESTIONS = [
  "Bonjour ! Avant de créer ton IA, j'aimerais mieux te connaître. Peux-tu me dire ce que tu fais dans la vie ou quel est ton métier ?",
  "Super. Et dans ton quotidien, à quoi aimerais-tu que ton IA t'aide ? Que veux-tu qu'elle fasse pour toi ?",
  "Parfait. Et comment veux-tu qu'elle parle à tes clients ? Plutôt calme, énergique, amicale, très pro, ou autre ?",
  "Tu veux qu'elle parle uniquement en français ou qu'elle soit bilingue, par exemple français/anglais ?",
  "Dernière question : veux-tu qu'elle accueille les clients, prenne des réservations, réponde à des questions, ou fasse autre chose de précis ?",
  "Parfait ! Pour finaliser ta création d'IA, peux-tu me donner ton adresse email et le nom de ton entreprise ?"
];

export const useRealtimeOnboarding = (): UseRealtimeOnboardingReturn => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questioning' | 'summary' | 'email' | 'generating' | 'testing' | 'completed'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionIdRef = useRef<string>('');

  const encodeAudioForAPI = useCallback((float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }, []);

  const createWavFromPCM = useCallback((pcmData: Uint8Array) => {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }, []);

  const playAudioChunk = useCallback(async (audioData: Uint8Array) => {
    if (!audioContextRef.current) return;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await audioContextRef.current.decodeAudioData(wavData.buffer.slice(0));
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio chunk:', error);
    }
  }, [createWavFromPCM]);

  const saveOnboardingData = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('onboarding_completions')
        .insert({
          email: onboardingData.email,
          business_name: onboardingData.businessName,
          profession: onboardingData.profession,
          needs: onboardingData.needs,
          tone: onboardingData.tone,
          language: onboardingData.language,
          use_case: onboardingData.useCase,
          session_id: sessionIdRef.current,
          business_type: 'IA Conversationnelle'
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder vos données",
          variant: "destructive"
        });
      } else {
        console.log('Onboarding data saved successfully');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  }, [onboardingData, toast]);

  const processUserResponse = useCallback((transcription: string) => {
    console.log(`Question ${currentQuestion + 1} response:`, transcription);
    
    if (currentQuestion < 5) {
      const dataKeys: (keyof OnboardingData)[] = ['profession', 'needs', 'tone', 'language', 'useCase'];
      
      setOnboardingData(prev => ({
        ...prev,
        [dataKeys[currentQuestion]]: transcription
      }));
      
      if (currentQuestion < 4) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setCurrentStep('email');
        setCurrentQuestion(5);
      }
    } else if (currentQuestion === 5) {
      // Extraire email et nom d'entreprise
      const emailMatch = transcription.match(/[\w.-]+@[\w.-]+\.\w+/);
      const email = emailMatch ? emailMatch[0] : '';
      
      // Chercher le nom d'entreprise (approximation)
      const businessMatch = transcription.match(/(?:entreprise|société|boîte|company|business)?\s*:?\s*([A-Za-zÀ-ÿ\s]+)/i);
      const businessName = businessMatch ? businessMatch[1].trim() : transcription.replace(email, '').trim();
      
      setOnboardingData(prev => ({
        ...prev,
        email,
        businessName
      }));
      
      generateSummary();
    }
  }, [currentQuestion]);

  const generateSummary = useCallback(() => {
    setCurrentStep('summary');
  }, []);

  const handleSummaryResponse = useCallback(async (transcription: string) => {
    const isPositive = transcription.toLowerCase().includes('oui') || 
                      transcription.toLowerCase().includes('exact') ||
                      transcription.toLowerCase().includes('parfait') ||
                      transcription.toLowerCase().includes('correct') ||
                      transcription.toLowerCase().includes('c\'est bon');
    
    if (isPositive) {
      setCurrentStep('generating');
      
      // Sauvegarder les données
      await saveOnboardingData();
      
      setTimeout(() => {
        setCurrentStep('testing');
      }, 2000);
    } else {
      setCurrentQuestion(0);
      setCurrentStep('questioning');
    }
  }, [saveOnboardingData]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data.type);

      switch (data.type) {
        case 'session.created':
          sessionIdRef.current = data.session?.id || `session_${Date.now()}`;
          console.log('Session created, sending configuration...');
          
          const systemPrompt = `Tu es Clara, l'assistante IA de Thalya spécialisée dans l'onboarding vocal ultra-rapide. 
          Tu conduis une conversation naturelle pour collecter les informations nécessaires à la création d'un agent IA personnalisé.
          
          Questions à poser dans l'ordre :
          1. ${QUESTIONS[0]}
          2. ${QUESTIONS[1]}
          3. ${QUESTIONS[2]}
          4. ${QUESTIONS[3]}
          5. ${QUESTIONS[4]}
          6. ${QUESTIONS[5]}
          
          Après les 6 réponses, fais un résumé rapide : "Parfait ! Je récapitule : tu travailles dans ${onboardingData.profession}, ton IA va t'aider à ${onboardingData.needs}, avec un ton ${onboardingData.tone}, parlant ${onboardingData.language}, pour ${onboardingData.useCase}. C'est bien ça ?"
          
          Si confirmation : "Excellent ! Je génère ton IA personnalisée maintenant."
          Sinon : reprendre rapidement.
          
          Sois très naturelle, rapide et efficace. Évite les pauses.`;

          wsRef.current?.send(JSON.stringify({
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: systemPrompt,
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.4,
                prefix_padding_ms: 200,
                silence_duration_ms: 800
              },
              temperature: 0.7,
              max_response_output_tokens: 150
            }
          }));
          break;

        case 'session.updated':
          console.log('Session updated successfully');
          setIsConnected(true);
          setIsConnecting(false);
          setCurrentStep('questioning');
          setCurrentQuestion(0);
          
          toast({
            title: "🎙️ Clara connectée",
            description: "Onboarding vocal optimisé actif !",
          });
          break;

        case 'input_audio_buffer.speech_started':
          setIsUserSpeaking(true);
          break;

        case 'input_audio_buffer.speech_stopped':
          setIsUserSpeaking(false);
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            console.log('User transcript:', data.transcript);
            if (currentStep === 'questioning' || currentStep === 'email') {
              processUserResponse(data.transcript);
            } else if (currentStep === 'summary') {
              handleSummaryResponse(data.transcript);
            }
          }
          break;

        case 'response.audio.delta':
          if (data.delta) {
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            playAudioChunk(bytes);
          }
          break;

        case 'response.audio.done':
          setIsSpeaking(false);
          break;

        case 'response.created':
          setIsSpeaking(true);
          break;

        case 'error':
          console.error('WebSocket error:', data);
          toast({
            title: "Erreur",
            description: data.error?.message || "Une erreur s'est produite",
            variant: "destructive"
          });
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [currentStep, processUserResponse, handleSummaryResponse, playAudioChunk, toast, onboardingData]);

  const startOnboarding = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    
    try {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      const ws = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/openai-realtime-chat');
      
      ws.onopen = () => {
        console.log('WebSocket connected to OpenAI Realtime API');
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à Clara",
          variant: "destructive"
        });
      };

      wsRef.current = ws;

      // Démarrer l'enregistrement immédiatement
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0.01
        }
      });

      mediaStreamRef.current = stream;
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(2048, 1, 1);
      
      processorRef.current.onaudioprocess = (event) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0);
          
          const sum = inputData.reduce((acc, val) => acc + Math.abs(val), 0);
          const avgLevel = sum / inputData.length;
          setAudioLevel(avgLevel * 15);
          
          const encodedAudio = encodeAudioForAPI(inputData);
          
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error('Error starting onboarding:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'onboarding vocal",
        variant: "destructive"
      });
    }
  }, [isConnected, isConnecting, handleWebSocketMessage, encodeAudioForAPI, toast]);

  const endOnboarding = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setCurrentStep('welcome');
    setCurrentQuestion(0);
    setOnboardingData({});
    setIsSpeaking(false);
    setIsUserSpeaking(false);
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => {
      endOnboarding();
    };
  }, [endOnboarding]);

  return {
    isConnected,
    isConnecting,
    currentStep,
    currentQuestion,
    onboardingData,
    isSpeaking,
    isUserSpeaking,
    audioLevel,
    startOnboarding,
    endOnboarding
  };
};
