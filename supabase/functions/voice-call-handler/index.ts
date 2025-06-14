
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Received Twilio webhook request');
    
    const formData = await req.formData();
    const callSid = formData.get('CallSid');
    const from = formData.get('From');
    const to = formData.get('To');
    
    console.log(`Call received - SID: ${callSid}, From: ${from}, To: ${to}`);

    // Réponse TwiML pour accueillir l'appelant
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice" language="fr-FR">
        Bonjour, vous êtes en contact avec l'assistant vocal Thalya. 
        Comment puis-je vous aider aujourd'hui ?
      </Say>
      <Record 
        action="https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/speech-to-text"
        method="POST"
        maxLength="30"
        finishOnKey="#"
        transcribe="false"
      />
    </Response>`;

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error in voice-call-handler:', error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice" language="fr-FR">
        Désolé, une erreur s'est produite. Veuillez rappeler plus tard.
      </Say>
      <Hangup />
    </Response>`;

    return new Response(errorResponse, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });
  }
});
