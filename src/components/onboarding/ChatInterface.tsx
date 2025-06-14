
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { createThalyaLogoSVG, svgToImageData } from '@/utils/createThalyaLogo';
import MetallicPaint from '@/components/ui/MetallicPaint';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  conversation: Message[];
  className?: string;
}

const ChatInterface = ({ conversation, className }: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [logoImageData, setLogoImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const svgString = createThalyaLogoSVG();
        const imageData = await svgToImageData(svgString);
        setLogoImageData(imageData);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };

    loadLogo();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6"
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 lg:gap-4 animate-fade-in",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
              msg.role === 'ai' 
                ? "bg-gradient-to-br from-electric-blue to-blue-600" 
                : "bg-graphite-200 text-graphite-700"
            )}>
              {msg.role === 'ai' ? (
                logoImageData ? (
                  <div className="w-full h-full relative">
                    <MetallicPaint 
                      imageData={logoImageData}
                      params={{
                        patternScale: 0.8,
                        refraction: 0.08,
                        edge: 0.9,
                        patternBlur: 0.001,
                        liquid: 0.2,
                        speed: 0.8,
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-pure-white rounded-full"></div>
                )
              ) : (
                <User className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </div>

            {/* Message */}
            <div className={cn(
              "max-w-[75%] lg:max-w-md",
              msg.role === 'user' ? "text-right" : "text-left"
            )}>
              <div className={cn(
                "inline-block p-3 lg:p-4 rounded-2xl shadow-sm break-words",
                msg.role === 'ai'
                  ? "bg-pure-white border border-graphite-200 text-deep-black"
                  : "bg-electric-blue text-pure-white"
              )}>
                <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
              <p className="text-xs text-graphite-500 mt-1 px-1">
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;
