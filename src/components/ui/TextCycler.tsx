
import { useEffect, useState } from 'react';

interface TextCyclerProps {
  texts: string[];
  className?: string;
  interval?: number;
}

const TextCycler = ({ texts, className = '', interval = 2000 }: TextCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (texts.length === 0) return;

    const cycleText = () => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 300);
    };

    const intervalId = setInterval(cycleText, interval);
    return () => clearInterval(intervalId);
  }, [texts.length, interval]);

  if (texts.length === 0) return null;

  return (
    <span
      className={`inline-block transition-opacity transition-transform duration-300 ease-in-out min-h-[1.2em] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      } ${className}`}
      style={{ minWidth: '200px', textAlign: 'left' }}
    >
      {texts[currentIndex] || texts[0]}
    </span>
  );
};

export default TextCycler;
