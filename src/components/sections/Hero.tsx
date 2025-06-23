
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20 pb-16 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-gray-900 leading-tight">
          Votre réceptionniste IA
          <br />
          disponible 24h/24
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Clara accueille vos clients, prend les rendez-vous et répond aux questions avec la personnalité de votre marque.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Button 
            onClick={handleStartDemo}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl transition-colors duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Essayer gratuitement
          </Button>
          
          <Button 
            onClick={handleStartOnboarding}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg font-medium rounded-xl transition-colors duration-200"
          >
            Configurer mon IA
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-600 font-medium">Configuration en 3 minutes</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-600 font-medium">Support 24/7 automatisé</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-600 font-medium">ROI mesurable dès J+1</span>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center">
          <p className="text-gray-500 text-sm font-medium">
            Déjà adopté par plus de 200 entreprises
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
