
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Activity, RefreshCw, Wifi, Mic, MicOff, MessageCircle } from "lucide-react";
import { useGoogleGenAILive } from '@/hooks/useGoogleGenAILive';
import { useState } from 'react';

export const GoogleGenAILiveChat = () => {
  const [textInput, setTextInput] = useState('');
  
  const {
    isRecording,
    isConnected,
    status,
    error,
    messages,
    startRecording,
    stopRecording,
    connect,
    disconnect,
    clearMessages
  } = useGoogleGenAILive();

  const handleSendText = () => {
    if (textInput.trim() && isConnected) {
      // Cette fonctionnalité nécessiterait l'implémentation complète de l'API Gemini Live
      console.log('Sending text to Gemini:', textInput);
      setTextInput('');
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isConnected) return 'text-green-600';
    if (status.includes('Connecting')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (error) return <Wifi className="w-4 h-4 text-red-500" />;
    if (isConnected) return <Activity className="w-4 h-4 text-green-500 animate-pulse" />;
    if (status.includes('Connecting')) return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    return <Wifi className="w-4 h-4 text-gray-500" />;
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-electric-blue" />
            Google GenAI Live - Clara
            {getStatusIcon()}
          </div>
          <div className="flex gap-2">
            <Button onClick={clearMessages} size="sm" variant="ghost">
              Clear
            </Button>
            {isConnected ? (
              <Button onClick={disconnect} size="sm" variant="outline">
                Déconnecter
              </Button>
            ) : (
              <Button onClick={connect} size="sm" className="bg-electric-blue hover:bg-blue-600">
                Connecter
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statut de connexion */}
        <div className="text-center">
          <div className={`p-4 rounded-lg border ${
            error ? 'bg-red-50 border-red-200' :
            isConnected ? 'bg-green-50 border-green-200' :
            status.includes('Connecting') ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <p className={`font-medium ${getStatusColor()}`}>
              {error || status}
            </p>
            {error && (
              <div className="mt-2 text-xs text-red-600">
                <p>• Vérifiez que VITE_GOOGLE_GENAI_API_KEY est configurée</p>
                <p>• Assurez-vous d'avoir accès à l'API Gemini 2.0 Flash</p>
              </div>
            )}
          </div>
        </div>

        {/* Informations sur Gemini 2.0 Flash Live */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-purple-800">
              🚀 Google Gemini 2.0 Flash Live
            </h3>
            <p className="text-sm text-purple-600">
              Audio natif temps réel avec Google GenAI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <p className="font-semibold text-purple-800">🎤 Audio Direct</p>
              <p className="text-purple-600">Pas de transcription intermédiaire</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <p className="font-semibold text-blue-800">⚡ Ultra Rapide</p>
              <p className="text-blue-600">Latence minimale native</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <p className="font-semibold text-green-800">🧠 Multimodal</p>
              <p className="text-green-600">Audio + Texte simultané</p>
            </div>
          </div>
        </div>

        {/* Zone de saisie texte */}
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Écrivez votre message à Clara..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
            disabled={!isConnected}
          />
          <Button 
            onClick={handleSendText}
            disabled={!isConnected || !textInput.trim()}
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Contrôles vocaux */}
        <div className="flex gap-2">
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isConnected}
            className={`flex-1 ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-electric-blue to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Arrêter l'enregistrement
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Parler à Clara (Live)
              </>
            )}
          </Button>
        </div>

        {/* Liste des messages */}
        {messages.length > 0 && (
          <div className="bg-white rounded-lg border p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-3 text-gray-800">Conversation</h4>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-50 border-l-4 border-blue-400 ml-8'
                      : 'bg-gray-50 border-l-4 border-gray-400 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm">
                      <span className="font-medium">
                        {message.type === 'user' ? '👤 Vous' : '🤖 Clara'}:
                      </span>{' '}
                      {message.text || 'Message vocal'}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note de développement */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 font-medium">🚧 En développement :</p>
          <p className="text-xs text-amber-700 mt-1">
            Cette interface utilise l'API Google GenAI native. L'implémentation complète du streaming audio bidirectionnel nécessite l'accès à l'API Gemini 2.0 Flash Live qui est actuellement en version expérimentale.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
