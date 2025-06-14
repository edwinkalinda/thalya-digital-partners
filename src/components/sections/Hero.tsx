
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Tagline */}
          <p className="text-graphite-600 text-lg mb-6 font-medium">
            <DecryptedText 
              text="Votre Partenaire en Automatisation Intelligente"
              animateOn="view"
              sequential={true}
              speed={30}
              className="text-graphite-600"
              encryptedClassName="text-electric-blue/60"
            />
          </p>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight">
            <DecryptedText 
              text="Automatisez votre"
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-deep-black"
              encryptedClassName="text-electric-blue/40"
            />
            <br />
            <DecryptedText 
              text="business,"
              animateOn="view"
              sequential={true}
              speed={45}
              className="text-deep-black"
              encryptedClassName="text-electric-blue/40"
            />
            <br />
            <span className="text-gradient">
              <DecryptedText 
                text="libérez votre potentiel."
                animateOn="view"
                sequential={true}
                speed={35}
                revealDirection="end"
                className="text-gradient"
                encryptedClassName="text-electric-blue/50"
              />
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-graphite-600 max-w-4xl mx-auto mb-12 font-normal leading-relaxed">
            <DecryptedText 
              text="Thalya automatise les composantes clés de votre entreprise – de la gestion des stocks à la relation client – pour une efficacité et une croissance sans précédent."
              animateOn="view"
              sequential={true}
              speed={25}
              className="text-graphite-600"
              encryptedClassName="text-electric-blue/30"
            />
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-deep-black hover:bg-graphite-800 text-pure-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/onboarding')}
            >
              <DecryptedText 
                text="Découvrir l'automatisation →"
                animateOn="hover"
                speed={20}
                maxIterations={8}
                className="text-pure-white"
                encryptedClassName="text-electric-blue/80"
              />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-graphite-300 text-graphite-700 hover:bg-graphite-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              <DecryptedText 
                text="Voir les cas d'usages"
                animateOn="hover"
                speed={20}
                maxIterations={8}
                className="text-graphite-700"
                encryptedClassName="text-electric-blue/60"
              />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-graphite-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <DecryptedText 
                text="Gestion de stocks optimisée"
                animateOn="view"
                speed={30}
                className="text-graphite-500"
                encryptedClassName="text-electric-blue/40"
              />
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <DecryptedText 
                text="Support client 24/7 automatisé"
                animateOn="view"
                speed={30}
                className="text-graphite-500"
                encryptedClassName="text-electric-blue/40"
              />
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <DecryptedText 
                text="Processus métier fluidifiés"
                animateOn="view"
                speed={30}
                className="text-graphite-500"
                encryptedClassName="text-electric-blue/40"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
