// Database types
export interface PersonCard {
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
}

export interface PolicySuggestion {
  policy: 'casa' | 'vita' | 'infortuni' | 'rc_auto' | 'property' | 'business_continuity' | 'benefit_dipendenti'
  confidence: number // 0..1
  reason: string
}

export interface SearchResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface List {
  id: string
  org_id: string
  type: 'person' | 'company'
  name: string
  created_by: string
  created_at: string
}

// Filter types
export interface PersonFilters {
  q?: string
  city?: string
  has_children?: boolean
  min_income?: number
  risk_home_min?: number
  opportunity_home_min?: number
}

export interface CompanyFilters {
  q?: string
  city?: string
  ateco?: string
  min_employees?: number
  risk_flood_min?: number
  opportunity_property_min?: number
}

// Policy types
export const POLICY_LABELS = {
  casa: 'Assicurazione Casa',
  vita: 'Assicurazione Vita',
  infortuni: 'Assicurazione Infortuni',
  rc_auto: 'RC Auto',
  property: 'Property Business',
  business_continuity: 'Business Continuity',
  benefit_dipendenti: 'Benefit Dipendenti'
} as const

export const LIFESTYLE_LABELS = {
  family: 'Famiglia',
  tech: 'Tech',
  professional: 'Professionale',
  travel: 'Viaggi',
  sport: 'Sport',
  young: 'Giovane',
  nightlife: 'Vita notturna',
  eco: 'Eco-friendly',
  culture: 'Cultura',
  art: 'Arte',
  traditional: 'Tradizionale'
} as const

export const MOBILITY_LABELS = {
  car: 'Auto',
  bike: 'Bici',
  scooter: 'Scooter',
  public_transport: 'Trasporti Pubblici',
  walk: 'A Piedi'
} as const