
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, ArrowRight, Phone } from "lucide-react";
import Header from '../components/layout/Header';
import Orb from '../components/ui/Orb';

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step]);

  const steps = [
    "Configuration de la personnalité...",
    "Génération de la voix...",
    "Finalisation des paramètres...",
    "Votre IA est prête !"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Animation */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-6">
              <Orb 
                hue={120}
                hoverIntensity={0.4}
                rotateOnHover={false}
                forceHoverState={step === 3}
              />
            </div>
            
            {step === 3 && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 animate-scale-in" />
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-electric-blue mr-3" />
                <CardTitle className="text-3xl font-bold text-deep-black">
                  {step < 3 ? "Création en cours..." : "Félicitations !"}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {steps.map((stepText, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                      index <= step 
                        ? 'bg-electric-blue/10 text-electric-blue' 
                        : 'bg-graphite-100 text-graphite-500'
                    }`}
                  >
                    {index < step ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : index === step ? (
                      <div className="w-5 h-5 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-graphite-300 rounded-full" />
                    )}
                    <span className="font-medium">{stepText}</span>
                  </div>
                ))}
              </div>

              {step === 3 && (
                <div className="animate-fade-in space-y-6">
                  <div className="bg-gradient-to-r from-electric-blue/5 to-blue-600/5 rounded-lg p-6 border border-electric-blue/20">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-electric-blue/10 rounded-lg">
                        <Phone className="w-6 h-6 text-electric-blue" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-deep-black mb-2">
                      Votre IA "Clara" est opérationnelle
                    </h3>
                    <p className="text-graphite-600 mb-4">
                      Elle est maintenant prête à gérer vos appels avec la personnalité 
                      que vous avez définie. Vous pouvez la tester ou accéder à votre tableau de bord.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-pure-white p-3 rounded-lg">
                        <div className="font-medium text-deep-black">Personnalité</div>
                        <div className="text-graphite-600">Professionnelle et amicale</div>
                      </div>
                      <div className="bg-pure-white p-3 rounded-lg">
                        <div className="font-medium text-deep-black">Voix</div>
                        <div className="text-graphite-600">Française naturelle</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 bg-electric-blue hover:bg-blue-600 text-lg py-6"
                    >
                      Accéder au tableau de bord
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex-1 border-electric-blue text-electric-blue hover:bg-electric-blue/5 text-lg py-6"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Tester l'IA
                    </Button>
                  </div>

                  <p className="text-sm text-graphite-500">
                    Vous pouvez modifier la configuration de votre IA à tout moment 
                    depuis votre tableau de bord.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
