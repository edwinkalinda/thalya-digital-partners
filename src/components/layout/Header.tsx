
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Thalya abstrait naturel */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              {/* Conteneur principal du logo Thalya */}
              <div className="w-16 h-12 relative mr-4 transition-all duration-700 group-hover:scale-110">
                {/* T - Forme d'arbre stylisée */}
                <div className="absolute left-0 top-0">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-full transform transition-all duration-500 group-hover:scale-110"></div>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full transform transition-all duration-300 group-hover:rotate-12"></div>
                </div>

                {/* H - Double vague naturelle */}
                <div className="absolute left-3 top-1">
                  <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full"></div>
                  <div className="absolute top-3 left-0 w-2 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"></div>
                  <div className="absolute top-0 left-2 w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full"></div>
                </div>

                {/* A - Forme de feuille stylisée */}
                <div className="absolute left-6 top-0">
                  <div className="w-3 h-4 bg-gradient-to-br from-lime-400 via-emerald-500 to-green-600 rounded-[50%_70%_30%_80%] transform rotate-12 transition-all duration-400 group-hover:rotate-24"></div>
                  <div className="absolute top-2 left-0.5 w-1.5 h-0.5 bg-emerald-700 rounded-full"></div>
                </div>

                {/* L - Tige courbée */}
                <div className="absolute left-9 top-0">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-700 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full"></div>
                </div>

                {/* Y - Forme de branche qui se divise */}
                <div className="absolute left-11 top-0">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full transform rotate-12 origin-bottom"></div>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500 to-emerald-600 rounded-full transform -rotate-12 origin-bottom"></div>
                  <div className="absolute top-3 left-0 w-0.5 h-3 bg-gradient-to-b from-emerald-600 to-green-700 rounded-full"></div>
                </div>

                {/* A - Seconde feuille */}
                <div className="absolute right-0 top-1">
                  <div className="w-2.5 h-3 bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 rounded-[60%_40%_70%_30%] transform -rotate-12 transition-all duration-500 group-hover:-rotate-24"></div>
                  <div className="absolute top-1 left-0.5 w-1 h-0.5 bg-green-700 rounded-full"></div>
                </div>

                {/* Éléments organiques connecteurs */}
                <div className="absolute bottom-0 left-1 w-12 h-1 bg-gradient-to-r from-emerald-300/40 via-teal-300/60 to-green-300/40 rounded-full transition-all duration-700 group-hover:scale-110"></div>
                
                {/* Particules de vie */}
                <div className="absolute top-0 left-2 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce animation-delay-1000 transition-opacity duration-300"></div>
                <div className="absolute bottom-1 left-4 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-2000 transition-opacity duration-300"></div>
                
                {/* Aura naturelle */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-teal-400/15 to-green-400/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-700"></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-deep-black group-hover:text-emerald-700 transition-colors duration-300">
                Thalya
              </span>
              <span className="text-xs text-graphite-500 font-medium tracking-wider uppercase group-hover:text-emerald-600 transition-colors duration-300">
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
