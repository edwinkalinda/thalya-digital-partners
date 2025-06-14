
import { useRef, useCallback, useState } from 'react';

interface AudioChunk {
  id: string;
  data: Uint8Array;
  timestamp: number;
}

interface UseOptimizedAudioReturn {
  playAudioStream: (base64Audio: string, messageId: string) => Promise<void>;
  isPlaying: boolean;
  currentMessageId: string | null;
  stopPlayback: () => void;
  audioQueueLength: number;
}

export const useOptimizedAudio = (): UseOptimizedAudioReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [audioQueueLength, setAudioQueueLength] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<AudioChunk[]>([]);
  const isProcessingRef = useRef(false);

  // Initialiser le contexte audio une seule fois
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({
        sampleRate: 24000,
        latencyHint: 'interactive'
      });
    }
    return audioContextRef.current;
  }, []);

  // Conversion base64 optimisée avec chunks
  const base64ToUint8Array = useCallback((base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    // Utilisation d'une boucle optimisée
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  }, []);

  // Lecture audio streaming avec gestion de queue
  const playAudioStream = useCallback(async (base64Audio: string, messageId: string) => {
    try {
      setCurrentMessageId(messageId);
      setIsPlaying(true);
      
      console.log(`Starting audio playback for message: ${messageId}`);
      const startTime = performance.now();
      
      // Conversion optimisée
      const audioData = base64ToUint8Array(base64Audio);
      const conversionTime = performance.now() - startTime;
      console.log(`Audio conversion took: ${conversionTime.toFixed(2)}ms`);
      
      // Créer le blob audio
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Arrêter toute lecture en cours
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Créer nouvel élément audio avec optimisations
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      currentAudioRef.current = audio;
      
      // Promesse pour gérer la lecture
      await new Promise<void>((resolve, reject) => {
        const cleanupAudio = () => {
          URL.revokeObjectURL(audioUrl);
          if (currentAudioRef.current === audio) {
            currentAudioRef.current = null;
          }
        };

        audio.addEventListener('canplay', () => {
          const loadTime = performance.now() - startTime;
          console.log(`Audio ready to play in: ${loadTime.toFixed(2)}ms`);
        });

        audio.addEventListener('ended', () => {
          console.log(`Audio playback completed for: ${messageId}`);
          cleanupAudio();
          setIsPlaying(false);
          setCurrentMessageId(null);
          resolve();
        });

        audio.addEventListener('error', (error) => {
          console.error('Audio playback error:', error);
          cleanupAudio();
          setIsPlaying(false);
          setCurrentMessageId(null);
          reject(error);
        });

        // Démarrer la lecture
        audio.src = audioUrl;
        audio.play().catch(reject);
      });
      
      const totalTime = performance.now() - startTime;
      console.log(`Total audio processing time: ${totalTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.error('Error in playAudioStream:', error);
      setIsPlaying(false);
      setCurrentMessageId(null);
      throw error;
    }
  }, [base64ToUint8Array]);

  // Arrêter la lecture
  const stopPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentMessageId(null);
  }, []);

  return {
    playAudioStream,
    isPlaying,
    currentMessageId,
    stopPlayback,
    audioQueueLength
  };
};
