
import { useEffect, useState } from 'react';
import Dither from './Dither';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 distortion-container">
      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <Dither
          waveColor={[0.2, 0.4, 0.8]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          waveAmplitude={0.2}
          waveFrequency={2}
          waveSpeed={0.03}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
