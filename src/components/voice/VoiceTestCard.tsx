import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Voix ElevenLabs optimisées pour le français avec qualité premium
const elevenLabsVoices = [
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Voix féminine française, professionnelle et naturelle' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Voix féminine française, chaleureuse et expressive' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Voix masculine française, claire et confiante' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Voix féminine premium, très naturelle' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Voix féminine douce et articulée' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Voix masculine énergique et dynamique' },
];

export const VoiceTestCard = () => {
  const { toast } = useToast();
  const [selectedVoice, setSelectedVoice] = useState('pFZP5JQG7iQjIQuC4Bku');
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testText, setTestText] = useState("Bonjour ! Je suis votre assistante Thalya, dotée d'une intelligence artificielle avancée. Je suis là pour vous accompagner avec professionnalisme et bienveillance. Comment puis-je vous aider aujourd'hui ?");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    const startTime = Date.now();
    
    try {
      console.log('Testing ElevenLabs voice:', selectedVoice);
      console.log('Test text:', testText);
      
      // Nettoyer l'URL précédente si elle existe
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: {
          text: testText,
          voiceId: selectedVoice
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      const processingTime = Date.now() - startTime;
      console.log(`Response received from ElevenLabs function in ${processingTime}ms`);

      // Vérifier si on a bien reçu les données audio en base64
      if (!data || !data.audioData) {
        console.error('Invalid response structure:', data);
        throw new Error('Données audio manquantes dans la réponse du serveur');
      }

      console.log('Base64 audio data length:', data.audioData.length);
      
      // Décoder le base64 en ArrayBuffer
      const binaryString = atob(data.audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log('Audio buffer size:', bytes.byteLength, 'bytes');
      
      if (bytes.byteLength === 0) {
        throw new Error('Buffer audio vide');
      }
      
      // Créer le blob audio
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);
      
      console.log('Audio URL created:', newAudioUrl);
      
      // Essayer de jouer l'audio
      try {
        const audio = new Audio(newAudioUrl);
        
        // Promesse pour gérer le chargement
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('canplay', () => {
            console.log('Audio can play, duration:', audio.duration);
            resolve();
          });
          
          audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            reject(new Error('Erreur de chargement audio'));
          });
          
          audio.load();
        });
        
        // Jouer l'audio
        await audio.play();
        
        toast({
          title: "Test vocal réussi ✅",
          description: `Voix ${elevenLabsVoices.find(v => v.id === selectedVoice)?.name} générée en ${processingTime}ms avec qualité optimisée.`,
        });
        
      } catch (playError) {
        console.error('Erreur de lecture audio:', playError);
        toast({
          title: "Audio généré ✅",
          description: "L'audio a été généré. Utilisez le bouton de téléchargement pour l'écouter.",
        });
      }
      
    } catch (error) {
      console.error('Voice test error:', error);
      toast({
        title: "Erreur de test vocal",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `thalya-voice-test-${selectedVoice}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Téléchargement lancé",
        description: "Le fichier audio a été téléchargé avec succès.",
      });
    } else {
      toast({
        title: "Aucun audio disponible",
        description: "Veuillez d'abord tester une voix pour générer l'audio.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center">
          <Play className="w-6 h-6 mr-2 text-electric-blue" />
          Test des Voix ElevenLabs (Optimisé)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">🚀 Version Optimisée</h3>
          <p className="text-green-700 text-sm">
            Utilise le modèle Turbo v2.5 d'ElevenLabs pour une latence ultra-faible (200-500ms) et une qualité vocale naturelle exceptionnelle.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="voice_selection">Sélection de la voix premium</Label>
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

          <div>
            <Label htmlFor="test_text">Texte de test (optimisé pour la naturalité)</Label>
            <Input
              id="test_text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Entrez le texte à tester..."
              className="border-graphite-300 focus:border-electric-blue"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestVoice}
              disabled={isTestingVoice || !testText.trim()}
              className="flex-1 bg-electric-blue hover:bg-blue-600"
            >
              {isTestingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération optimisée...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Tester la voix (Turbo v2.5)
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDownloadAudio}
              disabled={!audioUrl}
              variant="outline"
              className="flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>

          {audioUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                ✅ Audio généré avec succès ! Utilisez le bouton de téléchargement si la lecture automatique ne fonctionne pas.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
