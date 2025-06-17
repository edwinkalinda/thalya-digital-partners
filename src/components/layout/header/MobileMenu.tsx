
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, Menu } from "lucide-react";
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

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-graphite-100"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4 text-graphite-600" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-80 bg-white border-l border-graphite-200"
        >
          <SheetHeader className="text-left border-b border-graphite-200 pb-4 mb-6">
            <SheetTitle className="text-lg font-medium text-deep-black flex items-center gap-2">
              <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              Thalya
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col space-y-6">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  variant="ghost"
                  className="justify-start text-left py-2 px-3 text-sm text-graphite-600 hover:bg-graphite-50 hover:text-deep-black transition-all duration-200"
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-graphite-200">
              <Button
                onClick={handleLoginClick}
                variant="outline"
                size="sm"
                className="justify-start border-graphite-300 text-graphite-600 hover:border-electric-blue hover:text-electric-blue hover:bg-electric-blue/5"
              >
                <LogIn className="h-3 w-3 mr-2" />
                Connexion
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
