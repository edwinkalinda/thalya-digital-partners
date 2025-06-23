
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Mic, MicOff, Volume2, CheckCircle } from 'lucide-react';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { motion } from 'framer-motion';

const PublicDemo = () => {
  const [demoStep, setDemoStep] = useState<'welcome' | 'demo' | 'result'>('welcome');
  const [isRecording, setIsRecording] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const demoFlow = [
    {
      ai: "Bonjour ! Je suis Clara, votre future assistante IA. Dites-moi, quel type d'entreprise dirigez-vous ?",
      user: "Je dirige un restaurant italien",
      aiResponse: "Parfait ! Je vais configurer votre IA pour accueillir vos clients avec un ton chaleureux et professionnel."
    }
  ];

  const startDemo = () => {
    setDemoStep('demo');
    setCurrentMessage(demoFlow[0].ai);
    
    // Simuler la progression de la démo
    setTimeout(() => {
      setCurrentMessage(demoFlow[0].user);
      setTimeout(() => {
        setCurrentMessage(demoFlow[0].aiResponse);
        setTimeout(() => {
          setDemoStep('result');
        }, 3000);
      }, 2000);
    }, 3000);
  };

  const resetDemo = () => {
    setDemoStep('welcome');
    setCurrentMessage('');
    setIsRecording(false);
  };

  if (demoStep === 'welcome') {
    return (
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-electric-blue/5 via-pure-white to-emerald-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 mb-6 bg-electric-blue/10 border border-electric-blue/20 rounded-full text-electric-blue font-medium">
              <Play className="w-5 h-5 mr-2" />
              Démo publique
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-deep-black">
              Testez Clara sans inscription
            </h2>
            <p className="text-xl text-graphite-600 mb-8">
              Découvrez en 60 secondes comment Clara peut transformer l'accueil de votre entreprise
            </p>
          </div>

          <Card className="bg-pure-white shadow-2xl border-0 p-8 max-w-2xl mx-auto">
            <CardContent className="space-y-6">
              <VoiceOrb size="large" className="mx-auto" />
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-deep-black">
                  Expérience interactive
                </h3>
                <p className="text-graphite-600">
                  Clara va vous poser quelques questions pour comprendre votre activité et vous montrer comment elle peut vous aider.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Sans engagement</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>60 secondes</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Gratuit</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={startDemo}
                className="bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold w-full"
                size="lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Commencer la démo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (demoStep === 'demo') {
    return (
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-electric-blue/5 via-pure-white to-emerald-500/5">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-pure-white shadow-2xl border-0 p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-deep-black">
                Conversation avec Clara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VoiceOrb 
                size="large" 
                className="mx-auto" 
                isActive={true}
                isSpeaking={currentMessage === demoFlow[0].ai || currentMessage === demoFlow[0].aiResponse}
              />
              
              <div className="bg-graphite-50 p-6 rounded-xl border-l-4 border-electric-blue">
                <motion.p 
                  key={currentMessage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-deep-black"
                >
                  {currentMessage}
                </motion.p>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  className="text-graphite-600"
                >
                  Arrêter la démo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-electric-blue/5 via-pure-white to-emerald-500/5">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-pure-white shadow-2xl border-0 p-8">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-deep-black">
              Félicitations ! Votre IA est prête
            </h3>
            
            <p className="text-lg text-graphite-600">
              Clara a analysé votre activité et peut maintenant accueillir vos clients 24h/24
            </p>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Configuration automatique :</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Ton chaleureux et professionnel</li>
                <li>• Prise de réservations optimisée</li>
                <li>• Réponses personnalisées restaurant</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                className="bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3"
              >
                Créer mon IA maintenant
              </Button>
              <Button 
                onClick={resetDemo}
                variant="outline"
              >
                Refaire la démo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PublicDemo;
