
export interface VoiceMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: number;
  audioData?: string;
  latency?: number;
}

export interface LatencyStats {
  stt?: number;
  ai?: number;
  tts?: number;
  total: number;
}

export interface GeminiTest {
  name: string;
  message: string;
  description: string;
  color?: string;
}

export interface LiveAudioMessage {
  id: string;
  type: 'user' | 'ai';
  text?: string;
  timestamp: number;
}

export interface Appointment {
  id: string;
  phone_number: string;
  appointment_time: string;
  service?: string;
  practitioner?: string;
  notes?: string;
  source: 'voice' | 'manual';
  created_at: string;
}

export interface Reservation {
  id: string;
  phone_number: string;
  reservation_time: string;
  party_size?: number;
  special_requests?: string;
  source: 'voice' | 'manual';
  created_at: string;
}

export interface CallerProfile {
  id: string;
  phone_number: string;
  name?: string;
  preferred_language?: string;
  last_contacted?: string;
  tags?: string[];
}
