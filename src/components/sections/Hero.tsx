
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Users, Mic, Sparkles, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Iridescence from '@/components/ui/Iridescence';
import DecryptedText from '@/components/ui/DecryptedText';
import TrueFocus from '@/components/ui/TrueFocus';

// Integration icons components
const IntegrationIcon = ({ name }: { name: string }) => {
  const getIcon = () => {
    switch (name) {
      case 'Calendly':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#006BFF"/>
            <path d="M7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" fill="white"/>
            <path d="M5 6h14v2H5V6z" fill="white"/>
          </svg>
        );
      case 'Google Calendar':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#4285F4"/>
            <path d="M7 9h10v2H7V9zm0 4h7v2H7v-2z" fill="white"/>
            <path d="M6 5h12v3H6V5z" fill="white"/>
          </svg>
        );
      case 'Stripe':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#635BFF"/>
            <path d="M8.5 10.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-3zm4 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-3z" fill="white"/>
          </svg>
        );
      case 'Notion':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#000000"/>
            <path d="M6 6h12v2H6V6zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" fill="white"/>
          </svg>
        );
      case 'HubSpot':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#FF7A59"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
            <path d="M12 6v3M12 15v3M6 12h3M15 12h3" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'Salesforce':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00A1E0"/>
            <path d="M8 8h8v2H8V8zm0 4h6v2H8v-2zm0 4h4v2H8v-2z" fill="white"/>
          </svg>
        );
      default:
        return <Zap className="w-5 h-5 text-electric-blue" />;
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm border border-graphite-200/50 rounded-xl hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {getIcon()}
      </div>
      <span className="text-sm font-semibold text-graphite-800">{name}</span>
    </motion.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  const integrations = [
    'Calendly', 'Google Calendar', 'Stripe', 'Notion', 'HubSpot', 'Salesforce'
  ];

  const stats = [
    { value: '< 200ms', label: 'Latence' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '12+', label: 'Secteurs' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Iridescence Effect */}
      <div className="absolute inset-0 opacity-30">
        <Iridescence
          color={[0.2, 0.4, 1]}
          speed={0.3}
          amplitude={0.05}
          mouseReact={true}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white/95 via-pure-white/90 to-electric-blue/5 backdrop-blur-sm" />

      <div className="relative z-10 container mx-auto px-4 py-24">
        
        {/* Hero Principal */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          
          {/* Badge animé */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/20 rounded-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-electric-blue animate-pulse" />
            <span className="text-sm font-semibold text-electric-blue">
              <DecryptedText 
                text="IA conversationnelle temps réel"
                animateOn="view"
                speed={30}
                className="text-electric-blue"
              />
            </span>
          </motion.div>
          
          {/* Titre principal avec TrueFocus */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
              <TrueFocus
                sentence="L'IA qui transforme vos interactions clients"
                manualMode={false}
                blurAmount={3}
                borderColor="#0066FF"
                glowColor="rgba(0, 102, 255, 0.4)"
                animationDuration={1.2}
                pauseBetweenAnimations={2}
              />
            </h1>
          </motion.div>
          
          {/* Sous-titre avec DecryptedText */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-xl md:text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed">
              <DecryptedText
                text="Automatisez réservations et rendez-vous avec une IA vocale ultra-réactive. Intégration native avec vos outils existants."
                animateOn="view"
                speed={20}
                sequential={true}
                revealDirection="start"
                className="text-graphite-600"
              />
            </p>
          </motion.div>

          {/* Boutons CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/voice-configuration')}
                className="bg-electric-blue hover:bg-blue-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Mic className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                Créer mon IA
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-2 border-electric-blue/30 text-electric-blue hover:border-electric-blue hover:bg-electric-blue/5 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm group"
              >
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Voir la démo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats avec animations */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-default"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-black text-electric-blue mb-2 group-hover:scale-110 transition-transform">
                  <DecryptedText 
                    text={stat.value}
                    animateOn="hover"
                    speed={30}
                    className="text-electric-blue"
                  />
                </div>
                <div className="text-sm font-medium text-graphite-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Intégrations avec animations avancées */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-black mb-4">
              <DecryptedText 
                text="Intégrations natives"
                animateOn="view"
                sequential={true}
                className="text-deep-black"
              />
            </h2>
            <p className="text-lg text-graphite-600">
              Connectez Thalya à vos outils existants en quelques clics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
              >
                <IntegrationIcon name={integration} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features avec effets avancés */}
        <motion.div 
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          {[
            {
              icon: Zap,
              title: "Ultra-réactif",
              description: "Latence inférieure à 200ms avec GPT-4o et synthèse vocale temps réel",
              color: "from-electric-blue/20 to-blue-500/10"
            },
            {
              icon: Shield,
              title: "Sécurisé",
              description: "Conformité RGPD et chiffrement bout en bout",
              color: "from-emerald-500/20 to-green-500/10"
            },
            {
              icon: Users,
              title: "Personnalisé",
              description: "IA adaptée à votre secteur et vos besoins spécifiques",
              color: "from-purple-500/20 to-pink-500/10"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`relative p-8 bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden group cursor-pointer`}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 + index * 0.2 }}
            >
              {/* Background effect */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <Iridescence
                  color={[0.5, 0.7, 1]}
                  speed={0.5}
                  amplitude={0.02}
                  mouseReact={false}
                />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-electric-blue" />
                </div>
                
                <h3 className="text-xl font-bold text-deep-black mb-4">
                  <DecryptedText 
                    text={feature.title}
                    animateOn="hover"
                    className="text-deep-black"
                  />
                </h3>
                
                <p className="text-graphite-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
