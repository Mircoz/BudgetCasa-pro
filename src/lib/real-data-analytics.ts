// Real Data Analytics Engine - Based on actual Milano leads database
import { createClient } from '@supabase/supabase-js'
import type { MilanoLead } from './supabase-leads-api'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface RealTerritoryAnalytics {
  zona: string
  total_leads: number
  avg_income: number
  avg_propensity_casa: number
  avg_propensity_auto: number
  avg_propensity_vita: number
  avg_propensity_business: number
  avg_data_quality: number
  total_revenue_opportunity: number
  top_business_types: { type: string; count: number }[]
  income_distribution: { range: string; count: number; percentage: number }[]
  lead_density_score: number // leads per km2 estimate
}

export interface RealMarketSegmentation {
  segment_name: string
  criteria: string
  lead_count: number
  avg_income: number
  avg_quality_score: number
  conversion_potential: number
  revenue_opportunity: number
  top_products: { product: string; avg_propensity: number }[]
}

export interface RealPricingIntelligence {
  zona: string
  income_bracket: string
  suggested_premium_casa: number
  suggested_premium_auto: number
  suggested_premium_vita: number
  suggested_premium_business: number
  confidence_score: number
  market_positioning: 'aggressive' | 'competitive' | 'premium'
  reasoning: string
}

export interface RealCrossSellOpportunities {
  primary_product: string
  secondary_product: string
  correlation_strength: number
  opportunity_count: number
  estimated_revenue: number
  confidence_level: number
  trigger_profiles: string[]
}

export interface RealPerformanceMetrics {
  total_leads: number
  avg_quality_score: number
  quality_distribution: { score_range: string; count: number; percentage: number }[]
  zona_performance: { zona: string; lead_count: number; avg_quality: number; revenue_potential: number }[]
  business_type_performance: { business_type: string; count: number; avg_income: number; avg_propensity: number }[]
  monthly_trends: { month: string; lead_count: number; avg_quality: number }[]
}

export class RealDataAnalyticsEngine {
  
