
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navigationItems } from "./navigationItems";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
    if (!isHomePage) {
      navigate('/', { replace: false });
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 800);
    } else {
      scrollToElement(sectionId);
    }
  };

  return (
    <nav 
      className="hidden lg:flex items-center space-x-2"
      role="navigation"
      aria-label="Navigation principale"
    >
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          onClick={() => handleNavigation(item.id)}
          variant="ghost"
          className="text-graphite-700 hover:text-electric-blue hover:bg-electric-blue/5 transition-all duration-200 font-medium relative group"
          aria-label={`Naviguer vers ${item.label}`}
        >
          {item.label}
          <span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;
