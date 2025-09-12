// Advanced Insurance Propensity Scoring Engine
// Comprehensive coverage for all insurance product lines

export interface ComprehensiveInsurancePropensity {
  // EXISTING: Core propensities
  propensity_casa: number        // Home insurance (0-100)
  propensity_auto: number        // Auto insurance (0-100)
  propensity_vita: number        // Life insurance (0-100)  
  propensity_business: number    // Business/commercial (0-100)
  
  // NEW: Comprehensive Insurance Lines
  propensity_health: number      // Health/Medical insurance (0-100)
  propensity_travel: number      // Travel insurance (0-100)
  propensity_liability: number   // General liability (0-100)
  propensity_professional: number // Professional indemnity (0-100)
  propensity_cyber: number       // Cyber insurance (0-100)
  propensity_property_commercial: number // Commercial property (0-100)
  propensity_directors_officers: number  // D&O insurance (0-100)
  propensity_marine: number      // Marine/transport insurance (0-100)
  propensity_pension: number     // Pension/retirement plans (0-100)
  propensity_investment: number  // Investment-linked products (0-100)
  
  // RISK PROFILES
  risk_profile: 'low' | 'medium' | 'high' | 'premium'
  claims_prediction: number      // Predicted claims frequency (0-100)
  fraud_risk: number            // Anti-fraud score (0-100, lower is better)
  customer_lifetime_value: number // Predicted CLV in euros
}

export interface InsuranceLeadProfile extends ComprehensiveInsurancePropensity {
  // Personal Demographics
  age_bracket: '18-30' | '31-45' | '46-60' | '60+'
  income_bracket: 'low' | 'medium' | 'high' | 'premium'
  family_status: 'single' | 'couple' | 'family' | 'senior'
  employment_type: 'employee' | 'freelance' | 'business_owner' | 'retired'
  
  // Business Demographics (if applicable)
  business_size: 'micro' | 'small' | 'medium' | 'large' | null
  industry_vertical: string
  business_age: number // years in business
  
  // Territory Intelligence
  zona_risk_level: 'low' | 'medium' | 'high'
  market_penetration: number // % of zona already covered
  competitive_pressure: number // competitor density (0-100)
}

// Advanced propensity calculation engine
export class InsurancePropensityEngine {
  
  static calculateHealthInsurancePropensity(profile: any): number {
    let score = 50 // base score
    
    // Age factor - higher age = higher propensity
    if (profile.estimated_income > 50000) score += 20
    if (profile.family_size > 2) score += 15 // families need coverage
    if (profile.business_type?.includes('Healthcare')) score += 25
    if (profile.zona === 'Centro') score += 10 // urban professionals
    
    // Business owners and professionals higher propensity
    if (profile.partita_iva) score += 20
    if (profile.dipendenti && profile.dipendenti > 5) score += 15 // employee coverage
    
    return Math.min(95, Math.max(5, score))
  }
  
  static calculateProfessionalIndemnityPropensity(profile: any): number {
    let score = 20 // low base for general population
    
    // Professional services = high propensity
    const highRiskProfessions = [
      'Legal Services', 'Healthcare', 'Architecture', 'Engineering', 
      'Accounting', 'Consulting', 'Technology', 'Financial Services'
    ]
    
    if (profile.business_type && highRiskProfessions.some(prof => 
      profile.business_type.includes(prof) || profile.last_name.includes(prof.split(' ')[0])
    )) {
      score += 50
    }
    
    if (profile.partita_iva) score += 30 // all professionals need PI
    if (profile.estimated_income > 75000) score += 20 // high-value professionals
    if (profile.dipendenti && profile.dipendenti > 0) score += 15 // team liability
    
    return Math.min(95, Math.max(5, score))
  }
  
  static calculateCyberInsurancePropensity(profile: any): number {
    let score = 30 // moderate base - cyber is growing
    
    // Tech businesses = high propensity
    if (profile.business_type?.includes('Technology')) score += 40
    if (profile.business_type?.includes('Digital')) score += 35
    if (profile.website) score += 15 // online presence = cyber risk
    if (profile.linkedin_url) score += 10 // digital footprint
    
    // Business size factor
    if (profile.dipendenti && profile.dipendenti > 10) score += 25
    if (profile.fatturato_stimato > 500000) score += 20
    
    // Modern professionals
    if (profile.zona === 'Porta Nuova') score += 15 // tech district
    if (profile.estimated_income > 60000) score += 10
    
    return Math.min(95, Math.max(5, score))
  }
  
