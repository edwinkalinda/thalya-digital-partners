import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Brain, Plus, Settings, Trash2, Copy, Building } from 'lucide-react';
import { BusinessManager } from './BusinessManager';
import { AIConfig, Business } from '@/types/ai-config';

interface AIConfig {
  id: string;
  name: string;
  businessId: string;
  businessName: string;
  businessType: string;
  personality: string;
  tone: string;
  language: string;
  promptTemplate: string;
  voiceSettings: {
    speed: string;
    pitch: string;
    stability: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MultiAIManager = () => {
  const { toast } = useToast();
  const [aiConfigs, setAiConfigs] = useState<AIConfig[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showBusinessManager, setShowBusinessManager] = useState(false);
  
  const [newConfig, setNewConfig] = useState<Partial<AIConfig>>({
    name: '',
    businessId: '',
    businessName: '',
    businessType: '',
    personality: 'professional',
    tone: 'friendly',
    language: 'fr',
    promptTemplate: '',
    voiceSettings: {
      speed: '1.0',
      pitch: '0',
      stability: '0.5'
    },
    isActive: true
  });

  // Simuler le chargement des configurations existantes
  useEffect(() => {
    const mockConfigs: AIConfig[] = [
      {
        id: '1',
        name: 'Clara',
        businessId: '1',
        businessName: 'Restaurant Le Gourmet',
        businessType: 'Restaurant',
        personality: 'professional',
        tone: 'friendly',
        language: 'fr',
        promptTemplate: 'Vous êtes Clara, une assistante IA spécialisée dans les réservations pour Restaurant Le Gourmet...',
        voiceSettings: { speed: '1.0', pitch: '0', stability: '0.5' },
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        name: 'Sophie',
        businessId: '2',
        businessName: 'Clinique Saint-Louis',
        businessType: 'Clinique',
        personality: 'calm',
        tone: 'reassuring',
        language: 'fr',
        promptTemplate: 'Vous êtes Sophie, une assistante IA médicale pour la Clinique Saint-Louis...',
        voiceSettings: { speed: '0.9', pitch: '-2', stability: '0.7' },
        isActive: true,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18'
      }
    ];
    setAiConfigs(mockConfigs);
    setSelectedAI(mockConfigs[0]?.id || null);
  }, []);

  const personalities = [
    { value: 'professional', label: 'Professionnelle' },
    { value: 'casual', label: 'Décontractée' },
    { value: 'formal', label: 'Formelle' },
    { value: 'warm', label: 'Chaleureuse' },
    { value: 'calm', label: 'Apaisante' }
  ];

  const tones = [
    { value: 'friendly', label: 'Amical' },
    { value: 'neutral', label: 'Neutre' },
    { value: 'enthusiastic', label: 'Enthousiaste' },
    { value: 'reassuring', label: 'Rassurant' },
    { value: 'confident', label: 'Confiant' }
  ];

  const handleBusinessChange = (selectedBusinessId: string) => {
    const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
    if (selectedBusiness) {
      setNewConfig({
        ...newConfig,
        businessId: selectedBusiness.id,
        businessName: selectedBusiness.name,
        businessType: selectedBusiness.type
      });
    }
  };

  const handleCreateAI = () => {
    if (!newConfig.name || !newConfig.businessId) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom de l'IA et sélectionner un business",
        variant: "destructive"
      });
      return;
    }

    const config: AIConfig = {
      id: Date.now().toString(),
      name: newConfig.name!,
      businessId: newConfig.businessId!,
      businessName: newConfig.businessName!,
      businessType: newConfig.businessType!,
      personality: newConfig.personality || 'professional',
      tone: newConfig.tone || 'friendly',
      language: newConfig.language || 'fr',
      promptTemplate: newConfig.promptTemplate || `Vous êtes ${newConfig.name}, une assistante IA pour ${newConfig.businessName}...`,
      voiceSettings: newConfig.voiceSettings || { speed: '1.0', pitch: '0', stability: '0.5' },
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setAiConfigs([...aiConfigs, config]);
    setSelectedAI(config.id);
    setIsCreating(false);
    setNewConfig({
      name: '',
      businessId: '',
      businessName: '',
      businessType: '',
      personality: 'professional',
      tone: 'friendly',
      language: 'fr',
      promptTemplate: '',
      voiceSettings: { speed: '1.0', pitch: '0', stability: '0.5' },
      isActive: true
    });

    toast({
      title: "IA créée",
      description: `${config.name} a été configurée pour ${config.businessName}`,
    });
  };

  const handleUpdateConfig = (updatedConfig: AIConfig) => {
    setAiConfigs(aiConfigs.map(config => 
      config.id === updatedConfig.id 
        ? { ...updatedConfig, updatedAt: new Date().toISOString().split('T')[0] }
        : config
    ));
    
    toast({
      title: "Configuration mise à jour",
      description: `${updatedConfig.name} a été modifiée`,
    });
  };

  const handleDeleteAI = (id: string) => {
    const configName = aiConfigs.find(c => c.id === id)?.name;
    setAiConfigs(aiConfigs.filter(config => config.id !== id));
    if (selectedAI === id) {
      setSelectedAI(aiConfigs.find(c => c.id !== id)?.id || null);
    }
    
    toast({
      title: "IA supprimée",
      description: `${configName} a été supprimée`,
    });
  };

