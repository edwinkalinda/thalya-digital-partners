
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VoiceTestButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTestingMic, setIsTestingMic] = useState(false);

  const testMicrophone = async () => {
    setIsTestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Microphone détecté !",
        description: "Votre microphone fonctionne correctement.",
      });
    } catch (error) {
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone. Vérifiez les permissions.",
        variant: "destructive"
      });
    } finally {
      setIsTestingMic(false);
    }
  };

  const goToVoiceTests = () => {
    navigate('/voice-management');
  };

  return (
    <Card className="mt-6 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg text-blue-900 flex items-center">
          <Play className="w-5 h-5 mr-2" />
          Tester l'IA maintenant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-blue-700 text-sm">
          Testez les capacités vocales de votre IA avant de finaliser la configuration
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={testMicrophone}
            disabled={isTestingMic}
            variant="outline"
            className="flex-1 border-blue-300 hover:bg-blue-100"
          >
            {isTestingMic ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Tester le micro
              </>
            )}
          </Button>
          
          <Button
            onClick={goToVoiceTests}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Tests vocaux avancés
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTestButton;
