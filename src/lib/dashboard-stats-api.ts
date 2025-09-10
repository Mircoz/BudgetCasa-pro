// Dashboard Statistics API - Real Milano Data
import { getLeadStats, getZoneDistribution } from './supabase-leads-api'
import { getCompanyStats } from './supabase-companies-api'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface DashboardStats {
  totalLeads: number
  totalCompanies: number
  weeklyGrowth: number
  enrichmentRate: number
  totalRevenueOpportunity: number
  
  // Zone distribution
  zoneBreakdown: Array<{
    zona: string
    count: number
    percentage: number
  }>
  
  // Industry breakdown
  industryBreakdown: Array<{
    industry: string
    count: number
    revenue: number
  }>
  
  // Quality metrics
  highQualityLeads: number
  assignedLeads: number
  qualityScore: number
  
  // Recent activity
  recentLeads: Array<{
    id: string
    name: string
    zona: string
    industry: string
    leadScore: number
    createdAt: string
  }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get basic stats from existing APIs
    const [leadStats, companyStats, zoneDistribution] = await Promise.all([
      getLeadStats(),
      getCompanyStats(), 
      getZoneDistribution()
    ])

    // Get detailed zone breakdown
    const zoneBreakdown = Object.entries(zoneDistribution).map(([zona, count]) => ({
      zona,
      count,
      percentage: Math.round((count / leadStats.totalLeads) * 100)
    })).sort((a, b) => b.count - a.count)

    // Get industry breakdown from leads data
    const industryBreakdown = await getIndustryBreakdown()
    
    // Get revenue opportunity totals
    const totalRevenueOpportunity = await getTotalRevenueOpportunity()
    
    // Get recent high-quality leads
    const recentLeads = await getRecentHighQualityLeads()
    
    // Calculate weekly growth (mock for now, would need historical data)
    const weeklyGrowth = 12 // This would be calculated from created_at timestamps
    
    return {
      totalLeads: leadStats.totalLeads,
      totalCompanies: companyStats.totalCompanies,
      weeklyGrowth,
      enrichmentRate: leadStats.enrichmentRate,
      totalRevenueOpportunity,
      zoneBreakdown,
      industryBreakdown,
      highQualityLeads: leadStats.highQualityLeads,
      assignedLeads: leadStats.assignedLeads,
      qualityScore: leadStats.qualityRate,
      recentLeads
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    // Return fallback data
    return {
      totalLeads: 0,
      totalCompanies: 0,
      weeklyGrowth: 0,
      enrichmentRate: 0,
      totalRevenueOpportunity: 0,
      zoneBreakdown: [],
      industryBreakdown: [],
      highQualityLeads: 0,
      assignedLeads: 0,
      qualityScore: 0,
      recentLeads: []
    }
  }
}

async function getIndustryBreakdown() {
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .select(`
        last_name,
        business_type,
        fatturato_stimato,
        propensity_business
      `)
      .not('business_type', 'is', null)

    if (error) {
      console.error('Industry breakdown error:', error)
      return []
    }

    // Group by determined industry
    const industryMap = new Map<string, { count: number, revenue: number }>()
    
    data?.forEach(lead => {
      const industry = determineIndustry(lead.last_name, lead.business_type)
      const revenue = lead.fatturato_stimato || 0
      
      if (industryMap.has(industry)) {
        const existing = industryMap.get(industry)!
        industryMap.set(industry, {
          count: existing.count + 1,
          revenue: existing.revenue + revenue
        })
      } else {
        industryMap.set(industry, { count: 1, revenue })
      }
    })
    
    return Array.from(industryMap.entries()).map(([industry, { count, revenue }]) => ({
      industry,
      count,
      revenue
    })).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Industry breakdown error:', error)
    return []
  }
}

async function getTotalRevenueOpportunity() {
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .select('fatturato_stimato, estimated_income, dipendenti, zona, propensity_business')

    if (error) {
      console.error('Revenue opportunity error:', error)
      return 0
    }

    let totalRevenue = 0
    data?.forEach(lead => {
      // Calculate B2B revenue opportunity like in companies API
      const baseRevenue = lead.fatturato_stimato || (lead.estimated_income * 3 * 12)
      const employeeCount = lead.dipendenti || 3
      
      const revenueBasedPremium = baseRevenue * 0.015 // 1.5%
      const employeeBasedPremium = employeeCount * 800 // €800 per employee
      
      const zoneMultiplier = lead.zona === 'Centro' ? 1.5 : 
                            lead.zona === 'Porta Nuova' ? 1.4 : 1.2
      
      totalRevenue += (revenueBasedPremium + employeeBasedPremium) * zoneMultiplier
    })
    
    return Math.floor(totalRevenue)
  } catch (error) {
    console.error('Revenue opportunity error:', error)
    return 0
  }
}

async function getRecentHighQualityLeads() {
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .select(`
        id,
        first_name,
        last_name, 
        zona,
        business_type,
        data_quality_score,
        created_at
      `)
      .gte('data_quality_score', 75)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Recent leads error:', error)
      return []
    }

    return data?.map(lead => ({
      id: lead.id,
      name: `${lead.first_name} ${lead.last_name}`.trim(),
      zona: lead.zona,
      industry: determineIndustry(lead.last_name, lead.business_type),
      leadScore: lead.data_quality_score,
      createdAt: lead.created_at
    })) || []
  } catch (error) {
    console.error('Recent leads error:', error)
    return []
  }
}

// Helper function - same logic as in companies API
function determineIndustry(businessName: string, businessType?: string): string {
  const name = businessName.toLowerCase()
  
  if (businessType) return businessType
  
  if (name.includes('studio legale') || name.includes('avvocat')) return 'Legal Services'
  if (name.includes('commercialist') || name.includes('fiscal') || name.includes('contabil')) return 'Accounting & Finance'
  if (name.includes('architett') || name.includes('ingegner')) return 'Architecture & Engineering' 
  if (name.includes('medico') || name.includes('dentist') || name.includes('clinic')) return 'Healthcare'
  if (name.includes('consulen')) return 'Business Consulting'
  if (name.includes('software') || name.includes('digital') || name.includes('tech')) return 'Technology'
  if (name.includes('immobiliar')) return 'Real Estate'
  if (name.includes('veterin')) return 'Veterinary Services'
  if (name.includes('farmaci') || name.includes('ottic')) return 'Healthcare Retail'
  
  return 'Professional Services'
}