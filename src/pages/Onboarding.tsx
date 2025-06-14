import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Orb from '../components/ui/Orb';
import ChatInterface from '../components/onboarding/ChatInterface';
import ProgressIndicator from '../components/onboarding/ProgressIndicator';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send } from 'lucide-react';
import { useAgents, useNotifications } from '../contexts/AppContext';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: number;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [agentData, setAgentData] = useState({
    name: '',
    personality: '',
    mission: '',
    voice: '',
    info: ''
  });
  
  const navigate = useNavigate();
  const { addAgent } = useAgents();
  const { addNotifications } = useNotifications();
  
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'ai' as const,
      message: "Bonjour ! Je suis Thalya. Je vais vous aider à créer votre agent IA personnalisé. Commençons par une question simple : quel nom souhaitez-vous donner à votre IA réceptionniste ?",
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

    // Store user data
    const stepKeys = ['name', 'personality', 'mission', 'voice', 'info'];
    if (currentStep < stepKeys.length) {
      setAgentData(prev => ({
        ...prev,
        [stepKeys[currentStep]]: userInput
      }));
    }

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
      } else {
        // Onboarding completed, create the agent and redirect
        setTimeout(() => {
          const newAgent = {
            name: agentData.name,
            type: 'Réceptionniste',
            status: 'active' as const,
            personality: agentData.personality,
            voice: agentData.voice,
            calls: 0,
            satisfaction: 0
          };
          
          addAgent(newAgent);
          addNotifications('success', `L'IA ${agentData.name} a été créée avec succès !`);
          navigate('/onboarding-success');
        }, 2000);
      }
    }, 1500);

    setUserInput('');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here we would integrate with speech recognition API
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      {/* Header */}
      <Header />
      
      {/* Main Header */}
      <div className="flex-shrink-0 pt-16 px-4 py-6 sm:px-6 border-b border-graphite-200 bg-pure-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-deep-black mb-2">
                Configuration de votre IA
              </h1>
              <p className="text-base sm:text-lg text-graphite-600 max-w-2xl mx-auto lg:mx-0">
                Créons ensemble votre agent IA personnalisé grâce à notre processus guidé
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="bg-pure-white rounded-xl p-4 shadow-lg border border-graphite-200">
                <ProgressIndicator 
                  steps={onboardingSteps} 
                  currentStep={currentStep} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Avatar Section */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-pure-white to-graphite-50">
          <div className="text-center max-w-md">
            <div className="mb-6 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto">
              <Orb 
                hue={240}
                hoverIntensity={0.3}
                rotateOnHover={true}
                forceHoverState={isListening}
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-deep-black">
                Thalya
              </h2>
              <p className="text-sm sm:text-base text-graphite-600 leading-relaxed">
                Je vous guide dans la création de votre IA personnalisée
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-electric-blue/10 text-electric-blue text-sm font-medium rounded-full">
                Étape {currentStep + 1} sur {onboardingSteps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-3/5 border-t lg:border-t-0 lg:border-l border-graphite-200 flex flex-col bg-pure-white">
          <ChatInterface 
            conversation={conversation}
            className="flex-1 min-h-0"
          />
          
          {/* Input Section - Fixed height to prevent cropping */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-graphite-200 bg-pure-white shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    onKeyDown={handleKeyPress}
                    className="h-12 text-base border-2 border-graphite-200 focus:border-electric-blue transition-colors resize-none rounded-xl"
                  />
                </div>
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-xl border-2 transition-all duration-300"
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="h-12 px-6 bg-electric-blue hover:bg-electric-blue/90 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer
                </Button>
              </div>
              <p className="text-xs text-graphite-500 mt-3 text-center">
                💡 Conseil : Cliquez sur le micro pour parler ou tapez votre réponse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
