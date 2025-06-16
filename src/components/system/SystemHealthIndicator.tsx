
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export const SystemHealthIndicator = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);

  useEffect(() => {
    const performHealthChecks = async () => {
      const checks: HealthCheck[] = [];

      // Test connexion Supabase
      try {
        const { error } = await supabase.from('business_profiles').select('count', { count: 'exact', head: true });
        checks.push({
          name: 'Base de données',
          status: error ? 'error' : 'success',
          message: error ? 'Connexion échouée' : 'Connexion établie'
        });
      } catch {
        checks.push({
          name: 'Base de données',
          status: 'error',
          message: 'Impossible de se connecter'
        });
      }

      // Test authentification
      try {
        const { data: { session } } = await supabase.auth.getSession();
        checks.push({
          name: 'Authentification',
          status: session ? 'success' : 'warning',
          message: session ? 'Utilisateur connecté' : 'Non authentifié'
        });
      } catch {
        checks.push({
          name: 'Authentification',
          status: 'error',
          message: 'Erreur d\'authentification'
        });
      }

      // Test des API credentials (simulé)
      const hasApiKeys = !!(
        import.meta.env.VITE_OPENAI_API_KEY || 
        import.meta.env.VITE_ELEVENLABS_API_KEY
      );
      
      checks.push({
        name: 'Configuration API',
        status: hasApiKeys ? 'success' : 'warning',
        message: hasApiKeys ? 'Clés API configurées' : 'Clés API manquantes'
      });

      setHealthChecks(checks);
    };

    performHealthChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const overallStatus = healthChecks.some(c => c.status === 'error') ? 'error' :
                      healthChecks.some(c => c.status === 'warning') ? 'warning' : 'success';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="w-5 h-5 mr-2" />
          État du système
          {getStatusIcon(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{check.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{check.message}</span>
                {getStatusIcon(check.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
