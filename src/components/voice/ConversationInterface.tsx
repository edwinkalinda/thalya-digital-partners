
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Activity, MessageSquare, Volume2, VolumeX, Users, Zap } from "lucide-react";

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioData?: string;
  timestamp: number;
  source?: string;
  latency?: number;
}

// VAD ultra-simple
class SimpleVAD {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private silenceStart: number = 0;
  private isSpeaking: boolean = false;
  private silenceThreshold: number = 30;
  private silenceDuration: number = 1200; // 1.2s pour éviter les coupures

  constructor(
    private stream: MediaStream,
    private onSpeechStart: () => void,
    private onSpeechEnd: () => void
  ) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    
    this.startDetection();
  }

  private startDetection() {
    const checkAudio = () => {
      this.analyser.getByteFrequencyData(this.dataArray);
      
      const volume = this.dataArray.slice(1, 50).reduce((acc, val) => acc + val, 0) / 49;
      const now = Date.now();
      
      if (volume > this.silenceThreshold) {
        if (!this.isSpeaking) {
          console.log(`🎤 DÉBUT parole (volume: ${volume.toFixed(1)})`);
          this.isSpeaking = true;
          this.onSpeechStart();
        }
        this.silenceStart = now;
      } else {
        if (this.isSpeaking && (now - this.silenceStart) > this.silenceDuration) {
          console.log(`🔇 FIN parole`);
          this.isSpeaking = false;
          this.onSpeechEnd();
        }
      }
      
      requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
  }

  stop() {
    this.audioContext.close();
  }
}

