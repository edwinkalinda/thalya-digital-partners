
import { useEffect, useState } from 'react';
import Iridescence from './Iridescence';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 distortion-container">
      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <Iridescence
          color={[0.2, 0.4, 0.8]}
          speed={1.0}
          amplitude={0.1}
          mouseReact={true}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
