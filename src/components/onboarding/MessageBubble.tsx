
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  sender: 'ai' | 'user';
  text: string;
}

export function MessageBubble({ sender, text }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex w-full",
      sender === 'ai' ? 'justify-start' : 'justify-end'
    )}>
      <div
        className={cn(
          'inline-block px-4 py-3 rounded-2xl max-w-[80%] shadow-sm',
          sender === 'ai' 
            ? 'bg-pure-white border border-graphite-200 text-deep-black' 
            : 'bg-electric-blue text-pure-white'
        )}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
