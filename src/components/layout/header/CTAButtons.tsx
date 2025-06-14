
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";

const CTAButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
      <button
        onClick={() => navigate('/login')}
        className="group relative inline-flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-2.5 text-sm font-medium text-graphite-700 bg-pure-white border border-graphite-300 rounded-lg hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue transition-all duration-300 hover:shadow-md hover:shadow-electric-blue/10"
      >
        <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Connexion</span>
        
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <div className="scale-90 lg:scale-100">
        <StarBorder color="#0066FF" speed="4s" className="transition-all duration-300 hover:scale-105" onClick={() => navigate('/onboarding')}>
          <span className="text-sm px-2 lg:px-0">Demander une démo</span>
        </StarBorder>
      </div>
    </div>
  );
};

export default CTAButtons;
