
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export const TwilioConfigCard = () => {
  const [twilioNumber, setTwilioNumber] = useState('');

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center">
          <Settings className="w-6 h-6 mr-2 text-electric-blue" />
          Configuration Twilio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Configuration requise</h3>
          <p className="text-yellow-700 text-sm">
            Pour activer la fonctionnalité vocale, vous devez configurer les variables d'environnement suivantes :
          </p>
          <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
            <li><code>TWILIO_ACCOUNT_SID</code> - Votre SID de compte Twilio</li>
            <li><code>TWILIO_AUTH_TOKEN</code> - Votre token d'authentification Twilio</li>
            <li><code>OPENAI_API_KEY</code> - Votre clé API OpenAI (pour Whisper STT)</li>
            <li><code>ELEVENLABS_API_KEY</code> - ✅ Votre clé API ElevenLabs (configurée)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="twilio_number">Numéro Twilio assigné</Label>
            <Input
              id="twilio_number"
              value={twilioNumber}
              onChange={(e) => setTwilioNumber(e.target.value)}
              placeholder="+33 1 XX XX XX XX"
              className="border-graphite-300 focus:border-electric-blue"
            />
            <p className="text-sm text-graphite-500 mt-1">
              Le numéro de téléphone Twilio configuré pour recevoir les appels
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
