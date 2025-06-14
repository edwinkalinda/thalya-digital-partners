
import { useState, useCallback, useEffect } from 'react';
import { conversationService, ConversationMessage, OnboardingData } from '../services/conversationService';

interface UseOnboardingConversationReturn {
  conversation: ConversationMessage[];
  currentStep: number;
  agentData: Partial<OnboardingData>;
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  resetConversation: () => void;
  isComplete: boolean;
}

export const useOnboardingConversation = (): UseOnboardingConversationReturn => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      role: 'ai',
      message: "Bonjour ! Je suis Thalya. Je vais vous aider à créer votre agent IA personnalisé. Commençons par une question simple : quel nom souhaitez-vous donner à votre IA réceptionniste ?",
      timestamp: Date.now()
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [agentData, setAgentData] = useState<Partial<OnboardingData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const maxSteps = 5;

  // Future: Initialize real-time connection when backend is ready
  useEffect(() => {
    // Uncomment when backend WebSocket is available
    // const wsUrl = 'ws://your-backend-url/onboarding-chat';
    // conversationService.enableRealTime(wsUrl, handleRealTimeResponse);
    
    return () => {
      conversationService.disconnect();
    };
  }, []);

  // Future: Handle real-time responses from backend
  const handleRealTimeResponse = useCallback((response: any) => {
    const aiMessage: ConversationMessage = {
      role: 'ai',
      message: response.message,
      timestamp: Date.now()
    };

    setConversation(prev => [...prev, aiMessage]);
    
    if (response.extractedData) {
      setAgentData(prev => ({ ...prev, ...response.extractedData }));
    }
    
    if (response.shouldProceedToNext) {
      setCurrentStep(prev => prev + 1);
    }
    
    setIsProcessing(false);
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message to conversation
    const newUserMessage: ConversationMessage = {
      role: 'user',
      message: userMessage,
      timestamp: Date.now()
    };
    setConversation(prev => [...prev, newUserMessage]);

    try {
      // Process message through conversation service
      const response = await conversationService.processMessage(
        userMessage, 
        currentStep, 
        agentData
      );

      // For simulated responses (current implementation)
      if (response.message) {
        setTimeout(() => {
          const aiMessage: ConversationMessage = {
            role: 'ai',
            message: response.message,
            timestamp: Date.now()
          };

          setConversation(prev => [...prev, aiMessage]);
          
          if (response.extractedData) {
            setAgentData(prev => ({ ...prev, ...response.extractedData }));
          }
          
          if (response.shouldProceedToNext && currentStep < maxSteps - 1) {
            setCurrentStep(prev => prev + 1);
          }
          
          setIsProcessing(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setIsProcessing(false);
    }
  }, [currentStep, agentData, isProcessing]);

  const resetConversation = useCallback(() => {
    setConversation([
      {
        role: 'ai',
        message: "Bonjour ! Je suis Thalya. Je vais vous aider à créer votre agent IA personnalisé. Commençons par une question simple : quel nom souhaitez-vous donner à votre IA réceptionniste ?",
        timestamp: Date.now()
      }
    ]);
    setCurrentStep(0);
    setAgentData({});
    setIsProcessing(false);
  }, []);

  const isComplete = currentStep >= maxSteps - 1;

  return {
    conversation,
    currentStep,
    agentData,
    isProcessing,
    sendMessage,
    resetConversation,
    isComplete
  };
};
