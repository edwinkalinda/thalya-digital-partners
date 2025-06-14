
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Thalya moderne et épuré */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              {/* Conteneur principal du logo Thalya */}
              <div className="w-12 h-12 relative mr-4 transition-all duration-500 group-hover:scale-110">
                {/* Forme principale - Cercle avec pulse d'IA */}
                <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-electric-blue/20 via-emerald-500/30 to-teal-600/20 rounded-full transition-all duration-700 group-hover:scale-110"></div>
                
                {/* Centre neural - Point focal */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-electric-blue to-teal-600 rounded-full transition-all duration-300 group-hover:scale-125"></div>
                
                {/* Ondes de communication - 3 cercles concentriques */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border border-electric-blue/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 w-8 h-8 border border-emerald-500/30 rounded-full animate-pulse animation-delay-1000 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-1 -translate-y-1"></div>
                  <div className="absolute inset-0 w-10 h-10 border border-teal-600/20 rounded-full animate-pulse animation-delay-2000 opacity-0 group-hover:opacity-100 transition-opacity duration-900 transform -translate-x-2 -translate-y-2"></div>
                </div>

                {/* Particules d'intelligence - Points orbitaux */}
                <div className="absolute top-1 left-3 w-1 h-1 bg-electric-blue rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce"></div>
                <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-emerald-500 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                <div className="absolute bottom-2 left-1 w-1 h-1 bg-teal-600 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-400 group-hover:animate-ping"></div>
                <div className="absolute bottom-1 right-3 w-0.5 h-0.5 bg-electric-blue rounded-full opacity-60 group-hover:opacity-100 transition-all duration-600 group-hover:animate-bounce animation-delay-1000"></div>

                {/* Lignes de connexion subtiles */}
                <div className="absolute top-2 left-2 w-3 h-px bg-gradient-to-r from-electric-blue/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform rotate-45"></div>
                <div className="absolute bottom-2 right-2 w-3 h-px bg-gradient-to-l from-emerald-500/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform -rotate-45"></div>
                
                {/* Aura intelligente */}
                <div className="absolute inset-0 bg-gradient-radial from-electric-blue/5 via-emerald-500/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-1000 scale-150"></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-deep-black group-hover:text-electric-blue transition-colors duration-300 tracking-tight">
                Thalya
              </span>
              <span className="text-xs text-graphite-500 font-medium tracking-wider uppercase group-hover:text-emerald-600 transition-colors duration-300">
                IA Conversationnelle
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#modules" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Modules IA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#avantages" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Avantages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#temoignages" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#tarifs" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex hover:bg-electric-blue/5 hover:text-electric-blue hover:border-electric-blue/30 transition-all duration-300">
              Connexion
            </Button>
            <Button 
              className="bg-gradient-to-r from-electric-blue to-emerald-600 hover:from-electric-blue/90 hover:to-emerald-500 text-pure-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/onboarding')}
            >
              Demander une démo
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
