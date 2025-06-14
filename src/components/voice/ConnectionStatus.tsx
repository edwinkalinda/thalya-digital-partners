
import { Button } from "@/components/ui/button";
import { Wifi, RefreshCw, Brain, Mic } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  isRecording: boolean;
  connectionError: string | null;
  onConnect: () => void;
}

export const ConnectionStatus = ({ 
  isConnected, 
  isConnecting, 
  isRecording, 
  connectionError,
  onConnect 
}: ConnectionStatusProps) => {
  if (connectionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Wifi className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-red-800 font-medium">Erreur:</span>
        </div>
        <p className="text-red-700 mt-1">{connectionError}</p>
        <Button 
          onClick={onConnect}
          disabled={isConnecting}
          size="sm"
          className="mt-2"
          variant="outline"
        >
          {isConnecting ? 'Reconnexion...' : 'Réessayer'}
        </Button>
      </div>
    );
  }

  if (!isConnected && !isConnecting) {
    return (
      <div className="text-center text-sm space-y-2">
        <p className="text-red-600 flex items-center justify-center">
          <Wifi className="w-4 h-4 mr-2" />
          ❌ Déconnecté de Gemini Pro
        </p>
        <Button onClick={onConnect} size="sm" variant="outline">
          Se connecter
        </Button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="text-center text-sm">
        <p className="text-blue-600 flex items-center justify-center animate-pulse">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          🔌 Connexion à Google Gemini Pro...
        </p>
      </div>
    );
  }

  if (isConnected && !isRecording) {
    return (
      <div className="text-center text-sm">
        <p className="text-green-600 flex items-center justify-center">
          <Brain className="w-4 h-4 mr-2" />
          ✅ Clara prête avec Google Gemini Pro
        </p>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="text-center text-sm">
        <p className="text-red-600 animate-pulse flex items-center justify-center">
          <Mic className="w-4 h-4 mr-2" />
          🎤 Clara vous écoute...
        </p>
      </div>
    );
  }

  return null;
};
