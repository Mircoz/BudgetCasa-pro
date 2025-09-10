// Real Supabase Leads API Integration
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface MilanoLead {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone: string
  address_street?: string
  address_cap: string
  zona: string
  estimated_income: number
  family_size: number
  home_ownership: string
  propensity_casa: number
  propensity_auto: number
  propensity_vita: number
  propensity_business: number
  data_quality_score: number
  lead_status: string
  conversion_probability: number
  assigned_agent_id?: string
  enrichment_status?: string
  partita_iva?: string
  dipendenti?: number
  fatturato_stimato?: number
  linkedin_url?: string
  website?: string
  revenue_opportunity?: number
  business_type?: string
  created_at: string
  updated_at?: string
}

export interface LeadsSearchFilters {
  q?: string // search query
  zona?: string
  lead_status?: string
  min_quality_score?: number
  max_quality_score?: number
  min_income?: number
  max_income?: number
  assigned_agent_id?: string
  enrichment_status?: string
  propensity_casa_min?: number
  propensity_auto_min?: number
  propensity_vita_min?: number
  propensity_business_min?: number
  page?: number
  page_size?: number
}

export interface LeadsSearchResponse {
  items: MilanoLead[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

// Transform Milano lead to PersonCard format for UI compatibility
export function transformLeadToPersonCard(lead: MilanoLead) {
  const fullName = `${lead.first_name} ${lead.last_name}`.trim()
  
  return {
    id: lead.id,
    name: fullName,
    email: lead.email || null,
    phone: lead.phone,
    city: lead.zona,
    address: lead.address_street ? `${lead.address_street}, ${lead.address_cap} ${lead.zona}` : `${lead.address_cap} ${lead.zona}`,
    income: lead.estimated_income,
    children: lead.family_size > 1 ? lead.family_size - 1 : 0,
    homeOwnership: lead.home_ownership,
    
    // Insurance propensity
    casa_propensity: lead.propensity_casa,
    auto_propensity: lead.propensity_auto,
    vita_propensity: lead.propensity_vita,
    business_propensity: lead.propensity_business,
    
    // Lead scoring
    leadScore: lead.data_quality_score,
    revenueOpportunity: lead.revenue_opportunity || lead.estimated_income * 0.05, // 5% of income if no specific revenue
    conversionProbability: lead.conversion_probability,
    
    // Status and enrichment
    lead_status: lead.lead_status,
    assigned_agent_id: lead.assigned_agent_id,
    enrichment_status: lead.enrichment_status,
    
    // Business data (if available)
    partita_iva: lead.partita_iva,
    dipendenti: lead.dipendenti,
    fatturato_stimato: lead.fatturato_stimato,
    linkedin_url: lead.linkedin_url,
    website: lead.website,
    business_type: lead.business_type,
    
    // Determine urgency level based on quality and propensity
    urgencyLevel: (lead.data_quality_score >= 80 || Math.max(lead.propensity_casa, lead.propensity_auto, lead.propensity_vita, lead.propensity_business) >= 80) 
      ? 'high' as const
      : (lead.data_quality_score >= 60 || Math.max(lead.propensity_casa, lead.propensity_auto, lead.propensity_vita, lead.propensity_business) >= 60)
      ? 'medium' as const 
      : 'low' as const,
    
    // Suggest next action based on propensity and status
    nextAction: getNextActionSuggestion(lead),
    
    // Policy interests based on propensity scores
    policyInterests: getPolicyInterests(lead),
    
    // Timestamps
    created_at: lead.created_at,
    updated_at: lead.updated_at
  }
}

function getNextActionSuggestion(lead: MilanoLead): string {
  if (lead.assigned_agent_id && lead.lead_status === 'contacted') {
    return 'Follow-up Call'
  }
  
  if (lead.data_quality_score >= 85 || Math.max(lead.propensity_casa, lead.propensity_auto, lead.propensity_vita, lead.propensity_business) >= 85) {
    return 'Call Now - High Priority'
  }
  
  if (lead.email && lead.enrichment_status === 'completed') {
    return 'Send Personal Email'
  }
  
  if (lead.phone && !lead.assigned_agent_id) {
    return 'Schedule Consultation'
  }
  
  if (lead.data_quality_score >= 70) {
    return 'WhatsApp Contact'
  }
  
  return 'Send Proposal'
}

function getPolicyInterests(lead: MilanoLead): string[] {
  const interests: string[] = []
  
  if (lead.propensity_casa >= 60) interests.push('casa')
  if (lead.propensity_auto >= 60) interests.push('auto')  
  if (lead.propensity_vita >= 60) interests.push('vita')
  if (lead.propensity_business >= 60) interests.push('business')
  
  // If no strong propensities, add based on demographics
  if (interests.length === 0) {
    if (lead.home_ownership === 'Proprietario') interests.push('casa')
    if (lead.estimated_income > 50000) interests.push('auto')
    if (lead.family_size > 1) interests.push('vita')
  }
  
  return interests
}

export async function searchMilanoLeads(filters: LeadsSearchFilters = {}): Promise<LeadsSearchResponse> {
  try {
    const {
      q = '',
      zona,
      lead_status,
      min_quality_score,
      max_quality_score,
      min_income,
      max_income,
      assigned_agent_id,
      enrichment_status,
      propensity_casa_min,
      propensity_auto_min,
      propensity_vita_min,
      propensity_business_min,
      page = 1,
      page_size = 12
    } = filters

    let query = supabase
      .from('milano_leads')
      .select('*', { count: 'exact' })

    // Text search across name fields
    if (q.trim()) {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,zona.ilike.%${q}%`)
    }

    // Filters
    if (zona) {
      query = query.eq('zona', zona)
    }

    if (lead_status) {
      query = query.eq('lead_status', lead_status)
    }

    if (assigned_agent_id) {
      if (assigned_agent_id === 'unassigned') {
        query = query.is('assigned_agent_id', null)
      } else {
        query = query.eq('assigned_agent_id', assigned_agent_id)
      }
    }

    if (enrichment_status) {
      query = query.eq('enrichment_status', enrichment_status)
    }

    if (min_quality_score) {
      query = query.gte('data_quality_score', min_quality_score)
    }

    if (max_quality_score) {
      query = query.lte('data_quality_score', max_quality_score)
    }

    if (min_income) {
      query = query.gte('estimated_income', min_income)
    }

    if (max_income) {
      query = query.lte('estimated_income', max_income)
    }

    if (propensity_casa_min) {
      query = query.gte('propensity_casa', propensity_casa_min)
    }

    if (propensity_auto_min) {
      query = query.gte('propensity_auto', propensity_auto_min)
    }

    if (propensity_vita_min) {
      query = query.gte('propensity_vita', propensity_vita_min)
    }

    if (propensity_business_min) {
      query = query.gte('propensity_business', propensity_business_min)
    }

    // Ordering and pagination
    query = query
      .order('data_quality_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * page_size, page * page_size - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Supabase search error:', error)
      throw new Error(`Lead search failed: ${error.message}`)
    }

    const totalPages = Math.ceil((count || 0) / page_size)

    return {
      items: data || [],
      page,
      page_size,
      total: count || 0,
      total_pages: totalPages
    }

  } catch (error) {
    console.error('Search leads error:', error)
    throw error
  }
}

export async function getLeadById(id: string): Promise<MilanoLead | null> {
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get lead by ID error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Get lead by ID error:', error)
    return null
  }
}

export async function updateLead(id: string, updates: Partial<MilanoLead>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('milano_leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Update lead error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Update lead error:', error)
    return false
  }
}

export async function getLeadStats() {
  try {
    const [
      { count: totalLeads },
      { count: assignedLeads },
      { count: enrichedLeads },
      { count: highQualityLeads }
    ] = await Promise.all([
      supabase.from('milano_leads').select('*', { count: 'exact', head: true }),
      supabase.from('milano_leads').select('*', { count: 'exact', head: true }).not('assigned_agent_id', 'is', null),
      supabase.from('milano_leads').select('*', { count: 'exact', head: true }).eq('enrichment_status', 'completed'),
      supabase.from('milano_leads').select('*', { count: 'exact', head: true }).gte('data_quality_score', 80)
    ])

    return {
      totalLeads: totalLeads || 0,
      assignedLeads: assignedLeads || 0,
      enrichedLeads: enrichedLeads || 0,
      highQualityLeads: highQualityLeads || 0,
      assignmentRate: totalLeads ? Math.round((assignedLeads / totalLeads) * 100) : 0,
      enrichmentRate: totalLeads ? Math.round((enrichedLeads / totalLeads) * 100) : 0,
      qualityRate: totalLeads ? Math.round((highQualityLeads / totalLeads) * 100) : 0
    }
  } catch (error) {
    console.error('Get lead stats error:', error)
    return {
      totalLeads: 0,
      assignedLeads: 0,
      enrichedLeads: 0,
      highQualityLeads: 0,
      assignmentRate: 0,
      enrichmentRate: 0,
      qualityRate: 0
    }
  }
}

export async function getZoneDistribution() {
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .select('zona')

    if (error) {
      console.error('Zone distribution error:', error)
      return {}
    }

    const distribution: Record<string, number> = {}
    data?.forEach(lead => {
      const zona = lead.zona || 'Unknown'
      distribution[zona] = (distribution[zona] || 0) + 1
    })

    return distribution
  } catch (error) {
    console.error('Zone distribution error:', error)
    return {}
  }
}