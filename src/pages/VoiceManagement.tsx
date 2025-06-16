
import { useState } from "react";
import { Brain, Mic, MicOff, MessageCircle, Play, Square, Sparkles, Waveform } from "lucide-react";
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
        
        <div className="pt-16 container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <Brain className="w-20 h-20 text-electric-blue animate-glow" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-purple-500 animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl font-bold text-deep-black mb-6 bg-gradient-to-r from-electric-blue to-purple-600 bg-clip-text text-transparent">
                Clara
              </h1>
              
              <h2 className="text-3xl font-semibold text-deep-black mb-4">
                Onboarding IA Conversationnel
              </h2>
              
              <p className="text-xl text-graphite-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Configurez votre assistante IA en temps réel grâce à une conversation naturelle. 
                Clara s'adapte à votre entreprise et comprend vos besoins.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 hover-scale">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Conversation Intelligente</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Dialogue naturel avec reconnaissance vocale avancée et compréhension contextuelle
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 hover-scale">
                  <Waveform className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-800 mb-3">Audio Temps Réel</h3>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    Communication vocale instantanée avec synthèse vocale de haute qualité
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-8 hover-scale">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800 mb-3">Personnalisation IA</h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Configuration automatique selon votre secteur d'activité et vos préférences
                  </p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="relative">
                <Button 
                  onClick={startConversation}
                  disabled={isConnecting}
                  className="relative bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-700 hover:to-purple-700 px-16 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                  size="lg"
                >
                  <Brain className="w-8 h-8 mr-4" />
                  {isConnecting ? (
                    <>
                      <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connexion à Clara...
                    </>
                  ) : (
                    'Commencer avec Clara'
                  )}
                </Button>
                
                {isConnecting && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <p className="text-sm text-graphite-500 animate-pulse">
                      Initialisation de l'IA conversationnelle...
                    </p>
                  </div>
                )}
              </div>
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
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Brain className="w-10 h-10 mr-4 text-electric-blue" />
                {isRecording && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold text-deep-black">
                Conversation avec Clara
              </h1>
              {isRecording && (
                <div className="ml-4 flex items-center">
                  <Mic className="w-6 h-6 text-red-500 animate-pulse mr-2" />
                  <span className="text-red-600 font-semibold">En écoute</span>
                </div>
              )}
            </div>
            <p className="text-lg text-graphite-600">
              Configuration personnalisée de votre assistante IA en temps réel
            </p>
          </div>
          
          {/* Main Chat Interface */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-electric-blue/5 to-purple-600/5 border-b border-graphite-100">
              <CardTitle className="text-2xl text-deep-black flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-7 h-7 mr-3 text-electric-blue" />
                  <span>Onboarding Conversationnel</span>
                  <div className="ml-4 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                    <span className="text-sm text-graphite-600">
                      {isConnected ? 'Connecté' : 'En cours...'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={endConversation}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Terminer
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Chat Messages Area */}
              <div className="h-[500px] overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
                    <div className="relative mb-8">
                      <Brain className="w-16 h-16 text-electric-blue animate-avatar-pulse" />
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-purple-500 animate-bounce" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-deep-black mb-4">
                      Clara est prête !
                    </h3>
                    <p className="text-graphite-600 text-lg mb-2">
                      Commencez votre onboarding personnalisé
                    </p>
                    <p className="text-sm text-graphite-500">
                      Utilisez le microphone ou tapez votre message ci-dessous
                    </p>
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <div key={i} className="animate-slide-up">
                    <MessageBubble sender={msg.sender} text={msg.text} />
                  </div>
                ))}
              </div>
              
              {/* Input Interface */}
              <div className="border-t border-graphite-100 bg-white p-8">
                <div className="space-y-6">
                  {/* Text Input */}
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Tapez votre réponse ou utilisez le micro..."
                      className="flex-1 h-14 px-6 text-lg border-2 border-graphite-200 rounded-2xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20 transition-all duration-200"
                    />
                    <Button 
                      type="submit" 
                      disabled={!textInput.trim()}
                      className="h-14 px-8 bg-electric-blue hover:bg-blue-600 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </form>
                  
                  {/* Voice Controls */}
                  <div className="flex justify-center">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-12 py-6 text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse scale-105' 
                          : 'bg-gradient-to-r from-purple-600 to-electric-blue hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-6 h-6 mr-3" />
                          Arrêter l'enregistrement
                        </>
                      ) : (
                        <>
                          <Mic className="w-6 h-6 mr-3" />
                          Parler à Clara
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="mt-6 text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-lg' 
                      : isConnected 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-lg' 
                      : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-lg'
                  }`}>
                    {isRecording ? (
                      <>
                        <Waveform className="w-4 h-4 mr-2 animate-bounce" />
                        Clara vous écoute attentivement...
                      </>
                    ) : isConnected ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Prêt à converser avec Clara
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Connexion en cours...
                      </>
                    )}
                  </div>
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
