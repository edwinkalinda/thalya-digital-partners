
export interface CallerProfile {
  id: string;
  phone_number: string;
  name?: string;
  preferred_language?: string;
  last_contacted?: string;
  tags?: string[];
  voice_signature?: string;
  email?: string;
  business?: string;
  notes?: string;
  metadata?: any;
  last_seen_at?: string;
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  owner_email: string;
  business_name: string;
  business_type: string;
  appointment_type: string;
  working_hours: any;
  booking_tools?: string[];
  spoken_languages?: string[];
  preferred_tone?: string;
  intro_prompt?: string;
  restrictions?: string;
  webhook_url?: string;
  phone_number?: string;
  created_at: string;
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

export interface OutreachCampaign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  channels: string[];
  message_template: string;
  schedule: any;
  status: string;
  created_at: string;
}

export interface OutreachLead {
  id: string;
  campaign_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  last_contacted_at?: string;
  last_message?: string;
  metadata?: any;
  created_at: string;
}

export interface OutreachJob {
  id: string;
  campaign_id: string;
  lead_id: string;
  channel: 'email' | 'sms' | 'voice';
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  scheduled_at: string;
  sent_at?: string;
  attempts: number;
  last_error?: string;
  created_at: string;
}
