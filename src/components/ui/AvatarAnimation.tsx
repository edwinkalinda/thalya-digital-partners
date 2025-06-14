
import { useState, useEffect } from 'react';

const AvatarAnimation = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Main avatar circle */}
        <div className={`w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-electric-blue to-blue-600 flex items-center justify-center transition-all duration-1000 ${isActive ? 'animate-avatar-pulse' : ''}`}>
          
          {/* Inner glow */}
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-pure-white/20 to-transparent flex items-center justify-center">
            
            {/* Avatar face/symbol */}
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-pure-white flex items-center justify-center">
              <div className="text-electric-blue text-2xl md:text-3xl lg:text-4xl font-bold">T</div>
            </div>
          </div>

          {/* Audio wave rings */}
          <div className={`absolute inset-0 rounded-full border-2 border-electric-blue/30 ${isActive ? 'animate-ping' : ''}`}></div>
          <div className={`absolute -inset-2 rounded-full border border-electric-blue/20 ${isActive ? 'animate-ping' : ''} animation-delay-150`}></div>
          <div className={`absolute -inset-4 rounded-full border border-electric-blue/10 ${isActive ? 'animate-ping' : ''} animation-delay-300`}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-electric-blue rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 -left-6 w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse animation-delay-1000"></div>
      </div>
    </div>
  );
};

export default AvatarAnimation;
