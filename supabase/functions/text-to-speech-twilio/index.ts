
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const formData = await req.formData();
    const responseText = formData.get('responseText');
    const callSid = formData.get('CallSid');
    
    console.log(`Generating TTS for response: ${responseText}`);

    // Appeler ElevenLabs TTS
    const ttsResponse = await fetch('https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/elevenlabs-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        text: responseText,
        voiceId: 'pFZP5JQG7iQjIQuC4Bku' // Lily - voix féminine française
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error('Failed to generate speech with ElevenLabs');
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // Réponse TwiML avec l'audio généré par ElevenLabs
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Play>data:audio/mpeg;base64,${base64Audio}</Play>
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
    console.error('Error in text-to-speech-twilio function:', error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice" language="fr-FR">
        Désolé, je rencontre une difficulté technique. Veuillez rappeler plus tard.
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
