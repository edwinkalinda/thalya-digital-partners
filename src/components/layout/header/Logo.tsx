
import { createThalyaLogoSVG } from '@/utils/createThalyaLogo';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-8 h-8"
        dangerouslySetInnerHTML={{ __html: createThalyaLogoSVG() }}
      />
      <span className="text-xl font-bold text-deep-black">
        Thalya
      </span>
    </div>
  );
};

export default Logo;
