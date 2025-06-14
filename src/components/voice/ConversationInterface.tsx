
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
  private silenceDuration: number = 800; // 800ms ultra-rapide
  private minSpeechDuration: number = 300; // 300ms minimum ultra-court
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
    this.analyser.fftSize = 512; // Plus petit pour plus de rapidité
    this.analyser.smoothingTimeConstant = 0.1; // Moins de lissage pour plus de réactivité
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
      
      // Analyse ultra-rapide du volume
      const volume = this.dataArray.slice(5, 50).reduce((acc, val) => acc + val, 0) / 45;
      const now = Date.now();
      
      if (volume > this.silenceThreshold) {
        this.consecutiveSilenceFrames = 0;
        if (!this.isSpeaking) {
          console.log(`🎤 DÉBUT parole ULTRA-RAPIDE (volume: ${volume.toFixed(1)})`);
          this.isSpeaking = true;
          this.speechStartTime = now;
          this.onSpeechStart();
        }
        this.silenceStart = now;
      } else {
        this.consecutiveSilenceFrames++;
        
        if (this.isSpeaking && (now - this.silenceStart) > this.silenceDuration) {
          const speechDuration = now - this.speechStartTime;
          if (speechDuration >= this.minSpeechDuration && this.consecutiveSilenceFrames > 5) {
            console.log(`🔇 FIN parole ULTRA-RAPIDE (durée: ${speechDuration}ms)`);
            this.isSpeaking = false;
            this.isProcessing = true;
            this.onSpeechEnd();
            
            // Reset ultra-rapide
            setTimeout(() => {
              this.isProcessing = false;
            }, 500);
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
    setConnectionStatus('Connexion ULTRA-OPTIMISÉE...');
    console.log('🔌 Connexion WebSocket ULTRA-OPTIMISÉE...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté - Mode ULTRA-RAPIDE activé');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        setConnectionStatus('Système ULTRA-RAPIDE prêt');
        setErrorCount(0);
        
        toast({
          title: "🚀 Mode ULTRA-RAPIDE activé",
          description: "Latence minimale garantie",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connection_established':
              console.log(`🎊 ${data.message}`);
              setConnectionStatus(data.message);
              if (data.optimizations) {
                console.log(`🎉 Optimisations: ${data.optimizations.length}`);
              }
              break;
              
            case 'transcription':
              console.log(`👤 Transcription ULTRA-RAPIDE (${data.latency}ms): ${data.text}`);
              
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
              console.log(`📝 Aperçu ULTRA-RAPIDE: ${data.text}`);
              break;
              
            case 'audio_response':
              const sourceInfo = data.source === 'instant_cache' ? 
                `⚡ INSTANTANÉ (${data.latency}ms)` : 
                data.source === 'cache' ? 
                `🚀 CACHE (${data.latency}ms)` :
                data.source === 'generated' ?
                `🤖 GÉNÉRÉ (${data.latency}ms)` :
                `📝 TEXTE (${data.latency}ms)`;
                
              console.log(`${sourceInfo}: ${data.response}`);
              
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
              
              // Reset ultra-rapide
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 50);
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
        console.log('🔌 Conversation disconnected', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        setConnectionStatus('Déconnecté');
        stopListening();
        
        if (event.code !== 1000 && errorCount < 3) {
          toast({
            title: "Reconnexion automatique",
            description: "Mode ULTRA-RAPIDE...",
            variant: "destructive"
          });
          
          setTimeout(() => {
            if (!isConnected) {
              connectWebSocket();
            }
          }, 2000);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ Conversation WebSocket error:', error);
        setIsConnecting(false);
        setConnectionStatus('Erreur connexion');
        setErrorCount(prev => prev + 1);
        
        toast({
          title: "Erreur de connexion",
          description: "Retry automatique...",
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
          sampleRate: 24000
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
    console.log(`🎬 Traitement audio ULTRA-RAPIDE (${audioChunksRef.current.length} chunks)...`);
    
    const supportedMimeType = getSupportedMimeType();
    const audioBlob = new Blob(audioChunksRef.current, { 
      type: supportedMimeType
    });
    
    console.log(`📋 Audio ULTRA-RAPIDE: ${audioBlob.size} bytes`);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      console.log(`📤 Envoi ULTRA-RAPIDE: ${base64Audio.length} caractères`);
      
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
        audioBitsPerSecond: 32000 // Plus bas pour plus de rapidité
      };
      
      if (supportedMimeType) {
        mediaRecorderOptions.mimeType = supportedMimeType;
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, mediaRecorderOptions);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`📦 Chunk ULTRA-RAPIDE: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('⏹️ Enregistrement terminé ULTRA-RAPIDE');
        processAudioChunks();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(500); // Chunks de 500ms plus gros pour éviter trop de petits chunks
      
      console.log('🎤 Enregistrement ULTRA-RAPIDE démarré');
      
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
      isProcessingRef.current = false;
    }
  }, [isConnected, processAudioChunks]);

  const stopCurrentRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🛑 Arrêt enregistrement ULTRA-RAPIDE...');
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
      console.log('🎤 Configuration microphone ULTRA-RAPIDE...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setIsListening(true);
      
      // VAD ultra-rapide
      vadRef.current = new IntelligentVAD(
        stream,
        () => {
          console.log('🗣️ DÉBUT parole ULTRA-RAPIDE');
          startNewRecording();
        },
        () => {
          console.log('🤐 FIN parole ULTRA-RAPIDE');
          stopCurrentRecording();
        }
      );
      
      toast({
        title: "🎤 Mode ULTRA-RAPIDE activé",
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
    console.log('🔇 Arrêt du mode conversation ULTRA-RAPIDE...');
    
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
      title: "🔇 Mode ULTRA-RAPIDE arrêté",
      description: "Conversation terminée",
    });
  }, []);

  const clearConversation = () => {
    setConversation([]);
    toast({
      title: "Conversation effacée",
      description: "Mode ULTRA-RAPIDE prêt",
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
            Clara ULTRA-RAPIDE
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
        {/* Status ULTRA-RAPIDE avec métriques */}
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
                    ULTRA-RAPIDE
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

        {/* Conversation ULTRA-RAPIDE avec métriques */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Mode Conversation ULTRA-RAPIDE</p>
              <p className="text-sm">Latence minimale garantie</p>
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
                        <span className={`ml-1 text-xs ${message.latency < 1000 ? 'text-green-600' : message.latency < 2000 ? 'text-orange-600' : 'text-red-600'}`}>
                          ({message.latency}ms)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  {message.source && (
                    <p className="text-xs opacity-60 mt-1">
                      {message.source === 'instant_cache' ? '⚡ Instantané' : 
                       message.source === 'cache' ? '🚀 Cache' : 
                       message.source === 'generated' ? '🤖 Généré' : '📝 Texte'}
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

        {/* Status intelligent ULTRA-RAPIDE */}
        <div className="text-center">
          {isAISpeaking ? (
            <p className="text-green-600 font-medium animate-pulse">
              🤖 Clara répond en ULTRA-RAPIDE...
            </p>
          ) : isListening ? (
            <p className="text-red-600 font-medium flex items-center justify-center">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              🎤 Mode ULTRA-RAPIDE actif - Parlez naturellement
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Prêt pour conversation ULTRA-RAPIDE
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion ULTRA-RAPIDE...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez pour activer le mode ULTRA-RAPIDE
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
              className="hover:bg-blue-50"
            >
              👋 Bonjour
            </Button>
            <Button
              onClick={() => sendQuickMessage('Comment ça va ?')}
              variant="outline"
              size="sm"
              disabled={isAISpeaking}
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
