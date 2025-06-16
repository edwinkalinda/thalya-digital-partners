
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { useOnboardingFlow } from './useOnboardingFlow';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';

export function OnboardingChat() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    startOnboarding,
    started,
    finished
  } = useOnboardingFlow();

  const { startRecording, stopRecording, recording } = useVoiceRecorder((text) => {
    setInput(text);
    // Auto-send after transcription
    setTimeout(() => handleSend(), 100);
  });

  const [playedPreview, setPlayedPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (finished && !playedPreview) {
      playVoicePreview();
    }
  }, [finished, playedPreview]);

  const playVoicePreview = async () => {
    try {
      const response = await fetch('/api/preview-voice');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        if (!audioRef.current) {
          audioRef.current = new Audio(url);
        }
        
        audioRef.current.src = url;
        await audioRef.current.play();
        setPlayedPreview(true);
      }
    } catch (error) {
      console.error('Failed to play voice preview:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-3xl font-bold text-deep-black">
            Configuration de Clara
          </h2>
          <p className="text-graphite-600">
            Je vais vous poser quelques questions pour personnaliser votre assistante IA selon vos besoins.
          </p>
          <Button 
            onClick={startOnboarding}
            className="bg-electric-blue hover:bg-blue-600 px-8 py-3 text-lg"
          >
            Commencer la configuration
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-deep-black">
            Configuration terminée !
          </h2>
          <p className="text-graphite-600">
            Clara est maintenant configurée selon vos préférences. Vous pouvez tester votre assistante vocale.
          </p>
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            🎵 Lecture de l'aperçu vocal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-graphite-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-graphite-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-graphite-200 p-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre réponse ou utilisez le micro..."
            className="flex-1 px-4 py-3 border border-graphite-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue"
            disabled={isLoading}
          />
          
          <Button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            variant={recording ? "destructive" : "outline"}
            size="icon"
            className={recording ? "animate-pulse" : ""}
          >
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-electric-blue hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
