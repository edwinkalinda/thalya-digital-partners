
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  MicOff, 
  Settings, 
  Activity,
  Phone,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import Header from '@/components/layout/Header';

const VoiceManagement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [callsToday, setCallsToday] = useState(47);
  const [successRate, setSuccessRate] = useState(94);

  // Simuler les secteurs avec demandes IA
  const sectors = [
    { 
      name: 'Restaurant', 
      icon: '🍽️', 
      aiRequested: true, 
      status: 'Configuré',
      calls: 23,
      bookings: 18
    },
    { 
      name: 'Hôtel', 
      icon: '🏨', 
      aiRequested: false, 
      status: 'Disponible',
      calls: 0,
      bookings: 0
    },
    { 
      name: 'Clinique', 
      icon: '🏥', 
      aiRequested: true, 
      status: 'En test',
      calls: 12,
      bookings: 8
    },
    { 
      name: 'Dentiste', 
      icon: '🦷', 
      aiRequested: false, 
      status: 'Disponible',
      calls: 0,
      bookings: 0
    }
  ];

  const recentCalls = [
    { time: '14:32', type: 'Restaurant', status: 'Réservation confirmée', duration: '2m 15s' },
    { time: '14:18', type: 'Clinique', status: 'RDV programmé', duration: '1m 43s' },
    { time: '13:55', type: 'Restaurant', status: 'Informations données', duration: '45s' },
    { time: '13:21', type: 'Clinique', status: 'RDV reprogrammé', duration: '3m 02s' }
  ];

  return (
    <div className="min-h-screen bg-graphite-50">
      <Header />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            
            {/* En-tête */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-deep-black mb-2">
                Gestion vocale
              </h1>
              <p className="text-sm text-graphite-600">
                Surveillez et gérez vos assistants IA
              </p>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-graphite-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-electric-blue/10 rounded-lg">
                      <Phone className="w-4 h-4 text-electric-blue" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-deep-black">{callsToday}</div>
                      <div className="text-xs text-graphite-600">Appels aujourd'hui</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-graphite-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-deep-black">{successRate}%</div>
                      <div className="text-xs text-graphite-600">Taux de succès</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-graphite-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-deep-black">26</div>
                      <div className="text-xs text-graphite-600">RDV programmés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-graphite-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-deep-black">3</div>
                      <div className="text-xs text-graphite-600">IA actives</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="sectors" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-graphite-200">
                <TabsTrigger value="sectors" className="text-sm">Secteurs</TabsTrigger>
                <TabsTrigger value="calls" className="text-sm">Appels récents</TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="sectors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectors.map((sector, index) => (
                    <Card key={index} className="border-graphite-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{sector.icon}</span>
                            <div>
                              <div className="font-medium text-deep-black text-sm">{sector.name}</div>
                              <div className="text-xs text-graphite-600">{sector.status}</div>
                            </div>
                          </div>
                          {sector.aiRequested && (
                            <Badge variant="secondary" className="bg-electric-blue/10 text-electric-blue text-xs">
                              IA demandée
                            </Badge>
                          )}
                        </div>
                        
                        {sector.aiRequested && (
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="text-graphite-600">Appels</div>
                              <div className="font-semibold text-deep-black">{sector.calls}</div>
                            </div>
                            <div>
                              <div className="text-graphite-600">Réservations</div>
                              <div className="font-semibold text-deep-black">{sector.bookings}</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calls">
                <Card className="border-graphite-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-deep-black">
                      Appels récents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentCalls.map((call, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-graphite-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="text-xs text-graphite-500 w-12">{call.time}</div>
                            <div>
                              <div className="text-sm font-medium text-deep-black">{call.status}</div>
                              <div className="text-xs text-graphite-600">{call.type}</div>
                            </div>
                          </div>
                          <div className="text-xs text-graphite-500">{call.duration}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-graphite-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-deep-black">
                      Contrôles système
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-deep-black">Mode écoute</div>
                        <div className="text-xs text-graphite-600">Activer/désactiver la réception d'appels</div>
                      </div>
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className="text-xs"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-3 h-3 mr-1" />
                            Arrêter
                          </>
                        ) : (
                          <>
                            <Mic className="w-3 h-3 mr-1" />
                            Démarrer
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-deep-black">Configuration IA</div>
                        <div className="text-xs text-graphite-600">Modifier les paramètres des assistants</div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Configurer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
