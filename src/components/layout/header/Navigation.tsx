
import { useNavigate, useLocation } from "react-router-dom";
import { navigationItems } from "./navigationItems";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavigation = (sectionId: string) => {
    if (!isHomePage) {
      // Si on n'est pas sur la page d'accueil, naviguer d'abord vers la page d'accueil
      navigate('/', { replace: false });
      // Attendre que la page se charge avant de défiler
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 200);
    } else {
      // Si on est déjà sur la page d'accueil, défiler directement
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <button 
          key={item.id}
          onClick={() => handleNavigation(item.id)} 
          className="text-graphite-600 hover:text-electric-blue transition-colors relative group cursor-pointer"
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
