
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    navigate('/');
    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex items-center group cursor-pointer" onClick={handleLogoClick}>
      <div className="relative">
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3 transition-all duration-300 group-hover:scale-110">
          <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-electric-blue/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pure-white rounded-full"></div>
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
  );
};

export default Logo;
