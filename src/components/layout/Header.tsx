
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import CTAButtons from "./header/CTAButtons";
import MobileMenu from "./header/MobileMenu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-white/80 backdrop-blur-md border-b border-graphite-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
            
            <Logo />
          </div>

          <Navigation />

          <CTAButtons />

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
