/**
 * Territory Intelligence & Market Insights
 * 
 * Cross-analysis of demographic data, POI, companies, and B2C behavior
 * to provide actionable insurance recommendations for agents
 */

export interface TerritoryProfile {
  area: {
    name: string
    city: string
    municipality: string
    type: 'neighborhood' | 'district' | 'municipality'
    coordinates: { lat: number; lng: number }
  }
  
  demographics: {
    population: number
    avgAge: number
    familiesWithChildren: number
    avgIncome: number
    educationLevel: 'low' | 'medium' | 'high'
    employmentRate: number
    homeOwnership: number
  }

  realEstate: {
    avgHomePrice: number
    priceGrowthYoy: number
    transactionVolume: number
    newConstructions: number
    avgHomeSizeM2: number
    propertyTypes: {
      apartments: number
      houses: number
      commercial: number
    }
  }

  infrastructure: {
    schools: {
      elementary: number
      middle: number
      high: number
      universities: number
      avgRating: number
    }
    healthcare: {
      hospitals: number
      clinics: number
      pharmacies: number
      avgDistance: number
    }
    transport: {
      metroStations: number
      busStops: number
      trainStations: number
      avgCommuteTime: number
    }
    services: {
      supermarkets: number
      banks: number
      restaurants: number
      gyms: number
      parks: number
    }
  }

  risks: {
    flood: number        // 0-1 scale
    earthquake: number   // 0-1 scale 
    crime: number        // 0-1 scale
    traffic: number      // 0-1 scale
    fire: number         // 0-1 scale
    airQuality: number   // 0-1 scale (1 = good)
  }

  businessActivity: {
    totalCompanies: number
    byAteco: Record<string, number>  // ATECO code -> count
    avgEmployees: number
    avgRevenue: number
    startups: number
    corporateHeadquarters: number
  }

  b2cActivity: {
    budgetcasaUsers: number
    avgBudget: number
    popularNeighborhoods: string[]
    seasonalTrends: {
      q1: number
      q2: number
      q3: number
      q4: number
    }
  }
}

export interface InsuranceOpportunity {
  type: 'home' | 'life' | 'business' | 'mobility' | 'health'
  priority: 'high' | 'medium' | 'low'
  confidence: number  // 0-1
  targetSegment: string
  reasoning: string
  marketSize: number
  competition: 'low' | 'medium' | 'high'
  suggestedProducts: string[]
}

export interface CompanyContact {
  id: string
  name: string
  ateco: string
  atecoLabel: string
  address: string
  city: string
  municipality: string
  employees: number
  revenue?: string
  website?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  
  // Contact persons
  contacts: {
    role: 'CEO' | 'CFO' | 'HR' | 'Office Manager' | 'Risk Manager'
    name?: string
    email?: string
    phone?: string
    linkedin?: string
  }[]

  // Insurance context
  insuranceProfile: {
    currentProviders?: string[]
    renewalDates?: string[]
    riskFactors: string[]
    opportunities: InsuranceOpportunity[]
    lastContactDate?: string
    interactionHistory: {
      date: string
      type: 'email' | 'call' | 'meeting' | 'quote'
      notes: string
      outcome: 'interested' | 'not_interested' | 'follow_up' | 'closed'
    }[]
  }
}

export interface TerritoryInsights {
  territory: TerritoryProfile
  opportunities: InsuranceOpportunity[]
  targetCompanies: CompanyContact[]
  marketIntelligence: {
    trends: {
      trend: string
      impact: 'positive' | 'negative' | 'neutral'
      description: string
    }[]
    competitorAnalysis: {
      provider: string
      marketShare: number
      strengths: string[]
      weaknesses: string[]
    }[]
    recommendations: {
      action: string
      priority: 'high' | 'medium' | 'low'
      timeline: string
      expectedReturn: string
    }[]
  }
}

export class TerritoryIntelligenceEngine {
  
  /**
   * Analyze territory and generate actionable insights
   */
  static analyzeTerritoryOpportunities(territory: TerritoryProfile): InsuranceOpportunity[] {
    const opportunities: InsuranceOpportunity[] = []

    // Home Insurance Analysis
    const homeOpportunity = this.analyzeHomeInsuranceOpportunity(territory)
    if (homeOpportunity) opportunities.push(homeOpportunity)

    // Business Insurance Analysis
    const businessOpportunity = this.analyzeBusinessInsuranceOpportunity(territory)
    if (businessOpportunity) opportunities.push(businessOpportunity)

    // Life Insurance Analysis
    const lifeOpportunity = this.analyzeLifeInsuranceOpportunity(territory)
    if (lifeOpportunity) opportunities.push(lifeOpportunity)

    // Health Insurance Analysis  
    const healthOpportunity = this.analyzeHealthInsuranceOpportunity(territory)
    if (healthOpportunity) opportunities.push(healthOpportunity)

    return opportunities.sort((a, b) => b.confidence - a.confidence)
  }

