
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
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          {logoImageData ? (
            <MetallicPaint 
              imageData={logoImageData}
              params={{
                patternScale: 1.8,
                refraction: 0.12,
                edge: 0.6,
                patternBlur: 0.003,
                liquid: 0.4,
                speed: 1.2,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue via-purple-600 to-emerald-500 rounded-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-electric-blue/40 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/40"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Texte THALYA à côté */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden sm:block">
          <span className="text-xl font-black text-graphite-800 tracking-wider">THALYA</span>
        </div>
        
        {/* Halo lumineux amélioré avec les couleurs du logo */}
        <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-violet-500/40 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        {/* Particules brillantes animées avec les couleurs du logo */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-violet-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100"></div>
        <div className="absolute top-1 left-1 w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-200"></div>
      </div>
    </div>
  );
};

export default Logo;
