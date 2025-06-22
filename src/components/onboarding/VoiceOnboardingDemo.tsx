
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { useOpenAIRealtimeChat } from '@/hooks/useOpenAIRealtimeChat';

interface ConfiguredAI {
  name: string;
  businessType: string;
  personality: string;
  voice: string;
}

export function VoiceOnboardingDemo() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'configuring' | 'testing' | 'completed'>('welcome');
  const [configuredAI, setConfiguredAI] = useState<ConfiguredAI | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

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

  // Simulated audio level for demo
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isRecording]);

  // Extract AI configuration from conversation
  useEffect(() => {
    if (messages.length >= 6) {
      const lastMessages = messages.slice(-6);
      const hasName = lastMessages.some(m => m.text.toLowerCase().includes('nom') || m.text.toLowerCase().includes('appeler'));
      const hasBusiness = lastMessages.some(m => 
        m.text.toLowerCase().includes('restaurant') || 
        m.text.toLowerCase().includes('hôtel') || 
        m.text.toLowerCase().includes('clinique')
      );
      
      if (hasName && hasBusiness && !configuredAI) {
        const nameMatch = lastMessages.find(m => m.sender === 'user' && m.text.match(/\b[A-Z][a-z]+\b/));
        const businessMatch = lastMessages.find(m => m.sender === 'user' && 
          (m.text.includes('restaurant') || m.text.includes('hôtel') || m.text.includes('clinique'))
        );
        
        setConfiguredAI({
          name: nameMatch?.text.match(/\b[A-Z][a-z]+\b/)?.[0] || 'Clara',
          businessType: businessMatch?.text.includes('restaurant') ? 'restaurant' : 
                       businessMatch?.text.includes('hôtel') ? 'hôtel' : 'clinique',
          personality: 'Professionnelle et chaleureuse',
          voice: 'Voix féminine française'
        });
        
        setCurrentStep('testing');
        toast({
          title: "🎉 Configuration terminée !",
          description: "Votre IA est maintenant configurée.",
        });
      }
    }
  }, [messages, configuredAI, toast]);

  const handleOrbClick = async () => {
    if (currentStep === 'welcome') {
      setCurrentStep('configuring');
      try {
        await startConversation();
        setTimeout(() => {
          sendTextMessage(`Bonjour ! Je suis l'IA Chef d'Orchestre de Thalya. Je vais vous aider à configurer votre assistante IA personnalisée. 

Commençons par le nom : Quel prénom souhaitez-vous donner à votre assistante IA ?`);
        }, 2000);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la configuration vocale",
          variant: "destructive"
        });
        setCurrentStep('welcome');
      }
    } else if (currentStep === 'configuring') {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    } else if (currentStep === 'testing') {
      toast({
        title: `🎙️ Test de ${configuredAI?.name}`,
        description: "Votre IA configurée est maintenant en ligne pour un test",
      });
    }
  };

  // Determine orb properties based on current step
  const getOrbProps = () => {
    switch (currentStep) {
      case 'welcome':
        return {
          hue: 220,
          hoverIntensity: 0.3,
          forceHoverState: true,
          isListening: false,
          isSpeaking: false,
          audioLevel: 0
        };
      case 'configuring':
        return {
          hue: 220,
          hoverIntensity: 0.4,
          forceHoverState: false,
          isListening: isRecording,
          isSpeaking: false,
          audioLevel: audioLevel
        };
      case 'testing':
        return {
          hue: 120,
          hoverIntensity: 0.3,
          forceHoverState: true,
          isListening: false,
          isSpeaking: false,
          audioLevel: 0
        };
      default:
        return {
          hue: 220,
          hoverIntensity: 0.3,
          forceHoverState: true,
          isListening: false,
          isSpeaking: false,
          audioLevel: 0
        };
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div 
        className="w-64 h-64 cursor-pointer transition-transform hover:scale-105"
        onClick={handleOrbClick}
      >
        <VoiceOrb {...getOrbProps()} />
      </div>
    </div>
  );
}
