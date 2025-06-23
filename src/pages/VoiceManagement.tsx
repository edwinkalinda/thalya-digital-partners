
import { useState } from "react";
import { Phone, Mic, Users, BarChart3, Clock, Headphones } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const VoiceManagement = () => {
  const { toast } = useToast();
  const [activeCalls, setActiveCalls] = useState([
    { id: 1, caller: '+33 6 12 34 56 78', duration: '2:34', status: 'active', business: 'Restaurant Le Gourmet' },
    { id: 2, caller: '+33 1 45 67 89 12', duration: '1:12', status: 'active', business: 'Clinique Santé+' },
    { id: 3, caller: '+33 7 98 76 54 32', duration: '0:45', status: 'active', business: 'Hôtel Paradis' }
  ]);

  const [recentCalls, setRecentCalls] = useState([
    { id: 1, caller: '+33 6 11 22 33 44', time: '14:32', duration: '3:45', outcome: 'Réservation confirmée' },
    { id: 2, caller: '+33 1 55 66 77 88', time: '14:15', duration: '2:12', outcome: 'Informations données' },
    { id: 3, caller: '+33 7 99 88 77 66', time: '13:58', duration: '1:33', outcome: 'RDV programmé' }
  ]);

  const handleEndCall = (callId: number) => {
    setActiveCalls(prev => prev.filter(call => call.id !== callId));
    toast({
      title: "Appel terminé",
      description: "L'appel a été fermé avec succès",
    });
  };

  const handleListenCall = (callId: number) => {
    toast({
      title: "Écoute en cours",
      description: "Vous écoutez maintenant cet appel",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-deep-black">
                  Gestion Vocale
                </h1>
                <p className="text-graphite-600">
                  Supervision des appels et performances - Accès administrateur
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appels actifs</p>
                    <p className="text-2xl font-bold text-green-600">{activeCalls.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-blue-600">47</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durée moy.</p>
                    <p className="text-2xl font-bold text-purple-600">2:34</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taux succès</p>
                    <p className="text-2xl font-bold text-orange-600">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Appels Actifs
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Appels en Cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <div>
                            <p className="font-medium">{call.caller}</p>
                            <p className="text-sm text-gray-600">{call.business}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {call.duration}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleListenCall(call.id)}
                            className="flex items-center gap-2"
                          >
                            <Headphones className="w-4 h-4" />
                            Écouter
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEndCall(call.id)}
                          >
                            Terminer
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {activeCalls.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Aucun appel actif en ce moment
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Appels Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-gray-400 rounded-full" />
                          <div>
                            <p className="font-medium">{call.caller}</p>
                            <p className="text-sm text-gray-600">{call.time} - {call.duration}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-blue-600">
                          {call.outcome}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
