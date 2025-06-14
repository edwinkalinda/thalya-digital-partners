
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Zap, Clock, Activity, Play, Pause, MessageCircle, RefreshCw, Wifi, Brain } from "lucide-react";

interface VoiceMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioData?: string;
  latency?: number;
  timestamp: number;
}

interface LatencyStats {
  ai?: number;
  tts?: number;
  stt?: number;
  total: number;
}

export const RealtimeVoiceChat = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [aiEngine, setAiEngine] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Formats audio supportés avec détection automatique
  const getSupportedMimeType = useCallback(() => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`✅ Using supported audio type: ${type}`);
        return type;
      }
    }
    
    console.warn('⚠️ No preferred audio type supported, using default');
    return '';
  }, []);

  // Connexion WebSocket optimisée pour Gemini
  const connectWebSocket = useCallback(() => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    console.log('🔌 Connexion au chat vocal Gemini...');
    
    const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
    
    websocket.onopen = () => {
      console.log('✅ WebSocket connecté avec succès');
      setIsConnected(true);
      setIsConnecting(false);
      setWs(websocket);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      toast({
        title: "🧠 Chat Vocal Gemini Pro",
        description: "Connexion établie avec Google Gemini",
      });
    };

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'connection_status':
            console.log('🎉 Statut:', data.message);
            if (data.engine) {
              setAiEngine(data.engine);
            }
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
            console.log(`🤖 Réponse IA: ${data.response} (${data.latency}ms)`);
            
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
            console.error('❌ Erreur:', data.message);
            toast({
              title: "Erreur",
              description: data.message,
              variant: "destructive"
            });
            break;
            
          case 'pong':
            console.log('🏓 Pong reçu depuis', data.engine || 'serveur');
            break;
        }
      } catch (error) {
        console.error('❌ Erreur parsing message:', error);
      }
    };

    websocket.onclose = (event) => {
      console.log('🔌 WebSocket fermé:', event.code, event.reason);
      setIsConnected(false);
      setIsConnecting(false);
      setWs(null);
      
      if (event.code !== 1000) {
        toast({
          title: "Connexion fermée",
          description: "Reconnexion automatique...",
          variant: "destructive"
        });
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Tentative de reconnexion...');
          connectWebSocket();
        }, 3000);
      }
    };

    websocket.onerror = (error) => {
      console.error('❌ Erreur WebSocket:', error);
      setIsConnecting(false);
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez votre connexion internet",
        variant: "destructive"
      });
    };

  }, [isConnecting, isConnected, toast]);

  // Lecture audio optimisée
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
      
      audio.onerror = (error) => {
        console.error('❌ Erreur lecture audio:', error);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ Erreur playAudioStreaming:', error);
      setCurrentlyPlaying(null);
    }
  };

  // Enregistrement audio
  const startRecording = async () => {
    try {
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
      
      const supportedMimeType = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, supportedMimeType ? {
        mimeType: supportedMimeType,
        audioBitsPerSecond: 32000
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
        
        console.log(`🎤 Audio enregistré: ${audioBlob.size} bytes`);
        
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('📤 Envoi audio au serveur...');
            ws.send(JSON.stringify({
              type: 'audio_message',
              audio: base64Audio
            }));
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      toast({
        title: "🎤 Enregistrement",
        description: "Parlez maintenant...",
      });
      
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
      toast({
        title: "Erreur microphone",
        description: "Vérifiez les permissions",
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
    }
  };

  const sendTextMessage = () => {
    if (!textInput.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({
      type: 'text_message',
      message: textInput.trim()
    }));
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: textInput.trim(),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
  };

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

  const sendPing = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setLatencyStats(null);
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close(1000);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-electric-blue" />
            Chat Vocal Gemini Pro
            {isConnected && <Activity className="w-4 h-4 ml-2 text-green-500 animate-pulse" />}
            {isConnecting && <RefreshCw className="w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            {!isConnected && !isConnecting && <Wifi className="w-4 h-4 ml-2 text-red-500" />}
            {aiEngine && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {aiEngine}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={sendPing} disabled={!isConnected} size="sm" variant="ghost">
              Ping
            </Button>
            <Button onClick={clearMessages} size="sm" variant="ghost">
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques de latence */}
        {latencyStats && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              ⚡ Performances Google Gemini Pro
            </h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {latencyStats.stt && (
                <div className="text-center">
                  <div className="font-bold text-orange-600">{latencyStats.stt}ms</div>
                  <div className="text-gray-600">STT</div>
                </div>
              )}
              {latencyStats.ai && (
                <div className="text-center">
                  <div className="font-bold text-blue-600">{latencyStats.ai}ms</div>
                  <div className="text-gray-600">Gemini</div>
                </div>
              )}
              {latencyStats.tts && (
                <div className="text-center">
                  <div className="font-bold text-purple-600">{latencyStats.tts}ms</div>
                  <div className="text-gray-600">TTS</div>
                </div>
              )}
              <div className="text-center">
                <div className={`font-bold ${latencyStats.total < 200 ? 'text-green-600' : latencyStats.total < 500 ? 'text-orange-600' : 'text-red-600'}`}>
                  {latencyStats.total}ms
                </div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Tests rapides */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">🚀 Tests Rapides:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              onClick={() => sendQuickTest("Bonjour Clara")}
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
              Comment ça va ?
            </Button>
            <Button 
              onClick={() => sendQuickTest("Quelle heure est-il ?")}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Quelle heure ?
            </Button>
            <Button 
              onClick={() => sendQuickTest("Au revoir")}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Au revoir
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
            placeholder="Tapez votre message..."
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
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
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
            disabled={isConnected || isConnecting}
            variant="outline"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Connexion...
              </>
            ) : isConnected ? (
              <>
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                Connecté
              </>
            ) : (
              'Reconnecter'
            )}
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
                  {message.type === 'user' ? 'Vous' : 'Clara (Gemini)'}
                </span>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  {message.latency && (
                    <span className={`flex items-center px-2 py-1 rounded ${
                      message.latency < 200 ? 'bg-green-100 text-green-800' : 
                      message.latency < 500 ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {message.latency}ms
                    </span>
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
        <div className="text-center text-sm">
          {!isConnected && !isConnecting && (
            <p className="text-red-600 flex items-center justify-center">
              <Wifi className="w-4 h-4 mr-2" />
              ❌ Déconnecté - Cliquez "Reconnecter"
            </p>
          )}
          {isConnecting && (
            <p className="text-blue-600 flex items-center justify-center animate-pulse">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              🔌 Connexion en cours...
            </p>
          )}
          {isConnected && !isRecording && (
            <p className="text-green-600 flex items-center justify-center">
              <Brain className="w-4 h-4 mr-2" />
              ✅ Prêt avec Google Gemini Pro
            </p>
          )}
          {isRecording && (
            <p className="text-red-600 animate-pulse flex items-center justify-center">
              <Mic className="w-4 h-4 mr-2" />
              🎤 Enregistrement en cours...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
