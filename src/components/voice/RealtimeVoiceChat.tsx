
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Zap, Clock, Activity, Play, Pause } from "lucide-react";

interface VoiceMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioData?: string;
  latency?: number;
  source?: 'cache' | 'generated';
  timestamp: number;
}

interface LatencyStats {
  ai: number;
  tts: number;
  total: number;
  stt?: number;
}

export const RealtimeVoiceChat = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);

  // Connexion WebSocket optimisée
  const connectWebSocket = useCallback(() => {
    const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/functions/v1/realtime-voice-chat');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
      
      toast({
        title: "Connexion établie ⚡",
        description: "Streaming vocal ultra-optimisé activé",
      });
    };

    websocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'connection_established':
          toast({
            title: "Optimisations activées ⚡",
            description: data.optimizations.join(', '),
          });
          break;
          
        case 'transcription':
          console.log(`STT latency: ${data.latency}ms`);
          
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
          console.log(`Response latency: ${data.latency}ms (${data.source})`);
          
          const aiMessage: VoiceMessage = {
            id: Date.now().toString() + '_ai',
            type: 'ai',
            text: data.response,
            audioData: data.audioData,
            latency: data.latency,
            source: data.source,
            timestamp: Date.now()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
          if (data.breakdown) {
            setLatencyStats({
              ai: data.breakdown.ai,
              tts: data.breakdown.tts,
              total: data.latency
            });
          }
          
          // Lecture audio automatique streaming
          if (data.audioData) {
            await playAudioStreaming(data.audioData, aiMessage.id);
          }
          break;
          
        case 'error':
          toast({
            title: "Erreur",
            description: data.message,
            variant: "destructive"
          });
          break;
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Tentative de reconnexion...",
        variant: "destructive"
      });
    };

  }, [toast]);

  // Lecture audio streaming optimisée
  const playAudioStreaming = async (base64Audio: string, messageId: string) => {
    try {
      setCurrentlyPlaying(messageId);
      
      // Conversion base64 en blob optimisée
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentlyPlaying(null);
      
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire l'audio",
        variant: "destructive"
      });
    }
  };

  // Enregistrement audio optimisé
  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'audio_message',
              audio: base64Audio
            }));
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement démarré 🎤",
        description: "Parlez maintenant...",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Enregistrement terminé ⏹️",
        description: "Traitement en cours...",
      });
    }
  };

  // Connexion automatique
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [connectWebSocket]);

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center">
          <Zap className="w-6 h-6 mr-2 text-electric-blue" />
          Chat Vocal Temps Réel Ultra-Optimisé
          {isConnected && <Activity className="w-4 h-4 ml-2 text-green-500 animate-pulse" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques de latence */}
        {latencyStats && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              ⚡ Performances Ultra-Optimisées
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">{latencyStats.ai}ms</div>
                <div className="text-gray-600">IA Response</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{latencyStats.tts}ms</div>
                <div className="text-gray-600">TTS Stream</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{latencyStats.total}ms</div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles */}
        <div className="flex gap-2">
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isConnected}
            className={`flex-1 ${isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Arrêter l'enregistrement
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Commencer à parler
              </>
            )}
          </Button>

          <Button 
            onClick={connectWebSocket}
            disabled={isConnected}
            variant="outline"
            className="flex-shrink-0"
          >
            {isConnected ? 'Connecté' : 'Reconnecter'}
          </Button>
        </div>

        {/* Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-50 border-l-4 border-blue-500 ml-8'
                  : 'bg-gray-50 border-l-4 border-green-500 mr-8'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-semibold ${
                  message.type === 'user' ? 'text-blue-800' : 'text-green-800'
                }`}>
                  {message.type === 'user' ? 'Vous' : 'Clara (IA)'}
                </span>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  {message.latency && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {message.latency}ms
                    </span>
                  )}
                  {message.source === 'cache' && (
                    <span className="bg-green-100 text-green-800 px-1 rounded text-xs">Cache</span>
                  )}
                  {message.audioData && (
                    <Button
                      onClick={() => playAudioStreaming(message.audioData!, message.id)}
                      disabled={currentlyPlaying === message.id}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      {currentlyPlaying === message.id ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-gray-700">{message.text}</p>
            </div>
          ))}
        </div>

        {/* Statut */}
        <div className="text-center text-sm text-gray-500">
          {!isConnected && (
            <p>⚠️ Connexion WebSocket non établie</p>
          )}
          {isConnected && !isRecording && (
            <p>✅ Prêt pour la conversation vocale ultra-rapide</p>
          )}
          {isRecording && (
            <p className="text-red-600 animate-pulse">🎤 Enregistrement en cours...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
