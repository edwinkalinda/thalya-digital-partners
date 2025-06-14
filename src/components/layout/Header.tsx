
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo amélioré */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              {/* Logo principal avec animation */}
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-blue-600 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                <span className="text-pure-white font-bold text-xl">T</span>
                {/* Effet de lueur animé */}
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              </div>
              {/* Particules animées autour du logo */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-blue rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse animation-delay-1000"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-deep-black group-hover:text-electric-blue transition-colors duration-300">
                Thalya
              </span>
              <span className="text-xs text-graphite-500 font-medium tracking-wider uppercase">
                IA Conversationnelle
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#modules" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Modules IA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#avantages" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Avantages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#temoignages" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#tarifs" className="text-graphite-600 hover:text-electric-blue transition-colors relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex hover:bg-electric-blue hover:text-pure-white hover:border-electric-blue transition-all duration-300">
              Connexion
            </Button>
            <Button 
              className="bg-gradient-to-r from-deep-black to-graphite-800 hover:from-electric-blue hover:to-blue-600 text-pure-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
