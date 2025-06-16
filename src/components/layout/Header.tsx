
import { useState } from 'react';
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
    <header className="fixed w-full top-0 z-50 bg-pure-white/95 backdrop-blur-sm border-b border-graphite-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-graphite-700 hover:text-electric-blue transition-colors duration-200 font-medium"
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
                        className="flex items-center px-3 py-2 text-sm text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-lg transition-colors duration-200"
                        title={item.name}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="ml-2 hidden lg:block">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="w-px h-6 bg-graphite-300" />
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-graphite-600">
                    {user.user_metadata?.first_name || user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" className="bg-electric-blue hover:bg-blue-600">
                    Essai gratuit
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-pure-white border-t border-graphite-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-graphite-200 my-2" />
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-3 py-2 text-base font-medium text-graphite-700 hover:text-electric-blue hover:bg-graphite-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </>
              )}
              
              <div className="border-t border-graphite-200 my-2" />
              
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Déconnexion
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button className="w-full bg-electric-blue hover:bg-blue-600">
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
