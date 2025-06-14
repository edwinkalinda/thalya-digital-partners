
import { useEffect, useRef, useState } from 'react';

interface TextRotateProps {
  text: string;
  className?: string;
}

const TextRotate = ({ text, className = '' }: TextRotateProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`text-rotate ${className}`}>
      <span className="text-rotate-sr-only">{text}</span>
      
      <div className="text-rotate-lines" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span 
            key={wordIndex} 
            className="text-rotate-word inline-flex relative overflow-hidden group"
            style={{
              animationDelay: isVisible ? `${wordIndex * 100}ms` : '0ms',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-emerald-500/10 rounded-md scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            {word.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className="text-rotate-element relative z-10 inline-block hover:text-electric-blue transition-colors duration-200"
                style={{
                  animationDelay: isVisible ? `${(wordIndex * word.length + charIndex) * 50}ms` : '0ms',
                  transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(20px) rotateX(90deg)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.6s ease, opacity 0.6s ease, color 0.2s ease',
                }}
              >
                {char}
              </span>
            ))}
            {wordIndex < words.length - 1 && (
              <span 
                className="text-rotate-space relative z-10 inline-block"
                style={{
                  animationDelay: isVisible ? `${(wordIndex * word.length + word.length) * 50}ms` : '0ms',
                  transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(20px) rotateX(90deg)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.6s ease, opacity 0.6s ease',
                }}
              > </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextRotate;
