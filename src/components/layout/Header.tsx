
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo forestier abstrait */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              {/* Conteneur principal du logo forestier */}
              <div className="w-14 h-14 relative mr-3 transition-all duration-700 group-hover:scale-110">
                {/* Tronc principal - base de l'arbre */}
                <div className="absolute bottom-0 left-1/2 w-2 h-6 bg-gradient-to-t from-amber-800 to-amber-600 transform -translate-x-1/2 rounded-b-sm transition-all duration-500 group-hover:h-7"></div>
                
                {/* Feuillage principal - couronne de l'arbre */}
                <div className="absolute top-2 left-1/2 w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-400 to-teal-500 transform -translate-x-1/2 rounded-[70%_30%_60%_40%] transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-lg"></div>
                
                {/* Feuillage secondaire - branches latérales */}
                <div className="absolute top-3 left-2 w-5 h-5 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-[60%_40%_70%_30%] transform rotate-45 transition-all duration-500 group-hover:rotate-[60deg] opacity-80"></div>
                <div className="absolute top-4 right-2 w-4 h-4 bg-gradient-to-br from-green-400 to-forest-green rounded-[40%_60%_50%_50%] transform -rotate-30 transition-all duration-500 group-hover:rotate-0 opacity-70"></div>
                
                {/* Détails de feuilles volantes */}
                <div className="absolute top-1 left-4 w-2 h-2 bg-gradient-to-r from-lime-300 to-green-400 rounded-[50%_70%_30%_80%] transform rotate-12 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 opacity-60"></div>
                <div className="absolute top-6 right-1 w-1.5 h-1.5 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-[60%_40%_80%_20%] transform -rotate-45 transition-all duration-400 group-hover:translate-x-2 group-hover:translate-y-1 opacity-50"></div>
                
                {/* Racines stylisées */}
                <div className="absolute bottom-0 left-3 w-3 h-1.5 bg-gradient-to-r from-amber-700 to-amber-500 rounded-full transform rotate-12 opacity-40 transition-all duration-500 group-hover:scale-110"></div>
                <div className="absolute bottom-0 right-3 w-2.5 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transform -rotate-12 opacity-30 transition-all duration-500 group-hover:scale-110"></div>
                
                {/* Effet de lueur naturelle */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                
                {/* Particules magiques de la forêt */}
                <div className="absolute top-0 left-1 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300"></div>
                <div className="absolute top-2 right-0 w-0.5 h-0.5 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse animation-delay-1000 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-0 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-2000 transition-opacity duration-300"></div>
              </div>
              
              {/* Élément de sous-bois - mousse stylisée */}
              <div className="absolute -bottom-2 left-8 w-6 h-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
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
