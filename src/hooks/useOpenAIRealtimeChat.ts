import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface UseOpenAIRealtimeChatReturn {
  isConnected: boolean;
  isConnecting: boolean;
  messages: Message[];
  isRecording: boolean;
  startConversation: () => Promise<void>;
  endConversation: () => void;
  sendTextMessage: (text: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useOpenAIRealtimeChat = (): UseOpenAIRealtimeChatReturn => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data.type, data);

    switch (data.type) {
      case 'session.created':
        console.log('Session created, sending configuration...');
        wsRef.current?.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `Tu es Clara, l'assistante IA de Thalya. Tu conduis un onboarding conversationnel pour configurer un agent IA personnalisé. 
            Pose des questions pertinentes sur: le type d'entreprise, le ton souhaité, les services principaux, les heures d'ouverture.
            Sois naturelle, chaleureuse et professionnelle. Adapte tes questions selon les réponses.`,
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
        toast({
          title: "🎙️ Clara connectée",
          description: "L'onboarding vocal est prêt !",
        });
        break;

      case 'input_audio_buffer.speech_started':
        console.log('User started speaking');
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('User stopped speaking');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: data.transcript,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, userMessage]);
        }
        break;

      case 'response.audio_transcript.delta':
        if (data.delta) {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === 'ai' && lastMessage.id.endsWith('_current')) {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, text: lastMessage.text + data.delta }
              ];
            } else {
              return [
                ...prev,
                {
                  id: Date.now().toString() + '_current',
                  sender: 'ai',
                  text: data.delta,
                  timestamp: Date.now()
                }
              ];
            }
          });
        }
        break;

      case 'response.audio_transcript.done':
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.id.endsWith('_current')) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, id: Date.now().toString() }
            ];
          }
          return prev;
        });
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

      case 'error':
        console.error('WebSocket error:', data);
        toast({
          title: "Erreur",
          description: data.error?.message || "Une erreur s'est produite",
          variant: "destructive"
        });
        break;
    }
  }, [playAudioChunk, toast]);

  const startConversation = useCallback(async () => {
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

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la conversation",
        variant: "destructive"
      });
    }
  }, [isConnected, isConnecting, handleWebSocketMessage, toast]);

  const endConversation = useCallback(() => {
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
    setIsRecording(false);
  }, []);

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
          const encodedAudio = encodeAudioForAPI(inputData);
          
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
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
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    }));

    wsRef.current.send(JSON.stringify({
      type: 'response.create'
    }));
  }, []);

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, [endConversation]);

  return {
    isConnected,
    isConnecting,
    messages,
    isRecording,
    startConversation,
    endConversation,
    sendTextMessage,
    startRecording,
    stopRecording
  };
};
