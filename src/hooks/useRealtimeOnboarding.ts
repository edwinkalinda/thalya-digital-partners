
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  profession: string;
  needs: string;
  tone: string;
  language: string;
  useCase: string;
}

interface UseRealtimeOnboardingReturn {
  isConnected: boolean;
  isConnecting: boolean;
  currentStep: 'welcome' | 'questioning' | 'summary' | 'generating' | 'testing' | 'completed';
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
  "Dernière question : veux-tu qu'elle accueille les clients, prenne des réservations, réponde à des questions, ou fasse autre chose de précis ?"
];

export const useRealtimeOnboarding = (): UseRealtimeOnboardingReturn => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questioning' | 'summary' | 'generating' | 'testing' | 'completed'>('welcome');
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
      const audioBuffer = await audioContextRef.current.decodeAudioData(wavData.buffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio chunk:', error);
    }
  }, [createWavFromPCM]);

  const processUserResponse = useCallback((transcription: string) => {
    console.log(`Question ${currentQuestion + 1} response:`, transcription);
    
    const dataKeys: (keyof OnboardingData)[] = ['profession', 'needs', 'tone', 'language', 'useCase'];
    
    if (currentQuestion < 5) {
      setOnboardingData(prev => ({
        ...prev,
        [dataKeys[currentQuestion]]: transcription
      }));
      
      if (currentQuestion < 4) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        generateSummary();
      }
    }
  }, [currentQuestion]);

  const generateSummary = useCallback(() => {
    const { profession, needs, tone, language, useCase } = onboardingData;
    setCurrentStep('summary');
  }, [onboardingData]);

  const handleSummaryResponse = useCallback((transcription: string) => {
    const isPositive = transcription.toLowerCase().includes('oui') || 
                      transcription.toLowerCase().includes('exact') ||
                      transcription.toLowerCase().includes('parfait') ||
                      transcription.toLowerCase().includes('correct');
    
    if (isPositive) {
      setCurrentStep('generating');
      
      setTimeout(() => {
        setCurrentStep('testing');
      }, 3000);
    } else {
      setCurrentQuestion(0);
      setCurrentStep('questioning');
    }
  }, []);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data.type, data);

      switch (data.type) {
        case 'session.created':
          console.log('Session created, sending configuration...');
          const systemPrompt = `Tu es Clara, l'assistante IA de Thalya spécialisée dans l'onboarding vocal. 
          Tu conduis une conversation naturelle pour collecter les informations nécessaires à la création d'un agent IA personnalisé.
          
          Questions à poser dans l'ordre :
          1. ${QUESTIONS[0]}
          2. ${QUESTIONS[1]}
          3. ${QUESTIONS[2]}
          4. ${QUESTIONS[3]}
          5. ${QUESTIONS[4]}
          
          Après les 5 réponses, fais un résumé : "Si je résume bien, tu veux une IA qui travaille dans [activité], qui va t'aider à [besoin], avec un ton [ton], parlant [langue], et qui fera [cas d'usage]. C'est bien ça ?"
          
          Si confirmation : "Parfait. Donne-moi une seconde… Je génère ta version personnalisée maintenant."
          Sinon : reprendre les questions nécessaires.
          
          Sois naturelle, chaleureuse et professionnelle. Parle comme dans une vraie conversation.`;

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
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.8,
              max_response_output_tokens: 'inf'
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
            description: "L'onboarding vocal commence !",
          });
          break;

        case 'input_audio_buffer.speech_started':
          console.log('User started speaking');
          setIsUserSpeaking(true);
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('User stopped speaking');
          setIsUserSpeaking(false);
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            console.log('User transcript:', data.transcript);
            if (currentStep === 'questioning') {
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
  }, [currentStep, processUserResponse, handleSummaryResponse, playAudioChunk, toast]);

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

      // Start recording immediately when connected
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.onaudioprocess = (event) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0);
          
          const sum = inputData.reduce((acc, val) => acc + Math.abs(val), 0);
          const avgLevel = sum / inputData.length;
          setAudioLevel(avgLevel * 10);
          
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
