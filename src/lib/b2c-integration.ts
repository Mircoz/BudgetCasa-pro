/**
 * BudgetCasa B2C → B2B Data Integration
 * 
 * Transforms B2C user simulations into qualified B2B leads for insurance agents
 */

import { createClient } from './supabase'

// B2C Simulation types from budgetcasa.it
export type B2CSimulationType = 'affordability' | 'mortgage' | 'cost_calculator'
export type B2CSimulationStatus = 'draft' | 'completed'

export interface B2CSimulation {
  id: string
  user_id: string
  simulation_type: B2CSimulationType
  simulation_data: {
    budget?: number
    downPayment?: number
    desiredSqm?: number
    selectedNeighborhood?: string
    lifestyle?: {
      companions?: string[]  // ["partner", "family"]
      interests?: string[]   // ["bici", "running", "travel"]
    }
    desiredProperty?: {
      type?: 'apartment' | 'house'
      rooms?: number
      hasGarden?: boolean
    }
  }
  results?: {
    neighborhood?: {
      name: string
      avgPrice: number
      maxSqm: number
      isAffordable: boolean
    }
    summary?: {
      neighborhoodScore: number
      monthlyPayment?: number
      totalCosts?: number
    }
  }
  status: B2CSimulationStatus
  created_at: string
  updated_at: string
  // Added for B2B lead scoring
  email?: string
  phone?: string
  consent_marketing?: boolean
  last_activity?: string
}

export interface B2BLeadFromB2C {
  id: string
  source: 'budgetcasa_b2c'
  name?: string
  email?: string
  phone?: string
  geo_city: string
  geo_municipality?: string
  geo_quarter?: string
  household_size?: number
  has_children?: boolean
  lifestyle: string[]
  mobility: string[]
  income_monthly?: number
  intent_buy_home: boolean
  // B2C-specific enrichment
  budget_range: string
  property_type_preference?: string
  desired_sqm?: number
  down_payment_available?: number
  simulation_count: number
  last_simulation_date: string
  favorite_neighborhoods: string[]
  lead_temperature: 'hot' | 'warm' | 'cold'
  b2c_engagement_score: number
  created_at: string
}

export class B2CLeadGenerator {
  private supabase = createClient()

  /**
   * Extract qualified leads from B2C user simulations
   */
  async extractB2CLeads(filters?: {
    minBudget?: number
    maxDaysOld?: number
    neighborhoods?: string[]
    simulationTypes?: B2CSimulationType[]
    onlyCompleted?: boolean
  }): Promise<B2BLeadFromB2C[]> {
    const maxDaysOld = filters?.maxDaysOld || 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - maxDaysOld)

