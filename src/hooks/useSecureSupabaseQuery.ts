
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TableName = 
  | 'business_profiles'
  | 'caller_profiles' 
  | 'clinic_appointments'
  | 'onboarding_analytics'
  | 'onboarding_logs'
  | 'outreach_campaigns'
  | 'outreach_jobs'
  | 'outreach_leads'
  | 'real_estate_leads'
  | 'restaurant_reservations'
  | 'thalya_connect_configs';

interface BasicQueryOptions {
  table: TableName;
  select?: string;
  limit?: number;
}

interface QueryResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSecureSupabaseQuery<T = any>(options: BasicQueryOptions): QueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(options.table).select(options.select || '*');

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setData((result as T[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la récupération des données:', err);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [options.table, options.select, options.limit]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}
