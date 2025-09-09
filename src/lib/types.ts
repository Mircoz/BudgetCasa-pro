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
}

export interface CompanyFilters {
  q?: string
  city?: string
  ateco?: string
  min_employees?: number
  risk_flood_min?: number
  op_property_min?: number
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