  const handleDuplicateAI = (id: string) => {
    const originalConfig = aiConfigs.find(c => c.id === id);
    if (!originalConfig) return;

    const duplicatedConfig: AIConfig = {
      ...originalConfig,
      id: Date.now().toString(),
      name: `${originalConfig.name} (Copie)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setAiConfigs([...aiConfigs, duplicatedConfig]);
    setSelectedAI(duplicatedConfig.id);
    
    toast({
      title: "IA dupliquée",
      description: `Copie de ${originalConfig.name} créée`,
    });
  };

  const selectedConfig = aiConfigs.find(config => config.id === selectedAI);

  return (
    <div className="space-y-6">
      {/* Bouton pour gérer les businesses */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowBusinessManager(!showBusinessManager)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Building className="w-4 h-4" />
          {showBusinessManager ? 'Masquer' : 'Gérer'} les Businesses
        </Button>
      </div>

      {/* Gestionnaire de businesses */}
      {showBusinessManager && (
        <BusinessManager onBusinessesChange={setBusinesses} />
      )}

      {/* Liste des IA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Mes IA Configurées ({aiConfigs.length})
            </CardTitle>
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle IA
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiConfigs.map((config) => (
              <div
                key={config.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAI === config.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAI(config.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateAI(config.id);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAI(config.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600 mb-1">{config.businessName}</p>
                <p className="text-sm text-gray-600 mb-1">{config.businessType}</p>
                <p className="text-xs text-gray-500">
                  {config.personality} • {config.tone}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    config.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {config.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Modifiée: {config.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom de l'IA *</Label>
                <Input
                  value={newConfig.name || ''}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  placeholder="Ex: Clara, Sophie, Marie..."
                />
              </div>
              <div>
                <Label>Business associé *</Label>
                <Select 
                  value={newConfig.businessId || ''} 
                  onValueChange={handleBusinessChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map(business => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name} ({business.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Personnalité</Label>
                <Select value={newConfig.personality || 'professional'} onValueChange={(value) => setNewConfig({ ...newConfig, personality: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personalities.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ton</Label>
                <Select value={newConfig.tone || 'friendly'} onValueChange={(value) => setNewConfig({ ...newConfig, tone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Langue</Label>
                <Select value={newConfig.language || 'fr'} onValueChange={(value) => setNewConfig({ ...newConfig, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Prompt personnalisé (optionnel)</Label>
              <Textarea
                value={newConfig.promptTemplate || ''}
                onChange={(e) => setNewConfig({ ...newConfig, promptTemplate: e.target.value })}
                placeholder="Définissez le comportement spécifique de cette IA..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAI}>Créer l'IA</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration détaillée de l'IA sélectionnée */}
      {selectedConfig && (
        <AIConfigEditor 
          config={selectedConfig} 
          businesses={businesses}
          onUpdate={handleUpdateConfig}
          personalities={personalities}
          tones={tones}
        />
      )}
    </div>
  );
};

interface AIConfigEditorProps {
  config: AIConfig;
  businesses: Business[];
  onUpdate: (config: AIConfig) => void;
  personalities: { value: string; label: string }[];
  tones: { value: string; label: string }[];
}

const AIConfigEditor = ({ config, businesses, onUpdate, personalities, tones }: AIConfigEditorProps) => {
  const { toast } = useToast();
  const [editedConfig, setEditedConfig] = useState<AIConfig>(config);

  useEffect(() => {
    setEditedConfig(config);
  }, [config]);

  const handleBusinessChange = (selectedBusinessId: string) => {
    const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
    if (selectedBusiness) {
      setEditedConfig({
        ...editedConfig,
        businessId: selectedBusiness.id,
        businessName: selectedBusiness.name,
        businessType: selectedBusiness.type
      });
    }
  };

  const handleSave = () => {
    onUpdate(editedConfig);
  };

  const handleTest = () => {
    toast({
      title: "Test lancé",
      description: `${editedConfig.name} va répondre avec les nouveaux paramètres pour ${editedConfig.businessName}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration de {editedConfig.name} - {editedConfig.businessName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prénom de l'IA</Label>
            <Input
              value={editedConfig.name}
              onChange={(e) => setEditedConfig({ ...editedConfig, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Business associé</Label>
            <Select value={editedConfig.businessId} onValueChange={handleBusinessChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {businesses.map(business => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name} ({business.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Personnalité</Label>
            <Select value={editedConfig.personality} onValueChange={(value) => setEditedConfig({ ...editedConfig, personality: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {personalities.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ton</Label>
            <Select value={editedConfig.tone} onValueChange={(value) => setEditedConfig({ ...editedConfig, tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Langue</Label>
            <Select value={editedConfig.language} onValueChange={(value) => setEditedConfig({ ...editedConfig, language: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Template de prompt</Label>
          <Textarea
            value={editedConfig.promptTemplate}
            onChange={(e) => setEditedConfig({ ...editedConfig, promptTemplate: e.target.value })}
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Paramètres vocaux</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <Label className="text-sm">Vitesse</Label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                value={editedConfig.voiceSettings.speed}
                onChange={(e) => setEditedConfig({
                  ...editedConfig,
                  voiceSettings: { ...editedConfig.voiceSettings, speed: e.target.value }
                })}
              />
            </div>
            <div>
              <Label className="text-sm">Hauteur</Label>
              <Input
                type="number"
                step="1"
                min="-20"
                max="20"
                value={editedConfig.voiceSettings.pitch}
                onChange={(e) => setEditedConfig({
                  ...editedConfig,
                  voiceSettings: { ...editedConfig.voiceSettings, pitch: e.target.value }
                })}
              />
            </div>
            <div>
              <Label className="text-sm">Stabilité</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={editedConfig.voiceSettings.stability}
                onChange={(e) => setEditedConfig({
                  ...editedConfig,
                  voiceSettings: { ...editedConfig.voiceSettings, stability: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedConfig.isActive}
              onChange={(e) => setEditedConfig({ ...editedConfig, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">IA active</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sauvegarder
          </Button>
          <Button onClick={handleTest} variant="outline" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Tester
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
