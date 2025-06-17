
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import CTAButtons from './header/CTAButtons';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen for scroll events
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-graphite-200/50 shadow-lg shadow-graphite-900/5' 
          : 'bg-white/80 backdrop-blur-sm border-b border-graphite-200/30'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-3 hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 rounded-md group ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}
            aria-label="Retour à l'accueil Thalya"
          >
            <div className="relative">
              <Logo />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <span className={`font-black text-deep-black transition-all duration-300 group-hover:text-electric-blue ${
              isScrolled ? 'text-xl' : 'text-2xl'
            }`}>
              Thalya
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className={`transition-all duration-500 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>
            <Navigation />
          </div>

          {/* Enhanced Desktop CTA Buttons */}
          <div className={`hidden lg:flex transition-all duration-500 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>
            <CTAButtons />
          </div>

          {/* Enhanced Mobile Menu */}
          <div className={`transition-all duration-500 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Animated underline */}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-electric-blue via-emerald-500 to-electric-blue transition-all duration-500 ${
        isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`}></div>
    </header>
  );
};

export default Header;
