
import { Link } from 'react-router-dom';
import IridescenceLogo from '@/components/ui/IridescenceLogo';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      <IridescenceLogo size={48} />
      <span className="text-2xl font-black tracking-tight text-deep-black">
        Thalya
      </span>
    </Link>
  );
};

export default Logo;
