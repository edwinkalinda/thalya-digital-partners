
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo abstrait inspiré de la nature */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              {/* Logo principal - formes organiques abstraites */}
              <div className="w-12 h-12 relative mr-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                {/* Forme principale - feuille stylisée */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-electric-blue to-teal-500 rounded-[60%_40%_40%_60%] transform rotate-45 transition-all duration-700 group-hover:rotate-[135deg] shadow-lg group-hover:shadow-xl"></div>
                
                {/* Forme secondaire - vague fluide */}
                <div className="absolute top-1 left-1 w-8 h-8 bg-gradient-to-tr from-sky-300 to-blue-500 rounded-[40%_60%_60%_40%] transform -rotate-12 transition-all duration-500 group-hover:rotate-45 opacity-80"></div>
                
                {/* Détail central - point d'énergie */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse"></div>
                
                {/* Effets de lueur */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-electric-blue to-teal-500 rounded-[60%_40%_40%_60%] transform rotate-45 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-700"></div>
              </div>
              
              {/* Particules flottantes inspirées des pollens */}
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300"></div>
              <div className="absolute top-8 -left-1 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse animation-delay-1000 transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-2000 transition-opacity duration-300"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-deep-black group-hover:text-emerald-600 transition-colors duration-300">
                Thalya
              </span>
              <span className="text-xs text-graphite-500 font-medium tracking-wider uppercase group-hover:text-emerald-500 transition-colors duration-300">
                IA Symbiotique
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#modules" className="text-graphite-600 hover:text-emerald-600 transition-colors relative group">
              Modules IA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#avantages" className="text-graphite-600 hover:text-emerald-600 transition-colors relative group">
              Avantages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#temoignages" className="text-graphite-600 hover:text-emerald-600 transition-colors relative group">
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#tarifs" className="text-graphite-600 hover:text-emerald-600 transition-colors relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-300">
              Connexion
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-pure-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