  static calculateDirectorsOfficersPropensity(profile: any): number {
    let score = 10 // very low base
    
    // Only relevant for businesses with structure
    if (!profile.partita_iva) return 5
    
    if (profile.dipendenti && profile.dipendenti > 5) score += 30
    if (profile.dipendenti && profile.dipendenti > 20) score += 40
    if (profile.fatturato_stimato > 1000000) score += 35
    
    // Corporate structures
    const corporateTypes = ['S.r.l.', 'S.p.A.', 'S.a.s.']
    if (corporateTypes.some(type => profile.last_name.includes(type))) score += 45
    
    // High-liability sectors
    if (profile.business_type?.includes('Finance')) score += 25
    if (profile.business_type?.includes('Healthcare')) score += 20
    if (profile.business_type?.includes('Legal')) score += 20
    
    return Math.min(95, Math.max(5, score))
  }
  
  static calculatePensionPropensity(profile: any): number {
    let score = 40 // moderate base - everyone needs retirement
    
    // Age factor - middle age = highest propensity
    const ageFromIncome = Math.floor(profile.estimated_income / 2000) + 25 // rough age estimate
    if (ageFromIncome >= 35 && ageFromIncome <= 55) score += 25
    if (ageFromIncome >= 25 && ageFromIncome <= 35) score += 15
    
    // Income factor
    if (profile.estimated_income > 40000) score += 20
    if (profile.estimated_income > 75000) score += 30
    
    // Business owners need private pension
    if (profile.partita_iva) score += 25
    if (profile.dipendenti && profile.dipendenti > 0) score += 15 // employee plans
    
    // Family factor
    if (profile.family_size > 2) score += 15
    
    return Math.min(95, Math.max(10, score))
  }
  
  static calculateTravelInsurancePropensity(profile: any): number {
    let score = 35 // moderate base
    
    // Income factor - higher income = more travel
    if (profile.estimated_income > 50000) score += 20
    if (profile.estimated_income > 100000) score += 35
    
    // Professional factor - business travel
    if (profile.business_type?.includes('Consulting')) score += 25
    if (profile.business_type?.includes('Technology')) score += 20
    if (profile.partita_iva) score += 15
    
    // Urban professionals travel more
    if (profile.zona === 'Centro' || profile.zona === 'Porta Nuova') score += 15
    if (profile.family_size > 2) score += 10 // family trips
    
    return Math.min(90, Math.max(5, score))
  }
  
  // Master function to calculate all propensities
  static calculateAllPropensities(profile: any): ComprehensiveInsurancePropensity {
    return {
      // Existing propensities (keep current values)
      propensity_casa: profile.propensity_casa || 50,
      propensity_auto: profile.propensity_auto || 50, 
      propensity_vita: profile.propensity_vita || 50,
      propensity_business: profile.propensity_business || 50,
      
      // New comprehensive propensities
      propensity_health: this.calculateHealthInsurancePropensity(profile),
      propensity_travel: this.calculateTravelInsurancePropensity(profile),
      propensity_liability: Math.min(85, (profile.propensity_business || 30) + 20),
      propensity_professional: this.calculateProfessionalIndemnityPropensity(profile),
      propensity_cyber: this.calculateCyberInsurancePropensity(profile),
      propensity_property_commercial: profile.partita_iva ? Math.min(80, (profile.propensity_casa || 40) + 25) : 5,
      propensity_directors_officers: this.calculateDirectorsOfficersPropensity(profile),
      propensity_marine: profile.business_type?.includes('Import') || profile.business_type?.includes('Export') ? 70 : 15,
      propensity_pension: this.calculatePensionPropensity(profile),
      propensity_investment: Math.min(75, Math.floor(profile.estimated_income / 1500) + 20),
      
      // Risk profiling
      risk_profile: this.calculateRiskProfile(profile),
      claims_prediction: this.calculateClaimsPrediction(profile),
      fraud_risk: this.calculateFraudRisk(profile),
      customer_lifetime_value: this.calculateCLV(profile)
    }
  }
  
  static calculateRiskProfile(profile: any): 'low' | 'medium' | 'high' | 'premium' {
    let riskScore = 50
    
    // Income stability
    if (profile.estimated_income > 75000) riskScore -= 15
    if (profile.partita_iva) riskScore += 10 // self-employed = higher risk
    
    // Business factors
    if (profile.dipendenti && profile.dipendenti > 10) riskScore -= 10 // established business
    if (profile.business_type?.includes('Construction')) riskScore += 20
    if (profile.business_type?.includes('Legal')) riskScore -= 10
    
    // Territory
    if (profile.zona === 'Centro') riskScore -= 5
    if (profile.zona === 'Provincia') riskScore += 10
    
    if (riskScore <= 35) return 'low'
    if (riskScore <= 55) return 'medium' 
    if (riskScore <= 75) return 'high'
    return 'premium'
  }
  
