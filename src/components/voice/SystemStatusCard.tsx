
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const SystemStatusCard = () => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center">
          <Activity className="w-6 h-6 mr-2 text-electric-blue" />
          Statut du système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-yellow-800">Twilio</p>
            <p className="text-sm text-yellow-600">Configuration requise</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-green-800">ElevenLabs</p>
            <p className="text-sm text-green-600">✅ Intégré</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-yellow-800">OpenAI</p>
            <p className="text-sm text-yellow-600">Configuration requise</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-green-800">Edge Functions</p>
            <p className="text-sm text-green-600">✅ Déployées</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
