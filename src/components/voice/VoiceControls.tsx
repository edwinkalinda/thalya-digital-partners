
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, MessageCircle, RefreshCw, Activity } from "lucide-react";

interface VoiceControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendText: (text: string) => void;
  onConnect: () => void;
}

export const VoiceControls = ({ 
  isConnected, 
  isConnecting, 
  isRecording,
  onStartRecording,
  onStopRecording,
  onSendText,
  onConnect
}: VoiceControlsProps) => {
  const [textInput, setTextInput] = useState('');

  const handleSendText = () => {
    if (textInput.trim()) {
      onSendText(textInput);
      setTextInput('');
    }
  };

  return (
    <div className="space-y-4">
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
          onClick={isRecording ? onStopRecording : onStartRecording}
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
              Parler à Clara
            </>
          )}
        </Button>

        <Button 
          onClick={onConnect}
          disabled={isConnected || isConnecting}
          variant="outline"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              Connexion...
            </>
          ) : isConnected ? (
            <>
              <Activity className="w-4 h-4 mr-1 text-green-500" />
              Connecté
            </>
          ) : (
            'Reconnecter'
          )}
        </Button>
      </div>
    </div>
  );
};
