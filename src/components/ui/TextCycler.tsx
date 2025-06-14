
import { useEffect, useState } from 'react';

interface TextCyclerProps {
  texts: string[];
  className?: string;
  interval?: number;
}

const TextCycler = ({
  texts,
  className = '',
  interval = 2000
}: TextCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  if (texts.length === 0) return null;

  return (
    <span className={className}>
      {texts[currentIndex] || texts[0]}
    </span>
  );
};

export default TextCycler;