  private static analyzeHomeInsuranceOpportunity(territory: TerritoryProfile): InsuranceOpportunity | null {
    const { demographics, realEstate, risks, b2cActivity } = territory

    // Market size calculation
    const potentialHomes = demographics.population * demographics.homeOwnership
    const marketSize = potentialHomes * (realEstate.avgHomePrice * 0.003) // 0.3% premium

    // Risk assessment
    const riskScore = (risks.flood + risks.earthquake + risks.fire + risks.crime) / 4
    const growthScore = Math.min(realEstate.priceGrowthYoy / 10, 1) // Normalize to 0-1

    // B2C activity bonus
    const b2cBonus = Math.min(b2cActivity.budgetcasaUsers / 100, 0.3) // Up to 30% bonus

    const confidence = Math.min(
      (riskScore * 0.4) + 
      (growthScore * 0.3) + 
      (demographics.avgIncome / 100000 * 0.2) + 
      b2cBonus * 0.1, 
      1
    )

    if (confidence < 0.3) return null

    const priority: 'high' | 'medium' | 'low' = 
      confidence > 0.7 ? 'high' : 
      confidence > 0.5 ? 'medium' : 'low'

    return {
      type: 'home',
      priority,
      confidence,
      targetSegment: `Proprietari case (${Math.round(potentialHomes).toLocaleString()})`,
      reasoning: `Alto rischio ${riskScore > 0.6 ? 'naturale/criminalità' : 'moderato'}, crescita immobiliare ${realEstate.priceGrowthYoy.toFixed(1)}%, reddito medio €${demographics.avgIncome.toLocaleString()}`,
      marketSize,
      competition: riskScore > 0.7 ? 'high' : 'medium',
      suggestedProducts: [
        'Polizza Casa Multirischio',
        riskScore > 0.6 ? 'Copertura Eventi Naturali' : '',
        risks.crime > 0.6 ? 'Protezione Furto Premium' : '',
        'Responsabilità Civile Proprietario'
      ].filter(Boolean)
    }
  }

  private static analyzeBusinessInsuranceOpportunity(territory: TerritoryProfile): InsuranceOpportunity | null {
    const { businessActivity, risks, infrastructure } = territory

    if (businessActivity.totalCompanies < 10) return null

    // Focus on high-value sectors
    const techCompanies = businessActivity.byAteco['62.01'] || 0  // IT consulting
    const manufactureCompanies = businessActivity.byAteco['25.62'] || 0  // Manufacturing
    const retailCompanies = businessActivity.byAteco['47.11'] || 0  // Retail

    const prioritySectors = techCompanies + manufactureCompanies + retailCompanies
    const avgEmployees = businessActivity.avgEmployees

    // Market size estimation
    const marketSize = businessActivity.totalCompanies * avgEmployees * 2000 // €2k per employee avg

    // Risk-based scoring
    const businessRisk = (risks.flood + risks.fire + risks.crime) / 3
    const growthPotential = businessActivity.startups / businessActivity.totalCompanies

    const confidence = Math.min(
      (prioritySectors / businessActivity.totalCompanies * 0.4) +
      (businessRisk * 0.3) +
      (growthPotential * 0.2) +
      (avgEmployees / 50 * 0.1),
      1
    )

    if (confidence < 0.4) return null

    return {
      type: 'business',
      priority: confidence > 0.7 ? 'high' : confidence > 0.5 ? 'medium' : 'low',
      confidence,
      targetSegment: `Aziende ${avgEmployees}+ dipendenti (${prioritySectors} priority)`,
      reasoning: `${businessActivity.totalCompanies} aziende, ${prioritySectors} settori high-value, rischio ${businessRisk > 0.6 ? 'alto' : 'medio'}, ${businessActivity.startups} startup`,
      marketSize,
      competition: businessRisk > 0.6 ? 'medium' : 'high',
      suggestedProducts: [
        'Polizza Responsabilità Civile Professionale',
        'Copertura Interruzione Attività',
        businessRisk > 0.6 ? 'Multirischio Uffici' : '',
        techCompanies > 5 ? 'Cyber Risk Protection' : '',
        'Benefici Dipendenti Package'
      ].filter(Boolean)
    }
  }

