import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Thalya ultra-simple */}
          <div className="flex items-center">
            {/* Bouton de retour - affiché seulement si on n'est pas sur la page d'accueil */}
            {!isHomePage && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack} 
                className="mr-4 hover:bg-electric-blue/10 hover:text-electric-blue transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                {/* Logo minimaliste */}
                <div className="w-10 h-10 relative mr-3 transition-all duration-300 group-hover:scale-110">
                  {/* Cercle principal */}
                  <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-electric-blue/20"></div>
                  
                  {/* Point central */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pure-white rounded-full"></div>
                  
                  {/* Ondes simples au hover */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-6 h-6 border border-electric-blue/30 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-8 h-8 border border-electric-blue/20 rounded-full animate-pulse animation-delay-1000 transform -translate-x-1 -translate-y-1"></div>
                  </div>
                </div>
              </div>
              
              <span className="text-2xl font-bold text-deep-black group-hover:text-electric-blue transition-colors duration-300 tracking-tight">
                Thalya
              </span>
            </div>
          </div>

          {/* Navigation - affichée seulement sur la page d'accueil */}
          {isHomePage && (
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('ai-hub')} className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer">
                Modules IA
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('thalya-difference')} className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer">
                Avantages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('philosophy')} className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer">
                Témoignages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection('final-cta')} className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer">
                Tarifs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {/* Nouveau bouton de connexion avec design amélioré */}
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-graphite-700 bg-pure-white border border-graphite-300 rounded-lg hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue transition-all duration-300 hover:shadow-md hover:shadow-electric-blue/10"
            >
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Connexion</span>
              
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <StarBorder color="#0066FF" speed="4s" className="transition-all duration-300 hover:scale-105" onClick={() => navigate('/onboarding')}>
              Demander une démo
            </StarBorder>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
