
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const { toast } = useToast();
  
  // Use refs to store the current values without causing dependency issues
  const optionsRef = useRef({ table, select, filters, orderBy, limit });
  optionsRef.current = { table, select, filters, orderBy, limit };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { table: currentTable, select: currentSelect, filters: currentFilters, orderBy: currentOrderBy, limit: currentLimit } = optionsRef.current;

      let query = supabase.from(currentTable).select(currentSelect);

      // Appliquer les filtres de manière sécurisée
      if (currentFilters) {
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Appliquer le tri si spécifié
      if (currentOrderBy) {
        query = query.order(currentOrderBy.column, { ascending: currentOrderBy.ascending ?? false });
      }

      // Appliquer la limite si spécifiée
      if (currentLimit) {
        query = query.limit(currentLimit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData, table, select, JSON.stringify(filters), JSON.stringify(orderBy), limit]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
