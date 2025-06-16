
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Mic, Building, UtensilsCrossed, Heart, Target } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { dashboardNavigationItems } from "./navigationItems";

const CTAButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Building': return <Building className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2 bg-white border-graphite-300 hover:border-electric-blue hover:bg-electric-blue/5 transition-all duration-200"
              aria-label={`Menu utilisateur - ${user.email}`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline max-w-24 truncate">
                {user.user_metadata?.first_name || user.email?.split('@')[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-white border-graphite-200 shadow-lg"
            sideOffset={8}
          >
            {dashboardNavigationItems.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer hover:bg-electric-blue/5 focus:bg-electric-blue/10 ${
                  location.pathname === item.path ? 'bg-electric-blue/10 text-electric-blue' : ''
                }`}
              >
                {getIcon(item.icon)}
                <span className="ml-2">{item.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-graphite-200" />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-2">Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/login')}
        className="border-graphite-300 text-graphite-700 hover:border-electric-blue hover:text-electric-blue hover:bg-electric-blue/5 transition-all duration-200"
      >
        Se connecter
      </Button>
      <Button 
        size="sm"
        onClick={() => navigate('/onboarding')}
        className="bg-gradient-to-r from-electric-blue to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all duration-200"
      >
        Commencer
      </Button>
    </div>
  );
};

export default CTAButtons;
