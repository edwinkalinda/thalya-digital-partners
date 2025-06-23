
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Clock, 
  TrendingUp, 
  Settings,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Play,
  Edit3,
  Save,
  X
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');

  // États pour l'édition
  const [editForm, setEditForm] = useState({
    business_name: '',
    preferred_tone: '',
    spoken_languages: [],
    intro_prompt: '',
    business_type: ''
  });

  useEffect(() => {
    // Récupérer l'email depuis localStorage ou demander à l'utilisateur
    const storedSignup = localStorage.getItem('thalya_signup_data');
    if (storedSignup) {
      const signupData = JSON.parse(storedSignup);
      setEmail(signupData.email);
      loadConfiguration(signupData.email);
    } else {
      // Rediriger vers la page d'accueil si pas de données
      navigate('/');
    }
  }, [navigate]);

  const loadConfiguration = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('owner_email', userEmail)
        .single();

      if (error) {
        console.error('Erreur chargement config:', error);
        setConfig(null);
      } else {
        setConfig(data);
        setEditForm({
          business_name: data.business_name || '',
          preferred_tone: data.preferred_tone || '',
          spoken_languages: data.spoken_languages || [],
          intro_prompt: data.intro_prompt || '',
          business_type: data.business_type || ''
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          business_name: editForm.business_name,
          preferred_tone: editForm.preferred_tone,
          spoken_languages: editForm.spoken_languages,
          intro_prompt: editForm.intro_prompt,
          business_type: editForm.business_type
        })
        .eq('id', config.id);

      if (error) throw error;

      setConfig(prev => ({ ...prev, ...editForm }));
      setEditing(false);
      toast({
        title: "✅ Configuration mise à jour",
        description: "Votre IA a été mise à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const testAI = () => {
    toast({
      title: "🎙️ Test IA",
      description: "Fonctionnalité de test en cours de développement",
    });
  };

  const mockStats = {
    totalCalls: 47,
    successfulCalls: 44,
    avgDuration: '2:34',
    conversionRate: '93.6%'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16 container mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-deep-black mb-4">Configuration introuvable</h1>
          <p className="text-graphite-600 mb-6">
            Nous n'avons pas trouvé votre configuration IA. Veuillez d'abord configurer votre IA.
          </p>
          <Button onClick={() => navigate('/')} className="bg-electric-blue hover:bg-blue-600">
            Configurer mon IA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-12">
        {/* Header du dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-deep-black">
                Dashboard - {config.business_name}
              </h1>
              <p className="text-graphite-600">
                {config.business_type} • Configuration IA
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
              <Button onClick={testAI} variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Tester l'IA
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des appels</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                +12% depuis la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appels réussis</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.successfulCalls}</div>
              <p className="text-xs text-muted-foreground">
                Taux de réussite: {mockStats.conversionRate}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.avgDuration}</div>
              <p className="text-xs text-muted-foreground">
                -15s depuis hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">
                Basé sur 23 retours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration IA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configuration IA
                </CardTitle>
                {!editing ? (
                  <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={saveConfiguration} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-1" />
                      Sauver
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Nom de l'entreprise</label>
                    <p className="text-lg font-semibold text-deep-black">{config.business_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Type d'activité</label>
                    <p className="text-deep-black">{config.business_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Ton de voix</label>
                    <p className="text-deep-black">{config.preferred_tone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Langues</label>
                    <p className="text-deep-black">{config.spoken_languages?.join(', ')}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Nom de l'entreprise</label>
                    <Input
                      value={editForm.business_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Type d'activité</label>
                    <Input
                      value={editForm.business_type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, business_type: e.target.value }))}
                      placeholder="Type d'activité"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Ton de voix</label>
                    <Select value={editForm.preferred_tone} onValueChange={(value) => setEditForm(prev => ({ ...prev, preferred_tone: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un ton" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professionnel">Professionnel</SelectItem>
                        <SelectItem value="Amical">Amical</SelectItem>
                        <SelectItem value="Formel">Formel</SelectItem>
                        <SelectItem value="Décontracté">Décontracté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-graphite-600">Instructions personnalisées</label>
                    <Textarea
                      value={editForm.intro_prompt}
                      onChange={(e) => setEditForm(prev => ({ ...prev, intro_prompt: e.target.value }))}
                      placeholder="Instructions spécifiques pour votre IA..."
                      rows={3}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Appel entrant traité</span>
                  </div>
                  <span className="text-xs text-graphite-500">Il y a 2h</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Configuration mise à jour</span>
                  </div>
                  <span className="text-xs text-graphite-500">Il y a 4h</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Nouvelle interaction client</span>
                  </div>
                  <span className="text-xs text-graphite-500">Hier</span>
                </div>
                <Button variant="ghost" className="w-full text-electric-blue">
                  Voir toute l'activité
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
