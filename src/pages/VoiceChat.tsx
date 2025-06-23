
import { VoiceChatInterface } from '@/components/voice/VoiceChatInterface';
import Header from '@/components/layout/Header';

const VoiceChat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-deep-black mb-4">
                Chat Vocal avec Clara
              </h1>
              <p className="text-xl text-graphite-600">
                Conversation naturelle avec votre IA grâce à OpenAI Realtime
              </p>
            </div>
            
            <VoiceChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
