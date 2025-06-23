
-- Table pour stocker les données d'onboarding complètes
CREATE TABLE IF NOT EXISTS public.onboarding_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  profession VARCHAR(255),
  needs TEXT,
  tone VARCHAR(100),
  language VARCHAR(100),
  use_case TEXT,
  session_id VARCHAR(255),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches par email
CREATE INDEX IF NOT EXISTS idx_onboarding_completions_email ON public.onboarding_completions(email);

-- Index pour optimiser les recherches par session_id
CREATE INDEX IF NOT EXISTS idx_onboarding_completions_session_id ON public.onboarding_completions(session_id);

-- Activer RLS
ALTER TABLE public.onboarding_completions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion depuis les fonctions edge
CREATE POLICY "Allow insert from edge functions" ON public.onboarding_completions
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture des données d'onboarding
CREATE POLICY "Allow read onboarding completions" ON public.onboarding_completions
  FOR SELECT USING (true);
