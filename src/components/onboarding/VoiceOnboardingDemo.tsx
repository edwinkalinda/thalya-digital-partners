
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceOrb } from '@/components/ui/VoiceOrb';
import { useNavigate } from 'react-router-dom';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';

const VoiceOnboardingDemo = () => {
  const navigate = useNavigate();
  const { saveConfiguration } = useAIConfiguration();
  const [isDemo, setIsDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const demoSteps = [
    {
      question: "Bonjour ! Je suis Clara, votre assistante IA. Quel type d'entreprise dirigez-vous ?",
      userResponse: "Je dirige un restaurant français.",
      aiResponse: "Parfait ! Comment souhaitez-vous que je m'appelle dans votre restaurant ?"
    },
    {
      question: "Comment souhaitez-vous que je m'appelle dans votre restaurant ?",
      userResponse: "Appelez-vous Sophie.",
      aiResponse: "Enchanté ! Je m'appellerai Sophie. Maintenant, quel ton voulez-vous que j'adopte ? Plutôt chaleureux et convivial ?"
    },
    {
      question: "Quel ton voulez-vous que j'adopte ?",
      userResponse: "Oui, chaleureux et professionnel.",
      aiResponse: "Excellent ! Votre IA Sophie est maintenant configurée. Elle sera chaleureuse et professionnelle pour accueillir vos clients !"
    }
  ];

  const startDemo = () => {
    setIsDemo(true);
    setDemoStep(0);
  };

  const nextStep = () => {
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(demoStep + 1);
    } else {
      // Fin de la démo - rediriger vers onboarding
      navigate('/onboarding');
    }
  };

  const startOnboarding = async () => {
    if (!userEmail) {
      alert('Veuillez entrer votre email pour commencer');
      return;
    }

    // Sauvegarder les données initiales
    const initialConfig = {
      email: userEmail,
      business_name: 'Mon Entreprise',
      ai_name: 'Clara',
      business_type: 'Restaurant',
      status: 'trial'
    };

    const result = await saveConfiguration(initialConfig);
    if (result.success) {
      // Stocker temporairement l'email pour le dashboard
      localStorage.setItem('thalya_signup_data', JSON.stringify({ email: userEmail }));
      navigate('/client-dashboard');
    }
  };

  if (isDemo) {
    return (
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-deep-black via-graphite-900 to-deep-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-emerald-500/5" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pure-white mb-4">
              Démo interactive avec Clara
            </h2>
            <p className="text-xl text-graphite-300">
              Étape {demoStep + 1} sur {demoSteps.length}
            </p>
          </div>

          <Card className="bg-graphite-800/50 border-graphite-700 backdrop-blur-sm p-8">
            <div className="flex flex-col items-center space-y-6">
              <VoiceOrb 
                isActive={true}
                size="large"
                className="mb-4"
              />
              
              <div className="text-center space-y-4">
                <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/30">
                  <p className="text-electric-blue font-medium">Clara :</p>
                  <p className="text-pure-white text-lg mt-2">
                    {demoSteps[demoStep].question}
                  </p>
                </div>

                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30">
                  <p className="text-emerald-400 font-medium">Vous :</p>
                  <p className="text-pure-white text-lg mt-2">
                    {demoSteps[demoStep].userResponse}
                  </p>
                </div>

                {demoSteps[demoStep].aiResponse && (
                  <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/30">
                    <p className="text-electric-blue font-medium">Clara :</p>
                    <p className="text-pure-white text-lg mt-2">
                      {demoSteps[demoStep].aiResponse}
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={nextStep}
                className="bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
              >
                {demoStep < demoSteps.length - 1 ? 'Étape suivante' : 'Commencer mon onboarding'}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-deep-black via-graphite-900 to-deep-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-6 py-3 mb-6 bg-gradient-to-r from-electric-blue/20 to-emerald-500/20 border border-electric-blue/30 rounded-full">
            <Volume2 className="w-5 h-5 mr-2 text-electric-blue" />
            <span className="text-electric-blue font-medium">Onboarding Vocal IA</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-pure-white">Configurez votre IA en</span>
            <br />
            <span className="text-gradient bg-gradient-to-r from-electric-blue to-emerald-500 bg-clip-text text-transparent">
              parlant naturellement
            </span>
          </h2>
          
          <p className="text-xl text-graphite-300 max-w-3xl mx-auto leading-relaxed">
            Clara vous guide vocalement pour créer votre assistant IA personnalisé. 
            Une conversation de 3 minutes suffit pour configurer votre réceptionniste virtuelle.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-graphite-800/50 to-graphite-900/50 border-graphite-700 backdrop-blur-sm p-8">
              <div className="text-center space-y-6">
                <VoiceOrb 
                  isActive={isRecording}
                  size="large"
                  className="mx-auto"
                />
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-pure-white">
                    Essayez maintenant
                  </h3>
                  <p className="text-graphite-300">
                    Testez notre démo interactive ou commencez directement votre configuration
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={startDemo}
                    variant="outline"
                    className="w-full border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 py-3 text-lg"
                  >
                    🎬 Voir la démo interactive
                  </Button>

                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email professionnel"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-graphite-700/50 border border-graphite-600 rounded-lg text-pure-white placeholder-graphite-400 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                    />
                    
                    <Button 
                      onClick={startOnboarding}
                      className="w-full bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white py-3 text-lg font-semibold"
                    >
                      🚀 Configurer mon IA maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              {[
                { icon: "🎯", title: "Configuration intelligente", desc: "Clara comprend votre secteur et adapte ses réponses" },
                { icon: "⚡", title: "Déploiement instantané", desc: "Votre IA est opérationnelle en moins de 5 minutes" },
                { icon: "🔄", title: "Apprentissage continu", desc: "S'améliore avec chaque interaction client" },
                { icon: "📊", title: "Analytics en temps réel", desc: "Suivez les performances et optimisez" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-graphite-800/30 border border-graphite-700/50"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold text-pure-white mb-1">{feature.title}</h4>
                    <p className="text-graphite-300 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingDemo;
