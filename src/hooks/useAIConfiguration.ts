
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIConfiguration {
  email: string;
  business_name: string;
  ai_name: string;
  business_type: string;
  status: string;
}

export const useAIConfiguration = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveConfiguration = async (config: AIConfiguration) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .insert({
          owner_email: config.email,
          business_name: config.business_name,
          business_type: config.business_type,
          appointment_type: 'Accueil téléphonique',
          preferred_tone: 'Professionnel',
          spoken_languages: ['français'],
          intro_prompt: `IA ${config.business_name} - ${config.business_type}`,
          working_hours: {
            "lundi": ["09:00-18:00"],
            "mardi": ["09:00-18:00"],
            "mercredi": ["09:00-18:00"],
            "jeudi": ["09:00-18:00"],
            "vendredi": ["09:00-18:00"]
          }
        });

      if (error) throw error;

      toast({
        title: "Configuration sauvegardée",
        description: "Votre IA a été configurée avec succès",
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveConfiguration,
    isLoading
  };
};
