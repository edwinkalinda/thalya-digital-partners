
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseSecureSupabaseQueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useSecureSupabaseQuery<T>({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from(table).select(select);

        // Appliquer les filtres de manière sécurisée
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

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

        setData(result || []);
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

    fetchData();
  }, [table, select, JSON.stringify(filters), JSON.stringify(orderBy), limit, toast]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
}
