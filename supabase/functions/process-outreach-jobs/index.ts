
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const now = new Date().toISOString()
    
    // Récupérer les jobs à traiter
    const { data: jobs, error } = await supabase
      .from('outreach_jobs')
      .select('*, outreach_leads(*), outreach_campaigns(*)')
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .limit(10)

    if (error) {
      console.error('Job fetch error:', error)
      return new Response(
        JSON.stringify({ error: 'Job fetch error: ' + error.message }),
        { status: 500, headers: corsHeaders }
      )
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No jobs to process' }),
        { headers: corsHeaders }
      )
    }

    let processedCount = 0

    for (const job of jobs) {
      const { id, outreach_leads: lead, outreach_campaigns: campaign } = job
      
      try {
        // Générer un message avec GPT
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: `Generate a personalized outreach message for ${lead.name || 'a lead'} about ${campaign.title}. 
                       Template: ${campaign.message_template || 'Professional outreach message'}
                       Keep it professional and engaging in French.`
            }],
            temperature: 0.7,
            max_tokens: 300
          }),
        })

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`)
        }

        const openaiData = await openaiResponse.json()
        const message = openaiData.choices?.[0]?.message?.content || 'Message par défaut'

        // Simuler l'envoi d'email (en production, intégrer avec un service comme Resend)
        console.log(`Sending message to ${lead.email}: ${message}`)

        // Marquer le job comme envoyé
        const { error: updateError } = await supabase
          .from('outreach_jobs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            attempts: job.attempts + 1
          })
          .eq('id', id)

        if (updateError) {
          console.error('Update error:', updateError)
        } else {
          processedCount++
        }

      } catch (err) {
        console.error('Job processing error:', err)
        
        // Marquer comme failed ou retrying
        await supabase
          .from('outreach_jobs')
          .update({
            status: job.attempts >= 2 ? 'failed' : 'retrying',
            last_error: String(err),
            attempts: job.attempts + 1
          })
          .eq('id', id)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${processedCount} jobs`,
        processed: processedCount,
        total: jobs.length
      }),
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
