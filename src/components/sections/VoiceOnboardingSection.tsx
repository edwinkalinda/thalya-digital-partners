
import { VoiceOnboardingDemo } from '@/components/onboarding/VoiceOnboardingDemo';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight } from 'lucide-react';
import VoiceOrb from '@/components/ui/VoiceOrb';

const VoiceOnboardingSection = () => {
  const navigate = useNavigate();

  const handleStartConfiguration = () => {
    navigate('/voice-configuration');
  };

  return (
    <section id="voice-onboarding" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-pure-white to-graphite-50">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-electric-blue/10 rounded-full mb-8">
            <span className="text-sm font-semibold text-electric-blue tracking-wide uppercase">
              Configuration Interactive
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight text-graphite-900">
            Créez votre IA
            <span className="block text-gradient">en parlant naturellement</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
            Expérimentez la puissance de l'onboarding vocal. Configurez votre assistante IA 
            personnalisée en quelques minutes par simple conversation.
          </p>

          {/* Interactive Orb */}
          <div className="mb-12">
            <div 
              className="w-64 h-64 mx-auto cursor-pointer group relative"
              onClick={handleStartConfiguration}
            >
              <VoiceOrb 
                hue={220} 
                hoverIntensity={0.4}
                forceHoverState={false}
                rotateOnHover={true}
              />
              
              {/* Click indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-pure-white/90 backdrop-blur-sm rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-xl">
                  <Mic className="w-8 h-8 text-electric-blue" />
                </div>
              </div>
              
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-electric-blue/30 animate-ping"></div>
              <div className="absolute inset-4 rounded-full border-2 border-electric-blue/20 animate-ping animation-delay-1000"></div>
            </div>
            
            <p className="text-lg text-graphite-600 mt-6 font-medium">
              Cliquez sur l'orbe pour commencer
            </p>
          </div>

          <Button 
            onClick={handleStartConfiguration}
            className="bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-pure-white px-8 py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Mic className="w-6 h-6 mr-3" />
            Commencer la configuration vocale
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingSection;
