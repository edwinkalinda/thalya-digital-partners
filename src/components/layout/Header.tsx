import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import StarBorder from "@/components/ui/StarBorder";

const Header = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Thalya ultra-simple */}
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('ai-hub')}
              className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
            >
              Modules IA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('thalya-difference')}
              className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
            >
              Avantages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('philosophy')}
              className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
            >
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('final-cta')}
              className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
            >
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="hidden md:inline-flex border-graphite-300 text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue hover:border-electric-blue/30 transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              Connexion
            </Button>
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
