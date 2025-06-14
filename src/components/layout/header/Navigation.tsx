
import { useNavigate, useLocation } from "react-router-dom";
import { navigationItems } from "./navigationItems";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
  };

  return (
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
  );
};

export default Navigation;
