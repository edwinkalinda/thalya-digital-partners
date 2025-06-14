
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
    console.log('Processing speech-to-text request');
    
    const formData = await req.formData();
    const recordingUrl = formData.get('RecordingUrl');
    const callSid = formData.get('CallSid');
    
    if (!recordingUrl) {
      throw new Error('No recording URL provided');
    }

    console.log(`Processing recording: ${recordingUrl}`);

    // Télécharger l'enregistrement audio depuis Twilio
    const audioResponse = await fetch(recordingUrl as string, {
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
      },
    });

    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio recording');
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Convertir l'audio en format compatible avec OpenAI Whisper
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    
    // Préparer la requête pour OpenAI Whisper
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioBlob, 'audio.wav');
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', 'fr');

    // Appeler OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('OpenAI Whisper error:', errorText);
      throw new Error(`Whisper API error: ${errorText}`);
    }

    const transcriptionResult = await whisperResponse.json();
    const transcribedText = transcriptionResult.text;
    
    console.log(`Transcribed text: ${transcribedText}`);

    // Appeler l'IA pour générer une réponse
    const aiResponse = await fetch('https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/ai-response-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        message: transcribedText,
        callSid: callSid,
      }),
    });

    const aiResult = await aiResponse.json();
    const responseText = aiResult.response;

    // Appeler la nouvelle fonction TTS optimisée avec ElevenLabs
    const ttsResponse = await fetch('https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/text-to-speech-twilio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: new URLSearchParams({
        responseText: responseText,
        CallSid: callSid as string,
      }),
    });

    const twimlResponse = await ttsResponse.text();

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error in speech-to-text function:', error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice" language="fr-FR">
        Je n'ai pas bien compris. Pouvez-vous répéter votre question ?
      </Say>
      <Record 
        action="https://lrgvwkcdatfwxcjvbymt.supabase.co/functions/v1/speech-to-text"
        method="POST"
        maxLength="30"
        finishOnKey="#"
        transcribe="false"
      />
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
