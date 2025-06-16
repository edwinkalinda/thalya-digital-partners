
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
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {dashboardNavigationItems.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? 'bg-electric-blue/10' : ''}
              >
                {getIcon(item.icon)}
                <span className="ml-2">{item.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="w-4 h-4" />
              <span className="ml-2">Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/login')}
        className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
      >
        Se connecter
      </Button>
      <Button 
        onClick={() => navigate('/onboarding')}
        className="bg-electric-blue text-white hover:bg-blue-600"
      >
        Commencer
      </Button>
    </div>
  );
};

export default CTAButtons;
