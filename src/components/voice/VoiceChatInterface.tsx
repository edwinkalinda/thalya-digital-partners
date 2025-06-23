
import { RealtimeVoiceChat } from './RealtimeVoiceChat';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export const VoiceChatInterface = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl text-deep-black flex items-center">
            <Brain className="w-6 h-6 mr-2 text-electric-blue" />
            Chat Vocal Clara - OpenAI Realtime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-blue-800">
                🚀 OpenAI Realtime API
              </h3>
              <p className="text-sm text-blue-600">
                Conversation vocale ultra-rapide et naturelle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <p className="font-semibold text-blue-800">⚡ Ultra-rapide</p>
                <p className="text-blue-600">Latence minimale</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <p className="font-semibold text-purple-800">🎙️ Vocal temps réel</p>
                <p className="text-purple-600">Audio natif</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <p className="font-semibold text-green-800">🧠 GPT-4o</p>
                <p className="text-green-600">IA avancée</p>
              </div>
            </div>
          </div>
          
          <RealtimeVoiceChat />
        </CardContent>
      </Card>
    </div>
  );
};
