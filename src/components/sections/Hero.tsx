
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";
import StarBorder from "@/components/ui/StarBorder";
import TextCycler from "@/components/ui/TextCycler";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Tagline */}
          <p className="text-graphite-600 text-lg mb-6 font-medium">
            Votre Partenaire en Automatisation Intelligente
          </p>
          
          {/* Main Title with DecryptedText effect */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight">
            <DecryptedText 
              text="Automatisez votre business, libérez votre potentiel."
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-deep-black"
              encryptedClassName="text-electric-blue/40"
            />
          </h1>
          
          {/* TextCycler - positioned in the title area */}
          <div className="mb-8">
            <div className="text-lg text-graphite-500 mb-2">Spécialisé en :</div>
            <TextCycler
              texts={["Gestion automatisée", "IA intelligente", "Croissance optimisée"]}
              className="text-2xl text-electric-blue font-semibold"
              interval={3000}
              splitBy="characters"
              staggerDuration={50}
            />
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-graphite-600 max-w-4xl mx-auto mb-12 font-normal leading-relaxed">
            Thalya automatise les composantes clés de votre entreprise – de la gestion des stocks à la relation client – pour une efficacité et une croissance sans précédent.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <StarBorder 
              color="#0066FF"
              speed="4s"
              className="transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/onboarding')}
            >
              Découvrir l'automatisation →
            </StarBorder>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-graphite-300 text-graphite-700 hover:bg-graphite-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Voir les cas d'usages
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-graphite-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Gestion de stocks optimisée
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Support client 24/7 automatisé
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Processus métier fluidifiés
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
