// Database types
export interface PersonCard {
  id: string
  name?: string
  geo_city?: string
  lifestyle?: string[]
  mobility?: string[]
  hot_policy?: 'prima_casa' | 'rc_auto' | 'cane' | 'sport' | 'vita' | 'salute' | 'infortuni'
  policy_temperature?: 'hot' | 'warm' | 'cold'
  scores: {
    risk_home?: number
    risk_mobility?: number
    opportunity_home?: number
    opportunity_life?: number
  }
  
  // Enhanced fields with hierarchical information
  criticalInfo?: {
    leadScore?: number
    nextAction?: string
    revenueOpportunity?: number
    urgencyScore?: number
  }
  
  // Additional B2C integration fields
  b2c_engagement?: {
    simulationCount?: number
    lastActivity?: string
    engagementScore?: number
  }
  
  // Extended demographics
  demographics?: {
    age?: number
    income?: number
    familySize?: number
    hasChildren?: boolean
    email?: string
    phone?: string
  }
}

export interface CompanyCard {
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
    opportunity_employee_benefits?: number
  }
  
  // Enhanced fields with hierarchical information
  criticalInfo?: {
    leadScore?: number
    nextAction?: string
    revenueOpportunity?: number
    urgencyScore?: number
  }
  
  // Business intelligence fields
  businessHealth?: {
    yearsInBusiness?: number
    financialRating?: string
    growthTrend?: 'growing' | 'stable' | 'declining'
    cashFlowStability?: number
  }
  
  // Property and risk details
  propertyDetails?: {
    buildingAge?: number
    totalValue?: number
    riskFactors?: string[]
    lastRenovation?: string
  }
}

export interface PolicySuggestion {
  policy: 'casa' | 'vita' | 'infortuni' | 'rc_auto' | 'property' | 'business_continuity' | 'benefit_dipendenti'
  confidence: number // 0..1
  reason: string
  
  // Enhanced suggestion fields
  priority?: number // 1-10
  estimatedPremium?: number
  timeframe?: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  triggers?: string[] // what triggered this suggestion
}

export interface SearchResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Filter types
export interface PersonFilters {
  q?: string
  city?: string
  has_children?: boolean
  min_income?: number
  risk_home_min?: number
  opportunity_home_min?: number
  hot_policy?: 'prima_casa' | 'rc_auto' | 'cane' | 'sport' | 'vita' | 'salute' | 'infortuni'
  policy_temperature?: 'hot' | 'warm' | 'cold'
  
  // Enhanced filters for prioritization
  min_lead_score?: number
  urgency_level?: 'low' | 'medium' | 'high'
  next_action?: string
  revenue_opportunity_min?: number
  life_event?: 'recent' | 'predicted'
  engagement_level?: 'high' | 'medium' | 'low'
}

export interface CompanyFilters {
  q?: string
  city?: string
  ateco?: string
  min_employees?: number
  risk_flood_min?: number
  op_property_min?: number
  
  // Enhanced business filters
  min_lead_score?: number
  business_health?: 'excellent' | 'good' | 'fair' | 'poor'
  growth_trend?: 'growing' | 'stable' | 'declining'
  revenue_opportunity_min?: number
  building_age_max?: number
  financial_rating?: string
}

export interface List {
  id: string
  org_id: string
  type: 'person' | 'company'
  name: string
  created_by: string
  created_at: string
}

// Constants and labels
export const POLICY_LABELS = {
  casa: 'Assicurazione Casa',
  prima_casa: 'Prima Casa',
  vita: 'Assicurazione Vita',
  infortuni: 'Infortuni',
  rc_auto: 'RC Auto',
  cane: 'Assicurazione Cane/Animali',
  sport: 'Assicurazione Sport',
  salute: 'Assicurazione Salute',
  property: 'Polizza Property',
  business_continuity: 'Business Continuity',
  benefit_dipendenti: 'Benefici Dipendenti'
} as const

export const LIFESTYLE_LABELS = {
  sport: 'Sport',
  travel: 'Viaggi',
  family: 'Famiglia',
  wellness: 'Benessere',
  outdoor: 'Outdoor',
  partner: 'In Coppia',
  tech: 'Tecnologia'
} as const

export const MOBILITY_LABELS = {
  car: 'Auto',
  bike: 'Bicicletta', 
  scooter: 'Scooter',
  public_transport: 'Mezzi Pubblici',
  walk: 'A Piedi'
} as const

// Enhanced action types for next best actions
export const ACTION_LABELS = {
  call_immediate: 'Call Immediately',
  call_scheduled: 'Schedule Call',
  email_personalized: 'Send Personalized Email',
  meeting_request: 'Request Meeting',
  nurture_campaign: 'Add to Nurture Campaign',
  wait_monitor: 'Wait and Monitor',
  competitive_intercept: 'Competitive Intercept',
  life_event_follow: 'Follow Life Event'
} as const

// Priority levels for information display
export const PRIORITY_LEVELS = {
  critical: 'Critical - Always Show',
  context: 'Context - On Demand',
  detail: 'Detail - Deep Dive'
} as const

// Enhanced lead scoring categories
export const LEAD_SCORE_CATEGORIES = {
  demographic: 'Demographic Fit',
  behavioral: 'Behavioral Indicators', 
  temporal: 'Timing Factors',
  financial: 'Financial Capacity',
  risk: 'Risk Profile',
  engagement: 'Engagement Level'
} as const

