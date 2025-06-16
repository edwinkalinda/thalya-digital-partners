
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { VoiceMessage, LatencyStats } from '@/types/voice';

export const useWebSocketConnection = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        wsRef.current = websocket;
        
        toast({
          title: "🔗 Connexion établie",
          description: "Chat vocal activé avec Gemini",
        });
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        wsRef.current = null;
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Erreur de connexion WebSocket');
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError('Impossible de créer la connexion');
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting, toast]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          const userMessage: VoiceMessage = {
            id: Date.now().toString(),
            type: 'user',
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
            if (lastMessage && lastMessage.type === 'ai' && lastMessage.id.endsWith('_current')) {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, text: lastMessage.text + data.delta }
              ];
            } else {
              return [
                ...prev,
                {
                  id: Date.now().toString() + '_current',
                  type: 'ai' as const,
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

      case 'latency_stats':
        setLatencyStats(data.stats);
        break;

      default:
        console.log('Unhandled message type:', data.type);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setWs(null);
    wsRef.current = null;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'text_message',
        message: text
      }));
      
      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
    }
  }, []);

  const playAudioStreaming = useCallback((audioData: string, messageId: string) => {
    setCurrentlyPlaying(messageId);
    
    try {
      const audioBlob = new Blob([atob(audioData)], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentlyPlaying(null);
    }
  }, []);

  const cleanup = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return {
    ws,
    isConnected,
    isConnecting,
    connectionError,
    messages,
    latencyStats,
    currentlyPlaying,
    connectWebSocket,
    disconnect,
    clearMessages,
    sendTextMessage,
    playAudioStreaming,
    cleanup
  };
};
