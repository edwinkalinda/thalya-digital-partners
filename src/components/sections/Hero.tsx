
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

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white via-graphite-50 to-electric-blue/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-electric-blue/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Badge/Tagline */}
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-electric-blue/10 border border-electric-blue/20 rounded-full text-electric-blue font-medium text-sm">
            <span className="w-2 h-2 bg-electric-blue rounded-full mr-2 animate-pulse"></span>
            Votre Partenaire en Automatisation Intelligente
          </div>
          
          {/* Main Title with improved spacing */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
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
          
          {/* Enhanced Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-graphite-600 max-w-5xl mx-auto mb-10 font-normal leading-relaxed">
            Thalya révolutionne votre entreprise grâce à l'IA : 
            <span className="text-electric-blue font-semibold"> automatisation des stocks, relation client optimisée, processus fluidifiés</span> pour une efficacité et une croissance sans précédent.
          </p>
          
          {/* TextCycler - repositioned and enhanced */}
          <div className="mb-12">
            <div className="text-base sm:text-lg text-graphite-500 mb-3 font-medium">Spécialisé en :</div>
            <TextCycler
              texts={specializations}
              className="text-xl sm:text-2xl lg:text-3xl text-electric-blue font-bold"
              interval={2500}
              splitBy="characters"
              staggerDuration={30}
            />
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
            <StarBorder 
              color="#0066FF"
              speed="4s"
              className="transition-all duration-300 hover:scale-105 group"
              onClick={() => navigate('/onboarding')}
            >
              <span className="flex items-center gap-2 text-base sm:text-lg font-semibold px-2">
                Découvrir l'automatisation 
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </StarBorder>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-graphite-300 text-graphite-700 hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-electric-blue/10 group"
            >
              <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
              Voir les cas d'usage
            </Button>
          </div>
          
          {/* Enhanced Trust indicators */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-graphite-500 mb-6 font-medium">Déjà adopté par des entreprises innovantes :</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {trustIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center sm:justify-start space-x-3 p-4 rounded-xl bg-pure-white/50 border border-graphite-200/50 hover:border-electric-blue/30 hover:bg-electric-blue/5 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-graphite-700 font-medium text-center sm:text-left">
                    {indicator}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-electric-blue mb-2 group-hover:scale-110 transition-transform">99%</div>
              <div className="text-sm text-graphite-600">Taux de satisfaction</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-electric-blue mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm text-graphite-600">Disponibilité garantie</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-electric-blue mb-2 group-hover:scale-110 transition-transform">-50%</div>
              <div className="text-sm text-graphite-600">Temps de traitement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
