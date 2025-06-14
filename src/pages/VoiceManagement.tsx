
import { Phone } from "lucide-react";
import Header from "@/components/layout/Header";
import { VoiceTestCard } from "@/components/voice/VoiceTestCard";
import { TwilioConfigCard } from "@/components/voice/TwilioConfigCard";
import { VoiceCallTestCard } from "@/components/voice/VoiceCallTestCard";
import { SystemStatusCard } from "@/components/voice/SystemStatusCard";

const VoiceManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Phone className="w-12 h-12 text-electric-blue mr-4" />
              <h1 className="text-4xl font-bold text-deep-black">
                Test Système Vocal Thalya
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
              Testez et configurez votre agent IA réceptionniste vocal avec ElevenLabs
            </p>
          </div>

          {/* Voice Testing */}
          <VoiceTestCard />

          {/* Twilio Configuration */}
          <TwilioConfigCard />

          {/* Voice Call Testing */}
          <VoiceCallTestCard />

          {/* System Status */}
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
