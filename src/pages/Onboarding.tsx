import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Orb from '../components/ui/Orb';
import ChatInterface from '../components/onboarding/ChatInterface';
import ProgressIndicator from '../components/onboarding/ProgressIndicator';
import Header from '../components/layout/Header';
import { Mic, MicOff, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: number;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'ai' as const,
      message: "Bonjour ! Je suis l'IA Chef d'Orchestre de Thalya. Je vais vous aider à créer votre agent IA personnalisé. Commençons par une question simple : quel nom souhaitez-vous donner à votre IA réceptionniste ?",
      timestamp: Date.now()
    }
  ]);

  const onboardingSteps = [
    "Nom de l'IA",
    "Personnalité",
    "Mission",
    "Ton de voix",
    "Informations clés"
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      role: 'user' as const,
      message: userInput,
      timestamp: Date.now()
    };

    setConversation(prev => [...prev, newUserMessage]);

    // Simulate AI response based on current step
    setTimeout(() => {
      let aiResponse = '';
      
      switch (currentStep) {
        case 0:
          aiResponse = `Parfait ! ${userInput} est un excellent nom. Maintenant, décrivez-moi la personnalité que vous souhaitez pour ${userInput}. Doit-elle être formelle, amicale, professionnelle, décontractée ?`;
          break;
        case 1:
          aiResponse = "Excellent choix ! Maintenant, quelle sera la mission principale de votre IA ? Par exemple : accueillir les clients, prendre des rendez-vous, fournir des informations sur vos services...";
          break;
        case 2:
          aiResponse = "Parfait ! Quel ton de voix préférez-vous ? Plutôt chaleureux et empathique, ou professionnel et efficace ?";
          break;
        case 3:
          aiResponse = "Merci ! Pour finir, quelles sont les informations clés que votre IA doit connaître sur votre entreprise ? (horaires, services, tarifs...)";
          break;
        case 4:
          aiResponse = "Fantastique ! Votre IA est maintenant configurée. Je vais générer sa personnalité et vous pourrez la tester dans quelques instants.";
          break;
        default:
          aiResponse = "Merci pour ces informations !";
      }

      const aiMessage: Message = {
        role: 'ai' as const,
        message: aiResponse,
        timestamp: Date.now()
      };

      setConversation(prev => [...prev, aiMessage]);
      
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 1500);

    setUserInput('');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here we would integrate with speech recognition API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Header - adjusted for fixed header */}
      <div className="pt-16 p-6 border-b border-graphite-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-deep-black">Configuration de votre IA</h1>
            <p className="text-graphite-600">Créons ensemble votre agent IA personnalisé</p>
          </div>
          <ProgressIndicator 
            steps={onboardingSteps} 
            currentStep={currentStep} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Avatar Section */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-6 w-64 h-64 mx-auto">
              <Orb 
                hue={240}
                hoverIntensity={0.3}
                rotateOnHover={true}
                forceHoverState={isListening}
              />
            </div>
            <h2 className="text-xl font-semibold text-deep-black mb-2">
              IA Chef d'Orchestre
            </h2>
            <p className="text-graphite-600">
              Je vous guide dans la création de votre IA
            </p>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-1/2 border-l border-graphite-200 flex flex-col">
          <ChatInterface 
            conversation={conversation}
            className="flex-1"
          />
          
          {/* Input Section */}
          <div className="p-6 border-t border-graphite-200 bg-pure-white">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Tapez votre réponse..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className="h-10 w-10"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="h-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-graphite-500 mt-2">
              Cliquez sur le micro pour parler ou tapez votre réponse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
