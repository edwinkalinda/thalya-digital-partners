
import Hero from "@/components/sections/Hero";
import AIHub from "@/components/sections/AIHub";
import VoiceOnboardingSection from "@/components/sections/VoiceOnboardingSection"; 
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ThalyaDifference from "@/components/sections/ThalyaDifference";
import Philosophy from "@/components/sections/Philosophy";
import FinalCTA from "@/components/sections/FinalCTA";
import Header from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AIHub />
        <VoiceOnboardingSection />
        <TestimonialsSection />
        <ThalyaDifference />
        <Philosophy />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Index;
