
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

const ThalyaIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM8 4C8 6.20914 9.79086 8 12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4Z" 
      fill="currentColor"
    />
    <path 
      d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20ZM16 20C16 17.7909 14.2091 16 12 16C9.79086 16 8 17.7909 8 20C8 22.2091 9.79086 24 12 24C14.2091 24 16 22.2091 16 20Z" 
      fill="currentColor"
    />
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
                <ThalyaIcon className="w-5 h-5" />
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
