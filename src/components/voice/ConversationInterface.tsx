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
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      console.log(`✅ Format supporté détecté: ${type}`);
      return type;
    }
  }
  
  console.log('⚠️ Aucun format audio préféré supporté, utilisation du format par défaut');
  return '';
};

// Détection d'activité vocale simple
class VoiceActivityDetector {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private silenceStart: number = 0;
  private isSpeaking: boolean = false;
  private silenceThreshold: number = 40; // Seuil de silence
  private silenceDuration: number = 1500; // 1.5 secondes de silence

  constructor(
    private stream: MediaStream,
    private onSpeechStart: () => void,
    private onSpeechEnd: () => void
  ) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    
    this.startDetection();
  }

  private startDetection() {
    const checkAudio = () => {
      this.analyser.getByteFrequencyData(this.dataArray);
      
      const volume = this.dataArray.reduce((acc, val) => acc + val, 0) / this.dataArray.length;
      const now = Date.now();
      
      if (volume > this.silenceThreshold) {
        if (!this.isSpeaking) {
          console.log('🎤 Début de parole détecté');
          this.isSpeaking = true;
          this.onSpeechStart();
        }
        this.silenceStart = now;
      } else {
        if (this.isSpeaking && (now - this.silenceStart) > this.silenceDuration) {
          console.log('🔇 Fin de parole détectée');
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
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const isProcessingRef = useRef<boolean>(false);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    console.log('🔌 Attempting to connect to conversation WebSocket...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ Conversation WebSocket connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        
        toast({
          title: "🎉 Connexion établie",
          description: "Mode conversation temps réel activé !",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connection_established':
              console.log('🎊 Conversation ready');
              break;
              
            case 'transcription':
              console.log(`👤 Vous: ${data.text}`);
              
              const userMessage: ConversationMessage = {
                id: Date.now().toString(),
                type: 'user',
                text: data.text,
                timestamp: Date.now()
              };
              
              setConversation(prev => [...prev, userMessage]);
              break;
              
            case 'audio_response':
              console.log(`🤖 Clara: ${data.response}`);
              
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
              
              // Redémarrer l'écoute après la réponse de l'IA
              setTimeout(() => {
                if (isListening && !isProcessingRef.current) {
                  startNewRecording();
                }
              }, 500);
              break;
              
            case 'error':
              console.error('❌ Conversation error:', data.message);
              toast({
                title: "Erreur de conversation",
                description: data.message,
                variant: "destructive"
              });
              break;
          }
        } catch (error) {
          console.error('❌ Error parsing conversation message:', error);
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
      console.error('❌ Failed to create WebSocket:', error);
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
        audioContextRef.current = new AudioContext({ sampleRate: 22050 });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Stop any currently playing audio
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
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsAISpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = (error) => {
        console.error('❌ Audio playback error:', error);
        setIsAISpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ Error playing AI response:', error);
      setIsAISpeaking(false);
    }
  };

  const processAudioChunks = useCallback(async () => {
    if (isProcessingRef.current || audioChunksRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    console.log('🎬 Traitement des chunks audio...');
    
    const supportedMimeType = getSupportedMimeType();
    const audioBlob = new Blob(audioChunksRef.current, { 
      type: supportedMimeType || 'audio/webm' 
    });
    
    console.log(`📋 Blob audio créé: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      console.log(`📤 Envoi audio base64: ${base64Audio.length} caractères`);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'audio_message',
          audio: base64Audio
        }));
      }
      
      // Reset chunks pour le prochain enregistrement
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
        audioBitsPerSecond: 32000
      };
      
      if (supportedMimeType) {
        mediaRecorderOptions.mimeType = supportedMimeType;
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, mediaRecorderOptions);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`📦 Chunk audio ajouté: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('⏹️ MediaRecorder arrêté, traitement...');
        processAudioChunks();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Chunks plus petits pour plus de réactivité
      
      console.log('🎤 Nouvel enregistrement démarré');
      
    } catch (error) {
      console.error('❌ Erreur démarrage enregistrement:', error);
    }
  }, [isConnected, processAudioChunks]);

  const stopCurrentRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🛑 Arrêt enregistrement en cours...');
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
      console.log('🎤 Demande d\'accès au microphone pour conversation temps réel...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 22050,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      setIsListening(true);
      
      // Initialiser la détection d'activité vocale
      vadRef.current = new VoiceActivityDetector(
        stream,
        () => {
          // Début de parole
          console.log('🗣️ Début de parole - démarrage enregistrement');
          startNewRecording();
        },
        () => {
          // Fin de parole
          console.log('🤐 Fin de parole - arrêt enregistrement');
          stopCurrentRecording();
        }
      );
      
      toast({
        title: "🎤 Mode conversation activé",
        description: "Parlez naturellement, l'IA vous répondra automatiquement",
      });
      
    } catch (error) {
      console.error('❌ Microphone access error:', error);
      
      let errorMessage = "Impossible d'accéder au microphone";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Permission microphone refusée. Veuillez autoriser l'accès au microphone.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "Aucun microphone trouvé sur cet appareil.";
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
        console.log('🔇 Track audio arrêté');
      });
      streamRef.current = null;
    }
    
    // Reset chunks
    audioChunksRef.current = [];
    
    toast({
      title: "🔇 Mode conversation arrêté",
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
            Conversation Temps Réel avec Clara
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
            <Button onClick={clearConversation} size="sm" variant="ghost">
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
                  (isListening ? '🎤 En écoute - Mode conversation temps réel' : '✅ Connecté à Clara') 
                  : isConnecting ? '🔄 Connexion en cours...' : '❌ Déconnecté'}
              </span>
            </div>
            {isConnected ? (
              <Button 
                onClick={isListening ? stopListening : startListening} 
                size="sm"
                variant={isListening ? "destructive" : "default"}
              >
                {isListening ? 'Arrêter conversation' : 'Démarrer conversation'}
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
              <p className="text-lg">Conversation temps réel avec Clara !</p>
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
              🎤 Mode conversation temps réel activé - Parlez naturellement !
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Cliquez sur "Démarrer conversation" pour un mode temps réel
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion en cours...
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
