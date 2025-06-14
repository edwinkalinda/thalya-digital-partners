
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://lrgvwkcdatfwxcjvbymt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ3Z3a2NkYXRmd3hjanZieW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTU2NTksImV4cCI6MjA2NTQ3MTY1OX0.5xc3tutvh5fCONDiaOjUZDvIx6W3Eb7WvyjvB5_TR_w';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, callSid } = await req.json();
    
    console.log(`Generating AI response for message: ${message}`);

    // Initialiser le client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer la configuration de l'IA de l'utilisateur (pour l'instant, utiliser une config par défaut)
    const defaultPersona = `Tu es Clara, l'assistante vocale de Thalya. Tu es professionnelle, amicale et efficace. 
    Tu aides les clients avec leurs questions et tu peux prendre des messages pour l'équipe.
    Réponds de manière concise et naturelle, comme dans une vraie conversation téléphonique.
    Tu parles français et tu es très polie.`;

    // Appeler l'API OpenAI pour générer une réponse
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: defaultPersona
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiResult = await openaiResponse.json();
    const response = aiResult.choices[0].message.content;

    console.log(`Generated AI response: ${response}`);

    // Log de la conversation pour analyse future
    await supabase.from('call_logs').insert({
      call_sid: callSid,
      user_message: message,
      ai_response: response,
      timestamp: new Date().toISOString(),
    }).catch(err => console.log('Warning: Could not log conversation:', err));

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in ai-response-generator:', error);
    
    // Réponse de fallback
    const fallbackResponse = "Désolé, je rencontre une difficulté technique. Puis-je prendre vos coordonnées pour qu'un membre de notre équipe vous rappelle ?";
    
    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
