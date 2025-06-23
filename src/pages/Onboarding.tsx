
import VoiceOnboardingDemo from '@/components/onboarding/VoiceOnboardingDemo';
import Header from '@/components/layout/Header';

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-deep-black mb-4">
                Configuration de votre IA Clara
              </h1>
              <p className="text-xl text-graphite-600">
                Configurez votre assistante vocale en parlant naturellement
              </p>
            </div>
            
            <div className="bg-pure-white rounded-2xl shadow-xl border border-graphite-200 p-8">
              <VoiceOnboardingDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
