
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

export const ConversationInterface = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [conversationMode, setConversationMode] = useState<'text' | 'voice'>('voice');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const connectWebSocket = useCallback(() => {
    if (isConnected) return;
    
    console.log('🔌 Connecting to conversation WebSocket...');
    
    const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
    
    websocket.onopen = () => {
      console.log('✅ Conversation WebSocket connected');
      setIsConnected(true);
      setWs(websocket);
      
      toast({
        title: "🎉 Conversation démarrée",
        description: "Vous pouvez maintenant parler avec Clara !",
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

    websocket.onclose = () => {
      console.log('🔌 Conversation disconnected');
      setIsConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('❌ Conversation WebSocket error:', error);
    };

  }, [isConnected, toast, isAudioEnabled]);

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

  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 22050 });
      }
      
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
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 32000
      });
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
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
      mediaRecorder.start(1000);
      setIsRecording(true);
      
    } catch (error) {
      console.error('❌ Microphone access error:', error);
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const clearConversation = () => {
    setConversation([]);
    toast({
      title: "Conversation effacée",
      description: "Nouvelle conversation démarrée",
    });
  };

  useEffect(() => {
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
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-3xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-electric-blue" />
            Conversation avec Clara
            {isAISpeaking && <Activity className="w-5 h-5 ml-3 text-green-500 animate-pulse" />}
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
                {isConnected ? '✅ Connecté à Clara' : '❌ Déconnecté'}
              </span>
            </div>
            {!isConnected && (
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
              <p className="text-lg">Démarrez une conversation avec Clara !</p>
              <p className="text-sm">Cliquez sur le microphone pour commencer à parler</p>
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

        {/* Voice Controls */}
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopListening : startListening}
            disabled={!isConnected || isAISpeaking}
            size="lg"
            className={`relative h-20 w-20 rounded-full text-white shadow-lg transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                : isAISpeaking
                ? 'bg-green-500 cursor-not-allowed opacity-75'
                : 'bg-electric-blue hover:bg-blue-600 hover:scale-105'
            }`}
          >
            {isAISpeaking ? (
              <Activity className="w-8 h-8 animate-pulse" />
            ) : isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          {isAISpeaking ? (
            <p className="text-green-600 font-medium animate-pulse">
              🤖 Clara vous répond...
            </p>
          ) : isRecording ? (
            <p className="text-red-600 font-medium animate-pulse">
              🎤 À l'écoute... Parlez maintenant
            </p>
          ) : isConnected ? (
            <p className="text-blue-600 font-medium">
              💬 Appuyez sur le microphone pour parler avec Clara
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Connectez-vous pour démarrer la conversation
            </p>
          )}
        </div>

        {/* Quick Actions */}
        {isConnected && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'text_message',
                    message: 'Bonjour Clara, comment allez-vous ?'
                  }));
                }
              }}
              variant="outline"
              size="sm"
              disabled={isRecording || isAISpeaking}
            >
              👋 Saluer Clara
            </Button>
            <Button
              onClick={() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'text_message',
                    message: 'Pouvez-vous me parler de vos capacités ?'
                  }));
                }
              }}
              variant="outline"
              size="sm"
              disabled={isRecording || isAISpeaking}
            >
              🤖 Capacités
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
