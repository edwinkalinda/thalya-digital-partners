
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StarBorder from "@/components/ui/StarBorder";
import { navigationItems } from "./navigationItems";

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  const scrollToElement = (sectionId: string, maxAttempts = 20) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }
    
    // Si l'élément n'existe pas encore, réessayer jusqu'à maxAttempts
    if (maxAttempts > 0) {
      setTimeout(() => {
        scrollToElement(sectionId, maxAttempts - 1);
      }, 200);
    }
  };

  const handleNavigation = (sectionId: string) => {
    setIsOpen(false);
    
    if (!isHomePage) {
      // Si on n'est pas sur la page d'accueil, naviguer d'abord vers la page d'accueil
      navigate('/', { replace: false });
      // Attendre que la navigation soit terminée et que la page soit complètement chargée
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 800);
    } else {
      // Si on est déjà sur la page d'accueil, défiler directement
      scrollToElement(sectionId);
    }
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleDemoClick = () => {
    setIsOpen(false);
    navigate('/onboarding');
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="sm:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-electric-blue/10 focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-80 bg-pure-white"
          id="mobile-menu"
          aria-label="Menu de navigation mobile"
        >
          <SheetHeader className="text-left border-b border-graphite-200 pb-4 mb-6">
            <SheetTitle className="text-xl font-bold text-deep-black flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-pure-white rounded-full"></div>
              </div>
              Thalya
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col space-y-6">
            <nav 
              className="flex flex-col space-y-4"
              role="navigation"
              aria-label="Navigation mobile"
            >
              <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleNavigation(item.id))}
                  className="text-left py-3 px-4 rounded-lg text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue transition-all duration-300 border border-transparent hover:border-electric-blue/20 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                  aria-label={`Naviguer vers la section ${item.label}`}
                  tabIndex={0}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="flex flex-col space-y-4 pt-4 border-t border-graphite-200">
              <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide">
                Actions
              </h3>
              
              <Button
                onClick={handleLoginClick}
                onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
                variant="outline"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue transition-all duration-300 border border-graphite-300 hover:border-electric-blue/50 justify-start focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                aria-label="Se connecter à votre compte"
              >
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Button>
              
              <div
                onClick={handleDemoClick}
                onKeyDown={(e) => handleKeyDown(e, handleDemoClick)}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 rounded-lg"
                role="button"
                tabIndex={0}
                aria-label="Demander une démonstration"
              >
                <StarBorder color="#0066FF" speed="4s" className="w-full">
                  <span className="text-sm">Demander une démo</span>
                </StarBorder>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
