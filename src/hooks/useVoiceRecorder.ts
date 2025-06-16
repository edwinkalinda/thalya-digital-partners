
import { useState, useRef, useCallback } from 'react';

export function useVoiceRecorder(onResult: (text: string) => void) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');

        try {
          // Utiliser l'Edge Function Supabase pour la transcription
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: formData
          });

          if (!error && data?.text) {
            onResult(data.text);
          } else {
            console.error('Transcription error:', error);
          }
        } catch (error) {
          console.error('Transcription error:', error);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [onResult]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  return { 
    startRecording, 
    stopRecording, 
    recording 
  };
}
