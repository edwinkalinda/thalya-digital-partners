
import { useState } from "react";
import { Brain, Mic, MicOff, MessageCircle, Play, Square } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOpenAIRealtimeChat } from "@/hooks/useOpenAIRealtimeChat";
import { MessageBubble } from "@/components/onboarding/MessageBubble";

const VoiceManagement = () => {
  const [textInput, setTextInput] = useState('');
  
  const {
    isConnected,
    isConnecting,
    messages,
    isRecording,
    startConversation,
    endConversation,
    sendTextMessage,
    startRecording,
    stopRecording
  } = useOpenAIRealtimeChat();

  const handleTextSend = () => {
    if (textInput.trim()) {
      sendTextMessage(textInput);
      setTextInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTextSend();
  };

  if (!isConnected && !isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <Brain className="w-16 h-16 text-electric-blue mr-4" />
                <h1 className="text-5xl font-bold text-deep-black">
                  Clara - Onboarding IA
                </h1>
              </div>
              <p className="text-xl text-graphite-600 max-w-3xl mx-auto mb-8">
                Configurez votre assistante IA en temps réel avec une conversation naturelle
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-electric-blue/30 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-electric-blue mb-4">
                  🎙️ Conversation Temps Réel avec OpenAI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-blue-800">Chat Intelligent</p>
                    <p className="text-blue-600">Conversation naturelle</p>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <Mic className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-purple-800">Audio Temps Réel</p>
                    <p className="text-purple-600">Parlez directement à Clara</p>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-green-800">Configuration IA</p>
                    <p className="text-green-600">Personnalisation complète</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={startConversation}
                disabled={isConnecting}
                className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-4 text-lg font-semibold"
                size="lg"
              >
                <Brain className="w-6 h-6 mr-3" />
                {isConnecting ? 'Connexion...' : 'Commencer avec Clara'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-deep-black mb-2 flex items-center justify-center">
              <Brain className="w-8 h-8 mr-3 text-electric-blue" />
              Conversation avec Clara
              {isRecording && <Mic className="w-6 h-6 ml-3 text-red-500 animate-pulse" />}
            </h1>
            <p className="text-graphite-600">
              Configuration personnalisée de votre assistante IA
            </p>
          </div>
          
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-electric-blue" />
                  Onboarding en Temps Réel
                </div>
                <Button
                  onClick={endConversation}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Terminer
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Zone de conversation */}
              <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-graphite-500 py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-electric-blue" />
                    <p>Clara est prête à commencer l'onboarding...</p>
                    <p className="text-sm">Utilisez le micro ou tapez votre message</p>
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <MessageBubble key={i} sender={msg.sender} text={msg.text} />
                ))}
              </div>
              
              {/* Interface de saisie */}
              <div className="space-y-4">
                {/* Saisie texte */}
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Tapez votre réponse ou utilisez le micro..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!textInput.trim()}
                    className="bg-electric-blue hover:bg-blue-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </form>
                
                {/* Contrôle vocal */}
                <div className="flex justify-center">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 py-4 text-lg font-semibold ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-r from-purple-600 to-electric-blue hover:from-purple-700 hover:to-blue-700'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Arrêter l'enregistrement
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Parler à Clara
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Indicateur de statut */}
              <div className="mt-4 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isRecording 
                    ? 'bg-red-100 text-red-800' 
                    : isConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isRecording ? (
                    <>🎤 Clara vous écoute...</>
                  ) : isConnected ? (
                    <>💬 Prêt à converser avec Clara</>
                  ) : (
                    <>🔄 Connexion en cours...</>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
