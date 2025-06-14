
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
      
      <div className="text-rotate-lines flex flex-col" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="text-rotate-word inline-flex">
            {word.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className="text-rotate-element"
                style={{
                  animationDelay: isVisible ? `${(wordIndex * word.length + charIndex) * 50}ms` : '0ms',
                  transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(20px) rotateX(90deg)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.6s ease, opacity 0.6s ease',
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextRotate;
