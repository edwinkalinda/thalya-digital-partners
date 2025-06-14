
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PhoneCall } from "lucide-react";

export const VoiceCallTestCard = () => {
  const { toast } = useToast();
  const [testNumber, setTestNumber] = useState('');
  const [isTestCalling, setIsTestCalling] = useState(false);

  const handleTestCall = async () => {
    if (!testNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de téléphone pour le test.",
        variant: "destructive"
      });
      return;
    }

    setIsTestCalling(true);
    
    try {
      toast({
        title: "Test d'appel",
        description: "Fonctionnalité en cours de développement. Configuration Twilio requise.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initier l'appel test.",
        variant: "destructive"
      });
    } finally {
      setIsTestCalling(false);
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center">
          <PhoneCall className="w-6 h-6 mr-2 text-electric-blue" />
          Test de l'agent vocal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="test_number">Numéro de test</Label>
            <Input
              id="test_number"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="+33 6 XX XX XX XX"
              className="border-graphite-300 focus:border-electric-blue"
            />
            <p className="text-sm text-graphite-500 mt-1">
              Votre numéro pour tester l'agent vocal
            </p>
          </div>

          <Button 
            onClick={handleTestCall}
            disabled={isTestCalling || !testNumber}
            className="bg-electric-blue hover:bg-blue-600"
          >
            {isTestCalling ? 'Appel en cours...' : 'Lancer un appel test'}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">URL Webhook Twilio</h3>
          <p className="text-blue-700 text-sm mb-2">
            Configurez cette URL dans votre console Twilio pour les webhooks d'appels entrants :
          </p>
          <code className="bg-white border border-blue-300 rounded px-2 py-1 text-sm text-blue-800 block">
            https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/voice-call-handler
          </code>
        </div>
      </CardContent>
    </Card>
  );
};
