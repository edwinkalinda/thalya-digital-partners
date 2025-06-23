
import Header from '@/components/layout/Header';
import SimpleOnboardingForm from '@/components/onboarding/SimpleOnboardingForm';

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <SimpleOnboardingForm />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
