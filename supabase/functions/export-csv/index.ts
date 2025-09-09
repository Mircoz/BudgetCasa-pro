import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ExportCsvRequest {
  list_id: string
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

    const { list_id }: ExportCsvRequest = await req.json()

    // Get list details
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('name, type')
      .eq('id', list_id)
      .single()

    if (listError || !list) {
      return new Response(
        JSON.stringify({ error: 'List not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get list items
    const { data: items, error: itemsError } = await supabase
      .from('list_items')
      .select('entity_type, entity_id, notes, created_at')
      .eq('list_id', list_id)

    if (itemsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch list items' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let csvContent = ''
    let headers: string[] = []
    let rows: string[][] = []

    if (list.type === 'person') {
      headers = ['Nome', 'Città', 'Email', 'Telefono', 'Reddito Mensile', 'Figli', 'Lifestyle', 'Mobilità', 'Rischio Casa', 'Opportunità Casa', 'Note', 'Aggiunto il']
      
      // Get person details
      for (const item of items || []) {
        const { data: person } = await supabase
          .from('lead_persons')
          .select(`
            name, geo_city, email, phone, income_monthly, has_children, lifestyle, mobility,
            scores:lead_person_scores(risk_home, opportunity_home)
          `)
          .eq('id', item.entity_id)
          .single()

        if (person) {
          const scores = person.scores?.[0] || {}
          rows.push([
            person.name || '',
            person.geo_city || '',
            person.email || '',
            person.phone || '',
            person.income_monthly?.toString() || '',
            person.has_children ? 'Sì' : 'No',
            person.lifestyle?.join(', ') || '',
            person.mobility?.join(', ') || '',
            scores.risk_home?.toFixed(2) || '',
            scores.opportunity_home?.toFixed(2) || '',
            item.notes || '',
            new Date(item.created_at).toLocaleDateString('it-IT')
          ])
        }
      }
    } else if (list.type === 'company') {
      headers = ['Nome', 'P.IVA', 'ATECO', 'Città', 'Dipendenti', 'Email', 'Telefono', 'Indirizzo', 'Rischio Alluvione', 'Opportunità Property', 'Note', 'Aggiunto il']
      
      // Get company details
      for (const item of items || []) {
        const { data: company } = await supabase
          .from('companies')
          .select(`
            name, piva, ateco, geo_city, employees, contact_email, contact_phone, address,
            scores:company_scores(risk_flood, opportunity_property)
          `)
          .eq('id', item.entity_id)
          .single()

        if (company) {
          const scores = company.scores?.[0] || {}
          rows.push([
            company.name || '',
            company.piva || '',
            company.ateco || '',
            company.geo_city || '',
            company.employees?.toString() || '',
            company.contact_email || '',
            company.contact_phone || '',
            company.address || '',
            scores.risk_flood?.toFixed(2) || '',
            scores.opportunity_property?.toFixed(2) || '',
            item.notes || '',
            new Date(item.created_at).toLocaleDateString('it-IT')
          ])
        }
      }
    }

    // Generate CSV content
    csvContent = headers.join(',') + '\n'
    csvContent += rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`)
         .join(',')
    ).join('\n')

    const filename = `${list.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Export CSV error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})