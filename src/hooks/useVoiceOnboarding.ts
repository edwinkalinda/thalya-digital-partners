
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

interface UseVoiceOnboardingReturn {
  isConnected: boolean;
  isConnecting: boolean;
  currentStep: 'welcome' | 'questioning' | 'summary' | 'generating' | 'testing' | 'completed';
  currentQuestion: number;
  onboardingData: Partial<OnboardingData>;
  isRecording: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  startOnboarding: () => Promise<void>;
  endOnboarding: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

const QUESTIONS = [
  "Bonjour ! Avant de créer ton IA, j'aimerais mieux te connaître. Peux-tu me dire ce que tu fais dans la vie ou quel est ton métier ?",
  "Super. Et dans ton quotidien, à quoi aimerais-tu que ton IA t'aide ? Que veux-tu qu'elle fasse pour toi ?",
  "Parfait. Et comment veux-tu qu'elle parle à tes clients ? Plutôt calme, énergique, amicale, très pro, ou autre ?",
  "Tu veux qu'elle parle uniquement en français ou qu'elle soit bilingue (par exemple français/anglais) ?",
  "Dernière question : veux-tu qu'elle accueille les clients, prenne des réservations, réponde à des questions, ou fasse autre chose de précis ?"
];

export const useVoiceOnboarding = (): UseVoiceOnboardingReturn => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questioning' | 'summary' | 'generating' | 'testing' | 'completed'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  const playAudioFromBase64 = useCallback(async (base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsSpeaking(true);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  }, []);

  const processUserResponse = useCallback((transcription: string) => {
    console.log(`Question ${currentQuestion + 1} response:`, transcription);
    
    const dataKeys: (keyof OnboardingData)[] = ['profession', 'needs', 'tone', 'language', 'useCase'];
    
    if (currentQuestion < 5) {
      setOnboardingData(prev => ({
        ...prev,
        [dataKeys[currentQuestion]]: transcription
      }));
      
      if (currentQuestion < 4) {
        // Passer à la question suivante
        setCurrentQuestion(prev => prev + 1);
        askNextQuestion(currentQuestion + 1);
      } else {
        // Toutes les questions sont posées, faire le résumé
        generateSummary();
      }
    }
  }, [currentQuestion]);

  const askNextQuestion = useCallback(async (questionIndex: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: QUESTIONS[questionIndex],
          voiceId: 'pFZP5JQG7iQjIQuC4Bku'
        }
      });
      
      if (!error && data?.audioData) {
        await playAudioFromBase64(data.audioData);
      }
    } catch (error) {
      console.error('Error asking question:', error);
    }
  }, [playAudioFromBase64]);

  const generateSummary = useCallback(async () => {
    const { profession, needs, tone, language, useCase } = onboardingData;
    
    const summaryText = `Si je résume bien, tu veux une IA qui travaille dans ${profession}, qui va t'aider à ${needs}, avec un ton ${tone}, parlant ${language}, et qui fera ${useCase}. C'est bien ça ?`;
    
    setCurrentStep('summary');
    
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: summaryText,
          voiceId: 'pFZP5JQG7iQjIQuC4Bku'
        }
      });
      
      if (!error && data?.audioData) {
        await playAudioFromBase64(data.audioData);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  }, [onboardingData, playAudioFromBase64]);

  const handleSummaryResponse = useCallback(async (transcription: string) => {
    const isPositive = transcription.toLowerCase().includes('oui') || 
                      transcription.toLowerCase().includes('oui') || 
                      transcription.toLowerCase().includes('exact') ||
                      transcription.toLowerCase().includes('parfait') ||
                      transcription.toLowerCase().includes('correct');
    
    if (isPositive) {
      setCurrentStep('generating');
      
      try {
        const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
          body: {
            text: "Parfait. Donne-moi une seconde… Je génère ta version personnalisée maintenant.",
            voiceId: 'pFZP5JQG7iQjIQuC4Bku'
          }
        });
        
        if (!error && data?.audioData) {
          await playAudioFromBase64(data.audioData);
        }
        
        // Simuler la génération pendant 3 secondes
        setTimeout(async () => {
          setCurrentStep('testing');
          
          const { data: testData, error: testError } = await supabase.functions.invoke('elevenlabs-tts', {
            body: {
              text: "Voilà, ton IA est prête. Tu peux lui parler maintenant pour tester.",
              voiceId: 'pFZP5JQG7iQjIQuC4Bku'
            }
          });
          
          if (!testError && testData?.audioData) {
            await playAudioFromBase64(testData.audioData);
          }
        }, 3000);
        
      } catch (error) {
        console.error('Error in generation phase:', error);
      }
    } else {
      // Redemander les informations
      generateSummary();
    }
  }, [generateSummary, playAudioFromBase64]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data.type, data);

      switch (data.type) {
        case 'transcription':
          console.log('Transcription received:', data.text);
          if (currentStep === 'questioning') {
            processUserResponse(data.text);
          } else if (currentStep === 'summary') {
            handleSummaryResponse(data.text);
          }
          break;

        case 'audio_response':
          if (data.audioData) {
            playAudioFromBase64(data.audioData);
          }
          break;

        case 'connection_status':
          if (data.status === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
            toast({
              title: "🎙️ Connexion établie",
              description: "Onboarding vocal prêt !",
            });
          }
          break;

        case 'error':
          console.error('WebSocket error:', data);
          toast({
            title: "Erreur",
            description: data.message || "Une erreur s'est produite",
            variant: "destructive"
          });
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [currentStep, processUserResponse, handleSummaryResponse, playAudioFromBase64, toast]);

  const startOnboarding = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    
    try {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      const ws = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/realtime-voice-chat');
      
      ws.onopen = () => {
        console.log('WebSocket connected for onboarding');
        setIsConnected(true);
        setIsConnecting(false);
        setCurrentStep('questioning');
        setCurrentQuestion(0);
        
        // Démarrer avec la première question
        setTimeout(() => {
          askNextQuestion(0);
        }, 1000);
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
          description: "Impossible de se connecter au service vocal",
          variant: "destructive"
        });
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Error starting onboarding:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'onboarding vocal",
        variant: "destructive"
      });
    }
  }, [isConnected, isConnecting, handleWebSocketMessage, askNextQuestion, toast]);

  const startRecording = useCallback(async () => {
    if (!isConnected || isRecording) return;

    try {
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
        if (isRecording && wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0);
          
          // Calculer le niveau audio pour l'animation
          const sum = inputData.reduce((acc, val) => acc + Math.abs(val), 0);
          const avgLevel = sum / inputData.length;
          setAudioLevel(avgLevel * 10); // Amplifier pour l'animation
          
          const encodedAudio = encodeAudioForAPI(inputData);
          
          wsRef.current.send(JSON.stringify({
            type: 'audio_message',
            audio: encodedAudio
          }));
        }
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  }, [isConnected, isRecording, encodeAudioForAPI, toast]);

  const stopRecording = useCallback(() => {
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
    
    setIsRecording(false);
    setAudioLevel(0);
  }, []);

  const endOnboarding = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    stopRecording();

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setCurrentStep('welcome');
    setCurrentQuestion(0);
    setOnboardingData({});
    setIsSpeaking(false);
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      endOnboarding();
    };
  }, [endOnboarding]);

  // Simuler l'audio level quand on parle
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isSpeaking]);

  return {
    isConnected,
    isConnecting,
    currentStep,
    currentQuestion,
    onboardingData,
    isRecording,
    isSpeaking,
    audioLevel,
    startOnboarding,
    endOnboarding,
    startRecording,
    stopRecording
  };
};
