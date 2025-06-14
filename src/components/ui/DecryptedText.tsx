import { useEffect, useRef, useState, useMemo } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  encryptedClassName?: string;
  animateOn?: 'mount' | 'view';
  sequential?: boolean;
  speed?: number;
  revealDirection?: 'left' | 'right' | 'center' | 'random';
}

const DecryptedText = ({
  text,
  className = '',
  encryptedClassName = '',
  animateOn = 'mount',
  sequential = false,
  speed = 50,
  revealDirection = 'left'
}: DecryptedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedIndices, setDecryptedIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLSpanElement>(null);

  const generateRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const getRevealOrder = useMemo(() => {
    const indices = Array.from({ length: text.length }, (_, i) => i);
    
    switch (revealDirection) {
      case 'right':
        return indices.reverse();
      case 'center':
        const center = Math.floor(text.length / 2);
        const result: number[] = [];
        for (let i = 0; i < text.length; i++) {
          const leftIndex = center - i;
          const rightIndex = center + i + 1;
          if (leftIndex >= 0) result.push(leftIndex);
          if (rightIndex < text.length) result.push(rightIndex);
        }
        return result;
      case 'random':
        return indices.sort(() => Math.random() - 0.5);
      default: // 'left'
        return indices;
    }
  }, [text, revealDirection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && animateOn === 'view') {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current && animateOn === 'view') {
      observer.observe(containerRef.current);
    } else if (animateOn === 'mount') {
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, [animateOn]);

  useEffect(() => {
    if (!isVisible) return;

    if (sequential) {
      getRevealOrder.forEach((index, orderIndex) => {
        setTimeout(() => {
          setDecryptedIndices(prev => new Set([...prev, index]));
        }, orderIndex * speed);
      });
    } else {
      const timeouts = getRevealOrder.map((index) => {
        const delay = Math.random() * (text.length * speed);
        return setTimeout(() => {
          setDecryptedIndices(prev => new Set([...prev, index]));
        }, delay);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isVisible, text, speed, sequential, getRevealOrder]);

  return (
    <span 
      ref={containerRef} 
      className={`inline-flex ${className}`}
      style={{ display: 'inline-flex', flexDirection: 'row' }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`${decryptedIndices.has(index) ? className : encryptedClassName} transition-all duration-100`}
          style={{ 
            display: 'inline-block',
            minWidth: char === ' ' ? '0.3em' : 'auto'
          }}
        >
          {decryptedIndices.has(index) ? char : (char === ' ' ? ' ' : generateRandomChar())}
        </span>
      ))}
    </span>
  );
};

export default DecryptedText;
