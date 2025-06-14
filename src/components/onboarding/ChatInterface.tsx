
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

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
                <Bot className="w-5 h-5" />
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
