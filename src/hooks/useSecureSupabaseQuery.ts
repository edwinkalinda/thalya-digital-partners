
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

interface UseSecureSupabaseQueryOptions {
  table: TableName;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useSecureSupabaseQuery<T = any>({
  table,
  select = '*',
  filters = {},
  orderBy,
  limit
}: UseSecureSupabaseQueryOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from(table).select(select);

        // Appliquer les filtres de manière sécurisée
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        // Appliquer le tri si spécifié
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
        }

        // Appliquer la limite si spécifiée
        if (limit) {
          query = query.limit(limit);
        }

        const { data: result, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (mounted) {
          setData((result as T[]) || []);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
          setError(errorMessage);
          console.error('Erreur lors de la récupération des données:', err);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les données. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [table, select, limit, refetchCounter, toast]);

  const refetch = () => {
    setRefetchCounter(prev => prev + 1);
  };

  return { data, loading, error, refetch };
}
