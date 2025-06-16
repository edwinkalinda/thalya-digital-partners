
import { useEffect, useRef } from 'react';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
}

const Orb = ({ 
  hue = 220, 
  hoverIntensity = 0.3, 
  rotateOnHover = true, 
  forceHoverState = false 
}: OrbProps) => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = orb.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width;
      
      const intensity = Math.max(0, 1 - distance / maxDistance) * hoverIntensity;
      
      orb.style.transform = `scale(${1 + intensity}) ${
        rotateOnHover ? `rotate(${deltaX * 0.1}deg)` : ''
      }`;
      orb.style.filter = `brightness(${1 + intensity}) saturate(${1 + intensity})`;
    };

    const handleMouseLeave = () => {
      if (!forceHoverState) {
        orb.style.transform = 'scale(1) rotate(0deg)';
        orb.style.filter = 'brightness(1) saturate(1)';
      }
    };

    if (forceHoverState) {
      orb.style.transform = `scale(${1 + hoverIntensity})`;
      orb.style.filter = `brightness(${1 + hoverIntensity}) saturate(${1 + hoverIntensity})`;
    }

    document.addEventListener('mousemove', handleMouseMove);
    orb.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      orb.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div
      ref={orbRef}
      className="w-full h-full rounded-full transition-all duration-300 ease-out"
      style={{
        background: `radial-gradient(circle at 30% 30%, 
          hsl(${hue}, 80%, 70%) 0%, 
          hsl(${hue + 20}, 70%, 60%) 30%, 
          hsl(${hue - 20}, 90%, 50%) 70%, 
          hsl(${hue}, 60%, 40%) 100%)`,
        boxShadow: `0 0 40px hsla(${hue}, 70%, 60%, 0.3)`,
      }}
    />
  );
};

export default Orb;
