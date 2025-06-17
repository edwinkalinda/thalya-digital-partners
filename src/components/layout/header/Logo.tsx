
import { createThalyaLogoSVG } from '@/utils/createThalyaLogo';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-6 h-6"
        dangerouslySetInnerHTML={{ __html: createThalyaLogoSVG() }}
      />
    </div>
  );
};

export default Logo;
