
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from "@/hooks/use-toast";
import { createBlob, decode, decodeAudioData, floatTo16BitPCM } from '@/utils/audioUtils';

interface LiveAudioMessage {
  id: string;
  type: 'user' | 'ai';
  text?: string;
  timestamp: number;
}

interface UseGoogleGenAILiveReturn {
  isRecording: boolean;
  isConnected: boolean;
  status: string;
  error: string;
  messages: LiveAudioMessage[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearMessages: () => void;
}

export const useGoogleGenAILive = (): UseGoogleGenAILiveReturn => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<LiveAudioMessage[]>([]);

  // Audio contexts
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  
  // GenAI
  const clientRef = useRef<GoogleGenerativeAI | null>(null);
  const sessionRef = useRef<any | null>(null);
  
  // Audio processing
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const initializeAudioContexts = useCallback(() => {
    if (!inputAudioContextRef.current) {
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      inputNodeRef.current = inputAudioContextRef.current.createGain();
    }
    
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setStatus('Connecting...');
      setError('');
      
      // Récupérer la clé API depuis les variables d'environnement ou demander à l'utilisateur
      const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GOOGLE_GENAI_API_KEY is required');
      }

      clientRef.current = new GoogleGenerativeAI(apiKey);
      
      // Créer une session live
      const model = clientRef.current.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: "Tu es Clara, une assistante vocale française amicale et professionnelle. Réponds de manière naturelle et conversationnelle."
      });

      sessionRef.current = model.startChat({
        generationConfig: {
          responseModalities: ['AUDIO', 'TEXT'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        }
      });

      initializeAudioContexts();
      setIsConnected(true);
      setStatus('Connected to Gemini 2.0 Flash');
      
      toast({
        title: "🤖 Gemini Live",
        description: "Clara est connectée avec Gemini 2.0 Flash Live!",
      });

    } catch (err: any) {
      setError(err.message);
      setStatus('Connection failed');
      console.error('Connection error:', err);
      
      toast({
        title: "Erreur de connexion",
        description: err.message,
        variant: "destructive"
      });
    }
  }, [toast, initializeAudioContexts]);

  const startRecording = useCallback(async () => {
    if (!isConnected || !inputAudioContextRef.current) {
      toast({
        title: "Non connecté",
        description: "Connectez-vous d'abord à Gemini",
        variant: "destructive"
      });
      return;
    }

    try {
      setStatus('Starting recording...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;
      const source = inputAudioContextRef.current.createMediaStreamSource(stream);
      
      // Créer un script processor pour capturer l'audio
      scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      scriptProcessorRef.current.onaudioprocess = (event) => {
        if (sessionRef.current && isRecording) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          
          // Convertir en PCM 16-bit
          const pcmData = floatTo16BitPCM(inputData);
          
          // Envoyer à Gemini (cette partie nécessiterait l'API de streaming réelle)
          console.log('Sending audio chunk to Gemini:', pcmData.byteLength, 'bytes');
        }
      };

      source.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
      
      setIsRecording(true);
      setStatus('Recording...');
      
      toast({
        title: "🎤 Enregistrement",
        description: "Parlez à Clara...",
      });

    } catch (err: any) {
      setError(err.message);
      console.error('Recording error:', err);
      
      toast({
        title: "Erreur microphone",
        description: err.message,
        variant: "destructive"
      });
    }
  }, [isConnected, isRecording, toast]);

  const stopRecording = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    
    setIsRecording(false);
    setStatus(isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  const disconnect = useCallback(() => {
    stopRecording();
    
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
      inputNodeRef.current = null;
    }
    
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
      outputNodeRef.current = null;
    }
    
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    
    setIsConnected(false);
    setStatus('Disconnected');
    setError('');
  }, [stopRecording]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isRecording,
    isConnected,
    status,
    error,
    messages,
    startRecording,
    stopRecording,
    connect,
    disconnect,
    clearMessages
  };
};
