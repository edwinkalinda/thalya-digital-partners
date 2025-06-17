
import { VoiceOnboardingDemo } from '@/components/onboarding/VoiceOnboardingDemo';

const VoiceOnboardingSection = () => {
  return (
    <section id="voice-onboarding" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-pure-white to-graphite-50">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-electric-blue/10 rounded-full mb-8">
            <span className="text-sm font-semibold text-electric-blue tracking-wide uppercase">
              Démo Interactive
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight text-graphite-900">
            Configurez votre IA
            <span className="block text-gradient">en temps réel</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed font-light">
            Expérimentez la puissance de l'onboarding vocal. Créez et testez votre assistante IA 
            personnalisée en quelques minutes seulement.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <VoiceOnboardingDemo />
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingSection;
