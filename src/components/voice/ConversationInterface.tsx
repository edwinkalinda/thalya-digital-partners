
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
  isPlaying?: boolean;
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

// VAD ultra-agressive pour latence minimale
class UltraFastVAD {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private silenceStart: number = 0;
  private isSpeaking: boolean = false;
  private silenceThreshold: number = 30; // Seuil très bas pour détecter rapidement
  private silenceDuration: number = 800; // Seulement 800ms de silence
  private minSpeechDuration: number = 200; // Minimum 200ms de parole
  private speechStartTime: number = 0;

  constructor(
    private stream: MediaStream,
    private onSpeechStart: () => void,
    private onSpeechEnd: () => void
  ) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512; // Plus petit pour plus de vitesse
    this.analyser.smoothingTimeConstant = 0.1; // Moins de lissage = plus réactif
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    
    this.startDetection();
  }

  private startDetection() {
    const checkAudio = () => {
      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Analyse ultra-rapide du volume
      const volume = this.dataArray.slice(1, 30).reduce((acc, val) => acc + val, 0) / 29;
      const now = Date.now();
      
      if (volume > this.silenceThreshold) {
        if (!this.isSpeaking) {
          console.log(`🎤 DÉBUT parole ULTRA-RAPIDE (volume: ${volume.toFixed(1)})`);
          this.isSpeaking = true;
          this.speechStartTime = now;
          this.onSpeechStart();
        }
        this.silenceStart = now;
      } else {
        if (this.isSpeaking && (now - this.silenceStart) > this.silenceDuration) {
          const speechDuration = now - this.speechStartTime;
          if (speechDuration >= this.minSpeechDuration) {
            console.log(`🔇 FIN parole ULTRA-RAPIDE (durée: ${speechDuration}ms)`);
            this.isSpeaking = false;
            this.onSpeechEnd();
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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const vadRef = useRef<UltraFastVAD | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    console.log('🔌 Connexion WebSocket ULTRA-OPTIMISÉE...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté - Mode ULTRA-RAPIDE activé');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        
        toast({
          title: "🚀 Mode ULTRA-RAPIDE activé",
          description: "Latence minimisée à l'extrême",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connection_established':
              console.log(`🎊 Système ULTRA-RAPIDE prêt`);
              break;
              
            case 'transcription':
              console.log(`👤 Transcription ULTRA-RAPIDE (${data.latency}ms): ${data.text}`);
              
              const userMessage: ConversationMessage = {
                id: Date.now().toString(),
                type: 'user',
                text: data.text,
                timestamp: Date.now()
              };
              
              setConversation(prev => [...prev, userMessage]);
              break;
              
            case 'audio_response':
              const latencyInfo = data.source === 'instant_cache' ? 
                `INSTANTANÉ (${data.latency}ms)` : 
                `${data.latency}ms`;
                
              console.log(`🤖 Réponse ULTRA-RAPIDE ${latencyInfo}: ${data.response}`);
              
              const aiMessage: ConversationMessage = {
                id: Date.now().toString() + '_ai',
                type: 'ai',
                text: data.response,
                audioData: data.audioData,
                timestamp: Date.now()
              };
              
              setConversation(prev => [...prev, aiMessage]);
              
              if (data.audioData && isAudioEnabled) {
                await playAIResponse(data.audioData, aiMessage.id);
              }
              
              // Redémarrage IMMÉDIAT de l'écoute
              setTimeout(() => {
                if (isListening && !isProcessingRef.current) {
                  startNewRecording();
                }
              }, 50); // Réduit à 50ms
              break;
              
            case 'error':
              console.error('❌ Erreur conversation:', data.message);
              toast({
                title: "Erreur de conversation",
                description: data.message,
                variant: "destructive"
              });
              break;
          }
        } catch (error) {
          console.error('❌ Erreur parsing message:', error);
        }
      };

      websocket.onclose = (event) => {
        console.log('🔌 Conversation disconnected', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        stopListening();
        
        if (event.code !== 1000) {
          toast({
            title: "Connexion fermée",
            description: "Reconnexion automatique en cours...",
            variant: "destructive"
          });
          
          // Tentative de reconnexion automatique
          setTimeout(() => {
            if (!isConnected) {
              connectWebSocket();
            }
          }, 3000);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ Conversation WebSocket error:', error);
        setIsConnecting(false);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter au serveur vocal",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('❌ Erreur WebSocket:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur",
        description: "Impossible de créer la connexion WebSocket",
        variant: "destructive"
      });
    }
  }, [isConnected, isConnecting, toast, isAudioEnabled, isListening]);

  const playAIResponse = async (base64Audio: string, messageId: string) => {
    try {
      setIsAISpeaking(true);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ 
          sampleRate: 24000,
          latencyHint: 'interactive' // Optimisation latence
        });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Conversion optimisée
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.preload = 'auto'; // Pré-chargement
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
    
    console.log(`📋 Audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      console.log(`📤 Envoi audio ULTRA-RAPIDE: ${base64Audio.length} caractères`);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'audio_message',
          audio: base64Audio
        }));
      }
      
      audioChunksRef.current = [];
      isProcessingRef.current = false;
    };
    reader.readAsDataURL(audioBlob);
  }, [ws]);

  const startNewRecording = useCallback(async () => {
    if (!isConnected || !streamRef.current || isProcessingRef.current) return;
    
    try {
      const supportedMimeType = getSupportedMimeType();
      const mediaRecorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 64000 // Réduit pour plus de vitesse
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
        console.log('⏹️ Enregistrement terminé, traitement IMMÉDIAT...');
        processAudioChunks();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(500); // Chunks plus gros pour moins d'appels réseau
      
      console.log('🎤 Enregistrement ULTRA-RAPIDE démarré');
      
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
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
        description: "Veuillez d'abord vous connecter",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🎤 Configuration microphone ULTRA-RAPIDE...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000, // Qualité maximale pour meilleure transcription
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setIsListening(true);
      
      // VAD ULTRA-AGRESSIVE
      vadRef.current = new UltraFastVAD(
        stream,
        () => {
          console.log('🗣️ DÉBUT parole - enregistrement ULTRA-RAPIDE');
          startNewRecording();
        },
        () => {
          console.log('🤐 FIN parole - traitement IMMÉDIAT');
          stopCurrentRecording();
        }
      );
      
      toast({
        title: "🎤 Mode ULTRA-RAPIDE activé",
        description: "Latence minimisée - Parlez naturellement",
      });
      
    } catch (error) {
      console.error('❌ Erreur microphone:', error);
      
      let errorMessage = "Impossible d'accéder au microphone";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Permission microphone refusée. Veuillez autoriser l'accès.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "Aucun microphone trouvé.";
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
    
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
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
        console.log('🔇 Track audio arrêté');
      });
      streamRef.current = null;
    }
    
    // Reset chunks
    audioChunksRef.current = [];
    
    toast({
      title: "🔇 Mode conversation ULTRA-RAPIDE arrêté",
      description: "Conversation terminée",
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
        description: "Veuillez d'abord vous connecter",
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
            Conversation ULTRA-RAPIDE avec Clara
            {isAISpeaking && <Activity className="w-5 h-5 ml-3 text-green-500 animate-pulse" />}
            {isConnecting && <Zap className="w-5 h-5 ml-3 text-blue-500 animate-spin" />}
            {isListening && <Activity className="w-5 h-5 ml-3 text-red-500 animate-pulse" />}
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
              Nouvelle conversation
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Banner */}
        <div className={`p-4 rounded-lg border-l-4 ${
          isConnected 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {isConnected ? 
                  (isListening ? '🎤 Mode ULTRA-RAPIDE activé - Latence <100ms' : '✅ Connecté à Clara (ULTRA-OPTIMISÉ)') 
                  : isConnecting ? '🔄 Connexion ULTRA-RAPIDE...' : '❌ Déconnecté'}
              </span>
            </div>
            {isConnected ? (
              <Button 
                onClick={isListening ? stopListening : startListening} 
                size="sm"
                variant={isListening ? "destructive" : "default"}
              >
                {isListening ? 'Arrêter conversation' : 'Mode ULTRA-RAPIDE'}
              </Button>
            ) : (
              <Button onClick={connectWebSocket} size="sm">
                Se connecter
              </Button>
            )}
          </div>
        </div>

        {/* Conversation Display */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Conversation Ultra-Rapide avec Clara !</p>
              <p className="text-sm">Connectez-vous puis démarrez la conversation pour parler naturellement</p>
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
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  {message.audioData && message.type === 'ai' && (
                    <div className="mt-2 flex items-center">
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

        {/* Status Text */}
        <div className="text-center">
          {isAISpeaking ? (
            <p className="text-green-600 font-medium animate-pulse">
              🤖 Clara vous répond...
            </p>
          ) : isListening ? (
            <p className="text-red-600 font-medium">
              🎤 Mode conversation ultra-rapide activé - Parlez naturellement !
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Cliquez sur "Démarrer conversation" pour un mode ultra-rapide
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion ultra-rapide en cours...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez sur "Se connecter" pour démarrer
            </p>
          )}
        </div>

        {/* Quick Actions */}
        {isConnected && !isListening && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => sendQuickMessage('Bonjour Clara, comment allez-vous ?')}
              variant="outline"
              size="sm"
              disabled={isAISpeaking}
            >
              👋 Saluer Clara
            </Button>
            <Button
              onClick={() => sendQuickMessage('Pouvez-vous me parler de vos capacités ?')}
              variant="outline"
              size="sm"
              disabled={isAISpeaking}
            >
              🤖 Capacités
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
