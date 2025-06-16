
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Save, TestTube, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    personality: '',
    tone: 'professional',
    language: 'fr',
    businessType: 'general',
    customInstructions: '',
    voiceSettings: {
      stability: 0.6,
      similarity: 0.8,
      style: 0.2
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Load existing config
    const savedConfig = localStorage.getItem('thalya-ai-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Default config
      setConfig(prev => ({
        ...prev,
        personality: 'Je suis Clara, votre assistante vocale professionnelle et amicale. Je suis là pour aider vos clients avec enthousiasme et efficacité.',
        customInstructions: 'Toujours saluer chaleureusement les clients, poser des questions précises pour comprendre leurs besoins, et fournir des informations claires et utiles.'
      }));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage (in real app, would save to backend)
      localStorage.setItem('thalya-ai-config', JSON.stringify(config));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ Configuration sauvegardée",
        description: "Les paramètres de Clara ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    }
    
    setIsSaving(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      // Simulate AI test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🧪 Test réussi",
        description: "Clara répond correctement avec la nouvelle configuration",
      });
    } catch (error) {
      toast({
        title: "❌ Test échoué",
        description: "Vérifiez votre configuration",
        variant: "destructive"
      });
    }
    
    setIsTesting(false);
  };

  const handleVoicePreview = async () => {
    try {
      const response = await fetch('/api/preview-voice');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await audio.play();
        
        toast({
          title: "🎵 Aperçu vocal",
          description: "Écoute de la voix de Clara",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de lire l'aperçu vocal",
        variant: "destructive"
      });
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
              <Brain className="w-12 h-12 text-electric-blue mr-4" />
              <h1 className="text-4xl font-bold text-deep-black">
                Configuration de Clara
              </h1>
            </div>
            <p className="text-xl text-graphite-600">
              Personnalisez le comportement et la personnalité de votre assistante IA
            </p>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personality & Behavior */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-electric-blue">
                  <Brain className="w-5 h-5 mr-2" />
                  Personnalité et Comportement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de la personnalité
                  </label>
                  <Textarea
                    value={config.personality}
                    onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                    placeholder="Décrivez la personnalité de Clara..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ton de conversation
                  </label>
                  <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professionnel</SelectItem>
                      <SelectItem value="friendly">Amical</SelectItem>
                      <SelectItem value="casual">Décontracté</SelectItem>
                      <SelectItem value="formal">Formel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'entreprise
                  </label>
                  <Select value={config.businessType} onValueChange={(value) => setConfig({ ...config, businessType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hotel">Hôtel</SelectItem>
                      <SelectItem value="clinic">Clinique</SelectItem>
                      <SelectItem value="dentist">Cabinet dentaire</SelectItem>
                      <SelectItem value="general">Général</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Instructions & Voice */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Instructions et Voix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions personnalisées
                  </label>
                  <Textarea
                    value={config.customInstructions}
                    onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                    placeholder="Instructions spécifiques pour Clara..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue principale
                  </label>
                  <Select value={config.language} onValueChange={(value) => setConfig({ ...config, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Paramètres vocaux
                  </label>
                  
                  <div>
                    <label className="text-xs text-gray-600">Stabilité: {config.voiceSettings.stability}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.voiceSettings.stability}
                      onChange={(e) => setConfig({
                        ...config,
                        voiceSettings: {
                          ...config.voiceSettings,
                          stability: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Similarité: {config.voiceSettings.similarity}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.voiceSettings.similarity}
                      onChange={(e) => setConfig({
                        ...config,
                        voiceSettings: {
                          ...config.voiceSettings,
                          similarity: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleVoicePreview}
                  variant="outline"
                  className="w-full"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Écouter un aperçu
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleTest}
              disabled={isTesting}
              variant="outline"
              className="px-8 py-3"
            >
              {isTesting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Test en cours...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Tester la config
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-electric-blue hover:bg-blue-600 px-8 py-3"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>

          {/* Preview Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-center text-deep-black">
                Aperçu de Clara
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-electric-blue rounded-full mx-auto flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <p className="text-graphite-700 italic">
                  "{config.personality || 'Configuration en cours...'}"
                </p>
                <div className="flex justify-center space-x-4 text-sm text-graphite-600">
                  <span>Ton: {config.tone}</span>
                  <span>•</span>
                  <span>Secteur: {config.businessType}</span>
                  <span>•</span>
                  <span>Langue: {config.language.toUpperCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;
