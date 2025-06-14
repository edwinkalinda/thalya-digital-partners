
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createBlob, decode, decodeAudioData, floatTo16BitPCM } from '@/utils/audioUtils';
import { supabase } from '@/integrations/supabase/client';

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
  sendTextMessage: (text: string) => Promise<void>;
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

  const sendTextMessage = useCallback(async (text: string) => {
    if (!isConnected) {
      throw new Error('Not connected to GenAI');
    }

    try {
      // Ajouter le message utilisateur
      const userMessage: LiveAudioMessage = {
        id: Date.now().toString(),
        type: 'user',
        text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);

      // Appeler l'edge function
      const { data, error } = await supabase.functions.invoke('google-genai-chat', {
        body: { message: text }
      });

      if (error) throw error;

      // Ajouter la réponse de l'IA
      const aiMessage: LiveAudioMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: data.response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      toast({
        title: "Erreur de message",
        description: err.message,
        variant: "destructive"
      });
    }
  }, [isConnected, toast]);

  const connect = useCallback(async () => {
    try {
      setStatus('Connecting...');
      setError('');
      
      // Test de connexion avec l'edge function
      const { data, error } = await supabase.functions.invoke('google-genai-chat', {
        body: { message: 'Test de connexion' }
      });

      if (error) throw error;

      initializeAudioContexts();
      setIsConnected(true);
      setStatus('Connected to Gemini via Supabase');
      
      toast({
        title: "🤖 Gemini Live",
        description: "Clara est connectée via Supabase!",
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
        if (isRecording) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          
          // Convertir en PCM 16-bit
          const pcmData = floatTo16BitPCM(inputData);
          
          // Pour l'instant, on log l'audio capturé
          // L'intégration complète avec Gemini nécessiterait l'API WebRTC ou streaming
          console.log('Audio chunk captured:', pcmData.byteLength, 'bytes');
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
    clearMessages,
    sendTextMessage
  };
};
