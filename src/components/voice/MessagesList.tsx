
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause } from "lucide-react";
import { VoiceMessage } from "@/types/voice";

interface MessagesListProps {
  messages: VoiceMessage[];
  currentlyPlaying: string | null;
  onPlayAudio: (audioData: string, messageId: string) => void;
}

export const MessagesList = ({ messages, currentlyPlaying, onPlayAudio }: MessagesListProps) => {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.type === 'user'
              ? 'bg-blue-50 border-l-4 border-blue-500 ml-8'
              : 'bg-gray-50 border-l-4 border-green-500 mr-8'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`font-semibold ${
              message.type === 'user' ? 'text-blue-800' : 'text-green-800'
            }`}>
              {message.type === 'user' ? 'Vous' : 'Clara (Gemini Pro)'}
            </span>
            <div className="flex items-center text-xs text-gray-500 gap-2">
              {message.latency && (
                <span className={`flex items-center px-2 py-1 rounded ${
                  message.latency < 200 ? 'bg-green-100 text-green-800' : 
                  message.latency < 500 ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {message.latency}ms
                </span>
              )}
              {message.audioData && (
                <Button
                  onClick={() => onPlayAudio(message.audioData!, message.id)}
                  disabled={currentlyPlaying === message.id}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  {currentlyPlaying === message.id ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-700">{message.text}</p>
        </div>
      ))}
    </div>
  );
};
