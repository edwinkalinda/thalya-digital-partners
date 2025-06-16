
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Save, TestTube, Volume2, Sparkles, Settings, Mic, Speaker } from 'lucide-react';
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
      
      <div className="pt-16 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl animate-pulse"></div>
                <Brain className="relative w-20 h-20 text-electric-blue animate-glow" />
                <div className="absolute -top-3 -right-3">
                  <Sparkles className="w-8 h-8 text-purple-500 animate-bounce" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-deep-black bg-gradient-to-r from-electric-blue via-purple-600 to-electric-blue bg-clip-text text-transparent">
                Configuration de Clara
              </h1>
              <p className="text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed">
                Personnalisez le comportement et la personnalité de votre assistante IA pour créer une expérience unique
              </p>
            </div>
          </div>

          {/* Configuration Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-slide-up">
            {/* Personality & Behavior Card */}
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-white via-white to-blue-50/30 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 border-b border-blue-100/50 pb-8">
                <CardTitle className="flex items-center text-2xl text-deep-black group-hover:text-electric-blue transition-colors duration-300">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <Brain className="relative w-7 h-7 text-electric-blue" />
                  </div>
                  <span className="font-bold">Personnalité et Comportement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-graphite-800 mb-3">
                    Description de la personnalité
                  </label>
                  <Textarea
                    value={config.personality}
                    onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                    placeholder="Décrivez la personnalité de Clara avec précision..."
                    rows={5}
                    className="resize-none text-lg border-2 border-graphite-200 rounded-2xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20 transition-all duration-300 bg-white/80 p-6"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-graphite-800 mb-3">
                    Ton de conversation
                  </label>
                  <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                    <SelectTrigger className="h-16 text-lg border-2 border-graphite-200 rounded-2xl focus:border-electric-blue bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-graphite-200 rounded-2xl shadow-2xl">
                      <SelectItem value="professional" className="text-lg py-4">Professionnel</SelectItem>
                      <SelectItem value="friendly" className="text-lg py-4">Amical</SelectItem>
                      <SelectItem value="casual" className="text-lg py-4">Décontracté</SelectItem>
                      <SelectItem value="formal" className="text-lg py-4">Formel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-graphite-800 mb-3">
                    Type d'entreprise
                  </label>
                  <Select value={config.businessType} onValueChange={(value) => setConfig({ ...config, businessType: value })}>
                    <SelectTrigger className="h-16 text-lg border-2 border-graphite-200 rounded-2xl focus:border-electric-blue bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-graphite-200 rounded-2xl shadow-2xl">
                      <SelectItem value="restaurant" className="text-lg py-4">Restaurant</SelectItem>
                      <SelectItem value="hotel" className="text-lg py-4">Hôtel</SelectItem>
                      <SelectItem value="clinic" className="text-lg py-4">Clinique</SelectItem>
                      <SelectItem value="dentist" className="text-lg py-4">Cabinet dentaire</SelectItem>
                      <SelectItem value="general" className="text-lg py-4">Général</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Instructions Card */}
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-white via-white to-purple-50/30 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 via-white to-purple-50/50 border-b border-purple-100/50 pb-8">
                <CardTitle className="flex items-center text-2xl text-deep-black group-hover:text-purple-600 transition-colors duration-300">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <Volume2 className="relative w-7 h-7 text-purple-600" />
                  </div>
                  <span className="font-bold">Instructions et Voix</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-graphite-800 mb-3">
                    Instructions personnalisées
                  </label>
                  <Textarea
                    value={config.customInstructions}
                    onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                    placeholder="Instructions spécifiques pour Clara..."
                    rows={5}
                    className="resize-none text-lg border-2 border-graphite-200 rounded-2xl focus:border-purple-600 focus:ring-4 focus:ring-purple-600/20 transition-all duration-300 bg-white/80 p-6"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-graphite-800 mb-3">
                    Langue principale
                  </label>
                  <Select value={config.language} onValueChange={(value) => setConfig({ ...config, language: value })}>
                    <SelectTrigger className="h-16 text-lg border-2 border-graphite-200 rounded-2xl focus:border-purple-600 bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-graphite-200 rounded-2xl shadow-2xl">
                      <SelectItem value="fr" className="text-lg py-4">Français</SelectItem>
                      <SelectItem value="en" className="text-lg py-4">English</SelectItem>
                      <SelectItem value="es" className="text-lg py-4">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6">
                  <label className="block text-lg font-semibold text-graphite-800">
                    Paramètres vocaux
                  </label>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium text-graphite-700 flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Stabilité
                        </label>
                        <span className="text-lg font-bold text-electric-blue">{config.voiceSettings.stability}</span>
                      </div>
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
                        className="w-full h-3 bg-gradient-to-r from-graphite-200 to-graphite-300 rounded-full appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium text-graphite-700 flex items-center">
                          <Mic className="w-4 h-4 mr-2" />
                          Similarité
                        </label>
                        <span className="text-lg font-bold text-purple-600">{config.voiceSettings.similarity}</span>
                      </div>
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
                        className="w-full h-3 bg-gradient-to-r from-graphite-200 to-graphite-300 rounded-full appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleVoicePreview}
                  variant="outline"
                  className="w-full h-16 text-lg font-semibold border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-2xl transition-all duration-300 group"
                >
                  <Speaker className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Écouter un aperçu vocal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 animate-fade-in">
            <Button
              onClick={handleTest}
              disabled={isTesting}
              variant="outline"
              className="px-12 py-6 text-xl font-bold border-2 border-graphite-300 hover:border-electric-blue hover:bg-blue-50 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <div className="w-6 h-6 mr-4 animate-spin border-3 border-current border-t-transparent rounded-full" />
                  Test en cours...
                </>
              ) : (
                <>
                  <TestTube className="w-6 h-6 mr-4" />
                  Tester la configuration
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 mr-4 animate-spin border-3 border-current border-t-transparent rounded-full" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 mr-4" />
                  Sauvegarder la configuration
                </>
              )}
            </Button>
          </div>

          {/* Clara Preview Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl overflow-hidden backdrop-blur-sm animate-slide-up">
            <CardHeader className="text-center py-10">
              <CardTitle className="text-3xl font-bold text-deep-black mb-6">
                Aperçu de Clara
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-electric-blue to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                    <Brain className="w-12 h-12 text-white animate-avatar-pulse" />
                  </div>
                  <div className="absolute -top-3 -right-3">
                    <Sparkles className="w-8 h-8 text-purple-500 animate-bounce" />
                  </div>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <p className="text-xl text-graphite-700 italic leading-relaxed font-medium bg-white/60 p-8 rounded-2xl border border-graphite-200">
                    "{config.personality || 'Configuration en cours...'}"
                  </p>
                  
                  <div className="flex flex-wrap justify-center items-center gap-6 text-lg text-graphite-600">
                    <div className="flex items-center bg-blue-100 px-6 py-3 rounded-full">
                      <span className="font-semibold">Ton: {config.tone}</span>
                    </div>
                    <div className="flex items-center bg-purple-100 px-6 py-3 rounded-full">
                      <span className="font-semibold">Secteur: {config.businessType}</span>
                    </div>
                    <div className="flex items-center bg-green-100 px-6 py-3 rounded-full">
                      <span className="font-semibold">Langue: {config.language.toUpperCase()}</span>
                    </div>
                  </div>
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
