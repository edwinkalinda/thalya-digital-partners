
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
    
    if (maxAttempts > 0) {
      setTimeout(() => {
        scrollToElement(sectionId, maxAttempts - 1);
      }, 200);
    }
  };

  const handleNavigation = (sectionId: string) => {
    setIsOpen(false);
    
    if (!isHomePage) {
      navigate('/', { replace: false });
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 800);
    } else {
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

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-electric-blue/10"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-80 bg-white border-l border-graphite-200"
        >
          <SheetHeader className="text-left border-b border-graphite-200 pb-4 mb-6">
            <SheetTitle className="text-xl font-bold text-deep-black flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              Thalya
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col space-y-6">
            <nav className="flex flex-col space-y-2">
              <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide mb-2">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  variant="ghost"
                  className="justify-start text-left py-3 px-4 text-graphite-700 hover:bg-electric-blue/5 hover:text-electric-blue transition-all duration-200"
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-graphite-200">
              <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wide">
                Actions
              </h3>
              
              <Button
                onClick={handleLoginClick}
                variant="outline"
                className="justify-start border-graphite-300 text-graphite-700 hover:border-electric-blue hover:text-electric-blue hover:bg-electric-blue/5"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
              
              <Button
                onClick={handleDemoClick}
                className="justify-start bg-gradient-to-r from-electric-blue to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
              >
                Commencer
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
