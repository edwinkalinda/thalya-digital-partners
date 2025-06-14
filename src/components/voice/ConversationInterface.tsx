
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, MessageSquare, Users, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: number;
  source?: string;
  latency?: number;
}

export const ConversationInterface = () => {
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [averageLatency, setAverageLatency] = useState<number>(0);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  
  const latencyHistoryRef = useRef<number[]>([]);

  // Calcul latence moyenne
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
    setConnectionStatus('Connexion ultra-simple...');
    
    try {
      const websocket = new WebSocket('wss://lrgvwkcdatfwxcjvbymt.functions.supabase.co/realtime-voice-chat');
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connecté - Mode ultra-simple');
        setIsConnected(true);
        setIsConnecting(false);
        setWs(websocket);
        setConnectionStatus('Système ultra-simple prêt');
        
        toast({
          title: "🚀 Mode ultra-simple activé",
          description: "Messages texte uniquement, latence minimale",
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
              
            case 'instant_response':
              console.log(`🤖 Réponse (${data.latency}ms): ${data.response}`);
              
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
              console.log('🏓 Pong reçu, connexion active');
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

  const sendMessage = useCallback((message: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !message.trim()) {
      return;
    }

    // Ajouter le message utilisateur
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: message.trim(),
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev, userMessage]);

    // Envoyer via WebSocket
    ws.send(JSON.stringify({
      type: 'text_message',
      message: message.trim()
    }));

    setCurrentMessage('');
  }, [ws]);

  const handleSendClick = () => {
    sendMessage(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  };

  // Ping périodique pour maintenir la connexion
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
    };
  }, [ws]);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-3xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-electric-blue" />
            Clara Ultra-Simple
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
            {!isConnected && (
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
              <p className="text-lg">Mode Chat Ultra-Simple</p>
              <p className="text-sm">Messages texte uniquement - Latence minimale</p>
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
                        <span className={`ml-1 text-xs ${message.latency < 100 ? 'text-green-600' : message.latency < 300 ? 'text-orange-600' : 'text-red-600'}`}>
                          ({message.latency}ms)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  {message.source && (
                    <p className="text-xs opacity-60 mt-1">
                      {message.source === 'instant' ? '⚡ Instantané' : 
                       message.source === 'default' ? '💬 Standard' : 
                       '🤖 IA'}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Zone de saisie */}
        {isConnected && (
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendClick}
              disabled={!currentMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Messages rapides */}
        {isConnected && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => sendMessage('Bonjour Clara')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              👋 Bonjour
            </Button>
            <Button
              onClick={() => sendMessage('Comment ça va ?')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              💬 Comment ça va ?
            </Button>
            <Button
              onClick={() => sendMessage('Test')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              🧪 Test
            </Button>
            <Button
              onClick={() => sendMessage('Merci')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
            >
              🙏 Merci
            </Button>
          </div>
        )}

        {/* Status */}
        <div className="text-center">
          {isConnected ? (
            <p className="text-green-600 font-medium">
              💬 Système ultra-simple actif - Messages texte uniquement
            </p>
          ) : isConnecting ? (
            <p className="text-blue-600 font-medium animate-pulse">
              🔄 Connexion...
            </p>
          ) : (
            <p className="text-gray-500">
              🔌 Cliquez pour activer le mode ultra-simple
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
