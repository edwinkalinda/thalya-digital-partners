
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 distortion-container">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100"></div>
      
      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-60 right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-40 left-40 w-64 h-64 bg-electric-blue/3 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-electric-blue/20 rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#0066FF_1px,transparent_1px),linear-gradient(to_bottom,#0066FF_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
