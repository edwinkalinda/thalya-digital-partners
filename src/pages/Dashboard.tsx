
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  Package, 
  TrendingUp, 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  Calendar,
  Bell,
  LogOut,
  Edit3
} from "lucide-react";
import Header from '../components/layout/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [agents] = useState([
    {
      id: 1,
      name: "Clara",
      type: "Réceptionniste",
      icon: Phone,
      status: "active",
      calls: 127,
      satisfaction: 4.8,
      description: "Gère les appels entrants avec professionnalisme"
    },
    {
      id: 2,
      name: "Marcus",
      type: "Gestion Stock",
      icon: Package,
      status: "coming_soon",
      calls: 0,
      satisfaction: 0,
      description: "Optimise automatiquement vos niveaux de stock"
    },
    {
      id: 3,
      name: "Sophie",
      type: "Marketing",
      icon: TrendingUp,
      status: "coming_soon",
      calls: 0,
      satisfaction: 0,
      description: "Crée des campagnes marketing ciblées"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary" className="bg-graphite-100 text-graphite-600">Bientôt</Badge>;
      default:
        return <Badge variant="outline">Inactif</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-graphite-50">
      <Header />
      
      <div className="pt-16">
        {/* Dashboard Header */}
        <div className="bg-pure-white border-b border-graphite-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-deep-black mb-2">
                  Tableau de bord
                </h1>
                <p className="text-graphite-600">
                  Gérez vos agents IA et surveillez leurs performances
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-graphite-300">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="bg-electric-blue hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Agent
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appels traités</CardTitle>
                    <Phone className="h-4 w-4 text-electric-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Satisfaction client</CardTitle>
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8/5</div>
                    <p className="text-xs text-muted-foreground">Excellent score de satisfaction</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agents actifs</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1/3</div>
                    <p className="text-xs text-muted-foreground">2 agents en développement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Les dernières interactions de vos agents IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-graphite-50">
                        <Avatar>
                          <AvatarFallback className="bg-electric-blue text-white">C</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Clara a traité un appel</p>
                          <p className="text-xs text-muted-foreground">
                            Demande d'information produit - Durée: 3min 24s
                          </p>
                        </div>
                        <Badge variant="outline">Résolu</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-electric-blue/10 rounded-lg">
                              <IconComponent className="w-6 h-6 text-electric-blue" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{agent.name}</CardTitle>
                              <CardDescription>{agent.type}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(agent.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-graphite-600">{agent.description}</p>
                        
                        {agent.status === 'active' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Appels traités</span>
                              <span className="font-medium">{agent.calls}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Satisfaction</span>
                              <span className="font-medium">{agent.satisfaction}/5</span>
                            </div>
                            <Progress value={(agent.satisfaction / 5) * 100} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          {agent.status === 'active' ? (
                            <>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Settings className="w-4 h-4 mr-2" />
                                Configurer
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1" disabled>
                              En développement
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics détaillées</CardTitle>
                  <CardDescription>Analysez les performances de vos agents IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-graphite-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-graphite-700 mb-2">
                      Analytics avancées
                    </h3>
                    <p className="text-graphite-500 mb-4">
                      Visualisez les métriques détaillées de performance de vos agents
                    </p>
                    <Button className="bg-electric-blue hover:bg-blue-600">
                      Voir les analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>Gérez vos préférences et votre profil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Profil utilisateur
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Préférences
                  </Button>
                  <hr className="my-4" />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => navigate('/')}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
