
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

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      } ${className}`}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default TextCycler;
