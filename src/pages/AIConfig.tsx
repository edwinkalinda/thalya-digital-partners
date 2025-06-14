import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Bot, Save, Plus } from "lucide-react";
import Header from "@/components/layout/Header";

interface ThalyaConfig {
  id?: string;
  business_name: string;
  industry: string;
  target_audience: string;
  main_products_services: string;
  tone_of_voice: string;
}

const AIConfig = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ThalyaConfig[]>([]);
  const [currentConfig, setCurrentConfig] = useState<ThalyaConfig>({
    business_name: '',
    industry: '',
    target_audience: '',
    main_products_services: '',
    tone_of_voice: 'Professionnel'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toneOptions = [
    { value: 'Professionnel', label: 'Professionnel' },
    { value: 'Amical', label: 'Amical' },
    { value: 'Décontracté', label: 'Décontracté' },
    { value: 'Formel', label: 'Formel' },
    { value: 'Enthousiaste', label: 'Enthousiaste' },
    { value: 'Bienveillant', label: 'Bienveillant' }
  ];

  const industryOptions = [
    'Technologie',
    'Santé',
    'Finance',
    'Commerce de détail',
    'Éducation',
    'Immobilier',
    'Restauration',
    'Services',
    'Manufacturing',
    'Autre'
  ];

  useEffect(() => {
    if (user) {
      fetchConfigs();
    }
  }, [user]);

  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('thalya_connect_configs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error: any) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les configurations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !currentConfig.business_name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'entreprise est requis.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const configData = {
        ...currentConfig,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingId) {
        result = await supabase
          .from('thalya_connect_configs')
          .update(configData)
          .eq('id', editingId)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('thalya_connect_configs')
          .insert(configData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Succès",
        description: editingId ? "Configuration mise à jour." : "Configuration créée.",
      });

      await fetchConfigs();
      resetForm();
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentConfig({
      business_name: '',
      industry: '',
      target_audience: '',
      main_products_services: '',
      tone_of_voice: 'Professionnel'
    });
    setEditingId(null);
  };

  const editConfig = (config: ThalyaConfig) => {
    setCurrentConfig(config);
    setEditingId(config.id || null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-electric-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-electric-blue mr-4" />
              <h1 className="text-4xl font-bold text-deep-black">
                Configuration de vos Agents IA
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
              Personnalisez la personnalité et le comportement de vos agents IA Thalya
            </p>
          </div>

          {/* Configuration Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-deep-black flex items-center">
                <Plus className="w-6 h-6 mr-2 text-electric-blue" />
                {editingId ? 'Modifier la configuration' : 'Nouvelle configuration'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Nom de l'entreprise *</Label>
                  <Input
                    id="business_name"
                    value={currentConfig.business_name}
                    onChange={(e) => setCurrentConfig({...currentConfig, business_name: e.target.value})}
                    placeholder="Ex: Restaurant Le Gourmet"
                    className="border-graphite-300 focus:border-electric-blue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <Select 
                    value={currentConfig.industry} 
                    onValueChange={(value) => setCurrentConfig({...currentConfig, industry: value})}
                  >
                    <SelectTrigger className="border-graphite-300 focus:border-electric-blue">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_audience">Audience cible</Label>
                  <Input
                    id="target_audience"
                    value={currentConfig.target_audience}
                    onChange={(e) => setCurrentConfig({...currentConfig, target_audience: e.target.value})}
                    placeholder="Ex: Familles, professionnels, jeunes adultes..."
                    className="border-graphite-300 focus:border-electric-blue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone_of_voice">Ton de voix</Label>
                  <Select 
                    value={currentConfig.tone_of_voice} 
                    onValueChange={(value) => setCurrentConfig({...currentConfig, tone_of_voice: value})}
                  >
                    <SelectTrigger className="border-graphite-300 focus:border-electric-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_products_services">Produits et services principaux</Label>
                <Textarea
                  id="main_products_services"
                  value={currentConfig.main_products_services}
                  onChange={(e) => setCurrentConfig({...currentConfig, main_products_services: e.target.value})}
                  placeholder="Décrivez vos principaux produits et services..."
                  className="border-graphite-300 focus:border-electric-blue min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving || !currentConfig.business_name.trim()}
                  className="bg-electric-blue hover:bg-blue-600 flex-1"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? 'Mettre à jour' : 'Sauvegarder'}
                </Button>
                
                {editingId && (
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="border-electric-blue text-electric-blue hover:bg-electric-blue/5"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Existing Configurations */}
          {configs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-deep-black">
                Configurations existantes
              </h2>
              <div className="grid gap-4">
                {configs.map((config) => (
                  <Card key={config.id} className="shadow-md border border-graphite-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-semibold text-deep-black">
                            {config.business_name}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-graphite-700">Secteur:</span>
                              <p className="text-graphite-600">{config.industry || 'Non spécifié'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-graphite-700">Ton:</span>
                              <p className="text-graphite-600">{config.tone_of_voice}</p>
                            </div>
                            <div>
                              <span className="font-medium text-graphite-700">Audience:</span>
                              <p className="text-graphite-600">{config.target_audience || 'Non spécifiée'}</p>
                            </div>
                          </div>
                          {config.main_products_services && (
                            <div className="mt-3">
                              <span className="font-medium text-graphite-700">Services:</span>
                              <p className="text-graphite-600 text-sm mt-1">
                                {config.main_products_services}
                              </p>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => editConfig(config)}
                          variant="outline"
                          size="sm"
                          className="ml-4 border-electric-blue text-electric-blue hover:bg-electric-blue/5"
                        >
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConfig;
