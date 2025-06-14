
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { VoiceMessage, LatencyStats, WebSocketStatus } from '@/types/voice';

export const useWebSocketConnection = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttempts = useRef(0);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 25000);
  }, [ws]);

  const playAudioStreaming = async (base64Audio: string, messageId: string) => {
    try {
      setCurrentlyPlaying(messageId);
      
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ Erreur audio:', error);
      setCurrentlyPlaying(null);
    }
  };

  const connectWebSocket = useCallback(() => {
    if (isConnecting || (isConnected && ws?.readyState === WebSocket.OPEN)) {
      console.log('⚠️ Connexion déjà en cours ou établie');
      return;
    }
    
    setIsConnecting(true);
    setConnectionError(null);
    connectionAttempts.current += 1;
    
    console.log(`🔌 Connexion Gemini Pro (tentative ${connectionAttempts.current})`);
    
    if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      connectionTimeoutRef.current = setTimeout(() => {
        if (websocket.readyState === WebSocket.CONNECTING) {
          console.error('⏰ Timeout connexion (4s)');
          websocket.close();
          setIsConnecting(false);
          setConnectionError('Timeout - serveur inaccessible');
          
          if (connectionAttempts.current < 3) {
            setTimeout(connectWebSocket, 1500);
          }
        }
      }, 4000);

      websocket.onopen = () => {
        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
        
        console.log('✅ Gemini Pro connecté');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        setWs(websocket);
        connectionAttempts.current = 0;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        startPingInterval();
        websocket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        
        toast({
          title: "🧠 Google Gemini Pro",
          description: "Clara est prête à vous parler !",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`📨 Réponse: ${data.type}`);
          
          switch (data.type) {
            case 'connection_status':
              console.log('🎉 Statut Gemini:', data.message);
              setIsConnected(true);
              setIsConnecting(false);
              break;
              
            case 'transcription':
              console.log(`📝 Transcription: ${data.text} (${data.latency}ms)`);
              
              const userMessage: VoiceMessage = {
                id: Date.now().toString(),
                type: 'user',
                text: data.text,
                latency: data.latency,
                timestamp: Date.now()
              };
              
              setMessages(prev => [...prev, userMessage]);
              break;
              
            case 'audio_response':
              console.log(`🤖 Gemini: ${data.response} (${data.latency}ms)`);
              
              const aiMessage: VoiceMessage = {
                id: Date.now().toString() + '_ai',
                type: 'ai',
                text: data.response,
                audioData: data.audioData,
                latency: data.latency,
                timestamp: Date.now()
              };
              
              setMessages(prev => [...prev, aiMessage]);
              
              if (data.breakdown) {
                setLatencyStats({
                  ai: data.breakdown.ai,
                  tts: data.breakdown.tts,
                  stt: data.breakdown.stt,
                  total: data.latency
                });
              }
              
              if (data.audioData) {
                await playAudioStreaming(data.audioData, aiMessage.id);
              }
              break;
              
            case 'error':
              console.error('❌ Erreur Gemini:', data.message);
              setConnectionError(data.message);
              toast({
                title: "Erreur Gemini",
                description: data.message,
                variant: "destructive"
              });
              break;
              
            case 'pong':
              console.log('🏓 Pong - Gemini actif');
              if (!isConnected) {
                setIsConnected(true);
                setIsConnecting(false);
              }
              break;

            default:
              console.log(`⚠️ Type inconnu: ${data.type}`);
          }
        } catch (error) {
          console.error('❌ Erreur parsing:', error);
          setConnectionError('Erreur communication serveur');
        }
      };

      websocket.onclose = (event) => {
        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        
        console.log('🔌 Gemini fermé:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        
        if (event.code !== 1000 && connectionAttempts.current < 4) {
          const retryDelay = Math.min(1500 * connectionAttempts.current, 8000);
          setConnectionError(`Reconnexion dans ${retryDelay/1000}s...`);
          
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, retryDelay);
        } else if (connectionAttempts.current >= 4) {
          setConnectionError('Échec après 4 tentatives');
          toast({
            title: "Connexion échouée",
            description: "Impossible de joindre Gemini Pro",
            variant: "destructive"
          });
        }
      };

      websocket.onerror = (error) => {
        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
        console.error('❌ Erreur WebSocket:', error);
        setIsConnecting(false);
        setConnectionError('Erreur WebSocket');
      };

    } catch (error) {
      setIsConnecting(false);
      setConnectionError('Erreur création connexion');
      console.error('❌ Erreur:', error);
    }
  }, [isConnecting, isConnected, ws, toast, startPingInterval]);

  const disconnect = () => {
    if (ws) ws.close(1000);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
  };

  const clearMessages = () => {
    setMessages([]);
    setLatencyStats(null);
  };

  const sendTextMessage = (text: string) => {
    if (!text.trim()) return;
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast({
        title: "Non connecté",
        description: "Connectez-vous d'abord",
        variant: "destructive"
      });
      return;
    }
    
    ws.send(JSON.stringify({
      type: 'text_message',
      message: text.trim()
    }));
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
  };

  const cleanup = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    if (ws) ws.close(1000);
  };

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
