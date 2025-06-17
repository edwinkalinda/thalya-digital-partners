
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import CTAButtons from './header/CTAButtons';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-graphite-200/30 shadow-sm' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-14'
        }`}>
          <Link 
            to="/" 
            className={`flex items-center space-x-2 hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-electric-blue rounded-sm group ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}
            aria-label="Retour à l'accueil Thalya"
          >
            <div className="relative">
              <Logo />
            </div>
            <span className={`font-medium text-deep-black transition-all duration-200 group-hover:text-electric-blue ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}>
              Thalya
            </span>
          </Link>

          <div className={`transition-all duration-300 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>
            <Navigation />
          </div>

          <div className={`hidden lg:flex transition-all duration-300 ${
            isScrolled ? 'scale-95' : 'scale-100'
          }`}>
            <CTAButtons />
          </div>

          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
