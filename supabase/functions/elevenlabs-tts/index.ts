
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
    // Vérifier que la requête a un body
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const body = await req.text();
    if (!body || body.trim() === '') {
      throw new Error('Request body is empty');
    }

    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Request body:', body);
      throw new Error('Invalid JSON in request body');
    }

    const { text, voiceId = 'pFZP5JQG7iQjIQuC4Bku' } = requestData;
    
    if (!text || text.trim() === '') {
      throw new Error('Text parameter is required and cannot be empty');
    }

    console.log(`Converting text to speech with ElevenLabs: ${text}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.9,
          style: 0.3,
          use_speaker_boost: true
        },
        optimize_streaming_latency: 3,
        output_format: "mp3_44100_128"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    console.log(`Successfully generated audio from ElevenLabs, size: ${audioBuffer.byteLength} bytes`);

    // Conversion base64 correcte - convertir tout d'un coup sans concaténation
    const bytes = new Uint8Array(audioBuffer);
    let binaryString = '';
    
    // Construire la chaîne binaire complète
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    
    // Convertir en base64 d'un seul coup
    const base64Audio = btoa(binaryString);
    
    console.log(`Base64 conversion successful, length: ${base64Audio.length}`);

    return new Response(
      JSON.stringify({ audioData: base64Audio }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-tts function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
