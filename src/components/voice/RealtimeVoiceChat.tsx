
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Zap, Clock, Activity, Play, Pause, MessageCircle } from "lucide-react";

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
  const [textInput, setTextInput] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Détection automatique du format audio supporté
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg;codecs=opus'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`Using supported audio type: ${type}`);
        return type;
      }
    }
    
    console.warn('No preferred audio type supported, using default');
    return '';
  };

  // Connexion WebSocket optimisée
  const connectWebSocket = useCallback(() => {
    const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/functions/v1/realtime-voice-chat');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
      
      toast({
        title: "⚡ Connexion établie",
        description: "Chat vocal ultra-optimisé activé",
      });
    };

    websocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'connection_established':
          console.log('Optimizations activated:', data.optimizations);
          toast({
            title: "✅ Optimisations activées",
            description: "Cache intelligent, streaming TTS, traitement parallèle",
          });
          break;
          
        case 'transcription':
          console.log(`STT terminé en ${data.latency}ms: ${data.text}`);
          
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
          console.log(`Réponse générée en ${data.latency}ms (${data.source})`);
          
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
          
          // Lecture audio automatique
          if (data.audioData) {
            await playAudioStreaming(data.audioData, aiMessage.id);
          }
          break;
          
        case 'error':
          console.error('WebSocket error:', data.message);
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
      
      // Tentative de reconnexion automatique
      setTimeout(() => {
        if (!isConnected) {
          console.log('Tentative de reconnexion...');
          connectWebSocket();
        }
      }, 3000);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Reconnexion automatique en cours...",
        variant: "destructive"
      });
    };

  }, [toast, isConnected]);

  // Lecture audio streaming optimisée
  const playAudioStreaming = async (base64Audio: string, messageId: string) => {
    try {
      setCurrentlyPlaying(messageId);
      
      // Initialiser le contexte audio si nécessaire
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      
      // Si le contexte est suspendu, le reprendre
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Conversion base64 en blob optimisée
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.preload = 'metadata';
      
      audio.oncanplay = () => {
        console.log('Audio prêt à être lu');
      };
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('Erreur de lecture audio:', error);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Erreur dans playAudioStreaming:', error);
      setCurrentlyPlaying(null);
      
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire l'audio",
        variant: "destructive"
      });
    }
  };

  // Enregistrement audio avec détection automatique du format
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
      
      const supportedMimeType = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, supportedMimeType ? {
        mimeType: supportedMimeType
      } : undefined);
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { 
          type: supportedMimeType || 'audio/webm' 
        });
        
        console.log(`Audio enregistré: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
        
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('Envoi de l\'audio au serveur...');
            ws.send(JSON.stringify({
              type: 'audio_message',
              audio: base64Audio
            }));
          } else {
            console.error('WebSocket non connecté');
            toast({
              title: "Erreur de connexion",
              description: "WebSocket non connecté",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Enregistrer par chunks de 1 seconde
      setIsRecording(true);
      
      toast({
        title: "🎤 Enregistrement démarré",
        description: "Parlez maintenant...",
      });
      
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
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
        title: "⏹️ Enregistrement terminé",
        description: "Traitement en cours...",
      });
    }
  };

  // Envoi de message texte
  const sendTextMessage = () => {
    if (!textInput.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    
    console.log('Envoi du message texte:', textInput);
    
    ws.send(JSON.stringify({
      type: 'text_message',
      message: textInput.trim()
    }));
    
    // Ajouter le message de l'utilisateur immédiatement
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: textInput.trim(),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
  };

  // Test rapide avec phrases prédéfinies
  const sendQuickTest = (message: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({
      type: 'text_message',
      message: message
    }));
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: message,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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

        {/* Tests rapides */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Tests Rapides (Cache):</h4>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => sendQuickTest("Bonjour")}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Bonjour
            </Button>
            <Button 
              onClick={() => sendQuickTest("Comment allez-vous ?")}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Comment allez-vous ?
            </Button>
            <Button 
              onClick={() => sendQuickTest("Merci")}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Merci
            </Button>
          </div>
        </div>

        {/* Zone de saisie texte */}
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
            placeholder="Tapez votre message ici..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
            disabled={!isConnected}
          />
          <Button 
            onClick={sendTextMessage}
            disabled={!isConnected || !textInput.trim()}
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Contrôles vocaux */}
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
                    <span className="bg-green-100 text-green-800 px-1 rounded text-xs">Cache ⚡</span>
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
            <p className="text-red-600">❌ Connexion WebSocket non établie - Reconnexion automatique...</p>
          )}
          {isConnected && !isRecording && (
            <p className="text-green-600">✅ Prêt pour la conversation vocale ultra-rapide</p>
          )}
          {isRecording && (
            <p className="text-red-600 animate-pulse">🎤 Enregistrement en cours...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
