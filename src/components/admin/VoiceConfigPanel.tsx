
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, TestTube } from 'lucide-react';

export const VoiceConfigPanel = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    aiName: 'Clara',
    personality: 'professional',
    tone: 'friendly',
    language: 'fr',
    promptTemplate: 'Vous êtes Clara, une assistante IA professionnelle...',
    voiceSettings: {
      speed: '1.0',
      pitch: '0',
      stability: '0.5'
    }
  });

  const handleSave = () => {
    // Save configuration logic here
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres de Clara ont été mis à jour",
    });
  };

  const handleTest = () => {
    toast({
      title: "Test lancé",
      description: "Clara va répondre avec les nouveaux paramètres",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Settings className="w-5 h-5" />
            Configuration de l'IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Nom de l'IA</Label>
              <Input
                value={config.aiName}
                onChange={(e) => setConfig({ ...config, aiName: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label className="text-gray-700">Langue</Label>
              <Select value={config.language} onValueChange={(value) => setConfig({ ...config, language: value })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Personnalité</Label>
              <Select value={config.personality} onValueChange={(value) => setConfig({ ...config, personality: value })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnelle</SelectItem>
                  <SelectItem value="casual">Décontractée</SelectItem>
                  <SelectItem value="formal">Formelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700">Ton</Label>
              <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Amical</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="enthusiastic">Enthousiaste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-700">Template de prompt</Label>
            <Textarea
              value={config.promptTemplate}
              onChange={(e) => setConfig({ ...config, promptTemplate: e.target.value })}
              rows={4}
              className="font-mono text-sm border-gray-300"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
            <Button onClick={handleTest} variant="outline" className="flex items-center gap-2 border-gray-300">
              <TestTube className="w-4 h-4" />
              Tester
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
