
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
        <div className="w-32 h-10 sm:w-40 sm:h-12 relative transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1">
          {logoImageData ? (
            <MetallicPaint 
              imageData={logoImageData}
              params={{
                patternScale: 1.2,
                refraction: 0.03,
                edge: 0.7,
                patternBlur: 0.002,
                liquid: 0.15,
                speed: 0.5,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-purple-600 to-emerald-500 rounded-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-electric-blue/40 animate-pulse flex items-center justify-center">
              <span className="text-lg sm:text-xl font-black text-white tracking-widest">THALYA</span>
            </div>
          )}
        </div>
        
        {/* Halo lumineux */}
        <div className="absolute inset-0 w-32 h-10 sm:w-40 sm:h-12 bg-electric-blue/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        {/* Particules brillantes */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100"></div>
      </div>
    </div>
  );
};

export default Logo;
