
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import VoiceOnboardingDemo from '@/components/onboarding/VoiceOnboardingDemo';
import { Play, CheckCircle, Zap } from "lucide-react";

const VoiceOnboardingSection = () => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    "Configuration en moins de 2 minutes",
    "Conversation naturelle en temps réel", 
    "Personnalisation automatique selon votre secteur",
    "Aperçu vocal instantané de votre IA"
  ];

  if (showDemo) {
    return (
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-pure-white via-electric-blue/5 to-purple-100/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowDemo(false)}
              className="mb-6"
            >
              ← Retour à la présentation
            </Button>
            <h2 className="text-3xl font-bold text-deep-black mb-4">
              Configurez votre IA Clara maintenant
            </h2>
            <p className="text-graphite-600">
              Parlez naturellement pour configurer votre assistante IA
            </p>
          </div>
          
          <div className="bg-pure-white rounded-2xl shadow-2xl border border-graphite-200 p-8">
            <VoiceOnboardingDemo />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-pure-white via-electric-blue/5 to-purple-100/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-electric-blue/10 border border-electric-blue/20 rounded-full text-electric-blue font-medium text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Onboarding Révolutionnaire
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-deep-black">
            Configurez votre IA en
            <br />
            <span className="text-gradient">parlant naturellement</span>
          </h2>
          
          <p className="text-xl text-graphite-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Fini les formulaires complexes. Clara vous pose les bonnes questions et configure automatiquement votre IA selon vos réponses vocales.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Fonctionnalités */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-deep-black mb-8">
              Une expérience d'onboarding unique
            </h3>
            
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-pure-white/80 border border-graphite-200/60 hover:border-electric-blue/30 hover:shadow-lg transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-graphite-700 font-medium">{feature}</span>
              </div>
            ))}
            
            <div className="mt-8 p-6 bg-gradient-to-r from-electric-blue/10 to-purple-600/10 rounded-xl border border-electric-blue/20">
              <div className="flex items-center mb-3">
                <Play className="w-5 h-5 text-electric-blue mr-2" />
                <span className="font-semibold text-electric-blue">Technologie OpenAI Realtime</span>
              </div>
              <p className="text-sm text-graphite-600">
                Propulsé par l'API OpenAI Realtime pour une conversation ultra-fluide et naturelle, sans latence perceptible.
              </p>
            </div>
          </div>

          {/* Démo visuelle */}
          <div className="relative">
            <div className="bg-gradient-to-br from-pure-white to-graphite-50 p-8 rounded-2xl shadow-2xl border border-graphite-200">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-electric-blue to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <Play className="w-12 h-12 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-deep-black">
                    Démo Interactive
                  </h4>
                  <p className="text-graphite-600">
                    Testez l'onboarding vocal dès maintenant et découvrez la simplicité de Clara.
                  </p>
                  
                  <Button 
                    onClick={() => setShowDemo(true)}
                    className="bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Essayer maintenant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-graphite-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-electric-blue mb-2">2 min</div>
            <div className="text-graphite-600">Configuration complète</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500 mb-2">100%</div>
            <div className="text-graphite-600">Vocale et naturelle</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0ms</div>
            <div className="text-graphite-600">Latence perçue</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingSection;
