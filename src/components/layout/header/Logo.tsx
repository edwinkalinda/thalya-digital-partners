
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
    <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
      <div className="relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative overflow-hidden rounded-lg">
          {logoImageData ? (
            <MetallicPaint 
              imageData={logoImageData}
              params={{
                patternScale: 1.8,
                refraction: 0.12,
                edge: 0.8,
                patternBlur: 0.002,
                liquid: 0.3,
                speed: 1.2,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue via-purple-600 to-emerald-500 rounded-lg animate-pulse flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default Logo;
