
import Hero from "@/components/sections/Hero";
import PublicDemo from "@/components/sections/PublicDemo";
import AIHub from "@/components/sections/AIHub";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
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
        <div id="demo-section">
          <PublicDemo />
        </div>
        <AIHub />
        <TestimonialsSection />
        <PricingSection />
        <ThalyaDifference />
        <Philosophy />
        <FinalCTA />
      </main>
    </div>
  );
};

export default Index;
