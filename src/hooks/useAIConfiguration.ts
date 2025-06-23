
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIConfiguration {
  id?: string;
  email: string;
  business_name: string;
  ai_name: string;
  business_type: string;
  profession?: string;
  needs?: string;
  tone?: string;
  language?: string;
  use_case?: string;
  phone_number?: string;
  status?: string;
  subscription_tier?: string;
  trial_expires_at?: string;
}

export const useAIConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveConfiguration = async (config: AIConfiguration) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_configurations')
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getConfigurationByEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_configurations')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<AIConfiguration>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('ai_configurations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveConfiguration,
    getConfigurationByEmail,
    updateConfiguration
  };
};
