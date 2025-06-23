
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Clock, 
  TrendingUp, 
  Settings,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { getConfigurationByEmail, loading } = useAIConfiguration();
  const [config, setConfig] = useState<any>(null);
  const [email, setEmail] = useState('');

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
    const result = await getConfigurationByEmail(userEmail);
    if (result.success && result.data) {
      setConfig(result.data);
    }
  };

  const mockStats = {
    totalCalls: 47,
    successfulCalls: 44,
    avgDuration: '2:34',
    conversionRate: '93.6%'
  };

  const getStatusBadge = (status: string, trialExpires: string) => {
    const isExpired = new Date(trialExpires) < new Date();
    
    if (status === 'trial' && !isExpired) {
      return <Badge className="bg-blue-100 text-blue-800">Essai gratuit</Badge>;
    } else if (status === 'trial' && isExpired) {
      return <Badge variant="destructive">Essai expiré</Badge>;
    } else if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
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
                Tableau de bord - {config.ai_name}
              </h1>
              <p className="text-graphite-600">
                {config.business_name} • {config.business_type}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(config.status, config.trial_expires_at)}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>

          {config.status === 'trial' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-800">Période d'essai gratuite</p>
                      <p className="text-sm text-blue-600">
                        Expire le {new Date(config.trial_expires_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-electric-blue hover:bg-blue-600">
                    Passer au Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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

        {/* Configuration actuelle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuration actuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-graphite-600">Nom de l'IA</label>
                <p className="text-lg font-semibold text-deep-black">{config.ai_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-graphite-600">Ton de voix</label>
                <p className="text-deep-black">{config.tone || 'Professionnel'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-graphite-600">Langue</label>
                <p className="text-deep-black">{config.language || 'Français'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-graphite-600">Cas d'usage</label>
                <p className="text-deep-black">{config.use_case || 'Accueil téléphonique'}</p>
              </div>
              <Button variant="outline" className="w-full">
                Modifier la configuration
              </Button>
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
                    <span className="text-sm">Rendez-vous programmé</span>
                  </div>
                  <span className="text-xs text-graphite-500">Il y a 4h</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Configuration mise à jour</span>
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
