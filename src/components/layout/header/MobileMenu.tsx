
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems, adminNavigationItems } from "./navigationItems";
import IridescenceLogo from "@/components/ui/IridescenceLogo";

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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

  const handleAdminNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
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
            className="hover:bg-electric-blue/10 transition-all duration-200 group"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 transition-transform group-hover:scale-110" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-80 bg-gradient-to-br from-pure-white to-graphite-50 border-l border-electric-blue/20 shadow-2xl"
        >
          <SheetHeader className="text-left border-b border-electric-blue/20 pb-6 mb-8">
            <SheetTitle className="text-2xl font-black text-deep-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <IridescenceLogo size={40} />
              </div>
              <span className="text-gradient">Thalya</span>
            </SheetTitle>
            <p className="text-sm text-graphite-600 mt-2 font-medium">
              Automatisation intelligente pour votre business
            </p>
          </SheetHeader>
          
          <div className="flex flex-col space-y-8">
            <nav className="flex flex-col space-y-1">
              <h3 className="text-xs font-bold text-electric-blue uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-4 h-0.5 bg-electric-blue rounded-full"></div>
                Navigation
              </h3>
              {user ? (
                // Admin navigation for authenticated users
                adminNavigationItems.map((item, index) => (
                  <Button
                    key={item.id}
                    onClick={() => handleAdminNavigation(item.path)}
                    variant="ghost"
                    className={`justify-start text-left py-4 px-4 text-graphite-700 hover:bg-electric-blue/10 hover:text-electric-blue transition-all duration-300 rounded-xl group relative overflow-hidden ${
                      location.pathname === item.path ? 'bg-electric-blue/10 text-electric-blue' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                    <span className="relative z-10 font-medium">{item.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
                  </Button>
                ))
              ) : (
                // Homepage sections for non-authenticated users
                navigationItems.map((item, index) => (
                  <Button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    variant="ghost"
                    className="justify-start text-left py-4 px-4 text-graphite-700 hover:bg-electric-blue/10 hover:text-electric-blue transition-all duration-300 rounded-xl group relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                    <span className="relative z-10 font-medium">{item.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
                  </Button>
                ))
              )}
            </nav>
            
            {!user && (
              <div className="flex flex-col space-y-4 pt-6 border-t border-electric-blue/20">
                <h3 className="text-xs font-bold text-electric-blue uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-electric-blue rounded-full"></div>
                  Actions
                </h3>
                
                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  className="justify-start border-2 border-graphite-300 text-graphite-700 hover:border-electric-blue hover:text-electric-blue hover:bg-electric-blue/5 py-3 px-4 rounded-xl transition-all duration-300 group"
                >
                  <LogIn className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                  <span className="font-semibold">Se connecter</span>
                </Button>
                
                <Button
                  onClick={handleDemoClick}
                  className="justify-start bg-gradient-to-r from-electric-blue to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Sparkles className="h-5 w-5 mr-3 relative z-10 transition-transform group-hover:rotate-12" />
                  <span className="font-bold relative z-10">Commencer maintenant</span>
                </Button>
              </div>
            )}

            {!user && (
              <div className="pt-4 mt-auto">
                <div className="p-4 bg-gradient-to-r from-electric-blue/10 to-emerald-500/10 rounded-xl border border-electric-blue/20">
                  <p className="text-xs text-graphite-600 text-center font-medium">
                    ✨ Prêt à transformer votre business ?
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
