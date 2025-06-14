
import Header from '../components/layout/Header';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import Hero from '../components/sections/Hero';
import AIHub from '../components/sections/AIHub';
import ThalyaDifference from '../components/sections/ThalyaDifference';
import Philosophy from '../components/sections/Philosophy';
import FinalCTA from '../components/sections/FinalCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-graphite-100 text-deep-black relative">
      <AnimatedBackground />
      <Header />
      <Hero />
      <AIHub />
      <div id="thalya-difference">
        <ThalyaDifference />
      </div>
      <div id="philosophy">
        <Philosophy />
      </div>
      <div id="final-cta">
        <FinalCTA />
      </div>
    </div>
  );
};

export default Index;
