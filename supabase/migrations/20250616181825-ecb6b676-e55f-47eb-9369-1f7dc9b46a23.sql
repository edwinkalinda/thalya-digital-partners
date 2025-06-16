
-- Créer les tables pour le système Thalya

-- Table pour les profils d'appelants
CREATE TABLE public.caller_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  name TEXT,
  preferred_language TEXT DEFAULT 'fr',
  last_contacted TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  voice_signature TEXT,
  email TEXT,
  business TEXT,
  notes TEXT,
  metadata JSONB,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les profils business
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  working_hours JSONB,
  booking_tools TEXT[],
  spoken_languages TEXT[],
  preferred_tone TEXT,
  intro_prompt TEXT,
  restrictions TEXT,
  webhook_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les rendez-vous clinique
CREATE TABLE public.clinic_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  practitioner_type TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les réservations restaurant
CREATE TABLE public.restaurant_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  reservation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  party_size INTEGER DEFAULT 2,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les prospects immobilier
CREATE TABLE public.real_estate_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  property_type TEXT,
  budget_range TEXT,
  preferred_area TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les campagnes outreach
CREATE TABLE public.outreach_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  channels TEXT[] DEFAULT ARRAY['email'],
  message_template TEXT,
  schedule JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les leads outreach
CREATE TABLE public.outreach_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.outreach_campaigns(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'new',
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  last_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les jobs outreach
CREATE TABLE public.outreach_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.outreach_campaigns(id),
  lead_id UUID REFERENCES public.outreach_leads(id),
  channel TEXT CHECK (channel IN ('email', 'sms', 'voice')),
  status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'retrying')) DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les logs d'onboarding
CREATE TABLE public.onboarding_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES public.business_profiles(id),
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les analytics d'onboarding
CREATE TABLE public.onboarding_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  business_type TEXT,
  step_count INTEGER,
  completed BOOLEAN DEFAULT false,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer Row Level Security sur toutes les tables
ALTER TABLE public.caller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre l'accès public en lecture/écriture pour les tests
-- En production, ces politiques devront être ajustées selon les besoins de sécurité

CREATE POLICY "Allow public access" ON public.caller_profiles FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.business_profiles FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.clinic_appointments FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.restaurant_reservations FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.real_estate_leads FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.outreach_campaigns FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.outreach_leads FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.outreach_jobs FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.onboarding_logs FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.onboarding_analytics FOR ALL USING (true);

-- Créer des triggers pour mettre à jour updated_at
CREATE TRIGGER update_onboarding_analytics_updated_at
  BEFORE UPDATE ON public.onboarding_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
