
import Hero from '../components/sections/Hero';
import AIHub from '../components/sections/AIHub';
import ThalyaDifference from '../components/sections/ThalyaDifference';
import Philosophy from '../components/sections/Philosophy';
import FinalCTA from '../components/sections/FinalCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-pure-white text-deep-black">
      <Hero />
      <AIHub />
      <ThalyaDifference />
      <Philosophy />
      <FinalCTA />
    </div>
  );
};

export default Index;
