
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  conversation: Message[];
  className?: string;
}

const ThalyaLogo = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="10%" stopColor="#e2e8f0" />
        <stop offset="25%" stopColor="#cbd5e1" />
        <stop offset="40%" stopColor="#94a3b8" />
        <stop offset="55%" stopColor="#64748b" />
        <stop offset="70%" stopColor="#475569" />
        <stop offset="85%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="chromeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="45%" stopColor="rgba(255,255,255,0.8)" />
        <stop offset="55%" stopColor="rgba(255,255,255,0.8)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="chromeShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
      </filter>
    </defs>
    
    {/* Boucle supérieure gauche */}
    <path d="M 30 70
             C 30 40, 60 40, 60 70
             C 60 85, 75 100, 100 100
             C 125 100, 140 85, 140 70
             C 140 40, 170 40, 170 70
             C 170 130, 100 130, 100 70
             C 100 55, 85 40, 70 40
             C 45 40, 30 55, 30 70 Z" 
          fill="url(#chromeGradient)"
          filter="url(#chromeShadow)" />
    
    {/* Boucle supérieure droite */}
    <path d="M 170 70
             C 170 40, 140 40, 140 70
             C 140 85, 125 100, 100 100
             C 75 100, 60 85, 60 70
             C 60 40, 30 40, 30 70
             C 30 130, 100 130, 100 70
             C 100 55, 115 40, 130 40
             C 155 40, 170 55, 170 70 Z" 
          fill="url(#chromeGradient)"
          filter="url(#chromeShadow)" />
    
    {/* Boucle inférieure gauche */}
    <path d="M 30 130
             C 30 160, 60 160, 60 130
             C 60 115, 75 100, 100 100
             C 125 100, 140 115, 140 130
             C 140 160, 170 160, 170 130
             C 170 70, 100 70, 100 130
             C 100 145, 85 160, 70 160
             C 45 160, 30 145, 30 130 Z" 
          fill="url(#chromeGradient)"
          filter="url(#chromeShadow)" />
    
    {/* Boucle inférieure droite */}
    <path d="M 170 130
             C 170 160, 140 160, 140 130
             C 140 115, 125 100, 100 100
             C 75 100, 60 115, 60 130
             C 60 160, 30 160, 30 130
             C 30 70, 100 70, 100 130
             C 100 145, 115 160, 130 160
             C 155 160, 170 145, 170 130 Z" 
          fill="url(#chromeGradient)"
          filter="url(#chromeShadow)" />
    
    {/* Zone centrale d'intersection */}
    <circle cx="100" cy="100" r="25" 
            fill="url(#chromeGradient)" 
            filter="url(#chromeShadow)" />
    
    {/* Reflet chrome sur le dessus */}
    <ellipse cx="100" cy="80" rx="60" ry="8" 
             fill="url(#chromeHighlight)" 
             opacity="0.6" />
  </svg>
);

const ChatInterface = ({ conversation, className }: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className={cn("flex flex-col", className)}>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-4 animate-fade-in",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'ai' 
                ? "bg-electric-blue text-pure-white" 
                : "bg-graphite-200 text-graphite-700"
            )}>
              {msg.role === 'ai' ? (
                <ThalyaLogo className="w-6 h-6" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            {/* Message */}
            <div className={cn(
              "max-w-xs lg:max-w-md xl:max-w-lg",
              msg.role === 'user' ? "text-right" : "text-left"
            )}>
              <div className={cn(
                "inline-block p-4 rounded-2xl shadow-sm",
                msg.role === 'ai'
                  ? "bg-pure-white border border-graphite-200 text-deep-black"
                  : "bg-electric-blue text-pure-white"
              )}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
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
