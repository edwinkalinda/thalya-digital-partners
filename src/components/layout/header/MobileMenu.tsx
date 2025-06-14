
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
import StarBorder from "@/components/ui/StarBorder";
import { navigationItems } from "./navigationItems";

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      navigate('/');
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

  return (
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
  );
};

export default MobileMenu;
