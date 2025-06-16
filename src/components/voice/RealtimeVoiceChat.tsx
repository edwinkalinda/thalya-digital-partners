
import { useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Activity, RefreshCw, Wifi } from "lucide-react";

import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { ConnectionStatus } from './ConnectionStatus';
import { MessagesList } from './MessagesList';
import { PerformanceStats } from './PerformanceStats';
import { VoiceControls } from './VoiceControls';

export const RealtimeVoiceChat = () => {
  const { toast } = useToast();
  
  const {
    ws,
    isConnected,
    isConnecting,
    connectionError,
    messages,
    latencyStats,
    currentlyPlaying,
    connectWebSocket,
    disconnect,
    clearMessages,
    sendTextMessage,
    playAudioStreaming,
    cleanup: cleanupWebSocket
  } = useWebSocketConnection();

  const {
    isRecording,
    startRecording,
    stopRecording,
    cleanup: cleanupAudio
  } = useAudioRecording(ws, isConnected);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      cleanupWebSocket();
      cleanupAudio();
    };
  }, []);

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-2xl text-deep-black flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-electric-blue" />
            Chat Vocal Thalya
            {isConnected && <Activity className="w-4 h-4 ml-2 text-green-500 animate-pulse" />}
            {isConnecting && <RefreshCw className="w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            {!isConnected && !isConnecting && <Wifi className="w-4 h-4 ml-2 text-red-500" />}
          </div>
          <div className="flex gap-2">
            <Button onClick={clearMessages} size="sm" variant="ghost">
              Effacer
            </Button>
            {isConnected && (
              <Button onClick={disconnect} size="sm" variant="outline">
                Déconnecter
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statistiques de performance */}
        <PerformanceStats latencyStats={latencyStats} />

        {/* Contrôles vocaux et texte */}
        <VoiceControls
          isConnected={isConnected}
          isConnecting={isConnecting}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSendText={sendTextMessage}
          onConnect={connectWebSocket}
        />

        {/* Messages de conversation */}
        <MessagesList
          messages={messages}
          currentlyPlaying={currentlyPlaying}
          onPlayAudio={playAudioStreaming}
        />

        {/* Statut de connexion */}
        <ConnectionStatus
          isConnected={isConnected}
          isConnecting={isConnecting}
          isRecording={isRecording}
          connectionError={connectionError}
          onConnect={connectWebSocket}
        />
      </CardContent>
    </Card>
  );
};
