
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
      {/* Background avec dégradé moderne */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Badge de nouveau produit */}
        <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/70 backdrop-blur-sm rounded-full border border-blue-200 shadow-elegant">
          <Zap className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Nouveau : IA Vocale Temps Réel</span>
          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>

        {/* Titre principal avec animation */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.1] animate-fade-in-up">
          Votre réceptionniste IA
          <br />
          <span className="text-gradient">disponible 24h/24</span>
        </h1>
        
        {/* Sous-titre optimisé */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Clara transforme chaque appel en opportunité. Elle accueille vos clients, 
          gère les rendez-vous et reflète parfaitement votre marque.
        </p>
        
        {/* CTA Buttons modernisés */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleStartDemo}
            size="xl"
            className="group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Essai gratuit - 2 minutes
          </Button>
          
          <Button 
            onClick={handleStartOnboarding}
            variant="outline"
            size="xl"
            className="group"
          >
            <Bot className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Créer mon IA
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Stats ou métriques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 mb-2">3 min</div>
            <div className="text-gray-600 font-medium">Configuration complète</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Support automatisé</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-emerald-600 mb-2">+40%</div>
            <div className="text-gray-600 font-medium">Conversion moyenne</div>
          </div>
        </div>

        {/* Trust indicators avec icônes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Sécurité bancaire</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">RGPD compliant</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Support premium</span>
          </div>
        </div>

        {/* Social proof avec animation */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-gray-500" />
            <p className="text-gray-500 font-medium">
              Rejoignez plus de 500+ entreprises qui nous font confiance
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
