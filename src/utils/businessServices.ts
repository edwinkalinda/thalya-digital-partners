
import { supabase } from '@/integrations/supabase/client';

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

// Services pour les profils clients
export async function fetchOrCreateCallerProfile(phone: string): Promise<{ profile?: CallerProfile; error?: string }> {
  const { data: existing, error } = await supabase
    .from('caller_profiles')
    .select('*')
    .eq('phone_number', phone)
    .single();

  if (existing) {
    await supabase
      .from('caller_profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', existing.id);

    return { profile: existing };
  }

  const { data, error: insertError } = await supabase
    .from('caller_profiles')
    .insert([{ phone_number: phone }])
    .select()
    .single();

  if (insertError) return { error: insertError.message };
  return { profile: data };
}

export async function upsertCallerProfile(profile: Partial<CallerProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('caller_profiles')
    .upsert(profile, { onConflict: 'phone_number' });

  if (error) {
    console.error('upsertCallerProfile error:', error.message);
    return false;
  }

  return true;
}

// Services pour les profils business
export async function createBusinessProfile(data: Omit<BusinessProfile, 'id' | 'created_at'>): Promise<BusinessProfile> {
  const { data: inserted, error } = await supabase
    .from('business_profiles')
    .insert(data)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return inserted;
}

export async function getProfileByEmail(email: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('owner_email', email)
    .single();
  
  if (error) return null;
  return data;
}

// Services pour les logs
export async function logOnboardingResponse(profileId: string, question: string, response: string): Promise<void> {
  const { error } = await supabase
    .from('onboarding_logs')
    .insert({
      business_profile_id: profileId,
      question,
      response
    });
  
  if (error) throw new Error(error.message);
}

// Service pour tracking onboarding
export async function trackOnboardingSession({
  session_id,
  business_type,
  step_count,
  completed,
  duration
}: {
  session_id: string;
  business_type?: string;
  step_count?: number;
  completed?: boolean;
  duration?: number;
}): Promise<any> {
  const { data, error } = await supabase
    .from('onboarding_analytics')
    .upsert({
      session_id,
      business_type,
      step_count,
      completed,
      duration
    }, { onConflict: 'session_id' });

  if (error) console.error('Failed to track onboarding session:', error);
  return data;
}

// Utilitaires pour les tons de voix
export function applyToneModifier(input: string, tone: 'cheerful' | 'calm' | 'formal'): string {
  let prefix = '';
  switch (tone) {
    case 'cheerful':
      prefix = '[Respond in a friendly, upbeat tone.] ';
      break;
    case 'calm':
      prefix = '[Respond in a soft, reassuring tone.] ';
      break;
    case 'formal':
      prefix = '[Respond in a professional, formal tone.] ';
      break;
    default:
      return input;
  }
  return prefix + input;
}

// Utilitaires pour les voix ElevenLabs
interface VoiceMap {
  [lang: string]: string;
}

const VOICE_MAP: VoiceMap = {
  'en': 'pFZP5JQG7iQjIQuC4Bku', // Lily
  'fr': 'pFZP5JQG7iQjIQuC4Bku', // Lily (compatible français)
  'es': 'pFZP5JQG7iQjIQuC4Bku', // Lily (compatible espagnol)
};

export function getVoiceIdForLanguage(lang: string): string {
  const code = lang.slice(0, 2).toLowerCase();
  return VOICE_MAP[code] || VOICE_MAP['en'];
}

// Préchargement ElevenLabs
export async function prewarmElevenLabsTTS(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: {
        text: 'Hello',
        voiceId: 'pFZP5JQG7iQjIQuC4Bku'
      }
    });
    
    return !error;
  } catch (error) {
    console.error('Failed to prewarm ElevenLabs:', error);
    return false;
  }
}
