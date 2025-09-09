import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface LeadSuggestRequest {
  entity_type: 'person' | 'company'
  id: string
}

interface PolicySuggestion {
  policy: 'casa' | 'vita' | 'infortuni' | 'rc_auto' | 'property' | 'business_continuity' | 'benefit_dipendenti'
  confidence: number // 0..1
  reason: string
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

    const { entity_type, id }: LeadSuggestRequest = await req.json()

    let suggestions: PolicySuggestion[] = []

    if (entity_type === 'person') {
      // Get person data with scores
      const { data: person, error } = await supabase
        .from('lead_persons')
        .select(`
          *,
          scores:lead_person_scores(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Person not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const scores = person.scores?.[0] || {}
      
      // Generate suggestions based on person profile (mock logic)
      suggestions = generatePersonSuggestions(person, scores)

    } else if (entity_type === 'company') {
      // Get company data with scores
      const { data: company, error } = await supabase
        .from('companies')
        .select(`
          *,
          scores:company_scores(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Company not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const scores = company.scores?.[0] || {}
      
      // Generate suggestions based on company profile (mock logic)
      suggestions = generateCompanySuggestions(company, scores)
    }

    return new Response(
      JSON.stringify({ suggestions }),
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

function generatePersonSuggestions(person: any, scores: any): PolicySuggestion[] {
  const suggestions: PolicySuggestion[] = []
  
  // Casa insurance - high priority if intent_buy_home and high risk/opportunity
  if (person.intent_buy_home && (scores.risk_home > 0.6 || scores.opportunity_home > 0.7)) {
    suggestions.push({
      policy: 'casa',
      confidence: Math.min(0.95, (scores.risk_home || 0.5) * 0.8 + (scores.opportunity_home || 0.5) * 0.6),
      reason: person.intent_buy_home 
        ? `Intento d'acquisto confermato, rischio casa ${(scores.risk_home * 100).toFixed(0)}%`
        : `Alto rischio abitativo in zona ${person.geo_city}`
    })
  }

  // Vita insurance - for families with children or high income
  if (person.has_children || (person.income_monthly > 4000 && scores.opportunity_life > 0.6)) {
    suggestions.push({
      policy: 'vita',
      confidence: person.has_children 
        ? Math.min(0.90, 0.8 + (scores.opportunity_life || 0.5) * 0.3)
        : Math.min(0.75, (person.income_monthly / 6000) * 0.5 + (scores.opportunity_life || 0.5) * 0.5),
      reason: person.has_children
        ? `Famiglia con figli, protezione essenziale del nucleo familiare`
        : `Reddito elevato (€${person.income_monthly}), opportunità vita ${(scores.opportunity_life * 100).toFixed(0)}%`
    })
  }

  // RC Auto - high mobility risk
  if (scores.risk_mobility > 0.6 && person.mobility?.includes('car')) {
    suggestions.push({
      policy: 'rc_auto',
      confidence: Math.min(0.85, scores.risk_mobility * 0.9),
      reason: `Alto rischio mobilità (${(scores.risk_mobility * 100).toFixed(0)}%) con uso auto in ${person.geo_city}`
    })
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
}

function generateCompanySuggestions(company: any, scores: any): PolicySuggestion[] {
  const suggestions: PolicySuggestion[] = []
  
  // Property insurance - high property opportunity or flood risk
  if (scores.opportunity_property > 0.7 || scores.risk_flood > 0.6) {
    suggestions.push({
      policy: 'property',
      confidence: Math.min(0.95, (scores.opportunity_property || 0.5) * 0.7 + (scores.risk_flood || 0.3) * 0.8),
      reason: scores.risk_flood > 0.6
        ? `Alto rischio alluvione (${(scores.risk_flood * 100).toFixed(0)}%) zona ${company.geo_city}`
        : `Immobili di valore elevato, opportunità property ${(scores.opportunity_property * 100).toFixed(0)}%`
    })
  }

  // Business continuity - high business risk or many employees
  if (scores.risk_business_continuity > 0.6 || company.employees > 50) {
    suggestions.push({
      policy: 'business_continuity',
      confidence: company.employees > 50 
        ? Math.min(0.90, 0.7 + (company.employees / 200) * 0.3)
        : Math.min(0.85, scores.risk_business_continuity * 0.9),
      reason: company.employees > 50
        ? `${company.employees} dipendenti, continuità business critica`
        : `Alto rischio continuità operativa (${(scores.risk_business_continuity * 100).toFixed(0)}%)`
    })
  }

  // Employee benefits - many employees and high opportunity
  if (company.employees > 20 && scores.opportunity_employee_benefits > 0.7) {
    suggestions.push({
      policy: 'benefit_dipendenti',
      confidence: Math.min(0.80, (company.employees / 100) * 0.5 + scores.opportunity_employee_benefits * 0.6),
      reason: `${company.employees} dipendenti, opportunità welfare aziendale ${(scores.opportunity_employee_benefits * 100).toFixed(0)}%`
    })
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
}