  // Territory Analytics from real Milano data
  static async getTerritoryAnalytics(): Promise<RealTerritoryAnalytics[]> {
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
    
    if (error || !leads) throw new Error('Failed to fetch leads data')

    const territoryMap = new Map<string, MilanoLead[]>()
    
    // Group leads by zona
    leads.forEach(lead => {
      const zona = lead.zona || 'Unknown'
      if (!territoryMap.has(zona)) {
        territoryMap.set(zona, [])
      }
      territoryMap.get(zona)!.push(lead)
    })

    const analytics: RealTerritoryAnalytics[] = []
    
    territoryMap.forEach((zoneLeads, zona) => {
      const total_leads = zoneLeads.length
      const avg_income = zoneLeads.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / total_leads
      const avg_propensity_casa = zoneLeads.reduce((sum, lead) => sum + (lead.propensity_casa || 0), 0) / total_leads
      const avg_propensity_auto = zoneLeads.reduce((sum, lead) => sum + (lead.propensity_auto || 0), 0) / total_leads
      const avg_propensity_vita = zoneLeads.reduce((sum, lead) => sum + (lead.propensity_vita || 0), 0) / total_leads
      const avg_propensity_business = zoneLeads.reduce((sum, lead) => sum + (lead.propensity_business || 0), 0) / total_leads
      const avg_data_quality = zoneLeads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / total_leads
      const total_revenue_opportunity = zoneLeads.reduce((sum, lead) => sum + (lead.revenue_opportunity || 0), 0)
      
      // Business types distribution
      const businessTypeMap = new Map<string, number>()
      zoneLeads.forEach(lead => {
        const type = lead.business_type || 'Professional Services'
        businessTypeMap.set(type, (businessTypeMap.get(type) || 0) + 1)
      })
      
      const top_business_types = Array.from(businessTypeMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Income distribution
      const incomeRanges = [
        { min: 0, max: 30000, range: '€0-30k' },
        { min: 30000, max: 50000, range: '€30-50k' },
        { min: 50000, max: 75000, range: '€50-75k' },
        { min: 75000, max: 100000, range: '€75-100k' },
        { min: 100000, max: Infinity, range: '€100k+' }
      ]
      
      const income_distribution = incomeRanges.map(({ min, max, range }) => {
        const count = zoneLeads.filter(lead => 
          (lead.estimated_income || 0) >= min && (lead.estimated_income || 0) < max
        ).length
        return {
          range,
          count,
          percentage: Math.round((count / total_leads) * 100)
        }
      })

      // Lead density estimation (Milano zones rough km2)
      const zoneAreaMap: Record<string, number> = {
        'Centro': 12,
        'Navigli': 8,
        'Porta Nuova': 6,
        'Provincia': 150,
        'Unknown': 10
      }
      const area = zoneAreaMap[zona] || 10
      const lead_density_score = Math.round(total_leads / area)

      analytics.push({
        zona,
        total_leads,
        avg_income: Math.round(avg_income),
        avg_propensity_casa: Math.round(avg_propensity_casa),
        avg_propensity_auto: Math.round(avg_propensity_auto),
        avg_propensity_vita: Math.round(avg_propensity_vita),
        avg_propensity_business: Math.round(avg_propensity_business),
        avg_data_quality: Math.round(avg_data_quality),
        total_revenue_opportunity: Math.round(total_revenue_opportunity),
        top_business_types,
        income_distribution,
        lead_density_score
      })
    })

    return analytics.sort((a, b) => b.total_leads - a.total_leads)
  }

  // Market Segmentation from real data patterns
  static async getMarketSegmentation(): Promise<RealMarketSegmentation[]> {
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
    
    if (error || !leads) throw new Error('Failed to fetch leads data')

    const segments: RealMarketSegmentation[] = []

    // High-Value Professionals (>75k income)
    const highValue = leads.filter(lead => (lead.estimated_income || 0) > 75000)
    segments.push({
      segment_name: 'High-Value Professionals',
      criteria: 'Income > €75k',
      lead_count: highValue.length,
      avg_income: Math.round(highValue.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / highValue.length),
      avg_quality_score: Math.round(highValue.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / highValue.length),
      conversion_potential: Math.round(highValue.reduce((sum, lead) => sum + (lead.conversion_probability || 0), 0) / highValue.length),
      revenue_opportunity: Math.round(highValue.reduce((sum, lead) => sum + (lead.revenue_opportunity || 0), 0)),
      top_products: [
        { product: 'Vita', avg_propensity: Math.round(highValue.reduce((sum, lead) => sum + (lead.propensity_vita || 0), 0) / highValue.length) },
        { product: 'Business', avg_propensity: Math.round(highValue.reduce((sum, lead) => sum + (lead.propensity_business || 0), 0) / highValue.length) },
        { product: 'Casa', avg_propensity: Math.round(highValue.reduce((sum, lead) => sum + (lead.propensity_casa || 0), 0) / highValue.length) }
      ]
    })

    // Business Owners (have partita_iva)
    const businessOwners = leads.filter(lead => lead.partita_iva && lead.partita_iva.length > 0)
    if (businessOwners.length > 0) {
      segments.push({
        segment_name: 'Business Owners',
        criteria: 'Have Partita IVA',
        lead_count: businessOwners.length,
        avg_income: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / businessOwners.length),
        avg_quality_score: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / businessOwners.length),
        conversion_potential: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.conversion_probability || 0), 0) / businessOwners.length),
        revenue_opportunity: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.revenue_opportunity || 0), 0)),
        top_products: [
          { product: 'Business', avg_propensity: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.propensity_business || 0), 0) / businessOwners.length) },
          { product: 'Vita', avg_propensity: Math.round(businessOwners.reduce((sum, lead) => sum + (lead.propensity_vita || 0), 0) / businessOwners.length) }
        ]
      })
    }

    // Milano Centro Premium (Centro zone + high quality)
    const centroLeads = leads.filter(lead => lead.zona === 'Centro' && (lead.data_quality_score || 0) > 75)
    if (centroLeads.length > 0) {
      segments.push({
        segment_name: 'Milano Centro Premium',
        criteria: 'Centro + Quality >75',
        lead_count: centroLeads.length,
        avg_income: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / centroLeads.length),
        avg_quality_score: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / centroLeads.length),
        conversion_potential: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.conversion_probability || 0), 0) / centroLeads.length),
        revenue_opportunity: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.revenue_opportunity || 0), 0)),
        top_products: [
          { product: 'Casa', avg_propensity: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.propensity_casa || 0), 0) / centroLeads.length) },
          { product: 'Auto', avg_propensity: Math.round(centroLeads.reduce((sum, lead) => sum + (lead.propensity_auto || 0), 0) / centroLeads.length) }
        ]
      })
    }

    return segments.sort((a, b) => b.revenue_opportunity - a.revenue_opportunity)
  }

  // Real Pricing Intelligence based on income + zona
  static async getPricingIntelligence(): Promise<RealPricingIntelligence[]> {
    const territoryAnalytics = await this.getTerritoryAnalytics()
    
    return territoryAnalytics.map(territory => {
      const incomeLevel = territory.avg_income > 80000 ? 'high' : 
                         territory.avg_income > 50000 ? 'medium' : 'low'
      
      // Base premiums (market research)
      const basePremiums = {
        casa: { low: 450, medium: 650, high: 950 },
        auto: { low: 800, medium: 1100, high: 1600 },
        vita: { low: 1200, medium: 1800, high: 2800 },
        business: { low: 1500, medium: 2200, high: 3500 }
      }

      // Zone multipliers
      const zoneMultiplier = territory.zona === 'Centro' ? 1.2 :
                            territory.zona === 'Porta Nuova' ? 1.15 :
                            territory.zona === 'Navigli' ? 1.1 :
                            territory.zona === 'Provincia' ? 0.85 : 1.0

      const suggested_premium_casa = Math.round(basePremiums.casa[incomeLevel] * zoneMultiplier)
      const suggested_premium_auto = Math.round(basePremiums.auto[incomeLevel] * zoneMultiplier)
      const suggested_premium_vita = Math.round(basePremiums.vita[incomeLevel] * zoneMultiplier)
      const suggested_premium_business = Math.round(basePremiums.business[incomeLevel] * zoneMultiplier)

      // Confidence based on data quality and lead count
      const confidence_score = Math.min(95, Math.round(
        (territory.avg_data_quality / 100 * 60) + 
        (Math.min(territory.total_leads / 50, 1) * 35)
      ))

      // Market positioning
      const market_positioning: RealPricingIntelligence['market_positioning'] = 
        incomeLevel === 'high' ? 'premium' :
        incomeLevel === 'medium' ? 'competitive' : 'aggressive'

      const reasoning = `Basato su ${territory.total_leads} lead reali. Income medio €${territory.avg_income.toLocaleString()}, zona ${territory.zona}. Propensity casa: ${territory.avg_propensity_casa}%`

      return {
        zona: territory.zona,
        income_bracket: incomeLevel,
        suggested_premium_casa,
        suggested_premium_auto,
        suggested_premium_vita,
        suggested_premium_business,
        confidence_score,
        market_positioning,
        reasoning
      }
    })
  }

  // Cross-sell opportunities from real propensity correlations
  static async getCrossSellOpportunities(): Promise<RealCrossSellOpportunities[]> {
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
    
    if (error || !leads) throw new Error('Failed to fetch leads data')

    const opportunities: RealCrossSellOpportunities[] = []
    const products = ['casa', 'auto', 'vita', 'business']

    // Calculate correlations between propensity scores
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        const primary = products[i]
        const secondary = products[j]
        
        // Filter leads with high propensity for primary product
        const primaryLeads = leads.filter(lead => 
          (lead[`propensity_${primary}` as keyof MilanoLead] as number || 0) > 70
        )
        
        if (primaryLeads.length === 0) continue

        // Calculate average secondary propensity
        const avgSecondaryPropensity = primaryLeads.reduce((sum, lead) => 
          sum + ((lead[`propensity_${secondary}` as keyof MilanoLead] as number) || 0), 0
        ) / primaryLeads.length

        // Only include if secondary propensity is also meaningful (>40)
        if (avgSecondaryPropensity > 40) {
          const correlation_strength = Math.round(avgSecondaryPropensity)
          const opportunity_count = primaryLeads.filter(lead => 
            (lead[`propensity_${secondary}` as keyof MilanoLead] as number || 0) > 60
          ).length

          const estimated_revenue = opportunity_count * 2500 * (correlation_strength / 100) // rough estimate
          
          const confidence_level = Math.min(90, Math.round(
            (primaryLeads.length / 10) + (correlation_strength / 2)
          ))

          opportunities.push({
            primary_product: primary,
            secondary_product: secondary,
            correlation_strength,
            opportunity_count,
            estimated_revenue: Math.round(estimated_revenue),
            confidence_level,
            trigger_profiles: this.generateTriggerProfiles(primary, secondary, primaryLeads)
          })
        }
      }
    }

    return opportunities.sort((a, b) => b.estimated_revenue - a.estimated_revenue)
  }

  // Performance metrics from real data
  static async getPerformanceMetrics(): Promise<RealPerformanceMetrics> {
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
    
    if (error || !leads) throw new Error('Failed to fetch leads data')

    const total_leads = leads.length
    const avg_quality_score = Math.round(
      leads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / total_leads
    )

    // Quality distribution
    const qualityRanges = [
      { min: 0, max: 25, range: '0-25' },
      { min: 25, max: 50, range: '25-50' },
      { min: 50, max: 75, range: '50-75' },
      { min: 75, max: 100, range: '75-100' }
    ]
    
    const quality_distribution = qualityRanges.map(({ min, max, range }) => {
      const count = leads.filter(lead => 
        (lead.data_quality_score || 0) >= min && (lead.data_quality_score || 0) < max
      ).length
      return {
        score_range: range,
        count,
        percentage: Math.round((count / total_leads) * 100)
      }
    })

    // Zona performance
    const zonaMap = new Map<string, MilanoLead[]>()
    leads.forEach(lead => {
      const zona = lead.zona || 'Unknown'
      if (!zonaMap.has(zona)) zonaMap.set(zona, [])
      zonaMap.get(zona)!.push(lead)
    })

    const zona_performance = Array.from(zonaMap.entries()).map(([zona, zoneLeads]) => ({
      zona,
      lead_count: zoneLeads.length,
      avg_quality: Math.round(zoneLeads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / zoneLeads.length),
      revenue_potential: Math.round(zoneLeads.reduce((sum, lead) => sum + (lead.revenue_opportunity || 0), 0))
    })).sort((a, b) => b.revenue_potential - a.revenue_potential)

    // Business type performance
    const businessTypeMap = new Map<string, MilanoLead[]>()
    leads.forEach(lead => {
      const type = lead.business_type || 'Professional Services'
      if (!businessTypeMap.has(type)) businessTypeMap.set(type, [])
      businessTypeMap.get(type)!.push(lead)
    })

    const business_type_performance = Array.from(businessTypeMap.entries()).map(([business_type, typeLeads]) => ({
      business_type,
      count: typeLeads.length,
      avg_income: Math.round(typeLeads.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / typeLeads.length),
      avg_propensity: Math.round(
        (typeLeads.reduce((sum, lead) => sum + (lead.propensity_casa || 0), 0) / typeLeads.length +
         typeLeads.reduce((sum, lead) => sum + (lead.propensity_auto || 0), 0) / typeLeads.length +
         typeLeads.reduce((sum, lead) => sum + (lead.propensity_vita || 0), 0) / typeLeads.length +
         typeLeads.reduce((sum, lead) => sum + (lead.propensity_business || 0), 0) / typeLeads.length) / 4
      )
    })).sort((a, b) => b.count - a.count)

    // Monthly trends (based on created_at)
    const monthMap = new Map<string, MilanoLead[]>()
    leads.forEach(lead => {
      const month = new Date(lead.created_at).toISOString().slice(0, 7) // YYYY-MM
      if (!monthMap.has(month)) monthMap.set(month, [])
      monthMap.get(month)!.push(lead)
    })

    const monthly_trends = Array.from(monthMap.entries()).map(([month, monthLeads]) => ({
      month,
      lead_count: monthLeads.length,
      avg_quality: Math.round(monthLeads.reduce((sum, lead) => sum + (lead.data_quality_score || 0), 0) / monthLeads.length)
    })).sort((a, b) => a.month.localeCompare(b.month))

    return {
      total_leads,
      avg_quality_score,
      quality_distribution,
      zona_performance,
      business_type_performance,
      monthly_trends
    }
  }

  private static generateTriggerProfiles(primary: string, secondary: string, leads: MilanoLead[]): string[] {
    // Analyze common characteristics of leads with both high propensities
    const profiles: string[] = []
    
    // Income analysis
    const avgIncome = leads.reduce((sum, lead) => sum + (lead.estimated_income || 0), 0) / leads.length
    if (avgIncome > 70000) profiles.push(`High income (€${Math.round(avgIncome).toLocaleString()})`)
    
    // Business type analysis
    const businessTypes = new Map<string, number>()
    leads.forEach(lead => {
      const type = lead.business_type || 'Unknown'
      businessTypes.set(type, (businessTypes.get(type) || 0) + 1)
    })
    
    const topBusinessType = Array.from(businessTypes.entries()).sort((a, b) => b[1] - a[1])[0]
    if (topBusinessType && topBusinessType[1] > leads.length * 0.3) {
      profiles.push(`${topBusinessType[0]} professionals`)
    }
    
    // Zone analysis
    const zones = new Map<string, number>()
    leads.forEach(lead => {
      const zona = lead.zona || 'Unknown'
      zones.set(zona, (zones.get(zona) || 0) + 1)
    })
    
    const topZone = Array.from(zones.entries()).sort((a, b) => b[1] - a[1])[0]
    if (topZone && topZone[1] > leads.length * 0.4) {
      profiles.push(`${topZone[0]} residents`)
    }

    return profiles.length > 0 ? profiles : ['General Milano professionals']
  }
}