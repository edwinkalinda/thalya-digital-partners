
import { useNavigate } from 'react-router-dom';
import VoiceOrb from '@/components/ui/VoiceOrb';

const VoiceOnboardingSection = () => {
  const navigate = useNavigate();

  const handleOrbClick = () => {
    navigate('/voice-configuration');
  };

  return (
    <section id="voice-onboarding" className="py-24 px-6 lg:px-8 bg-pure-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-deep-black animate-fade-in">
          Configurez votre IA
        </h2>
        
        <p className="text-base text-graphite-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-1000">
          Créez votre assistante IA personnalisée en conversant naturellement avec elle
        </p>

        <div className="mb-8 animate-scale-in animation-delay-2000">
          <div 
            className="w-48 h-48 mx-auto cursor-pointer group relative hover-scale"
            onClick={handleOrbClick}
          >
            <VoiceOrb 
              hue={220} 
              hoverIntensity={0.3}
              forceHoverState={false}
              rotateOnHover={true}
            />
            
            <div className="absolute inset-0 rounded-full border border-electric-blue/20 animate-ping"></div>
            <div className="absolute inset-4 rounded-full border border-electric-blue/10 animate-ping animation-delay-1000"></div>
          </div>
          
          <p className="text-sm text-graphite-500 mt-4 animate-fade-in animation-delay-2000">
            Cliquez pour commencer
          </p>
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingSection;
