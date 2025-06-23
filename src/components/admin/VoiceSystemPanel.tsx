
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, Phone, Mic, Server, RefreshCw } from 'lucide-react';

export const VoiceSystemPanel = () => {
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState({
    openai: 'connected',
    elevenlabs: 'connected',
    twilio: 'disconnected',
    gemini: 'connected'
  });

  const [stats, setStats] = useState({
    activeConnections: 3,
    totalCalls: 127,
    avgLatency: '150ms',
    uptime: '99.8%'
  });

  const refreshStatus = () => {
    toast({
      title: "Statut rafraîchi",
      description: "Vérification des services en cours...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Activity className="w-5 h-5" />
            Statut du Système
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshStatus} className="border-gray-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.openai)}`} />
              <span className="text-sm font-medium text-gray-700">OpenAI</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.elevenlabs)}`} />
              <span className="text-sm font-medium text-gray-700">ElevenLabs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.twilio)}`} />
              <span className="text-sm font-medium text-gray-700">Twilio</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.gemini)}`} />
              <span className="text-sm font-medium text-gray-700">Gemini</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">Connexions actives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">Appels total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">Latence moy.</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgLatency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4 bg-white">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