  static calculateClaimsPrediction(profile: any): number {
    let claimsScore = 25 // base prediction
    
    // Higher income = potentially more claims (more assets to insure)
    if (profile.estimated_income > 100000) claimsScore += 15
    
    // Business type risk factors
    if (profile.business_type?.includes('Construction')) claimsScore += 35
    if (profile.business_type?.includes('Transport')) claimsScore += 25
    if (profile.business_type?.includes('Healthcare')) claimsScore += 20
    if (profile.business_type?.includes('Legal')) claimsScore += 10
    
    // Family size (more people = more potential claims)
    claimsScore += (profile.family_size - 1) * 5
    
    return Math.min(85, Math.max(5, claimsScore))
  }
  
  static calculateFraudRisk(profile: any): number {
    let fraudRisk = 5 // low base risk
    
    // Red flags
    if (!profile.phone) fraudRisk += 20
    if (!profile.email && !profile.website) fraudRisk += 15
    if (!profile.partita_iva && profile.business_type) fraudRisk += 25
    
    // Protective factors
    if (profile.website && profile.linkedin_url) fraudRisk -= 10
    if (profile.dipendenti && profile.dipendenti > 5) fraudRisk -= 5
    if (profile.zona === 'Centro') fraudRisk -= 5
    
    return Math.min(90, Math.max(1, fraudRisk))
  }
  
  static calculateCLV(profile: any): number {
    // Customer Lifetime Value calculation
    let basePremium = 0
    
    // Estimate annual premium potential across all products
    basePremium += (profile.propensity_casa || 0) * 8  // Home: €800 avg premium
    basePremium += (profile.propensity_auto || 0) * 12  // Auto: €1200 avg premium  
    basePremium += (profile.propensity_vita || 0) * 15  // Life: €1500 avg premium
    basePremium += (profile.propensity_business || 0) * 25 // Business: €2500 avg premium
    
    // Professional and specialized products (higher premiums)
    const comprehensivePropensity = this.calculateAllPropensities(profile)
    basePremium += comprehensivePropensity.propensity_professional * 35 // €3500 avg
    basePremium += comprehensivePropensity.propensity_cyber * 20 // €2000 avg
    basePremium += comprehensivePropensity.propensity_directors_officers * 45 // €4500 avg
    
    // 7-year average customer lifecycle * retention rate
    const retentionRate = profile.zona === 'Centro' ? 0.85 : 0.75
    
    return Math.floor(basePremium * 7 * retentionRate)
  }
}

// Insurance Product Portfolio Constants
export const INSURANCE_PRODUCTS = {
  // Personal Lines
  CASA: { name: 'Assicurazione Casa', avgPremium: 800, category: 'personal' },
  AUTO: { name: 'Assicurazione Auto', avgPremium: 1200, category: 'personal' },
  VITA: { name: 'Assicurazione Vita', avgPremium: 1500, category: 'personal' },
  HEALTH: { name: 'Assicurazione Salute', avgPremium: 2200, category: 'personal' },
  TRAVEL: { name: 'Assicurazione Viaggi', avgPremium: 150, category: 'personal' },
  PENSION: { name: 'Piano Pensionistico', avgPremium: 3000, category: 'personal' },
  INVESTMENT: { name: 'Polizza Investimento', avgPremium: 4000, category: 'personal' },
  
  // Business Lines  
  BUSINESS: { name: 'Assicurazione Aziendale', avgPremium: 2500, category: 'business' },
  LIABILITY: { name: 'Responsabilità Civile', avgPremium: 1800, category: 'business' },
  PROFESSIONAL: { name: 'RC Professionale', avgPremium: 3500, category: 'business' },
  CYBER: { name: 'Cyber Insurance', avgPremium: 2000, category: 'business' },
  PROPERTY_COMMERCIAL: { name: 'Immobili Commerciali', avgPremium: 4500, category: 'business' },
  DIRECTORS_OFFICERS: { name: 'D&O Insurance', avgPremium: 4500, category: 'business' },
  MARINE: { name: 'Assicurazione Trasporti', avgPremium: 3200, category: 'business' }
} as const

export type InsuranceProductType = keyof typeof INSURANCE_PRODUCTS