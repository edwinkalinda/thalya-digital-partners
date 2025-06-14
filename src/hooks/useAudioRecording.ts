
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAudioRecording = (ws: WebSocket | null, isConnected: boolean) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getSupportedMimeType = useCallback(() => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`✅ Format audio supporté: ${type}`);
        return type;
      }
    }
    
    console.warn('⚠️ Aucun format préféré supporté, utilisation par défaut');
    return '';
  }, []);

  const startRecording = async () => {
    if (!isConnected) {
      toast({
        title: "Non connecté",
        description: "Connectez-vous d'abord à Gemini",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 22050,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      const supportedMimeType = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, supportedMimeType ? {
        mimeType: supportedMimeType,
        audioBitsPerSecond: 32000
      } : undefined);
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { 
          type: supportedMimeType || 'audio/webm' 
        });
        
        console.log(`🎤 Audio: ${audioBlob.size} bytes`);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('📤 Envoi à Gemini...');
            ws.send(JSON.stringify({
              type: 'audio_message',
              audio: base64Audio
            }));
          } else {
            toast({
              title: "Connexion fermée",
              description: "Reconnexion nécessaire",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      toast({
        title: "🎤 Enregistrement",
        description: "Parlez à Clara...",
      });
      
    } catch (error) {
      console.error('❌ Erreur micro:', error);
      toast({
        title: "Erreur microphone",
        description: "Vérifiez les permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    cleanup
  };
};
