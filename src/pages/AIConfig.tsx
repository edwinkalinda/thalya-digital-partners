
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Mic, MicOff, MessageCircle, Sparkles, AudioWaveform, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOpenAIRealtimeChat } from '@/hooks/useOpenAIRealtimeChat';
import { MessageBubble } from '@/components/onboarding/MessageBubble';

const AIConfig = () => {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState('');
  const [configStep, setConfigStep] = useState<'initial' | 'configuring' | 'completed'>('initial');
  
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

  const startVocalConfig = async () => {
    setConfigStep('configuring');
    await startConversation();
    
    // Envoyer le message initial pour la configuration
    setTimeout(() => {
      sendTextMessage("Bonjour Clara ! Je souhaite configurer votre personnalité et vos paramètres. Pouvez-vous me guider dans cette configuration ?");
    }, 2000);
  };

  const saveAndComplete = () => {
    setConfigStep('completed');
    endConversation();
    
    toast({
      title: "✅ Configuration sauvegardée",
      description: "Clara a été configurée selon vos préférences vocales",
    });
  };

  if (configStep === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        
        <div className="pt-16 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl animate-pulse"></div>
                  <Brain className="relative w-24 h-24 text-electric-blue animate-glow" />
                  <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-8 h-8 text-purple-500 animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-7xl font-bold text-deep-black mb-6 bg-gradient-to-r from-electric-blue via-purple-600 to-electric-blue bg-clip-text text-transparent animate-pulse">
                Configuration Vocale de Clara
              </h1>
              
              <p className="text-2xl text-graphite-600 max-w-4xl mx-auto mb-16 leading-relaxed">
                Configurez votre assistante IA en conversant naturellement. Clara comprendra vos préférences et s'adaptera automatiquement.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up">
                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-300">
                  <MessageCircle className="w-16 h-16 mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">Configuration Naturelle</h3>
                  <p className="text-blue-700 leading-relaxed">
                    Exprimez vos besoins naturellement et Clara s'adaptera automatiquement
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-300">
                  <Settings className="w-16 h-16 mx-auto mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold text-purple-800 mb-4">Personnalisation Avancée</h3>
                  <p className="text-purple-700 leading-relaxed">
                    Paramètres fins de personnalité, ton et comportement via conversation
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-300">
                  <AudioWaveform className="w-16 h-16 mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Interaction Vocale</h3>
                  <p className="text-green-700 leading-relaxed">
                    Configuration entièrement vocale pour une expérience immersive
                  </p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="relative">
                <Button 
                  onClick={startVocalConfig}
                  disabled={isConnecting}
                  className="relative bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-700 hover:to-purple-700 px-20 py-8 text-2xl font-bold rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl disabled:opacity-50 disabled:scale-100"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <Mic className="relative w-10 h-10 mr-6" />
                  {isConnecting ? (
                    <>
                      <div className="relative w-8 h-8 mr-4 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connexion à Clara...
                    </>
                  ) : (
                    'Commencer la Configuration Vocale'
                  )}
                </Button>
                
                {isConnecting && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <p className="text-graphite-500 animate-pulse font-medium">
                      Initialisation de la configuration vocale...
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

  if (configStep === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        
        <div className="pt-16 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-6 -right-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-white text-2xl">✓</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-deep-black mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Configuration Terminée !
            </h1>
            
            <p className="text-2xl text-graphite-600 mb-12 leading-relaxed">
              Clara a été configurée selon vos préférences. Elle est maintenant prête à assister vos clients avec sa nouvelle personnalité.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-3xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                🎉 Félicitations !
              </h3>
              <p className="text-green-700 text-lg">
                Votre assistante IA a été personnalisée avec succès grâce à votre configuration vocale.
              </p>
            </div>
            
            <Button
              onClick={() => window.location.href = '/voice-management'}
              className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-6 text-xl font-bold rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-6 h-6 mr-4" />
              Tester Clara Maintenant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-lg animate-pulse"></div>
                <Settings className="relative w-16 h-16 mr-6 text-electric-blue" />
                {isRecording && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                )}
              </div>
              <h1 className="text-5xl font-bold text-deep-black bg-gradient-to-r from-electric-blue to-purple-600 bg-clip-text text-transparent">
                Configuration Vocale avec Clara
              </h1>
              {isRecording && (
                <div className="ml-6 flex items-center bg-red-50 px-4 py-2 rounded-full border border-red-200">
                  <Mic className="w-6 h-6 text-red-500 animate-pulse mr-3" />
                  <span className="text-red-600 font-semibold">En écoute</span>
                </div>
              )}
            </div>
            <p className="text-xl text-graphite-600 font-medium">
              Configurez Clara en conversant naturellement avec elle
            </p>
          </div>
          
          {/* Main Chat Interface */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl overflow-hidden backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-electric-blue/5 via-purple-600/5 to-electric-blue/5 border-b border-graphite-100">
              <CardTitle className="text-2xl text-deep-black flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-8 h-8 mr-4 text-electric-blue" />
                  <span className="font-bold">Configuration Conversationnelle</span>
                  <div className="ml-6 flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse shadow-lg`}></div>
                    <span className="text-sm text-graphite-600 font-medium">
                      {isConnected ? 'Connecté' : 'En cours...'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={saveAndComplete}
                    disabled={!isConnected}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 rounded-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button
                    onClick={endConversation}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-xl"
                  >
                    Terminer
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Chat Messages Area */}
              <div className="h-[500px] overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
                    <div className="relative mb-10">
                      <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl animate-pulse"></div>
                      <Settings className="relative w-20 h-20 text-electric-blue animate-avatar-pulse" />
                      <div className="absolute -top-3 -right-3">
                        <Sparkles className="w-8 h-8 text-purple-500 animate-bounce" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-deep-black mb-6">
                      Clara est prête pour la configuration !
                    </h3>
                    <p className="text-graphite-600 text-xl mb-3">
                      Parlez-lui de vos préférences et besoins
                    </p>
                    <p className="text-graphite-500">
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
              <div className="border-t border-graphite-100 bg-white/80 backdrop-blur-sm p-8">
                <div className="space-y-8">
                  {/* Text Input */}
                  <form onSubmit={handleSubmit} className="flex gap-6">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Dites à Clara comment vous souhaitez qu'elle se comporte..."
                      className="flex-1 h-16 px-8 text-lg border-2 border-graphite-200 rounded-2xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20 transition-all duration-200 bg-white/90"
                    />
                    <Button 
                      type="submit" 
                      disabled={!textInput.trim()}
                      className="h-16 px-10 bg-electric-blue hover:bg-blue-600 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                  </form>
                  
                  {/* Voice Controls */}
                  <div className="flex justify-center">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-16 py-8 text-xl font-bold rounded-3xl transition-all duration-300 shadow-2xl ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse scale-105' 
                          : 'bg-gradient-to-r from-purple-600 to-electric-blue hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-8 h-8 mr-4" />
                          Arrêter l'enregistrement
                        </>
                      ) : (
                        <>
                          <Mic className="w-8 h-8 mr-4" />
                          Configurer vocalement
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="mt-8 text-center">
                  <div className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-lg border border-red-200' 
                      : isConnected 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-lg border border-green-200' 
                      : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-lg border border-blue-200'
                  }`}>
                    {isRecording ? (
                      <>
                        <AudioWaveform className="w-5 h-5 mr-3 animate-bounce" />
                        Clara vous écoute pour la configuration...
                      </>
                    ) : isConnected ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Prêt à configurer Clara
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

export default AIConfig;
