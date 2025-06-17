
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, User, Building, ArrowRight } from 'lucide-react';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { useOpenAIRealtimeChat } from '@/hooks/useOpenAIRealtimeChat';
import { useNavigate } from 'react-router-dom';

interface ConfiguredAI {
  name: string;
  businessType: string;
  personality: string;
  voice: string;
}

export function VoiceOnboardingDemo() {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    if (messages.length >= 6) { // After sufficient conversation
      const lastMessages = messages.slice(-6);
      const hasName = lastMessages.some(m => m.text.toLowerCase().includes('nom') || m.text.toLowerCase().includes('appeler'));
      const hasBusiness = lastMessages.some(m => 
        m.text.toLowerCase().includes('restaurant') || 
        m.text.toLowerCase().includes('hôtel') || 
        m.text.toLowerCase().includes('clinique')
      );
      
      if (hasName && hasBusiness && !configuredAI) {
        // Extract configuration (simplified for demo)
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
          description: "Votre IA est maintenant configurée. Vous pouvez la tester.",
        });
      }
    }
  }, [messages, configuredAI, toast]);

  const startVoiceConfiguration = async () => {
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
  };

  const testConfiguredAI = () => {
    toast({
      title: `🎙️ Test de ${configuredAI?.name}`,
      description: "Votre IA configurée est maintenant en ligne pour un test",
    });
  };

  const proceedToSignup = () => {
    if (configuredAI) {
      // Store configuration in localStorage for signup process
      localStorage.setItem('thalya_configured_ai', JSON.stringify(configuredAI));
      navigate('/signup');
    }
  };

  if (currentStep === 'welcome') {
    return (
      <div className="text-center space-y-8">
        <div className="w-64 h-64 mx-auto">
          <VoiceOrb 
            hue={220} 
            hoverIntensity={0.3}
            forceHoverState={true}
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-deep-black">
            Rencontrez Thalya
          </h2>
          <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
            Configurez votre assistante IA personnalisée en conversant naturellement avec elle. 
            Donnez-lui un nom, définissez sa personnalité et testez-la immédiatement.
          </p>
          
          <Button 
            onClick={startVoiceConfiguration}
            className="bg-electric-blue hover:bg-blue-600 px-8 py-4 text-lg rounded-xl"
            size="lg"
          >
            <Mic className="w-5 h-5 mr-3" />
            Commencer la configuration vocale
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'configuring') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-6">
            <VoiceOrb 
              hue={220} 
              hoverIntensity={0.4}
              isListening={isRecording}
              isSpeaking={false}
              audioLevel={audioLevel}
            />
          </div>
          
          <h2 className="text-3xl font-bold text-deep-black mb-4">
            Configuration en cours...
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-graphite-600">
              {isConnecting ? 'Connexion...' : isConnected ? 'Connecté à Thalya' : 'En attente'}
            </span>
          </div>
        </div>

        <Card className="p-6 max-w-2xl mx-auto">
          <div className="h-64 overflow-y-auto space-y-4 mb-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-electric-blue text-white' 
                    : 'bg-graphite-100 text-deep-black'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-8 py-4 rounded-full text-lg ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-electric-blue hover:bg-blue-600'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5 mr-3" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-3" />
                  Parler
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'testing' && configuredAI) {
    return (
      <div className="text-center space-y-8">
        <div className="w-48 h-48 mx-auto">
          <VoiceOrb 
            hue={120} 
            hoverIntensity={0.3}
            forceHoverState={true}
          />
        </div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Configuration terminée
          </div>
          
          <h2 className="text-4xl font-bold text-deep-black">
            Voici {configuredAI.name} !
          </h2>
          
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto border border-graphite-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-electric-blue" />
                <div className="text-left">
                  <div className="font-semibold">Nom</div>
                  <div className="text-graphite-600">{configuredAI.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-electric-blue" />
                <div className="text-left">
                  <div className="font-semibold">Spécialisée pour</div>
                  <div className="text-graphite-600">{configuredAI.businessType}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-electric-blue" />
                <div className="text-left">
                  <div className="font-semibold">Personnalité</div>
                  <div className="text-graphite-600">{configuredAI.personality}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={testConfiguredAI}
              variant="outline"
              className="px-6 py-3 rounded-xl border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
            >
              <Mic className="w-5 h-5 mr-2" />
              Tester {configuredAI.name}
            </Button>
            
            <div className="text-graphite-500 text-sm">ou</div>
            
            <Button 
              onClick={proceedToSignup}
              className="bg-electric-blue hover:bg-blue-600 px-8 py-4 text-lg rounded-xl"
              size="lg"
            >
              Je veux utiliser {configuredAI.name} pour mon {configuredAI.businessType}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
