
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  Volume2, 
  Settings, 
  Activity, 
  Users, 
  Clock,
  TrendingUp,
  Building,
  Phone
} from 'lucide-react';
import Header from '@/components/layout/Header';

interface AIRequest {
  id: string;
  businessType: string;
  aiName: string;
  status: 'pending' | 'configured' | 'active';
  requestedAt: string;
  industry: string;
}

const VoiceManagement = () => {
  const [aiRequests, setAIRequests] = useState<AIRequest[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeAIs: 0,
    pendingConfigurations: 0,
    averageSetupTime: 0
  });

  useEffect(() => {
    // Simuler des données de démonstration
    const mockRequests: AIRequest[] = [
      {
        id: '1',
        businessType: 'Restaurant',
        aiName: 'Clara',
        status: 'active',
        requestedAt: '2024-01-15T10:30:00Z',
        industry: 'Restauration'
      },
      {
        id: '2',
        businessType: 'Hôtel',
        aiName: 'Sophie',
        status: 'configured',
        requestedAt: '2024-01-14T15:45:00Z',
        industry: 'Hôtellerie'
      },
      {
        id: '3',
        businessType: 'Clinique',
        aiName: 'Marie',
        status: 'pending',
        requestedAt: '2024-01-13T09:15:00Z',
        industry: 'Santé'
      }
    ];

    setAIRequests(mockRequests);
    setStats({
      totalRequests: mockRequests.length,
      activeAIs: mockRequests.filter(r => r.status === 'active').length,
      pendingConfigurations: mockRequests.filter(r => r.status === 'pending').length,
      averageSetupTime: 12
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'configured': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'configured': return 'Configuré';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Restauration': return Building;
      case 'Hôtellerie': return Building;
      case 'Santé': return Activity;
      default: return Building;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-electric-blue/10 rounded-xl">
                <Mic className="w-8 h-8 text-electric-blue" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Gestion Vocale</h1>
                <p className="text-gray-600 text-lg">Administration et monitoring des IA configurées</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">IA Actives</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.activeAIs}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En Attente</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pendingConfigurations}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.averageSetupTime}min</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Requests Table */}
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-electric-blue" />
                <span>Demandes de Configuration IA</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IA</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Secteur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Demandé le</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100">
                    {aiRequests.map((request) => {
                      const IndustryIcon = getIndustryIcon(request.industry);
                      return (
                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue/20 to-electric-blue/10 rounded-xl flex items-center justify-center">
                                <Mic className="w-5 h-5 text-electric-blue" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{request.aiName}</p>
                                <p className="text-sm text-gray-500">ID: {request.id}</p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <IndustryIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{request.industry}</span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-gray-700">{request.businessType}</span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(request.status)} font-medium`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </td>
                          
                          <td className="px-6 py-4">
                            <span className="text-gray-700">
                              {new Date(request.requestedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                              >
                                <Settings className="w-4 h-4 mr-1" />
                                Gérer
                              </Button>
                              
                              {request.status === 'active' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:border-emerald-300"
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Tester
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
