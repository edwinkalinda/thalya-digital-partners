
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  client_name: string;
  business_name: string;
  business_type: string;
  testimonial_text: string;
  rating: number;
  avatar_url?: string;
  is_featured: boolean;
  created_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedTestimonials = () => {
    return testimonials.filter(t => t.is_featured);
  };

  return {
    testimonials,
    featuredTestimonials: getFeaturedTestimonials(),
    loading,
    error,
    refetch: fetchTestimonials
  };
};