  private static analyzeLifeInsuranceOpportunity(territory: TerritoryProfile): InsuranceOpportunity | null {
    const { demographics, infrastructure } = territory

    // Target families with children and higher income
    const targetFamilies = demographics.familiesWithChildren
    const marketSize = targetFamilies * demographics.avgIncome * 0.05 // 5% of income typical

    // Scoring based on family profile and infrastructure
    const familyScore = targetFamilies / demographics.population
    const incomeScore = Math.min(demographics.avgIncome / 80000, 1) // Normalize to 80k
    const infraScore = (infrastructure.schools.elementary + infrastructure.healthcare.hospitals) / 10

    const confidence = Math.min(
      (familyScore * 0.5) +
      (incomeScore * 0.3) +
      (infraScore * 0.2),
      1
    )

    if (confidence < 0.3) return null

    return {
      type: 'life',
      priority: confidence > 0.6 ? 'high' : 'medium',
      confidence,
      targetSegment: `Famiglie con figli (${targetFamilies.toLocaleString()})`,
      reasoning: `${Math.round(familyScore * 100)}% famiglie con figli, reddito medio €${demographics.avgIncome.toLocaleString()}, buone infrastrutture`,
      marketSize,
      competition: demographics.avgIncome > 60000 ? 'high' : 'medium',
      suggestedProducts: [
        'Assicurazione Vita Famiglia',
        'Polizza Infortuni Bambini',
        demographics.avgIncome > 60000 ? 'Piano Pensione Integrativo' : '',
        'Tutela Legale Famiglia'
      ].filter(Boolean)
    }
  }

  private static analyzeHealthInsuranceOpportunity(territory: TerritoryProfile): InsuranceOpportunity | null {
    const { demographics, infrastructure } = territory

    // Health opportunity based on income and healthcare access
    const healthcareDistance = infrastructure.healthcare.avgDistance
    const incomeLevel = demographics.avgIncome

    if (incomeLevel < 40000) return null // Low income = low health insurance uptake

    const accessibilityScore = healthcareDistance > 10 ? 0.8 : 0.4 // Higher need if far from hospitals
    const incomeScore = Math.min(incomeLevel / 100000, 1)
    const ageScore = demographics.avgAge > 40 ? 0.7 : 0.3 // Older = higher health consciousness

    const confidence = Math.min(
      (accessibilityScore * 0.4) +
      (incomeScore * 0.4) +
      (ageScore * 0.2),
      1
    )

    if (confidence < 0.4) return null

    const marketSize = demographics.population * incomeLevel * 0.02 // 2% of income

    return {
      type: 'health',
      priority: confidence > 0.6 ? 'high' : 'medium', 
      confidence,
      targetSegment: `Professionisti ${demographics.avgAge.toFixed(0)}+ anni`,
      reasoning: `Reddito elevato €${incomeLevel.toLocaleString()}, distanza sanità ${healthcareDistance}km, età media ${demographics.avgAge.toFixed(0)} anni`,
      marketSize,
      competition: incomeLevel > 80000 ? 'high' : 'medium',
      suggestedProducts: [
        'Assicurazione Sanitaria Integrativa',
        demographics.avgAge > 45 ? 'Long Term Care' : '',
        incomeLevel > 80000 ? 'Sanità Premium' : 'Sanità Base',
        'Check-up Preventivi Package'
      ].filter(Boolean)
    }
  }

  /**
   * Generate company targeting recommendations for territory
   */
  static generateCompanyTargeting(territory: TerritoryProfile, companies: CompanyContact[]): {
    highPriority: CompanyContact[]
    recommendations: {
      company: CompanyContact
      suggestedApproach: string
      products: string[]
      urgency: 'high' | 'medium' | 'low'
      reasoning: string
    }[]
  } {
    const territoryOpportunities = this.analyzeTerritoryOpportunities(territory)
    const recommendations: any[] = []

    for (const company of companies) {
      const companyScore = this.scoreCompanyForTerritory(company, territory, territoryOpportunities)
      
      if (companyScore.score > 0.6) {
        recommendations.push({
          company,
          suggestedApproach: companyScore.approach,
          products: companyScore.products,
          urgency: companyScore.urgency,
          reasoning: companyScore.reasoning
        })
      }
    }

    const highPriority = recommendations
      .filter(r => r.urgency === 'high')
      .map(r => r.company)

    return {
      highPriority,
      recommendations: recommendations.sort((a, b) => {
        const urgencyScore = { high: 3, medium: 2, low: 1 }
        return urgencyScore[b.urgency] - urgencyScore[a.urgency]
      })
    }
  }

