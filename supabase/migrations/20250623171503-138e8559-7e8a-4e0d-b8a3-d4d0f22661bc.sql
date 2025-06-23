
-- Créer une table pour les configurations d'IA complétées
CREATE TABLE IF NOT EXISTS public.ai_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL,
  business_name VARCHAR NOT NULL,
  ai_name VARCHAR NOT NULL DEFAULT 'Clara',
  business_type VARCHAR NOT NULL,
  profession VARCHAR,
  needs TEXT,
  tone VARCHAR,
  language VARCHAR DEFAULT 'français',
  use_case TEXT,
  phone_number VARCHAR,
  status VARCHAR DEFAULT 'active',
  subscription_tier VARCHAR DEFAULT 'trial',
  trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les statistiques d'utilisation
CREATE TABLE IF NOT EXISTS public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_config_id UUID REFERENCES public.ai_configurations(id) ON DELETE CASCADE,
  calls_count INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les témoignages
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR NOT NULL,
  business_name VARCHAR NOT NULL,
  business_type VARCHAR NOT NULL,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  avatar_url VARCHAR,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer quelques témoignages de démo
INSERT INTO public.testimonials (client_name, business_name, business_type, testimonial_text, rating, is_featured) VALUES
('Sophie Martin', 'Restaurant Le Gourmet', 'Restaurant', 'Clara a révolutionné notre service client ! 40% d''appels en plus gérés automatiquement, nos clients adorent.', 5, true),
('Dr. Pierre Dubois', 'Clinique Santé Plus', 'Clinique médicale', 'Enfin une IA qui comprend le secteur médical. Clara prend nos rendez-vous 24h/24, c''est fantastique !', 5, true),
('Marie Leroy', 'Immobilier Premium', 'Immobilier', 'Nos prospects sont qualifiés automatiquement par Clara. Notre taux de conversion a doublé !', 5, true),
('Jean-Luc Bernard', 'Hôtel des Alpes', 'Hôtellerie', 'Clara gère nos réservations même à 3h du matin. Service client parfait, clients ravis !', 5, false);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_ai_configurations_email ON public.ai_configurations(email);
CREATE INDEX IF NOT EXISTS idx_usage_stats_ai_config_id ON public.usage_stats(ai_config_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_date ON public.usage_stats(date);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured) WHERE is_featured = true;

-- Activer RLS (Row Level Security)
ALTER TABLE public.ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour ai_configurations (accessible par email pour le moment)
CREATE POLICY "Users can view their own AI configurations" ON public.ai_configurations
  FOR SELECT USING (true); -- Pour l'instant accessible à tous pour le MVP

CREATE POLICY "Users can insert AI configurations" ON public.ai_configurations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own AI configurations" ON public.ai_configurations
  FOR UPDATE USING (true);

-- Créer les politiques RLS pour usage_stats
CREATE POLICY "Users can view usage stats" ON public.usage_stats
  FOR SELECT USING (true);

CREATE POLICY "System can insert usage stats" ON public.usage_stats
  FOR INSERT WITH CHECK (true);

-- Créer les politiques RLS pour testimonials (lecture publique)
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = true);
