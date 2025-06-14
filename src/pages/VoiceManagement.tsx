
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Phone, PhoneCall, Settings, Activity, Volume2 } from "lucide-react";
import Header from "@/components/layout/Header";

const VoiceManagement = () => {
  const { toast } = useToast();
  const [twilioNumber, setTwilioNumber] = useState('');
  const [testNumber, setTestNumber] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('pFZP5JQG7iQjIQuC4Bku'); // Lily par défaut
  const [isTestCalling, setIsTestCalling] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Voix ElevenLabs optimisées pour le français
  const elevenLabsVoices = [
    { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Voix féminine française, professionnelle' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Voix féminine française, chaleureuse' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Voix féminine anglaise, claire' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Voix féminine anglaise, amicale' },
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Voix masculine française, professionnelle' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Voix masculine anglaise, énergique' },
  ];

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

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    
    try {
      const response = await fetch('https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/elevenlabs-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Bonjour, je suis votre assistante vocale Thalya. Comment puis-je vous aider aujourd'hui ?",
          voiceId: selectedVoice
        }),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
        
        toast({
          title: "Test vocal réussi",
          description: "La voix sélectionnée a été testée avec succès.",
        });
      } else {
        throw new Error('Erreur lors du test vocal');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de tester la voix. Vérifiez votre clé API ElevenLabs.",
        variant: "destructive"
      });
    } finally {
      setIsTestingVoice(false);
    }
  };

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
                Gestion Vocale Thalya
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
              Configurez et gérez votre agent IA réceptionniste vocal avec ElevenLabs
            </p>
          </div>

          {/* Configuration des voix ElevenLabs */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-deep-black flex items-center">
                <Volume2 className="w-6 h-6 mr-2 text-electric-blue" />
                Configuration Vocale ElevenLabs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ ElevenLabs intégré</h3>
                <p className="text-green-700 text-sm">
                  Votre système utilise maintenant ElevenLabs pour une latence ultra-faible (200-400ms de gain) et une qualité vocale exceptionnelle.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="voice_selection">Sélection de la voix</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="border-graphite-300 focus:border-electric-blue">
                      <SelectValue placeholder="Choisir une voix" />
                    </SelectTrigger>
                    <SelectContent>
                      {elevenLabsVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-sm text-gray-500">{voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleTestVoice}
                  disabled={isTestingVoice}
                  variant="outline"
                  className="w-full"
                >
                  {isTestingVoice ? 'Test en cours...' : 'Tester la voix sélectionnée'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Twilio */}
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
                  <li><code>ELEVENLABS_API_KEY</code> - Votre clé API ElevenLabs (pour TTS)</li>
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

          {/* Test d'appel */}
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

          {/* Statut du système */}
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
                  <p className="text-sm text-green-600">Intégré</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  <p className="font-semibold text-yellow-800">OpenAI</p>
                  <p className="text-sm text-yellow-600">Configuration requise</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="font-semibold text-green-800">Edge Functions</p>
                  <p className="text-sm text-green-600">Déployées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
