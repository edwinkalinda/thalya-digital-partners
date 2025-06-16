
import { useState, useEffect, useCallback } from 'react';
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

interface QueryOptions {
  table: TableName;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

interface QueryResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSecureSupabaseQuery<T = any>(options: QueryOptions): QueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { toast } = useToast();

  const executeQuery = useCallback(async () => {
    let isMounted = true;
    
    try {
      setLoading(true);
      setError(null);

      // Build the query step by step
      let query = supabase.from(options.table).select(options.select || '*');

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      if (isMounted) {
        setData((result as T[]) || []);
      }
    } catch (err) {
      if (isMounted) {
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
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    options.table,
    options.select,
    options.limit,
    JSON.stringify(options.filters || {}),
    JSON.stringify(options.orderBy || {}),
    toast
  ]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
}
