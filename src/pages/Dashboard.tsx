
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Phone, Settings, BarChart3, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeAgents: 1,
    satisfaction: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalCalls: 142,
        activeAgents: 1,
        satisfaction: 4.8,
        monthlyGrowth: 23
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-deep-black">
              Tableau de bord Thalya
            </h1>
            <p className="text-xl text-graphite-600">
              Bienvenue {user?.user_metadata?.first_name || 'Admin'} ! Gérez vos assistantes IA
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Appels ce mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{stats.totalCalls}</div>
                <p className="text-sm text-blue-600">+{stats.monthlyGrowth}% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Agents actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{stats.activeAgents}</div>
                <p className="text-sm text-green-600">Clara en service</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{stats.satisfaction}/5</div>
                <p className="text-sm text-purple-600">Note moyenne clients</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Croissance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">+{stats.monthlyGrowth}%</div>
                <p className="text-sm text-orange-600">Ce mois vs précédent</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-electric-blue">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Gestion Vocale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-graphite-600 mb-4">
                  Testez et gérez vos interfaces de chat vocal avec Clara
                </p>
                <Link to="/voice-management">
                  <Button className="w-full bg-electric-blue hover:bg-blue-600">
                    Accéder
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Settings className="w-6 h-6 mr-2" />
                  Configuration IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-graphite-600 mb-4">
                  Personnalisez le comportement et la personnalité de Clara
                </p>
                <Link to="/ai-config">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Configurer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Brain className="w-6 h-6 mr-2" />
                  Nouvelle Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-graphite-600 mb-4">
                  Créez une nouvelle assistante IA personnalisée
                </p>
                <Link to="/onboarding">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Commencer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-deep-black">
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-graphite-50 rounded-lg">
                  <div>
                    <p className="font-medium text-deep-black">Clara a géré 12 appels</p>
                    <p className="text-sm text-graphite-600">Il y a 2 heures</p>
                  </div>
                  <div className="text-green-600 font-semibold">+12 appels</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-graphite-50 rounded-lg">
                  <div>
                    <p className="font-medium text-deep-black">Configuration mise à jour</p>
                    <p className="text-sm text-graphite-600">Il y a 1 jour</p>
                  </div>
                  <div className="text-blue-600 font-semibold">Modifié</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-graphite-50 rounded-lg">
                  <div>
                    <p className="font-medium text-deep-black">Nouveau client satisfait</p>
                    <p className="text-sm text-graphite-600">Il y a 2 jours</p>
                  </div>
                  <div className="text-purple-600 font-semibold">⭐ 5/5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
