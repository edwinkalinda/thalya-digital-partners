
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Clock, Activity, Play, Pause, MessageCircle, RefreshCw, Wifi, Brain, TestTube, Zap } from "lucide-react";

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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttempts = useRef(0);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tests optimisés pour Google Gemini Pro
  const geminiApiTests = [
    { 
      name: "🤝 Connexion", 
      message: "Réponds juste 'Bonjour' pour tester la connexion Gemini.",
      description: "Test de base de connexion",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    { 
      name: "🧮 Calcul", 
      message: "Combien font 25 + 17 ? Réponds juste avec le nombre.",
      description: "Test de capacité de calcul",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    { 
      name: "🇫🇷 Français", 
      message: "Dis-moi bonjour en français de manière naturelle.",
      description: "Test de langue française",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    { 
      name: "🧠 Logique", 
      message: "Si tous les oiseaux volent et qu'un rouge-gorge est un oiseau, que peux-tu dire du rouge-gorge ?",
      description: "Test de raisonnement logique",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    { 
      name: "💡 Créativité", 
      message: "Invente une phrase poétique avec les mots : intelligence, avenir, technologie.",
      description: "Test de créativité",
      color: "bg-pink-50 border-pink-200 text-pink-800"
    },
    { 
      name: "📅 Contexte", 
      message: "Quelle est la date d'aujourd'hui et dans quel contexte es-tu utilisé ?",
      description: "Test de conscience contextuelle",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800"
    }
  ];

  // Fonction pour les tests rapides
  const runGeminiTest = useCallback((test: typeof geminiApiTests[0]) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast({
        title: "❌ Erreur",
        description: "Connexion fermée - connectez-vous d'abord",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`🧪 Test Gemini: ${test.name}`);
    
    ws.send(JSON.stringify({
      type: 'text_message',
      message: test.message,
      test_mode: true
    }));
    
    const testMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: `[TEST ${test.name}] ${test.message}`,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, testMessage]);
    
    toast({
      title: `🧪 ${test.name}`,
      description: test.description,
    });
  }, [ws, toast]);

  // Formats audio supportés
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
        console.log(`✅ Format audio supporté: ${type}`);
        return type;
      }
    }
    
    console.warn('⚠️ Aucun format préféré supporté, utilisation par défaut');
    return '';
  }, []);

  // Ping automatique
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

  // Connexion WebSocket optimisée
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

  // Lecture audio
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

  // Enregistrement vocal
  const startRecording = async () => {
    if (!isConnected) {
      toast({
        title: "Non connecté",
        description: "Connectez-vous d'abord à Gemini",
        variant: "destructive"
      });
      return;
    }

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
        
        console.log(`🎤 Audio: ${audioBlob.size} bytes`);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('📤 Envoi à Gemini...');
            ws.send(JSON.stringify({
              type: 'audio_message',
              audio: base64Audio
            }));
          } else {
            toast({
              title: "Connexion fermée",
              description: "Reconnexion nécessaire",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      toast({
        title: "🎤 Enregistrement",
        description: "Parlez à Clara...",
      });
      
    } catch (error) {
      console.error('❌ Erreur micro:', error);
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
    if (!textInput.trim()) return;
    
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

  const clearMessages = () => {
    setMessages([]);
    setLatencyStats(null);
  };

  const disconnect = () => {
    if (ws) ws.close(1000);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (ws) ws.close(1000);
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
            Chat Vocal Google Gemini Pro
            {isConnected && <Activity className="w-4 h-4 ml-2 text-green-500 animate-pulse" />}
            {isConnecting && <RefreshCw className="w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            {!isConnected && !isConnecting && <Wifi className="w-4 h-4 ml-2 text-red-500" />}
          </div>
          <div className="flex gap-2">
            <Button onClick={clearMessages} size="sm" variant="ghost">
              Clear
            </Button>
            {isConnected && (
              <Button onClick={disconnect} size="sm" variant="outline">
                Déconnecter
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Erreurs de connexion */}
        {connectionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Wifi className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-red-800 font-medium">Erreur:</span>
            </div>
            <p className="text-red-700 mt-1">{connectionError}</p>
            <Button 
              onClick={connectWebSocket}
              disabled={isConnecting}
              size="sm"
              className="mt-2"
              variant="outline"
            >
              {isConnecting ? 'Reconnexion...' : 'Réessayer'}
            </Button>
          </div>
        )}

        {/* TESTS GOOGLE GEMINI PRO - Section principale */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center mb-2">
              <TestTube className="w-5 h-5 mr-2" />
              🧪 Tests API Google Gemini Pro
            </h2>
            <p className="text-sm text-purple-600">
              Testez différents aspects de l'intelligence artificielle Clara
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {geminiApiTests.map((test, index) => (
              <Button
                key={index}
                onClick={() => runGeminiTest(test)}
                disabled={!isConnected}
                variant="outline"
                className={`h-auto p-4 text-left flex flex-col items-start space-y-2 ${test.color} hover:scale-105 transition-transform`}
              >
                <div className="font-semibold text-sm">{test.name}</div>
                <div className="text-xs opacity-80 line-clamp-2">{test.description}</div>
                <div className="text-xs opacity-60 truncate w-full">{test.message.substring(0, 40)}...</div>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full text-xs text-purple-700">
              <Zap className="w-3 h-3 mr-1" />
              Tests optimisés pour Google Gemini Pro
            </div>
          </div>
        </div>

        {/* Statistiques de performance */}
        {latencyStats && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              ⚡ Performances Gemini Pro
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

        {/* Zone de saisie texte */}
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
            placeholder="Écrivez votre message à Clara..."
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
                Parler à Clara
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

        {/* Messages de conversation */}
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
                  {message.type === 'user' ? 'Vous' : 'Clara (Gemini Pro)'}
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

        {/* Statut de connexion */}
        <div className="text-center text-sm">
          {!isConnected && !isConnecting && (
            <div className="space-y-2">
              <p className="text-red-600 flex items-center justify-center">
                <Wifi className="w-4 h-4 mr-2" />
                ❌ Déconnecté de Gemini Pro
              </p>
              <Button onClick={connectWebSocket} size="sm" variant="outline">
                Se connecter
              </Button>
            </div>
          )}
          {isConnecting && (
            <p className="text-blue-600 flex items-center justify-center animate-pulse">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              🔌 Connexion à Google Gemini Pro...
            </p>
          )}
          {isConnected && !isRecording && (
            <p className="text-green-600 flex items-center justify-center">
              <Brain className="w-4 h-4 mr-2" />
              ✅ Clara prête avec Google Gemini Pro
            </p>
          )}
          {isRecording && (
            <p className="text-red-600 animate-pulse flex items-center justify-center">
              <Mic className="w-4 h-4 mr-2" />
              🎤 Clara vous écoute...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
