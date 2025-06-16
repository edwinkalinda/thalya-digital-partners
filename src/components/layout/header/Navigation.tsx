
import { useNavigate, useLocation } from "react-router-dom";
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
    
    // Si l'élément n'existe pas encore, réessayer jusqu'à maxAttempts
    if (maxAttempts > 0) {
      setTimeout(() => {
        scrollToElement(sectionId, maxAttempts - 1);
      }, 200);
    }
  };

  const handleNavigation = (sectionId: string) => {
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

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(sectionId);
    }
  };

  return (
    <nav 
      className="hidden lg:flex items-center space-x-8"
      role="navigation"
      aria-label="Navigation principale"
    >
      {navigationItems.map((item) => (
        <button 
          key={item.id}
          onClick={() => handleNavigation(item.id)}
          onKeyDown={(e) => handleKeyDown(e, item.id)}
          className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 rounded-md px-2 py-1"
          aria-label={`Naviguer vers la section ${item.label}`}
          tabIndex={0}
        >
          {item.label}
          <span 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full group-focus:w-full"
            aria-hidden="true"
          ></span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
