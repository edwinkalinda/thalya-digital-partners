
import { Button } from "@/components/ui/button";
import AvatarAnimation from "../ui/AvatarAnimation";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6">
            Plus qu'une IA.
            <br />
            <span className="text-gradient">Un partenaire.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-graphite-600 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
            Déployez des agents IA ultra-personnalisés qui gèrent vos appels, 
            enchantent vos clients et automatisent vos opérations, le tout via une simple conversation.
          </p>
          
          {/* Avatar Animation */}
          <div className="mb-12">
            <AvatarAnimation />
          </div>
          
          {/* CTA Button */}
          <div className="animate-slide-up">
            <Button 
              size="lg" 
              className="bg-electric-blue hover:bg-blue-600 text-pure-white px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 animate-glow"
              onClick={() => {
                // Scroll to AI Hub section or trigger onboarding
                document.getElementById('ai-hub')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Donner Vie à votre IA
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-graphite-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-graphite-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
