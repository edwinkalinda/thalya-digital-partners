
import { Button } from "@/components/ui/button";
import { Wifi, RefreshCw, Brain, Mic, AlertCircle } from "lucide-react";

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
        <div className="flex items-center mb-2">
          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-red-800 font-medium">Erreur de connexion:</span>
        </div>
        <p className="text-red-700 text-sm mb-3">{connectionError}</p>
        <div className="text-xs text-red-600 mb-3">
          <p>• Vérifiez que les clés API sont configurées</p>
          <p>• GOOGLE_GEMINI_API_KEY pour Gemini 1.5 Flash</p>
          <p>• ELEVENLABS_API_KEY pour la synthèse vocale</p>
          <p>• OPENAI_API_KEY pour la transcription</p>
        </div>
        <Button 
          onClick={onConnect}
          disabled={isConnecting}
          size="sm"
          className="mt-2"
          variant="outline"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Reconnexion...
            </>
          ) : (
            'Réessayer'
          )}
        </Button>
      </div>
    );
  }

  if (!isConnected && !isConnecting) {
    return (
      <div className="text-center text-sm space-y-3">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 flex items-center justify-center mb-2">
            <Wifi className="w-4 h-4 mr-2" />
            ❌ Déconnecté de Clara (Gemini 1.5 Flash)
          </p>
          <Button onClick={onConnect} size="sm" className="bg-electric-blue hover:bg-blue-600">
            Se connecter à Clara
          </Button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="text-center text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 flex items-center justify-center animate-pulse">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            🔌 Connexion à Clara avec Gemini 1.5 Flash...
          </p>
        </div>
      </div>
    );
  }

  if (isConnected && !isRecording) {
    return (
      <div className="text-center text-sm">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 flex items-center justify-center">
            <Brain className="w-4 h-4 mr-2" />
            ✅ Clara prête avec Gemini 1.5 Flash
          </p>
          <p className="text-xs text-green-500 mt-1">
            Vous pouvez maintenant parler ou écrire à Clara
          </p>
        </div>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="text-center text-sm">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 animate-pulse flex items-center justify-center">
            <Mic className="w-4 h-4 mr-2" />
            🎤 Clara vous écoute...
          </p>
          <p className="text-xs text-red-500 mt-1">
            Parlez clairement, Clara analyse vos paroles
          </p>
        </div>
      </div>
    );
  }

  return null;
};
