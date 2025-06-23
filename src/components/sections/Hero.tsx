
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, CheckCircle, Bot, Zap, Users } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      {/* Background moderne et sobre */}
      <div className="absolute inset-0 bg-gradient-modern" />
      
      {/* Éléments décoratifs subtils */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Badge professionnel */}
        <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-modern">
          <Zap className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-800">IA Vocale Temps Réel</span>
          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full" />
        </div>

        {/* Titre principal optimisé */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
          Votre réceptionniste IA
          <br />
          <span className="text-gradient">disponible 24h/24</span>
        </h1>
        
        {/* Sous-titre professionnel */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Clara transforme chaque appel en opportunité. Elle accueille vos clients, 
          gère les rendez-vous et reflète parfaitement votre marque.
        </p>
        
        {/* CTA Buttons fonctionnels */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Button 
            onClick={handleStartDemo}
            size="xl"
            className="group shadow-modern hover-lift"
          >
            <Play className="w-5 h-5 mr-2" />
            Essai gratuit - 2 minutes
          </Button>
          
          <Button 
            onClick={handleStartOnboarding}
            variant="outline"
            size="xl"
            className="group shadow-modern hover-lift"
          >
            <Bot className="w-5 h-5 mr-2" />
            Créer mon IA
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* Métriques professionnelles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-modern hover-lift">
            <div className="text-2xl font-bold text-blue-600 mb-1">3 min</div>
            <div className="text-gray-600 text-sm font-medium">Configuration complète</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-modern hover-lift">
            <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
            <div className="text-gray-600 text-sm font-medium">Support automatisé</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-modern hover-lift">
            <div className="text-2xl font-bold text-emerald-600 mb-1">+40%</div>
            <div className="text-gray-600 text-sm font-medium">Conversion moyenne</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Sécurité bancaire</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">RGPD compliant</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Support premium</span>
          </div>
        </div>

        {/* Social proof subtil */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <p className="text-gray-500 text-sm font-medium">
              Plus de 500+ entreprises nous font confiance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
