
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingMessage {
  sender: 'ai' | 'user';
  text: string;
}

export function useOnboardingFlow() {
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [sessionId] = useState(() => uuidv4());
  const [stepCount, setStepCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startOnboarding = () => {
    setStarted(true);
    setStartTime(Date.now());
    setMessages([{ 
      sender: 'ai', 
      text: 'Bienvenue ! Quel type d\'entreprise dirigez-vous ? Cela m\'aidera à personnaliser Clara pour vos besoins spécifiques.' 
    }]);
    
    // Track session start
    trackSession({ session_id: sessionId });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const newMessages = [...messages, { sender: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      // Call onboarding edge function
      const { data, error } = await supabase.functions.invoke('onboarding-chat', {
        body: { 
          messages: newMessages,
          sessionId 
        }
      });

      if (error) throw error;

      const aiResponse = data.response || 'Je suis désolé, je n\'ai pas pu traiter votre réponse.';
      const updatedMessages = [...newMessages, { sender: 'ai' as const, text: aiResponse }];
      setMessages(updatedMessages);
      setStepCount(c => c + 1);

      // Track progress
      await trackSession({
        session_id: sessionId,
        step_count: stepCount + 1,
        business_type: detectBusinessType(newMessages)
      });

      // Check if onboarding is complete
      if (aiResponse.toLowerCase().includes('merci') || 
          aiResponse.toLowerCase().includes('terminé') || 
          stepCount >= 5) {
        setFinished(true);
        const duration = startTime ? Date.now() - startTime : 0;
        await trackSession({
          session_id: sessionId,
          completed: true,
          duration
        });
      }

    } catch (error) {
      console.error('Onboarding error:', error);
      setMessages([...newMessages, { 
        sender: 'ai', 
        text: 'Désolé, une erreur s\'est produite. Pouvez-vous répéter votre réponse ?' 
      }]);
    }

    setIsLoading(false);
  };

  const trackSession = async (data: any) => {
    try {
      await supabase.functions.invoke('track-onboarding', {
        body: data
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  const detectBusinessType = (messages: OnboardingMessage[]): string | undefined => {
    const allText = messages.map(m => m.text).join(' ').toLowerCase();
    
    if (allText.includes('restaurant') || allText.includes('café')) return 'restaurant';
    if (allText.includes('hôtel') || allText.includes('hotel')) return 'hotel';
    if (allText.includes('clinique') || allText.includes('médical')) return 'clinic';
    if (allText.includes('dentiste') || allText.includes('dental')) return 'dentist';
    if (allText.includes('hôpital') || allText.includes('hospital')) return 'hospital';
    
    return undefined;
  };

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    startOnboarding,
    started,
    finished
  };
}
