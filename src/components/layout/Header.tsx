
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center mr-3">
              <span className="text-pure-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-deep-black">Thalya</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#modules" className="text-graphite-600 hover:text-electric-blue transition-colors">
              Modules IA
            </a>
            <a href="#avantages" className="text-graphite-600 hover:text-electric-blue transition-colors">
              Avantages
            </a>
            <a href="#temoignages" className="text-graphite-600 hover:text-electric-blue transition-colors">
              Témoignages
            </a>
            <a href="#tarifs" className="text-graphite-600 hover:text-electric-blue transition-colors">
              Tarifs
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex">
              Connexion
            </Button>
            <Button 
              className="bg-deep-black hover:bg-graphite-800 text-pure-white"
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
