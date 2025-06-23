import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, CheckCircle } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";
import StarBorder from "@/components/ui/StarBorder";
import TextCycler from "@/components/ui/TextCycler";

const Hero = () => {
  const navigate = useNavigate();

  const trustIndicators = [
    "Gestion de stocks optimisée",
    "Support client 24/7 automatisé", 
    "Processus métier fluidifiés"
  ];

  const specializations = [
    "Automatisation intelligente",
    "IA conversationnelle",
    "Optimisation des processus",
    "Croissance accélérée"
  ];

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white via-graphite-50 to-electric-blue/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-electric-blue/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Badge/Tagline - Level 4 */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-electric-blue/10 border border-electric-blue/20 rounded-full text-electric-blue font-medium text-sm">
            <span className="w-2 h-2 bg-electric-blue rounded-full mr-2 animate-pulse"></span>
            Votre Partenaire en Automatisation Intelligente
          </div>
          
          {/* Main Title - Level 1 (Primaire) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]">
            <DecryptedText 
              text="Automatisez votre business,"
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-deep-black block mb-2"
              encryptedClassName="text-electric-blue/40"
            />
            <DecryptedText 
              text="libérez votre potentiel"
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-gradient block"
              encryptedClassName="text-electric-blue/40"
            />
          </h1>
          
          {/* Subtitle - Level 2 (Secondaire) */}
          <div className="mb-8">
            <p className="text-xl sm:text-2xl lg:text-3xl text-graphite-700 max-w-4xl mx-auto mb-4 font-semibold leading-tight">
              Thalya révolutionne votre entreprise grâce à l'IA
            </p>
            <p className="text-lg sm:text-xl text-graphite-600 max-w-3xl mx-auto leading-relaxed">
              Automatisation des stocks, relation client optimisée, processus fluidifiés pour une efficacité et une croissance sans précédent.
            </p>
          </div>
          
          {/* TextCycler - Level 3 (Tertiaire) */}
          <div className="mb-12 p-6 bg-pure-white/60 border border-graphite-200/50 rounded-2xl backdrop-blur-sm max-w-2xl mx-auto">
            <div className="text-lg text-graphite-600 mb-4 font-medium">Spécialisé en :</div>
            <TextCycler
              texts={specializations}
              className="text-2xl sm:text-3xl text-electric-blue font-bold"
              interval={1200}
              splitBy="characters"
              staggerDuration={30}
            />
          </div>
          
          {/* CTA Button - Seul bouton restant */}
          <div className="flex justify-center items-center mb-16">
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-graphite-400 text-graphite-700 hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/10 group"
            >
              <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
              Voir les cas d'usage
            </Button>
          </div>
          
          {/* Trust indicators - Niveau de preuve */}
          <div className="mb-16">
            <p className="text-base text-graphite-600 mb-8 font-semibold">Déjà adopté par des entreprises innovantes</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center sm:justify-start space-x-3 p-5 rounded-xl bg-pure-white/70 border border-graphite-200/60 hover:border-electric-blue/30 hover:bg-electric-blue/5 transition-all duration-300 group shadow-sm"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-base text-graphite-700 font-medium text-center sm:text-left">
                    {indicator}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
