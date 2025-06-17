
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextRotate from "@/components/ui/TextRotate";
import TextCycler from "@/components/ui/TextCycler";
import { Phone, Package, TrendingUp, Mic, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIHub = () => {
  const navigate = useNavigate();
  
  const capabilities = [
    "la réception",
    "la gestion de stock", 
    "le marketing",
    "et bien plus encore"
  ];

  const handleConfigureReceptionist = () => {
    const element = document.getElementById('voice-onboarding');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiscoverRoadmap = () => {
    const element = document.getElementById('final-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ai-hub" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-graphite-50 to-pure-white">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-electric-blue/10 rounded-full mb-8">
            <span className="text-base font-semibold text-electric-blue tracking-wide uppercase">
              Écosystème IA
            </span>
          </div>
          
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            <span className="block text-graphite-900">
              <TextRotate text="Un agent pour " className="inline" />
            </span>
            <TextCycler
              texts={capabilities}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-gradient inline-block min-h-[1.2em]"
              interval={2500}
              splitBy="characters"
              staggerDuration={30}
            />
          </h2>
          
          <p className="text-2xl sm:text-3xl text-graphite-600 max-w-4xl mx-auto leading-relaxed font-light">
            Découvrez notre écosystème d'intelligences artificielles spécialisées, 
            chacune conçue pour exceller dans son domaine et transformer votre entreprise.
          </p>
        </div>

        {/* Enhanced Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          
          {/* IA Réceptionniste - Hero card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-pure-white rounded-[2rem] p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border border-graphite-100 animate-slide-up relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-electric-blue/5 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="p-5 bg-gradient-to-br from-electric-blue/10 to-electric-blue/5 rounded-2xl backdrop-blur-sm">
                  <Phone className="w-12 h-12 text-electric-blue" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-base font-semibold">
                  Disponible maintenant
                </Badge>
              </div>
              
              <h3 className="text-5xl lg:text-6xl font-black mb-6 text-graphite-900 leading-tight">
                <TextRotate text="IA Réceptionniste Vocale" />
              </h3>
              
              <p className="text-graphite-600 text-2xl leading-relaxed mb-8 font-light">
                Gère vos appels entrants 24/7 avec une voix naturelle et une personnalité 
                qui reflète parfaitement votre marque. Configuration vocale en temps réel.
              </p>

              {/* Features list */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Mic className="w-6 h-6 text-electric-blue" />
                  <span className="text-base text-graphite-600">Configuration vocale</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-electric-blue" />
                  <span className="text-base text-graphite-600">Personnalité adaptable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-electric-blue" />
                  <span className="text-base text-graphite-600">Appels 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-electric-blue" />
                  <span className="text-base text-graphite-600">IA en temps réel</span>
                </div>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-electric-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-pure-white w-full py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={handleConfigureReceptionist}
              >
                <Mic className="w-6 h-6 mr-3" />
                Essayer la démo vocale
                <div className="ml-2 w-2 h-2 bg-pure-white rounded-full animate-pulse"></div>
              </Button>
            </div>
          </div>

          {/* IA Gestion de Stock - Coming soon */}
          <div className="bg-pure-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-graphite-100 animate-slide-up relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-graphite-50/50 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-graphite-100 rounded-xl group-hover:bg-graphite-200 transition-colors duration-300">
                  <Package className="w-8 h-8 text-graphite-500" />
                </div>
                <Badge variant="secondary" className="bg-graphite-100 text-graphite-600 px-3 py-1 text-sm font-semibold">
                  Bientôt disponible
                </Badge>
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-graphite-700">
                <TextRotate text="IA Gestion de Stock" />
              </h3>
              <p className="text-graphite-500 text-lg leading-relaxed font-light">
                Optimise vos niveaux de stock en prédisant la demande et en automatisant 
                les commandes fournisseurs.
              </p>
            </div>
          </div>

          {/* IA Marketing - Coming soon */}
          <div className="bg-pure-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-graphite-100 animate-slide-up relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-graphite-50/50 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-graphite-100 rounded-xl group-hover:bg-graphite-200 transition-colors duration-300">
                  <TrendingUp className="w-8 h-8 text-graphite-500" />
                </div>
                <Badge variant="secondary" className="bg-graphite-100 text-graphite-600 px-3 py-1 text-sm font-semibold">
                  Bientôt disponible
                </Badge>
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-graphite-700">
                <TextRotate text="IA Marketing" />
              </h3>
              <p className="text-graphite-500 text-lg leading-relaxed font-light">
                Crée et lance des campagnes marketing ciblées en analysant le comportement 
                de vos clients en temps réel.
              </p>
            </div>
          </div>

          {/* Roadmap card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-electric-blue/8 via-blue-600/5 to-purple-600/8 rounded-[1.5rem] p-10 border border-electric-blue/20 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-electric-blue/10 to-transparent rounded-full blur-2xl"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-4xl lg:text-5xl font-black mb-6 text-gradient">
                <TextRotate text="Et bien plus encore..." />
              </h3>
              <p className="text-graphite-600 text-xl mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                Notre écosystème d'IA s'enrichit constamment de nouvelles spécialisations 
                pour répondre à tous vos besoins métier et rester à la pointe de l'innovation.
              </p>
              <Button 
                variant="outline" 
                className="border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-pure-white px-8 py-3 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleDiscoverRoadmap}
              >
                Découvrir la roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHub;
