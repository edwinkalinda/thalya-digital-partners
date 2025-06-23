
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicDemo = () => {
  const [demoStep, setDemoStep] = useState<'welcome' | 'demo' | 'result'>('welcome');
  const [currentMessage, setCurrentMessage] = useState('');
  const navigate = useNavigate();

  const demoFlow = [
    {
      ai: "Bonjour ! Je suis Clara. Quel type d'entreprise dirigez-vous ?",
      user: "Je dirige un restaurant italien",
      aiResponse: "Parfait ! Je vais configurer votre IA pour accueillir vos clients avec un ton chaleureux et professionnel."
    }
  ];

  const startDemo = () => {
    setDemoStep('demo');
    setCurrentMessage(demoFlow[0].ai);
    
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
  };

  const handleCreateAI = () => {
    navigate('/onboarding');
  };

  if (demoStep === 'welcome') {
    return (
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Testez Clara sans inscription
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Découvrez en 60 secondes comment Clara peut transformer l'accueil de votre entreprise
            </p>
          </div>

          <Card className="bg-white shadow-modern-lg border-0 max-w-lg mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
              </div>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Expérience interactive
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Clara va vous poser quelques questions pour comprendre votre activité et vous montrer comment elle peut vous aider.
                </p>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">Sans engagement</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">60 secondes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">Gratuit</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={startDemo}
                size="lg"
                className="w-full shadow-modern hover-lift"
              >
                <Play className="w-4 h-4 mr-2" />
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
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-modern-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Conversation avec Clara
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <p className="text-lg text-gray-900 text-center">
                  {currentMessage}
                </p>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  className="shadow-modern"
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
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-white shadow-modern-lg border-0">
          <CardContent className="p-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Félicitations ! Votre IA est prête
            </h3>
            
            <p className="text-lg text-gray-600 mb-8">
              Clara a analysé votre activité et peut maintenant accueillir vos clients 24h/24
            </p>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
              <h4 className="font-semibold text-green-800 mb-3">Configuration automatique :</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Ton chaleureux et professionnel</li>
                <li>• Prise de réservations optimisée</li>
                <li>• Réponses personnalisées restaurant</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleCreateAI}
                size="lg"
                className="shadow-modern hover-lift"
              >
                Créer mon IA maintenant
              </Button>
              <Button 
                onClick={resetDemo}
                variant="outline"
                size="lg"
                className="shadow-modern"
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
