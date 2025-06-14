
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
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {logoImageData ? (
            <MetallicPaint 
              imageData={logoImageData}
              params={{
                patternScale: 1.5,
                refraction: 0.025,
                edge: 0.8,
                patternBlur: 0.003,
                liquid: 0.12,
                speed: 0.4,
              }}
            />
          ) : (
            <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-electric-blue via-purple-600 to-emerald-500 rounded-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-electric-blue/30 animate-pulse"></div>
          )}
        </div>
        
        {/* Halo lumineux */}
        <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 bg-electric-blue/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
      
      <span className="text-2xl sm:text-3xl font-black text-deep-black group-hover:text-electric-blue transition-all duration-300 tracking-tight font-mono">
        Thalya
      </span>
    </div>
  );
};

export default Logo;
