import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Activity, MessageSquare, Volume2, VolumeX, Users, Zap, AlertTriangle } from "lucide-react";

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioData?: string;
  timestamp: number;
  isPlaying?: boolean;
  source?: string;
  latency?: number;
}

// Fonction utilitaire pour détecter le format audio supporté
const getSupportedMimeType = (): string => {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus'
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      console.log(`✅ Format supporté détecté: ${type}`);
      return type;
    }
  }
  
  console.log('⚠️ Utilisation du format par défaut');
  return 'audio/webm';
};

// VAD optimisé avec détection intelligente
class IntelligentVAD {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private silenceStart: number = 0;
  private isSpeaking: boolean = false;
  private silenceThreshold: number = 25;
  private silenceDuration: number = 1000; // 1 seconde plus stable
  private minSpeechDuration: number = 500; // 500ms minimum
  private speechStartTime: number = 0;
  private consecutiveSilenceFrames: number = 0;
  private isProcessing: boolean = false;

  constructor(
    private stream: MediaStream,
    private onSpeechStart: () => void,
    private onSpeechEnd: () => void
  ) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.3; // Plus de lissage
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    
    this.startDetection();
  }

  private startDetection() {
    const checkAudio = () => {
      if (this.isProcessing) {
        requestAnimationFrame(checkAudio);
        return;
      }

      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Analyse plus précise du volume
      const volume = this.dataArray.slice(10, 100).reduce((acc, val) => acc + val, 0) / 90;
      const now = Date.now();
      
      if (volume > this.silenceThreshold) {
        this.consecutiveSilenceFrames = 0;
        if (!this.isSpeaking) {
          console.log(`🎤 DÉBUT parole intelligent (volume: ${volume.toFixed(1)})`);
          this.isSpeaking = true;
          this.speechStartTime = now;
          this.onSpeechStart();
        }
        this.silenceStart = now;
      } else {
        this.consecutiveSilenceFrames++;
        
        if (this.isSpeaking && (now - this.silenceStart) > this.silenceDuration) {
          const speechDuration = now - this.speechStartTime;
          if (speechDuration >= this.minSpeechDuration && this.consecutiveSilenceFrames > 10) {
            console.log(`🔇 FIN parole intelligent (durée: ${speechDuration}ms)`);
            this.isSpeaking = false;
            this.isProcessing = true;
            this.onSpeechEnd();
            
            // Reset après traitement
            setTimeout(() => {
              this.isProcessing = false;
            }, 2000);
          }
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
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [averageLatency, setAverageLatency] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const vadRef = useRef<IntelligentVAD | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const latencyHistoryRef = useRef<number[]>([]);

  // Calcul latence moyenne
  const updateLatencyStats = useCallback((latency: number) => {
    latencyHistoryRef.current.push(latency);
    if (latencyHistoryRef.current.length > 10) {
      latencyHistoryRef.current.shift();
    }
    const avg = latencyHistoryRef.current.reduce((a, b) => a + b, 0) / latencyHistoryRef.current.length;
    setAverageLatency(Math.round(avg));
  }, []);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setConnectionStatus('Connexion en cours...');
    console.log('🔌 Connexion WebSocket optimisée...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté avec optimisations');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        setConnectionStatus('Connecté avec optimisations');
        setErrorCount(0);
        
        toast({
          title: "🚀 Système optimisé connecté",
          description: "Rate limiting et anti-spam activés",
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
              
            case 'transcription_preview':
              console.log(`📝 Aperçu: ${data.text}`);
              break;
              
            case 'audio_response':
              const sourceInfo = data.source === 'instant_cache' ? 
                `INSTANTANÉ (${data.latency}ms)` : 
                data.source === 'cache' ? 
                `CACHE (${data.latency}ms)` :
                `GÉNÉRÉ (${data.latency}ms)`;
                
              console.log(`🤖 ${sourceInfo}: ${data.response}`);
              
              if (data.latency) updateLatencyStats(data.latency);
              
              const aiMessage: ConversationMessage = {
                id: Date.now().toString() + '_ai',
                type: 'ai',
                text: data.response,
                audioData: data.audioData,
                timestamp: Date.now(),
                source: data.source,
                latency: data.latency
              };
              
              setConversation(prev => [...prev, aiMessage]);
              
              if (data.audioData && isAudioEnabled) {
                await playAIResponse(data.audioData, aiMessage.id);
              }
              
              // Reset traitement
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 100);
              break;
              
            case 'error':
              console.error('❌ Erreur:', data.message);
              setErrorCount(prev => prev + 1);
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
          setErrorCount(prev => prev + 1);
        }
      };

      websocket.onclose = (event) => {
        console.log('🔌 WebSocket fermé', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        setConnectionStatus('Déconnecté');
        stopListening();
        
        if (event.code !== 1000 && errorCount < 3) {
          toast({
            title: "Connexion fermée",
            description: "Reconnexion automatique...",
            variant: "destructive"
          });
          
          setTimeout(() => {
            if (!isConnected) {
              connectWebSocket();
            }
          }, 3000);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        setIsConnecting(false);
        setConnectionStatus('Erreur de connexion');
        setErrorCount(prev => prev + 1);
        
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('❌ Erreur WebSocket:', error);
      setIsConnecting(false);
      setConnectionStatus('Erreur');
      setErrorCount(prev => prev + 1);
    }
  }, [isConnected, isConnecting, toast, isAudioEnabled, errorCount, updateLatencyStats]);

  const playAIResponse = async (base64Audio: string, messageId: string) => {
    try {
      setIsAISpeaking(true);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ 
          sampleRate: 24000,
          latencyHint: 'interactive'
        });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsAISpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = (error) => {
        console.error('❌ Erreur lecture audio:', error);
        setIsAISpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ Erreur playback:', error);
      setIsAISpeaking(false);
    }
  };

  const processAudioChunks = useCallback(async () => {
    if (isProcessingRef.current || audioChunksRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    console.log(`🎬 Traitement audio optimisé (${audioChunksRef.current.length} chunks)...`);
    
    const supportedMimeType = getSupportedMimeType();
    const audioBlob = new Blob(audioChunksRef.current, { 
      type: supportedMimeType
    });
    
    console.log(`📋 Audio: ${audioBlob.size} bytes`);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      console.log(`📤 Envoi audio: ${base64Audio.length} caractères`);
      
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
      const supportedMimeType = getSupportedMimeType();
      const mediaRecorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 64000
      };
      
      if (supportedMimeType) {
        mediaRecorderOptions.mimeType = supportedMimeType;
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, mediaRecorderOptions);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`📦 Chunk: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('⏹️ Enregistrement terminé, traitement...');
        processAudioChunks();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Chunks de 1 seconde plus stables
      
      console.log('🎤 Enregistrement optimisé démarré');
      
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
      console.log('🎤 Configuration microphone optimisée...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0.01
        }
      });
      
      streamRef.current = stream;
      setIsListening(true);
      
      // VAD intelligent
      vadRef.current = new IntelligentVAD(
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
        title: "🎤 Mode optimisé activé",
        description: "Parlez naturellement",
      });
      
    } catch (error) {
      console.error('❌ Erreur microphone:', error);
      
      let errorMessage = "Impossible d'accéder au microphone";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Permission microphone refusée";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "Aucun microphone trouvé";
        }
      }
      
      toast({
        title: "Erreur microphone",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopListening = useCallback(() => {
    console.log('🔇 Arrêt conversation...');
    
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
    
    toast({
      title: "🔇 Conversation arrêtée",
      description: "Mode écoute désactivé",
    });
  }, []);

  const clearConversation = () => {
    setConversation([]);
    toast({
      title: "Conversation effacée",
      description: "Nouvelle conversation démarrée",
    });
  };

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
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, [stopListening]);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-3xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-electric-blue" />
            Clara Optimisée
            {isAISpeaking && <Activity className="w-5 h-5 ml-3 text-green-500 animate-pulse" />}
            {isConnecting && <Zap className="w-5 h-5 ml-3 text-blue-500 animate-spin" />}
            {isListening && <Activity className="w-5 h-5 ml-3 text-red-500 animate-pulse" />}
            {errorCount > 0 && <AlertTriangle className="w-5 h-5 ml-3 text-orange-500" />}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              size="sm"
              variant="ghost"
              className={isAudioEnabled ? "text-green-600" : "text-gray-400"}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setConversation([])} size="sm" variant="ghost">
              Effacer
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status avec métriques */}
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
                    Latence moyenne: {averageLatency}ms | Erreurs: {errorCount}
                  </p>
                )}
              </div>
            </div>
            {isConnected ? (
              <Button 
                onClick={isListening ? stopListening : startListening} 
                size="sm"
                variant={isListening ? "destructive" : "default"}
                disabled={isProcessingRef.current}
              >
                {isListening ? 'Arrêter' : 'Démarrer'}
              </Button>
            ) : (
              <Button onClick={connectWebSocket} size="sm" disabled={isConnecting}>
                {isConnecting ? 'Connexion...' : 'Se connecter'}
              </Button>
            )}
          </div>
        </div>

        {/* Conversation avec métriques */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Conversation Optimisée</p>
              <p className="text-sm">Rate limiting et cache intelligent activés</p>
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
                        <span className="ml-1 text-xs">
                          ({message.latency}ms)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  {message.source && (
                    <p className="text-xs opacity-60 mt-1">
                      Source: {message.source}
                    </p>
                  )}
                  {message.audioData && message.type === 'ai' && (
                    <div className="mt-2">
                      <Button
                        onClick={() => playAIResponse(message.audioData!, message.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                      >
                        🔊 Réécouter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status intelligent */}
        <div className="text-center">
          {isAISpeaking ? (
            <p className="text-green-600 font-medium animate-pulse">
              🤖 Clara vous répond...
            </p>
          ) : isListening ? (
            <p className="text-red-600 font-medium">
              🎤 Écoute active - Parlez naturellement
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Prêt pour conversation optimisée
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion optimisée...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez pour vous connecter
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
              disabled={isAISpeaking}
            >
              👋 Bonjour
            </Button>
            <Button
              onClick={() => sendQuickMessage('Comment ça va ?')}
              variant="outline"
              size="sm"
              disabled={isAISpeaking}
            >
              💬 Comment ça va ?
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
