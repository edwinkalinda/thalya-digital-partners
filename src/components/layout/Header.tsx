
import { Link } from 'react-router-dom';
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import CTAButtons from './header/CTAButtons';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  return (
    <header 
      className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md"
            aria-label="Retour à l'accueil Thalya"
          >
            <Logo />
          </Link>

          <Navigation />

          <div className="hidden lg:flex">
            <CTAButtons />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
