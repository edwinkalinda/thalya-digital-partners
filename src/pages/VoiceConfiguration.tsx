
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MessageSquare, ArrowLeft, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { VoiceOnboardingDemo } from '@/components/onboarding/VoiceOnboardingDemo';
import { OnboardingChat } from '@/components/onboarding/OnboardingChat';

const VoiceConfiguration = () => {
  const navigate = useNavigate();
  const [configMode, setConfigMode] = useState<'select' | 'voice' | 'text'>('select');

  const handleBack = () => {
    if (configMode === 'select') {
      navigate('/');
    } else {
      setConfigMode('select');
    }
  };

  if (configMode === 'voice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="mb-6 text-graphite-600 hover:text-electric-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux options
              </Button>
              
              <VoiceOnboardingDemo />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (configMode === 'text') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="mb-6 text-graphite-600 hover:text-electric-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux options
              </Button>
              
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-deep-black mb-4">
                  Configuration par texte
                </h1>
                <p className="text-xl text-graphite-600">
                  Configurez votre IA via une conversation écrite
                </p>
              </div>
              
              <div className="bg-pure-white rounded-2xl shadow-xl border border-graphite-200">
                <OnboardingChat />
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
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            <Button
              onClick={handleBack}
              variant="ghost"
              className="mb-8 text-graphite-600 hover:text-electric-blue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>

            {/* Header */}
            <div className="text-center mb-16">
              <div className="w-32 h-32 mx-auto mb-8">
                <VoiceOrb 
                  hue={220} 
                  hoverIntensity={0.3}
                  forceHoverState={true}
                />
              </div>
              
              <h1 className="text-5xl font-bold text-deep-black mb-6">
                Configurez votre IA
              </h1>
              
              <p className="text-xl text-graphite-600 max-w-2xl mx-auto leading-relaxed">
                Choisissez votre méthode de configuration préférée pour créer 
                votre assistante IA personnalisée.
              </p>
            </div>

            {/* Configuration Options */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Voice Configuration */}
              <Card 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-electric-blue/20 hover:border-electric-blue/50 cursor-pointer bg-gradient-to-br from-electric-blue/5 to-electric-blue/10"
                onClick={() => setConfigMode('voice')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-electric-blue/20 to-electric-blue/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mic className="w-10 h-10 text-electric-blue" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-deep-black mb-4">
                    Configuration vocale
                  </h3>
                  
                  <p className="text-graphite-600 mb-6 leading-relaxed">
                    Parlez naturellement à Thalya pour définir la personnalité, 
                    le nom et les spécificités de votre assistante IA.
                  </p>

                  <div className="space-y-2 text-sm text-electric-blue">
                    <div>✓ Configuration intuitive</div>
                    <div>✓ Dialogue naturel</div>
                    <div>✓ Test en temps réel</div>
                  </div>

                  <div className="mt-6 px-4 py-2 bg-electric-blue/10 rounded-full text-electric-blue font-semibold text-sm">
                    Recommandé
                  </div>
                </CardContent>
              </Card>

              {/* Text Configuration */}
              <Card 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-graphite-200 hover:border-graphite-400 cursor-pointer"
                onClick={() => setConfigMode('text')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-graphite-200 to-graphite-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-10 h-10 text-graphite-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-deep-black mb-4">
                    Configuration par texte
                  </h3>
                  
                  <p className="text-graphite-600 mb-6 leading-relaxed">
                    Utilisez une interface de chat textuelle pour configurer 
                    votre IA étape par étape.
                  </p>

                  <div className="space-y-2 text-sm text-graphite-600">
                    <div>✓ Interface familière</div>
                    <div>✓ Contrôle précis</div>
                    <div>✓ Configuration rapide</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="mt-16 p-8 bg-pure-white rounded-2xl border border-graphite-200 text-center">
              <Settings className="w-8 h-8 text-electric-blue mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-deep-black mb-2">
                Configuration avancée disponible
              </h4>
              <p className="text-graphite-600 text-sm">
                Après la configuration initiale, vous pourrez affiner les paramètres 
                de votre IA dans votre tableau de bord personnalisé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceConfiguration;
