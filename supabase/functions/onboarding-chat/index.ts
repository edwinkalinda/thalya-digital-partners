
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, sessionId } = await req.json()
    
    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_GENAI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Tu es Clara, une assistante IA spécialisée dans la configuration d'assistants vocaux pour entreprises.

Ton rôle est de poser des questions pertinentes pour configurer l'IA selon les besoins de l'entreprise.

Questions importantes à poser dans l'ordre :
1. Type d'entreprise (restaurant, hôtel, clinique, etc.)
2. Services principaux offerts
3. Heures d'ouverture
4. Tone de voix souhaité (professionnel, amical, etc.)
5. Informations spécifiques à communiquer aux clients

Sois concise, amicale et pose une seule question à la fois. Adapte tes questions selon le type d'entreprise mentionné.

Termine par un message de remerciement quand tu as assez d'informations (après 4-5 échanges).`
    })

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const lastMessage = messages[messages.length - 1]
    
    const chat = model.startChat({
      history: chatHistory
    })

    const result = await chat.sendMessage(lastMessage.text)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({ response: text }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