export const ConversationInterface = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [averageLatency, setAverageLatency] = useState<number>(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const vadRef = useRef<SimpleVAD | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const latencyHistoryRef = useRef<number[]>([]);

  // Calcul latence moyenne simplifié
  const updateLatencyStats = useCallback((latency: number) => {
    latencyHistoryRef.current.push(latency);
    if (latencyHistoryRef.current.length > 5) {
      latencyHistoryRef.current.shift();
    }
    const avg = latencyHistoryRef.current.reduce((a, b) => a + b, 0) / latencyHistoryRef.current.length;
    setAverageLatency(Math.round(avg));
  }, []);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setConnectionStatus('Connexion simplifiée...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté - Mode simplifié');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        setConnectionStatus('Système simplifié prêt');
        
        toast({
          title: "🚀 Mode simplifié activé",
          description: "Latence ultra-réduite",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connection_established':
              console.log(`🎊 ${data.message}`);
              setConnectionStatus(data.message);
              break;
              
            case 'transcription':
              console.log(`👤 Transcription (${data.latency}ms): ${data.text}`);
              
              if (data.latency) updateLatencyStats(data.latency);
              
              const userMessage: ConversationMessage = {
                id: Date.now().toString(),
                type: 'user',
                text: data.text,
                timestamp: Date.now(),
                latency: data.latency
              };
              
              setConversation(prev => [...prev, userMessage]);
              break;
              
            case 'audio_response':
              const sourceInfo = data.source === 'instant' ? 
                `⚡ INSTANTANÉ (${data.latency}ms)` : 
                data.source === 'cache' ? 
                `🚀 CACHE (${data.latency}ms)` :
                `🤖 IA (${data.latency}ms)`;
                
              console.log(`${sourceInfo}: ${data.response}`);
              
              if (data.latency) updateLatencyStats(data.latency);
              
              const aiMessage: ConversationMessage = {
                id: Date.now().toString() + '_ai',
                type: 'ai',
                text: data.response,
                timestamp: Date.now(),
                source: data.source,
                latency: data.latency
              };
              
              setConversation(prev => [...prev, aiMessage]);
              
              // Reset ultra-rapide
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 100);
              break;
              
            case 'error':
              console.error('❌ Erreur:', data.message);
              toast({
                title: "Erreur temporaire",
                description: data.message,
                variant: "destructive"
              });
              isProcessingRef.current = false;
              break;
          }
        } catch (error) {
          console.error('❌ Erreur parsing message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('🔌 WebSocket fermé');
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        setConnectionStatus('Déconnecté');
        stopListening();
      };

      websocket.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        setIsConnecting(false);
        setConnectionStatus('Erreur connexion');
      };

    } catch (error) {
      console.error('❌ Erreur WebSocket:', error);
      setIsConnecting(false);
      setConnectionStatus('Erreur');
    }
  }, [isConnected, isConnecting, toast, updateLatencyStats]);

  const processAudioChunks = useCallback(async () => {
    if (isProcessingRef.current || audioChunksRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    console.log(`🎬 Traitement audio (${audioChunksRef.current.length} chunks)...`);
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'audio_message',
          audio: base64Audio
        }));
      }
      
      audioChunksRef.current = [];
    };
    reader.readAsDataURL(audioBlob);
  }, [ws]);

  const startNewRecording = useCallback(async () => {
    if (!isConnected || !streamRef.current || isProcessingRef.current) return;
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        audioBitsPerSecond: 16000 // Plus bas pour plus de rapidité
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('⏹️ Enregistrement terminé');
        processAudioChunks();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Chunks de 1s
      
      console.log('🎤 Enregistrement démarré');
      
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
      isProcessingRef.current = false;
    }
  }, [isConnected, processAudioChunks]);

  const stopCurrentRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🛑 Arrêt enregistrement...');
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startListening = async () => {
    if (!isConnected) {
      toast({
        title: "Non connecté",
        description: "Connectez-vous d'abord",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🎤 Configuration microphone...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setIsListening(true);
      
      // VAD simplifié
      vadRef.current = new SimpleVAD(
        stream,
        () => {
          console.log('🗣️ DÉBUT parole');
          startNewRecording();
        },
        () => {
          console.log('🤐 FIN parole');
          stopCurrentRecording();
        }
      );
      
      toast({
        title: "🎤 Mode simplifié activé",
        description: "Parlez naturellement",
      });
      
    } catch (error) {
      console.error('❌ Erreur microphone:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopListening = useCallback(() => {
    console.log('🔇 Arrêt du mode conversation...');
    
    setIsListening(false);
    isProcessingRef.current = false;
    
    if (vadRef.current) {
      vadRef.current.stop();
      vadRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    audioChunksRef.current = [];
  }, []);

  const sendQuickMessage = (message: string) => {
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
      message: message
    }));

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: message,
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev, userMessage]);
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
      stopListening();
    };
  }, [stopListening]);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-3xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-electric-blue" />
            Clara Simplifiée
            {isConnecting && <Zap className="w-5 h-5 ml-3 text-blue-500 animate-spin" />}
            {isListening && <Activity className="w-5 h-5 ml-3 text-red-500 animate-pulse" />}
          </div>
          <Button onClick={() => setConversation([])} size="sm" variant="ghost">
            Effacer
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status simplifié */}
        <div className={`p-4 rounded-lg border-l-4 ${
          isConnected 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <div>
                <span className="font-semibold">
                  {connectionStatus}
                </span>
                {averageLatency > 0 && (
                  <p className="text-xs text-gray-600">
                    Latence moyenne: {averageLatency}ms
                  </p>
                )}
              </div>
            </div>
            {isConnected ? (
              <Button 
                onClick={isListening ? stopListening : startListening} 
                size="sm"
                variant={isListening ? "destructive" : "default"}
                className={isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Parler
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={connectWebSocket} size="sm" disabled={isConnecting}>
                {isConnecting ? 'Connexion...' : 'Se connecter'}
              </Button>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Mode Conversation Simplifié</p>
              <p className="text-sm">Latence ultra-réduite</p>
            </div>
          ) : (
            conversation.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-electric-blue text-white'
                      : 'bg-white text-gray-800 shadow-md border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">
                      {message.type === 'user' ? 'Vous' : 'Clara'}
                    </span>
                    <div className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.latency && (
                        <span className={`ml-1 text-xs ${message.latency < 500 ? 'text-green-600' : message.latency < 1000 ? 'text-orange-600' : 'text-red-600'}`}>
                          ({message.latency}ms)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  {message.source && (
                    <p className="text-xs opacity-60 mt-1">
                      {message.source === 'instant' ? '⚡ Instantané' : 
                       message.source === 'cache' ? '🚀 Cache' : 
                       '🤖 IA'}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          {isListening ? (
            <p className="text-red-600 font-medium flex items-center justify-center">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              🎤 Mode simplifié actif - Parlez naturellement
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Prêt pour conversation simplifiée
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez pour activer le mode simplifié
            </p>
          )}
        </div>

        {/* Messages rapides */}
        {isConnected && !isListening && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => sendQuickMessage('Bonjour Clara')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              👋 Bonjour
            </Button>
            <Button
              onClick={() => sendQuickMessage('Comment ça va ?')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              💬 Comment ça va ?
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
