
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StarBorder from "@/components/ui/StarBorder";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // Si on n'est pas sur la page d'accueil, naviguer d'abord vers l'accueil
    if (!isHomePage) {
      navigate('/');
      // Attendre que la navigation soit terminée avant de scroller
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setIsOpen(false);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    // Si on est déjà sur la page d'accueil, scroller vers le haut
    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const navigationItems = [
    { id: 'ai-hub', label: 'Modules IA' },
    { id: 'thalya-difference', label: 'Avantages' },
    { id: 'philosophy', label: 'Témoignages' },
    { id: 'final-cta', label: 'Tarifs' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et bouton retour */}
          <div className="flex items-center">
            {/* Bouton de retour - affiché seulement si on n'est pas sur la page d'accueil */}
            {!isHomePage && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack} 
                className="mr-2 sm:mr-4 hover:bg-electric-blue/10 hover:text-electric-blue transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            
            {/* Logo cliquable */}
            <div className="flex items-center group cursor-pointer" onClick={handleLogoClick}>
              <div className="relative">
                {/* Logo minimaliste */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3 transition-all duration-300 group-hover:scale-110">
                  {/* Cercle principal */}
                  <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-electric-blue/20"></div>
                  
                  {/* Point central */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pure-white rounded-full"></div>
                  
                  {/* Ondes simples au hover */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-electric-blue/30 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 border border-electric-blue/20 rounded-full animate-pulse animation-delay-1000 transform -translate-x-0.5 -translate-y-0.5 sm:-translate-x-1 sm:-translate-y-1"></div>
                  </div>
                </div>
              </div>
              
              <span className="text-xl sm:text-2xl font-bold text-deep-black group-hover:text-electric-blue transition-colors duration-300 tracking-tight">
                Thalya
              </span>
            </div>
          </div>

          {/* Navigation Desktop - toujours visible */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* CTA Buttons Desktop */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            {/* Bouton de connexion amélioré */}
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-2.5 text-sm font-medium text-graphite-700 bg-pure-white border border-graphite-300 rounded-lg hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue transition-all duration-300 hover:shadow-md hover:shadow-electric-blue/10"
            >
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Connexion</span>
              
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <div className="scale-90 lg:scale-100">
              <StarBorder color="#0066FF" speed="4s" className="transition-all duration-300 hover:scale-105" onClick={() => navigate('/onboarding')}>
                <span className="text-sm px-2 lg:px-0">Demander une démo</span>
              </StarBorder>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-electric-blue/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-pure-white">
                <SheetHeader className="text-left border-b border-graphite-200 pb-4 mb-6">
                  <SheetTitle className="text-xl font-bold text-deep-black flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-pure-white rounded-full"></div>
                    </div>
                    Thalya
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-6">
                  {/* Navigation Mobile - toujours visible */}
                  <nav className="flex flex-col space-y-4">
                    <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide">Navigation</h3>
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-left py-3 px-4 rounded-lg text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue transition-all duration-300 border border-transparent hover:border-electric-blue/20"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                  
                  {/* Actions Mobile */}
                  <div className="flex flex-col space-y-4 pt-4 border-t border-graphite-200">
                    <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide">Actions</h3>
                    
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 rounded-lg text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue transition-all duration-300 border border-graphite-300 hover:border-electric-blue/50"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Connexion</span>
                    </button>
                    
                    <div
                      onClick={() => {
                        navigate('/onboarding');
                        setIsOpen(false);
                      }}
                      className="cursor-pointer"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
