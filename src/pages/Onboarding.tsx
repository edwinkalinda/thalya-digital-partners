
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Orb from '../components/ui/Orb';
import ChatInterface from '../components/onboarding/ChatInterface';
import ProgressIndicator from '../components/onboarding/ProgressIndicator';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useAgents, useNotifications } from '../contexts/AppContext';
import { useOnboardingConversation } from '../hooks/useOnboardingConversation';

const Onboarding = () => {
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  const navigate = useNavigate();
  const { addAgent } = useAgents();
  const { addNotification } = useNotifications();
  
  const {
    conversation,
    currentStep,
    agentData,
    isProcessing,
    sendMessage,
    isComplete
  } = useOnboardingConversation();

  const onboardingSteps = [
    "Nom de l'IA",
    "Personnalité",
    "Mission",
    "Ton de voix",
    "Informations clés"
  ];

  // Handle completion
  useEffect(() => {
    if (isComplete && agentData.name) {
      setTimeout(() => {
        const newAgent = {
          name: agentData.name,
          type: 'Réceptionniste',
          status: 'active' as const,
          personality: agentData.personality || '',
          voice: agentData.voice || '',
          calls: 0,
          satisfaction: 0
        };
        
        addAgent(newAgent);
        addNotification('success', `L'IA ${agentData.name} a été créée avec succès !`);
        navigate('/onboarding-success');
      }, 2000);
    }
  }, [isComplete, agentData, addAgent, addNotification, navigate]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;
    
    await sendMessage(userInput);
    setUserInput('');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Future: Integrate with speech recognition when backend supports it
    // if (!isListening) {
    //   startSpeechRecognition();
    // } else {
    //   stopSpeechRecognition();
    // }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Header */}
      <div className="pt-16 p-3 sm:p-4 lg:p-6 border-b border-graphite-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-deep-black truncate">
                Configuration de votre IA
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-graphite-600 mt-1">
                Créons ensemble votre agent IA personnalisé
                {isProcessing && (
                  <span className="ml-2 inline-flex items-center text-electric-blue">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Thalya réfléchit...
                  </span>
                )}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ProgressIndicator 
                steps={onboardingSteps} 
                currentStep={currentStep} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Avatar Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-8 min-h-[280px] lg:min-h-0">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mx-auto">
              <Orb 
                hue={240}
                hoverIntensity={0.3}
                rotateOnHover={true}
                forceHoverState={isListening || isProcessing}
              />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-deep-black mb-1 sm:mb-2">
              Thalya
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-graphite-600">
              Je vous guide dans la création de votre IA
            </p>
            {isProcessing && (
              <p className="text-xs text-electric-blue mt-2 animate-pulse">
                En cours de traitement...
              </p>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-graphite-200 flex flex-col min-h-0 flex-1">
          <ChatInterface 
            conversation={conversation}
            className="flex-1 min-h-0"
          />
          
          {/* Input Section */}
          <div className="p-3 sm:p-4 lg:p-6 border-t border-graphite-200 bg-pure-white flex-shrink-0">
            <div className="flex gap-2 sm:gap-3 lg:gap-4 items-end">
              <div className="flex-1 min-w-0">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={isProcessing ? "Thalya traite votre réponse..." : "Tapez votre réponse..."}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                  className="resize-none text-xs sm:text-sm lg:text-base w-full"
                />
              </div>
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 flex-shrink-0"
                disabled={isProcessing}
                title="Reconnaissance vocale (à venir)"
              >
                {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isProcessing}
                className="h-8 sm:h-9 lg:h-10 flex-shrink-0 px-3 sm:px-4"
              >
                {isProcessing ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-graphite-500 mt-2 lg:mt-3">
              {isProcessing 
                ? "Conversation en temps réel avec Thalya..." 
                : "Cliquez sur le micro pour parler ou tapez votre réponse"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
