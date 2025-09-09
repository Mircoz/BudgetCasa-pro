import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SearchCompaniesRequest {
  q?: string
  city?: string
  ateco?: string
  min_employees?: number
  risk_flood_min?: number
  opportunity_property_min?: number
  page?: number
  page_size?: number
}

interface CompanyCard {
  id: string
  name: string
  ateco?: string
  geo_city?: string
  employees?: number
  scores: {
    risk_flood?: number
    risk_crime?: number
    risk_business_continuity?: number
    opportunity_property?: number
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
      ateco,
      min_employees = 0,
      risk_flood_min = 0,
      opportunity_property_min = 0,
      page = 1,
      page_size = 20
    }: SearchCompaniesRequest = await req.json()

    const from = (page - 1) * page_size
    const to = from + page_size - 1

    let query = supabase
      .from('companies')
      .select(`
        id,
        name,
        ateco,
        geo_city,
        employees,
        scores:company_scores!inner(
          risk_flood,
          risk_crime,
          risk_business_continuity,
          opportunity_property
        )
      `, { count: 'exact' })
      .gte('employees', min_employees)

    // Apply filters
    if (city) {
      query = query.eq('geo_city', city)
    }
    
    if (ateco) {
      query = query.eq('ateco', ateco)
    }

    if (q) {
      // Use full-text search
      query = query.textSearch('fts', `'${q.replace(/'/g, "''")}'`)
    }

    // Apply score filters
    query = query
      .gte('company_scores.risk_flood', risk_flood_min)
      .gte('company_scores.opportunity_property', opportunity_property_min)

    // Order by opportunity and risk
    query = query
      .order('opportunity_property', { referencedTable: 'company_scores', ascending: false })
      .order('risk_business_continuity', { referencedTable: 'company_scores', ascending: false })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Search companies error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform data to match CompanyCard interface
    const items: CompanyCard[] = (data || []).map(company => ({
      id: company.id,
      name: company.name,
      ateco: company.ateco,
      geo_city: company.geo_city,
      employees: company.employees,
      scores: Array.isArray(company.scores) && company.scores.length > 0 ? {
        risk_flood: company.scores[0].risk_flood,
        risk_crime: company.scores[0].risk_crime,
        risk_business_continuity: company.scores[0].risk_business_continuity,
        opportunity_property: company.scores[0].opportunity_property
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