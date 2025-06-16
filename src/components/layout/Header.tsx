
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Brain, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from './header/Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu-content');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (mobileMenu && menuButton && 
          !mobileMenu.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Fonctionnalités', href: '/#features' },
    { name: 'Tarifs', href: '/#pricing' },
  ];

  const userNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Brain },
    { name: 'Chat Vocal', href: '/voice-management', icon: MessageCircle },
    { name: 'Configuration IA', href: '/ai-config', icon: Settings },
  ];

  return (
    <header 
      className="fixed w-full top-0 z-50 bg-pure-white/95 backdrop-blur-sm border-b border-graphite-200"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 rounded-md"
            aria-label="Retour à l'accueil"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Navigation principale"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-graphite-700 hover:text-electric-blue transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 rounded-md px-2 py-1"
                aria-label={`Naviguer vers ${item.name}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* User Navigation */}
                <div className="flex items-center space-x-2">
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-3 py-2 text-sm text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                        title={item.name}
                        aria-label={item.name}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span className="ml-2 hidden lg:block">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="w-px h-6 bg-graphite-300" aria-hidden="true" />
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-graphite-600">
                    {user.user_metadata?.first_name || user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                    aria-label="Se déconnecter"
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                    aria-label="Se connecter"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="sm" 
                    className="bg-electric-blue hover:bg-blue-600 focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                    aria-label="Commencer l'essai gratuit"
                  >
                    Essai gratuit
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              id="mobile-menu-button"
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-content"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu-content"
            className="md:hidden"
            role="dialog"
            aria-label="Menu de navigation mobile"
            aria-modal="true"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-pure-white border-t border-graphite-200">
              <nav role="navigation" aria-label="Navigation mobile">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label={`Naviguer vers ${item.name}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {user && (
                <>
                  <div className="border-t border-graphite-200 my-2" aria-hidden="true" />
                  <nav role="navigation" aria-label="Navigation utilisateur mobile">
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-3 py-2 text-base font-medium text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                          onClick={() => setIsMenuOpen(false)}
                          aria-label={item.name}
                        >
                          <Icon className="w-4 h-4 mr-3" aria-hidden="true" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </>
              )}
              
              <div className="border-t border-graphite-200 my-2" aria-hidden="true" />
              
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full justify-start focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                  aria-label="Se déconnecter"
                >
                  Déconnexion
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                      aria-label="Se connecter"
                    >
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button 
                      className="w-full bg-electric-blue hover:bg-blue-600 focus:ring-2 focus:ring-electric-blue focus:ring-offset-2"
                      aria-label="Commencer l'essai gratuit"
                    >
                      Essai gratuit
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
