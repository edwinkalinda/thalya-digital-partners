
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { VoiceOnboardingDemo } from '@/components/onboarding/VoiceOnboardingDemo';
import { OnboardingChat } from '@/components/onboarding/OnboardingChat';

const VoiceConfiguration = () => {
  const navigate = useNavigate();
  const [configMode, setConfigMode] = useState<'voice' | 'text'>('voice');

  const handleBack = () => {
    navigate('/');
  };

  if (configMode === 'text') {
    return (
      <div className="min-h-screen bg-pure-white">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto">
              <Button
                onClick={() => setConfigMode('voice')}
                variant="ghost"
                size="sm"
                className="mb-4 text-graphite-500 hover:text-deep-black text-xs"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Retour
              </Button>
              
              <div className="bg-white rounded-xl border border-graphite-200">
                <OnboardingChat />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pure-white">
      <Header />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="mb-6 text-graphite-500 hover:text-deep-black text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Accueil
            </Button>

            <div className="mb-12">
              <VoiceOnboardingDemo />
            </div>

            {/* Option alternative discrète */}
            <div className="text-center">
              <button
                onClick={() => setConfigMode('text')}
                className="text-xs text-graphite-400 hover:text-graphite-600 transition-colors underline underline-offset-2"
              >
                Préférez-vous configurer par texte ?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConfiguration;
