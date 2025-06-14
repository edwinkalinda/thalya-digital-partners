
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, MessageSquare, Play, Volume2, Loader2 } from "lucide-react";

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: number;
  hasAudio?: boolean;
}

// Classe pour gérer l'enregistrement audio optimisé
class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Fonction pour encoder l'audio au format requis par OpenAI
const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

// Classe pour gérer la lecture audio en continu
class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async addAudioChunk(base64Audio: string) {
    if (!this.audioContext) return;

    try {
      // Décoder l'audio base64
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Créer un buffer audio PCM
      const audioBuffer = await this.createPCMBuffer(bytes);
      this.audioQueue.push(audioBuffer);

      if (!this.isPlaying) {
        this.playNext();
      }
    } catch (error) {
      console.error('Erreur décodage audio:', error);
    }
  }

  private async createPCMBuffer(pcmData: Uint8Array): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const samples = pcmData.length / 2;
    const audioBuffer = this.audioContext.createBuffer(1, samples, 24000);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const sample = (pcmData[i * 2] | (pcmData[i * 2 + 1] << 8));
      channelData[i] = sample < 0x8000 ? sample / 0x8000 : (sample - 0x10000) / 0x8000;
    }

    return audioBuffer;
  }

  private playNext() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift()!;
    
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => {
      this.playNext();
    };
    
    source.start(0);
  }

  stop() {
    this.audioQueue = [];
    this.isPlaying = false;
  }
}

export const ConversationInterface = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [isAIResponsePlaying, setIsAIResponsePlaying] = useState(false);
  
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();
    return () => {
      audioPlayerRef.current?.stop();
    };
  }, []);

  const connectWebSocket = useCallback(() => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setConnectionStatus('Connexion au chat vocal temps réel...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté - Chat vocal temps réel');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        setConnectionStatus('Chat vocal temps réel prêt');
        
        toast({
          title: "🎙️ Chat vocal activé",
          description: "Vous pouvez maintenant parler avec Clara",
        });
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`📨 Event reçu: ${data.type}`);
          
          switch (data.type) {
            case 'connection_established':
              setConnectionStatus(data.message);
              break;
              
            case 'session.created':
              console.log('🎉 Session OpenAI créée');
              break;
              
            case 'session.updated':
              console.log('⚙️ Session OpenAI configurée');
              break;
              
            case 'input_audio_buffer.speech_started':
              console.log('🎤 Détection de parole');
              break;
              
            case 'input_audio_buffer.speech_stopped':
              console.log('🛑 Fin de parole détectée');
              break;
              
            case 'conversation.item.input_audio_transcription.completed':
              console.log(`📝 Transcription: ${data.transcript}`);
              
              const userMessage: ConversationMessage = {
                id: Date.now().toString(),
                type: 'user',
                text: data.transcript,
                timestamp: Date.now()
              };
              
              setConversation(prev => [...prev, userMessage]);
              break;
              
            case 'response.audio_transcript.delta':
              // Accumuler le texte de la réponse IA
              setConversation(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.type === 'ai' && lastMessage.id.endsWith('_current')) {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      text: lastMessage.text + data.delta
                    }
                  ];
                } else {
                  return [
                    ...prev,
                    {
                      id: Date.now().toString() + '_current',
                      type: 'ai' as const,
                      text: data.delta,
                      timestamp: Date.now(),
                      hasAudio: true
                    }
                  ];
                }
              });
              break;
              
            case 'response.audio_transcript.done':
              // Finaliser le message AI
              setConversation(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.id.endsWith('_current')) {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      id: Date.now().toString()
                    }
                  ];
                }
                return prev;
              });
              break;
              
            case 'response.audio.delta':
              // Jouer l'audio reçu
              if (data.delta && audioPlayerRef.current) {
                setIsAIResponsePlaying(true);
                await audioPlayerRef.current.addAudioChunk(data.delta);
              }
              break;
              
            case 'response.audio.done':
              setIsAIResponsePlaying(false);
              console.log('🔊 Audio de réponse terminé');
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
              console.log('🏓 Pong reçu');
              break;
          }
        } catch (error) {
          console.error('❌ Erreur parsing message:', error);
        }
      };

      websocket.onclose = (event) => {
        console.log(`🔌 WebSocket fermé:`, event.code);
        setIsConnected(false);
        setIsConnecting(false);
        setWs(null);
        setConnectionStatus('Déconnecté');
        
        if (audioRecorderRef.current) {
          audioRecorderRef.current.stop();
          audioRecorderRef.current = null;
          setIsRecording(false);
        }
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
  }, [isConnected, isConnecting, toast]);

  const startRecording = async () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast({
        title: "Erreur",
        description: "WebSocket non connecté",
        variant: "destructive"
      });
      return;
    }

    try {
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Enregistrement",
        description: "Parlez maintenant, l'IA vous écoute",
      });
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
      setIsRecording(false);
      
      toast({
        title: "⏹️ Arrêt",
        description: "Traitement de votre message...",
      });
    }
  };

  // Ping périodique
  useEffect(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [ws]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
    };
  }, [ws]);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-3xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-electric-blue" />
            Clara - IA Réceptionniste Vocale
          </div>
          <Button onClick={() => setConversation([])} size="sm" variant="ghost">
            Effacer
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status */}
        <div className={`p-4 rounded-lg border-l-4 ${
          isConnected 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              <div>
                <span className="font-semibold">
                  {connectionStatus}
                </span>
                {isAIResponsePlaying && (
                  <p className="text-xs text-blue-600 animate-pulse">
                    🔊 Clara répond...
                  </p>
                )}
              </div>
            </div>
            {!isConnected && (
              <Button onClick={connectWebSocket} size="sm" disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Conversation Vocale avec Clara</p>
              <p className="text-sm">Appuyez sur le microphone et parlez</p>
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
                    <div className="text-xs opacity-75 flex items-center">
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.hasAudio && (
                        <Play className="w-3 h-3 ml-1" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contrôles vocaux */}
        {isConnected && (
          <div className="flex justify-center">
            <Button 
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              className={`px-8 py-4 rounded-full ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-6 h-6 mr-2" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 mr-2" />
                  Parler avec Clara
                </>
              )}
            </Button>
          </div>
        )}

        {/* Status */}
        <div className="text-center">
          {isConnected ? (
            <p className="text-green-600 font-medium">
              🎙️ Conversation vocale temps réel active
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion au système vocal...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez pour activer la conversation vocale
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
