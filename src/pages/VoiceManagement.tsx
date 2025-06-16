
import { useState } from "react";
import { Brain, Mic, MicOff, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboardingFlow } from "@/components/onboarding/useOnboardingFlow";
import { MessageBubble } from "@/components/onboarding/MessageBubble";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useToast } from "@/hooks/use-toast";

const VoiceManagement = () => {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState('');
  
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    startOnboarding,
    started,
    finished
  } = useOnboardingFlow();

  const { startRecording, stopRecording, recording } = useVoiceRecorder((text) => {
    setInput(text);
    // Auto-send après transcription
    setTimeout(() => handleSend(), 100);
  });

  const handleTextSend = () => {
    if (textInput.trim()) {
      setInput(textInput);
      setTextInput('');
      setTimeout(() => handleSend(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTextSend();
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <Brain className="w-16 h-16 text-electric-blue mr-4" />
                <h1 className="text-5xl font-bold text-deep-black">
                  Onboarding Clara
                </h1>
              </div>
              <p className="text-xl text-graphite-600 max-w-3xl mx-auto mb-8">
                Configurez votre assistante IA en temps réel avec une conversation naturelle
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-electric-blue/30 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-electric-blue mb-4">
                  🎙️ Conversation en Temps Réel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-blue-800">Chat Intelligent</p>
                    <p className="text-blue-600">Questions personnalisées</p>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <Mic className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-purple-800">Vocal & Texte</p>
                    <p className="text-purple-600">Interface multimodale</p>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-lg">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-green-800">Configuration IA</p>
                    <p className="text-green-600">Personnalisation complète</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={startOnboarding}
                className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-4 text-lg font-semibold"
                size="lg"
              >
                <Brain className="w-6 h-6 mr-3" />
                Commencer l'Onboarding
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">✅</span>
              </div>
              
              <h1 className="text-4xl font-bold text-deep-black">
                Configuration Terminée !
              </h1>
              
              <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
                Clara est maintenant configurée selon vos préférences et prête à servir vos clients.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  🎉 Félicitations !
                </h3>
                <p className="text-green-700">
                  Votre assistante IA personnalisée est opérationnelle. Vous pouvez maintenant tester ses capacités.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-electric-blue hover:bg-blue-600 px-8 py-3"
                >
                  Retour au Dashboard
                </Button>
                <Button 
                  onClick={startOnboarding}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Recommencer
                </Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-deep-black mb-2">
              Configuration Clara en Temps Réel
            </h1>
            <p className="text-graphite-600">
              Conversez naturellement pour personnaliser votre assistante IA
            </p>
          </div>
          
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Brain className="w-6 h-6 mr-2 text-electric-blue" />
                Conversation avec Clara
                {recording && <Mic className="w-4 h-4 ml-2 text-red-500 animate-pulse" />}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Zone de conversation */}
              <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-6 space-y-4">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} sender={msg.sender} text={msg.text} />
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-graphite-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Interface de saisie */}
              <div className="space-y-4">
                {/* Saisie texte */}
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Tapez votre réponse ou utilisez le micro..."
                    className="flex-1 px-4 py-3 border border-graphite-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !textInput.trim()}
                    className="bg-electric-blue hover:bg-blue-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </form>
                
                {/* Contrôle vocal */}
                <div className="flex justify-center">
                  <Button
                    onClick={recording ? stopRecording : startRecording}
                    className={`px-8 py-4 text-lg font-semibold ${
                      recording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-r from-purple-600 to-electric-blue hover:from-purple-700 hover:to-blue-700'
                    }`}
                  >
                    {recording ? (
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
                  recording 
                    ? 'bg-red-100 text-red-800' 
                    : isLoading 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {recording ? (
                    <>🎤 Écoute en cours...</>
                  ) : isLoading ? (
                    <>🤔 Clara réfléchit...</>
                  ) : (
                    <>💬 Prêt à converser</>
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
