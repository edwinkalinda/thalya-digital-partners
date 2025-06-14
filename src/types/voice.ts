
export interface VoiceMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  audioData?: string;
  latency?: number;
  timestamp: number;
}

export interface LatencyStats {
  ai?: number;
  tts?: number;
  stt?: number;
  total: number;
}

export interface GeminiTest {
  name: string;
  message: string;
  description: string;
  color: string;
}

export interface WebSocketStatus {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
}