    // Query B2C simulations from budgetcasa.it database
    let query = this.supabase
      .from('user_simulations')
      .select('*')
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false })

    if (filters?.onlyCompleted) {
      query = query.eq('status', 'completed')
    }

    if (filters?.simulationTypes?.length) {
      query = query.in('simulation_type', filters.simulationTypes)
    }

    const { data: simulations, error } = await query

    if (error) throw error
    if (!simulations?.length) return []

    // Group by user_id and convert to B2B leads
    const leadsByUser = this.groupSimulationsByUser(simulations)
    const b2bLeads: B2BLeadFromB2C[] = []

    for (const [userId, userSimulations] of leadsByUser) {
      const lead = await this.convertUserToB2BLead(userId, userSimulations, filters)
      if (lead) {
        b2bLeads.push(lead)
      }
    }

    return b2bLeads.sort((a, b) => b.b2c_engagement_score - a.b2c_engagement_score)
  }

  /**
   * Group simulations by user_id
   */
  private groupSimulationsByUser(simulations: B2CSimulation[]): Map<string, B2CSimulation[]> {
    const grouped = new Map<string, B2CSimulation[]>()
    
    for (const sim of simulations) {
      if (!grouped.has(sim.user_id)) {
        grouped.set(sim.user_id, [])
      }
      grouped.get(sim.user_id)!.push(sim)
    }

    return grouped
  }

  /**
   * Convert B2C user simulations into qualified B2B lead
   */
  private async convertUserToB2BLead(
    userId: string, 
    simulations: B2CSimulation[],
    filters?: any
  ): Promise<B2BLeadFromB2C | null> {
    const mostRecent = simulations[0]
    const completedSims = simulations.filter(s => s.status === 'completed')
    
    // Lead qualification filters
    const totalBudget = this.extractTotalBudget(simulations)
    if (filters?.minBudget && totalBudget < filters.minBudget) {
      return null
    }

    // Extract key data from simulations
    const neighborhoods = this.extractNeighborhoods(simulations)
    const lifestyle = this.extractLifestyle(simulations)
    const mobility = this.inferMobility(simulations, lifestyle)
    const temperatureScore = this.calculateLeadTemperature(simulations)
    const engagementScore = this.calculateEngagementScore(simulations)

    // Get user profile data (if available)
    const userProfile = await this.getUserProfile(userId)

    const lead: B2BLeadFromB2C = {
      id: `b2c_${userId}`,
      source: 'budgetcasa_b2c',
      name: userProfile?.name,
      email: userProfile?.email,
      phone: userProfile?.phone,
      geo_city: neighborhoods[0] || 'Milano', // Primary neighborhood
      geo_municipality: this.extractMunicipality(neighborhoods[0]),
      geo_quarter: neighborhoods[0],
      household_size: this.inferHouseholdSize(simulations),
      has_children: this.inferHasChildren(simulations),
      lifestyle,
      mobility,
      income_monthly: this.inferMonthlyIncome(totalBudget),
      intent_buy_home: true, // Always true for B2C users
      
      // B2C-specific enrichment
      budget_range: this.categorizeBudget(totalBudget),
      property_type_preference: this.extractPropertyType(simulations),
      desired_sqm: this.extractDesiredSqm(simulations),
      down_payment_available: this.extractDownPayment(simulations),
      simulation_count: simulations.length,
      last_simulation_date: mostRecent.created_at,
      favorite_neighborhoods: neighborhoods.slice(0, 3),
      lead_temperature: temperatureScore,
      b2c_engagement_score: engagementScore,
      created_at: mostRecent.created_at
    }

    return lead
  }

  /**
   * Calculate lead temperature based on activity and data quality
   */
  private calculateLeadTemperature(simulations: B2CSimulation[]): 'hot' | 'warm' | 'cold' {
    const mostRecent = new Date(simulations[0].created_at)
    const daysOld = (Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
    const completedCount = simulations.filter(s => s.status === 'completed').length
    const totalCount = simulations.length

    // Hot: Recent activity + multiple completed simulations
    if (daysOld <= 7 && completedCount >= 2) return 'hot'
    if (daysOld <= 3 && completedCount >= 1) return 'hot'
    
    // Warm: Moderate activity
    if (daysOld <= 14 && totalCount >= 3) return 'warm'
    if (daysOld <= 7 && totalCount >= 2) return 'warm'
    
    // Cold: Limited activity or old
    return 'cold'
  }

  /**
   * Calculate engagement score (0-100)
   */
  private calculateEngagementScore(simulations: B2CSimulation[]): number {
    let score = 0
    
    // Base score for number of simulations
    score += Math.min(simulations.length * 10, 30)
    
    // Bonus for completed simulations
    const completed = simulations.filter(s => s.status === 'completed').length
    score += completed * 15
    
    // Bonus for recent activity
    const mostRecent = new Date(simulations[0].created_at)
    const daysOld = (Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld <= 3) score += 25
    else if (daysOld <= 7) score += 15
    else if (daysOld <= 14) score += 10
    
    // Bonus for high budget
    const budget = this.extractTotalBudget(simulations)
    if (budget >= 800000) score += 20
    else if (budget >= 500000) score += 15
    else if (budget >= 300000) score += 10
    
    // Bonus for lifestyle richness
    const lifestyle = this.extractLifestyle(simulations)
    score += Math.min(lifestyle.length * 5, 15)

    return Math.min(score, 100)
  }

  /**
   * Extract and aggregate data from simulations
   */
  private extractTotalBudget(simulations: B2CSimulation[]): number {
    const budgets = simulations
      .map(s => s.simulation_data.budget)
      .filter((b): b is number => typeof b === 'number')
    
    return budgets.length ? Math.max(...budgets) : 0
  }

  private extractNeighborhoods(simulations: B2CSimulation[]): string[] {
    const neighborhoods: Record<string, number> = {}
    
    for (const sim of simulations) {
      const neighborhood = sim.simulation_data.selectedNeighborhood || 
                          sim.results?.neighborhood?.name
      if (neighborhood) {
        neighborhoods[neighborhood] = (neighborhoods[neighborhood] || 0) + 1
      }
    }

    return Object.entries(neighborhoods)
      .sort(([,a], [,b]) => b - a)
      .map(([name]) => name)
  }

  private extractLifestyle(simulations: B2CSimulation[]): string[] {
    const lifestyle = new Set<string>()
    
    for (const sim of simulations) {
      const interests = sim.simulation_data.lifestyle?.interests || []
      const companions = sim.simulation_data.lifestyle?.companions || []
      
      interests.forEach(i => lifestyle.add(i))
      companions.forEach(c => lifestyle.add(c))
    }

    return Array.from(lifestyle)
  }

  private inferMobility(simulations: B2CSimulation[], lifestyle: string[]): string[] {
    const mobility = new Set<string>()
    
    // Infer from lifestyle
    if (lifestyle.includes('bici')) mobility.add('bike')
    if (lifestyle.includes('running')) mobility.add('walk')
    if (lifestyle.includes('travel')) mobility.add('car')
    
    // Default assumption for property buyers
    mobility.add('car')
    
    return Array.from(mobility)
  }

  private inferHouseholdSize(simulations: B2CSimulation[]): number {
    // Infer from companions and property size
    const companions = simulations
      .flatMap(s => s.simulation_data.lifestyle?.companions || [])
    
    if (companions.includes('family')) return 4
    if (companions.includes('partner')) return 2
    
    return 1
  }

  private inferHasChildren(simulations: B2CSimulation[]): boolean {
    const lifestyle = simulations
      .flatMap(s => s.simulation_data.lifestyle?.companions || [])
    
    return lifestyle.includes('family') || lifestyle.includes('children')
  }

  private inferMonthlyIncome(budget: number): number {
    // Rough estimate: budget / 5 years / 12 months
    return Math.round(budget / 60)
  }

  private categorizeBudget(budget: number): string {
    if (budget >= 1000000) return '1M+'
    if (budget >= 800000) return '800K-1M'
    if (budget >= 600000) return '600K-800K'  
    if (budget >= 400000) return '400K-600K'
    if (budget >= 200000) return '200K-400K'
    return '<200K'
  }

  private extractPropertyType(simulations: B2CSimulation[]): string {
    const sqmValues = simulations
      .map(s => s.simulation_data.desiredSqm)
      .filter((s): s is number => typeof s === 'number')
    
    if (sqmValues.length) {
      const avgSqm = sqmValues.reduce((a, b) => a + b, 0) / sqmValues.length
      return avgSqm > 100 ? 'house' : 'apartment'
    }
    
    return 'apartment'
  }

  private extractDesiredSqm(simulations: B2CSimulation[]): number | undefined {
    const sqmValues = simulations
      .map(s => s.simulation_data.desiredSqm)
      .filter((s): s is number => typeof s === 'number')
    
    return sqmValues.length ? Math.round(sqmValues.reduce((a, b) => a + b, 0) / sqmValues.length) : undefined
  }

  private extractDownPayment(simulations: B2CSimulation[]): number | undefined {
    const payments = simulations
      .map(s => s.simulation_data.downPayment)
      .filter((p): p is number => typeof p === 'number')
    
    return payments.length ? Math.max(...payments) : undefined
  }

  private extractMunicipality(neighborhood?: string): string | undefined {
    // Map neighborhoods to municipalities
    const neighborhoodMap: Record<string, string> = {
      'Isola': 'Milano',
      'Brera': 'Milano',
      'Navigli': 'Milano',
      'Trastevere': 'Roma',
      'Parioli': 'Roma',
      'Vomero': 'Napoli'
    }
    
    return neighborhood ? neighborhoodMap[neighborhood] : undefined
  }

  /**
   * Get user profile data from auth.users if available
   */
  private async getUserProfile(userId: string): Promise<{
    name?: string
    email?: string  
    phone?: string
  } | null> {
    try {
      // This would query the user profile from Supabase auth
      const { data, error } = await this.supabase
        .from('user_profiles')  // If you have a profiles table
        .select('full_name, email, phone')
        .eq('id', userId)
        .single()

      if (error) return null

      return {
        name: data?.full_name,
        email: data?.email,
        phone: data?.phone
      }
    } catch {
      return null
    }
  }
}

