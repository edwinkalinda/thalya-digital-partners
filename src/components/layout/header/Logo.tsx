
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MetallicPaint from "@/components/ui/MetallicPaint";
import { createThalyaLogoSVG, svgToImageData } from "@/utils/createThalyaLogo";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [logoImageData, setLogoImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const svgString = createThalyaLogoSVG();
        const imageData = await svgToImageData(svgString);
        setLogoImageData(imageData);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };

    loadLogo();
  }, []);

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
          {logoImageData ? (
            <MetallicPaint 
              imageData={logoImageData}
              params={{
                patternScale: 2,
                refraction: 0.015,
                edge: 1,
                patternBlur: 0.005,
                liquid: 0.07,
                speed: 0.3,
              }}
            />
          ) : (
            <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-electric-blue/20"></div>
          )}
        </div>
      </div>
      
      <span className="text-xl sm:text-2xl font-bold text-deep-black group-hover:text-electric-blue transition-colors duration-300 tracking-tight">
        Thalya
      </span>
    </div>
  );
};

export default Logo;
