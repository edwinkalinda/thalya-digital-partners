
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, CheckCircle, Bot, Zap, Users, Sparkles, MessageSquare, TrendingUp } from "lucide-react";

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

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      {/* Background premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" />
      
      {/* Éléments décoratifs IA */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-ai rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl opacity-25" />

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Badge premium IA */}
        <div className="inline-flex items-center px-6 py-3 mb-8 bg-white/90 backdrop-blur-xl rounded-full border-2 border-primary/20 shadow-ai-lg hover-lift">
          <Bot className="w-5 h-5 text-primary mr-3" />
          <span className="text-sm font-bold text-slate-800">Intelligence Artificielle Conversationnelle</span>
          <div className="ml-3 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>

        {/* Titre principal IA */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-tight">
          Votre IA d'entreprise
          <br />
          <span className="text-gradient">disponible 24h/24</span>
        </h1>
        
        {/* Sous-titre professionnel */}
        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
          Clara transforme vos interactions clients grâce à l'IA conversationnelle. 
          Réservations, rendez-vous, support client - tout automatisé avec l'intelligence de votre marque.
        </p>
        
        {/* CTA Buttons premium */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
          <Button 
            onClick={handleStartDemo}
            size="xl"
            variant="premium"
            className="group min-w-[280px]"
          >
            <Play className="w-6 h-6 mr-3" />
            Tester gratuitement - 2 minutes
            <Sparkles className="w-5 h-5 ml-2 opacity-75" />
          </Button>
          
          <Button 
            onClick={handleLogin}
            variant="outline"
            size="xl"
            className="group min-w-[240px] border-2 border-primary/30 hover:border-primary"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Accéder à votre IA
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {/* Métriques d'entreprise */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-ai-lg hover-lift gradient-border">
            <div className="text-4xl font-black text-primary mb-2">3 min</div>
            <div className="text-slate-600 text-base font-semibold">Déploiement complet</div>
            <Zap className="w-6 h-6 text-primary/60 mx-auto mt-3" />
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-ai-lg hover-lift gradient-border">
            <div className="text-4xl font-black text-indigo-600 mb-2">24/7</div>
            <div className="text-slate-600 text-base font-semibold">Disponibilité garantie</div>
            <Bot className="w-6 h-6 text-indigo-600/60 mx-auto mt-3" />
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-ai-lg hover-lift gradient-border">
            <div className="text-4xl font-black text-emerald-600 mb-2">+85%</div>
            <div className="text-slate-600 text-base font-semibold">Conversion clients</div>
            <TrendingUp className="w-6 h-6 text-emerald-600/60 mx-auto mt-3" />
          </div>
        </div>

        {/* Trust indicators premium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-3 text-slate-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">Sécurité entreprise</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-slate-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">RGPD & ISO 27001</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-slate-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">Support dédié</span>
          </div>
        </div>

        {/* Social proof entreprise */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-slate-500" />
            <p className="text-slate-600 text-base font-bold">
              Plus de 2000+ entreprises nous font confiance
            </p>
          </div>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-xs font-bold text-slate-500 px-4 py-2 bg-slate-100 rounded-lg">RESTAURANTS</div>
            <div className="text-xs font-bold text-slate-500 px-4 py-2 bg-slate-100 rounded-lg">CLINIQUES</div>
            <div className="text-xs font-bold text-slate-500 px-4 py-2 bg-slate-100 rounded-lg">HÔTELS</div>
            <div className="text-xs font-bold text-slate-500 px-4 py-2 bg-slate-100 rounded-lg">DENTISTES</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