/**
 * Insurance Lead Scoring based on B2C behavior
 */
export class InsuranceLeadScorer {
  
  /**
   * Generate insurance opportunity scores for B2C leads
   */
  static scoreInsuranceOpportunities(lead: B2BLeadFromB2C): {
    risk_home: number
    risk_mobility: number  
    opportunity_life: number
    opportunity_home: number
    explanation: {
      home_insurance: string
      life_insurance: string
      mobility_insurance: string
    }
  } {
    const scores = {
      risk_home: this.scoreHomeRisk(lead),
      risk_mobility: this.scoreMobilityRisk(lead),
      opportunity_life: this.scoreLifeOpportunity(lead), 
      opportunity_home: this.scoreHomeOpportunity(lead),
      explanation: {
        home_insurance: this.explainHomeInsurance(lead),
        life_insurance: this.explainLifeInsurance(lead),
        mobility_insurance: this.explainMobilityInsurance(lead)
      }
    }

    return scores
  }

  private static scoreHomeRisk(lead: B2BLeadFromB2C): number {
    let score = 0.5 // Base score

    // Higher budget = higher risk exposure
    if (lead.budget_range === '1M+') score += 0.3
    else if (lead.budget_range === '800K-1M') score += 0.2
    else if (lead.budget_range === '600K-800K') score += 0.1

    // Property type
    if (lead.property_type_preference === 'house') score += 0.1

    // Family situation
    if (lead.has_children) score += 0.1
    if (lead.household_size && lead.household_size >= 3) score += 0.05

    // Intent certainty
    if (lead.lead_temperature === 'hot') score += 0.15
    else if (lead.lead_temperature === 'warm') score += 0.05

    return Math.min(score, 1.0)
  }

