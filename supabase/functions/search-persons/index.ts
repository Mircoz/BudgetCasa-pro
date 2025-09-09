import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SearchPersonsRequest {
  q?: string
  city?: string
  has_children?: boolean
  min_income?: number
  risk_home_min?: number
  opportunity_home_min?: number
  page?: number
  page_size?: number
}

interface PersonCard {
  id: string
  name?: string
  geo_city?: string
  lifestyle?: string[]
  mobility?: string[]
  scores: {
    risk_home?: number
    risk_mobility?: number
    opportunity_home?: number
    opportunity_life?: number
  }
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

    const {
      q,
      city,
      has_children,
      min_income = 0,
      risk_home_min = 0,
      opportunity_home_min = 0,
      page = 1,
      page_size = 20
    }: SearchPersonsRequest = await req.json()

    const from = (page - 1) * page_size
    const to = from + page_size - 1

    let query = supabase
      .from('lead_persons')
      .select(`
        id,
        name,
        geo_city,
        lifestyle,
        mobility,
        scores:lead_person_scores!inner(
          risk_home,
          risk_mobility,
          opportunity_home,
          opportunity_life
        )
      `, { count: 'exact' })
      .gte('income_monthly', min_income)

    // Apply filters
    if (city) {
      query = query.eq('geo_city', city)
    }
    
    if (has_children !== undefined) {
      query = query.eq('has_children', has_children)
    }

    if (q) {
      // Use full-text search
      query = query.textSearch('fts', `'${q.replace(/'/g, "''")}'`)
    }

    // Apply score filters
    query = query
      .gte('lead_person_scores.risk_home', risk_home_min)
      .gte('lead_person_scores.opportunity_home', opportunity_home_min)

    // Order by opportunity and risk
    query = query
      .order('opportunity_home', { referencedTable: 'lead_person_scores', ascending: false })
      .order('risk_home', { referencedTable: 'lead_person_scores', ascending: false })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Search persons error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform data to match PersonCard interface
    const items: PersonCard[] = (data || []).map(person => ({
      id: person.id,
      name: person.name,
      geo_city: person.geo_city,
      lifestyle: person.lifestyle || [],
      mobility: person.mobility || [],
      scores: Array.isArray(person.scores) && person.scores.length > 0 ? {
        risk_home: person.scores[0].risk_home,
        risk_mobility: person.scores[0].risk_mobility,
        opportunity_home: person.scores[0].opportunity_home,
        opportunity_life: person.scores[0].opportunity_life
      } : {}
    }))

    return new Response(
      JSON.stringify({ 
        items, 
        total: count || 0,
        page,
        page_size,
        total_pages: Math.ceil((count || 0) / page_size)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})