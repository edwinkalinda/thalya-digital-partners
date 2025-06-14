
import { useEffect, useState } from 'react';
import Iridescence from './Iridescence';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('AnimatedBackground mounted');
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{ 
        width: '100vw', 
        height: '100vh',
        backgroundColor: 'rgba(0,255,0,0.1)' // Temporary green tint to see if this div is there
      }}
    >
      <Iridescence
        color={[0.2, 0.4, 0.8]}
        speed={1.0}
        amplitude={0.1}
        mouseReact={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedBackground;