  private static scoreCompanyForTerritory(
    company: CompanyContact, 
    territory: TerritoryProfile, 
    opportunities: InsuranceOpportunity[]
  ): {
    score: number
    approach: string
    products: string[]
    urgency: 'high' | 'medium' | 'low'
    reasoning: string
  } {
    const { businessActivity, risks } = territory
    
    // Company size scoring
    const sizeScore = Math.min(company.employees / 50, 1) // Normalize to 50 employees
    
    // Sector alignment
    const sectorOpportunity = opportunities.find(o => 
      o.type === 'business' && o.suggestedProducts.some(p => 
        this.matchesCompanySector(p, company.ateco)
      )
    )
    const sectorScore = sectorOpportunity ? sectorOpportunity.confidence : 0.3

    // Risk exposure
    const riskScore = this.calculateCompanyRiskExposure(company, territory)
    
    // Contact readiness  
    const contactScore = company.contacts.length > 0 ? 0.8 : 0.4
    
    const totalScore = (sizeScore * 0.3) + (sectorScore * 0.3) + (riskScore * 0.3) + (contactScore * 0.1)

    // Generate approach strategy
    const approach = this.generateApproachStrategy(company, territory, riskScore)
    const products = this.recommendProductsForCompany(company, territory, opportunities)
    
    const urgency: 'high' | 'medium' | 'low' = 
      totalScore > 0.8 ? 'high' :
      totalScore > 0.6 ? 'medium' : 'low'

    const reasoning = this.generateCompanyScoreReasoning(company, territory, riskScore, sectorScore)

    return {
      score: totalScore,
      approach,
      products,
      urgency,
      reasoning
    }
  }

  private static matchesCompanySector(product: string, ateco: string): boolean {
    // Simple sector matching - would be more sophisticated in production
    const techSectors = ['62.01', '63.11', '58.29']
    const manufacturingSectors = ['25.62', '28.11']
    
    if (product.includes('Cyber') && techSectors.includes(ateco)) return true
    if (product.includes('Multirischio') && manufacturingSectors.includes(ateco)) return true
    
    return false
  }

  private static calculateCompanyRiskExposure(company: CompanyContact, territory: TerritoryProfile): number {
    const { risks } = territory
    const { ateco, employees } = company

    // Base risk from territory
    let riskScore = (risks.flood + risks.fire + risks.crime) / 3

    // Sector-specific risk multipliers
    const highRiskSectors = ['25.62', '47.11'] // Manufacturing, retail
    if (highRiskSectors.includes(ateco)) riskScore *= 1.3

    // Size multiplier
    if (employees > 100) riskScore *= 1.2

    return Math.min(riskScore, 1)
  }

  private static generateApproachStrategy(company: CompanyContact, territory: TerritoryProfile, riskScore: number): string {
    const hasContacts = company.contacts.length > 0
    const highRisk = riskScore > 0.7

    if (hasContacts && highRisk) {
      return "Contatto diretto CEO/CFO evidenziando rischi territoriali specifici e casi studio settore"
    } else if (hasContacts) {
      return "Approccio consultivo a HR/Office Manager per analisi coperture esistenti e gap"
    } else if (highRisk) {
      return "Cold outreach con risk assessment gratuito personalizzato per zona/settore"
    } else {
      return "LinkedIn outreach + email sequencing con value proposition settore-specifica"
    }
  }

  private static recommendProductsForCompany(
    company: CompanyContact, 
    territory: TerritoryProfile, 
    opportunities: InsuranceOpportunity[]
  ): string[] {
    const products = []
    const { employees, ateco } = company
    const { risks } = territory

    // Base products for all companies
    products.push('Responsabilità Civile Professionale')

    // Size-based products
    if (employees >= 10) {
      products.push('Benefici Dipendenti')
    }
    if (employees >= 50) {
      products.push('Polizza Dirigenti')
    }

    // Risk-based products
    if (risks.flood > 0.6 || risks.fire > 0.6) {
      products.push('Multirischio Uffici')
    }
    if (risks.crime > 0.6) {
      products.push('Furto e Rapina')
    }

    // Sector-specific products
    const techSectors = ['62.01', '63.11']
    if (techSectors.includes(ateco)) {
      products.push('Cyber Risk Protection')
      products.push('Errori & Omissioni IT')
    }

    const manufacturingSectors = ['25.62']
    if (manufacturingSectors.includes(ateco)) {
      products.push('Responsabilità Prodotto')
      products.push('Interruzione Attività')
    }

    return products
  }

  private static generateCompanyScoreReasoning(
    company: CompanyContact, 
    territory: TerritoryProfile, 
    riskScore: number, 
    sectorScore: number
  ): string {
    const elements = []
    
    if (company.employees >= 20) elements.push(`${company.employees} dipendenti`)
    if (riskScore > 0.6) elements.push('alto rischio territoriale')
    if (sectorScore > 0.6) elements.push('settore prioritario')
    if (company.contacts.length > 0) elements.push('contatti disponibili')
    
    return elements.join(', ') || 'profilo standard'
  }
}