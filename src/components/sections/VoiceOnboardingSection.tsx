
import { VoiceOnboardingDemo } from '@/components/onboarding/VoiceOnboardingDemo';

const VoiceOnboardingSection = () => {
  return (
    <section id="voice-onboarding" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-pure-white to-graphite-50">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-electric-blue/10 rounded-full mb-8">
            <span className="text-sm font-semibold text-electric-blue tracking-wide uppercase">
              Onboarding Vocal Interactif
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight text-graphite-900">
            Créez votre IA
            <span className="block text-gradient">en 5 questions</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed font-light">
            Une conversation vocale de 3 minutes suffit pour configurer votre assistante IA personnalisée. 
            Parlez naturellement, elle s'adapte à votre métier et votre style.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <VoiceOnboardingDemo />
          
          {/* Instructions discrètes */}
          <div className="text-center mt-8 space-y-2">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-graphite-100/30 border border-graphite-200/20 rounded-lg opacity-70">
              <span className="text-graphite-500 text-sm font-medium">
                🎙️ Conversation vocale • 🤖 IA personnalisée • ⚡ Test immédiat
              </span>
            </div>
            <p className="text-xs text-graphite-400">
              Cliquez sur l'orb pour commencer votre onboarding vocal personnalisé
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceOnboardingSection;
