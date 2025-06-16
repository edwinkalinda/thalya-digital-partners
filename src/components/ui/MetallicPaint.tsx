
import { useEffect, useRef } from 'react';

interface MetallicPaintProps {
  imageData: ImageData;
  params: {
    patternScale: number;
    refraction: number;
    edge: number;
    patternBlur: number;
    liquid: number;
    speed: number;
  };
}

const MetallicPaint = ({ imageData, params }: MetallicPaintProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match imageData
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    // Apply metallic paint effect
    const applyMetallicEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create base metallic gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(0, 102, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply pattern with animation
      const time = Date.now() * params.speed * 0.001;
      ctx.globalCompositeOperation = 'overlay';
      
      for (let i = 0; i < canvas.width; i += 2) {
        for (let j = 0; j < canvas.height; j += 2) {
          const wave = Math.sin(i * params.patternScale + time) * Math.cos(j * params.patternScale + time);
          const alpha = (wave + 1) * 0.5 * params.liquid;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillRect(i, j, 1, 1);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    applyMetallicEffect();

    // Animation loop
    const animate = () => {
      applyMetallicEffect();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [imageData, params]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-cover rounded-full"
      style={{ filter: 'blur(0.5px) contrast(1.1)' }}
    />
  );
};

export default MetallicPaint;