  private static scoreMobilityRisk(lead: B2BLeadFromB2C): number {
    let score = 0.4 // Base score

    // Mobility patterns
    if (lead.mobility.includes('car')) score += 0.3
    if (lead.mobility.includes('bike')) score += 0.1
    
    // Lifestyle indicators
    if (lead.lifestyle.includes('travel')) score += 0.2
    if (lead.lifestyle.includes('sport')) score += 0.1

    return Math.min(score, 1.0)
  }

  private static scoreLifeOpportunity(lead: B2BLeadFromB2C): number {
    let score = 0.3 // Base score

    // Family protection needs
    if (lead.has_children) score += 0.4
    if (lead.household_size && lead.household_size >= 2) score += 0.2

    // Financial capacity
    if (lead.income_monthly && lead.income_monthly > 5000) score += 0.2
    else if (lead.income_monthly && lead.income_monthly > 3000) score += 0.1

    // Age proxy (higher engagement = likely younger)
    if (lead.b2c_engagement_score > 80) score += 0.1

    return Math.min(score, 1.0)
  }

  private static scoreHomeOpportunity(lead: B2BLeadFromB2C): number {
    let score = 0.6 // Base score (home buyers are prime targets)

    // Purchase intent
    if (lead.lead_temperature === 'hot') score += 0.3
    else if (lead.lead_temperature === 'warm') score += 0.1

    // Engagement quality
    if (lead.b2c_engagement_score > 80) score += 0.1
    if (lead.simulation_count >= 3) score += 0.05

    return Math.min(score, 1.0)
  }

  private static explainHomeInsurance(lead: B2BLeadFromB2C): string {
    const budget = lead.budget_range
    const temp = lead.lead_temperature
    
    return `Interessato all'acquisto casa (budget ${budget}), lead ${temp}. Necessità protezione proprietà ad alto valore.`
  }

  private static explainLifeInsurance(lead: B2BLeadFromB2C): string {
    const family = lead.has_children ? 'con figli' : lead.household_size && lead.household_size >= 2 ? 'in coppia' : 'single'
    
    return `Profilo familiare ${family}, acquisto casa indica stabilità e responsabilità finanziaria.`
  }

  private static explainMobilityInsurance(lead: B2BLeadFromB2C): string {
    const mobility = lead.mobility.join(', ')
    
    return `Mobilità: ${mobility}. Stile di vita attivo richiede coperture mobilità complete.`
  }
}

export const b2cLeadGenerator = new B2CLeadGenerator()