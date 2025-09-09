import type { PersonCard, CompanyCard, PersonFilters, CompanyFilters, SearchResponse, PolicySuggestion } from './types'
import { B2BLeadFromB2C, InsuranceLeadScorer } from './b2c-integration'

// Mock B2C leads from BudgetCasa.it user simulations
const mockB2CLeads: B2BLeadFromB2C[] = [
  {
    id: 'b2c_user123',
    source: 'budgetcasa_b2c',
    name: 'Marco Ferrari',
    email: 'marco.ferrari@email.com',
    geo_city: 'Milano',
    geo_municipality: 'Milano',
    geo_quarter: 'Isola',
    household_size: 2,
    has_children: false,
    lifestyle: ['sport', 'travel', 'partner'],
    mobility: ['car', 'bike'],
    income_monthly: 6500,
    intent_buy_home: true,
    budget_range: '600K-800K',
    property_type_preference: 'apartment',
    desired_sqm: 85,
    down_payment_available: 150000,
    simulation_count: 4,
    last_simulation_date: '2025-09-07T10:30:00Z',
    favorite_neighborhoods: ['Isola', 'Brera', 'Navigli'],
    lead_temperature: 'hot',
    b2c_engagement_score: 92,
    created_at: '2025-09-07T10:30:00Z'
  },
  {
    id: 'b2c_user456',
    source: 'budgetcasa_b2c',
    name: 'Elena Rossi',
    email: 'elena.rossi@email.com',
    geo_city: 'Roma',
    geo_municipality: 'Roma',
    geo_quarter: 'Parioli',
    household_size: 4,
    has_children: true,
    lifestyle: ['family', 'wellness'],
    mobility: ['car', 'public_transport'],
    income_monthly: 8500,
    intent_buy_home: true,
    budget_range: '800K-1M',
    property_type_preference: 'house',
    desired_sqm: 120,
    down_payment_available: 200000,
    simulation_count: 6,
    last_simulation_date: '2025-09-06T14:15:00Z',
    favorite_neighborhoods: ['Parioli', 'Flaminio'],
    lead_temperature: 'hot',
    b2c_engagement_score: 88,
    created_at: '2025-09-05T09:45:00Z'
  },
  {
    id: 'b2c_user789',
    source: 'budgetcasa_b2c',
    name: 'Giuseppe Bianchi',
    email: 'g.bianchi@email.com',
    geo_city: 'Napoli',
    geo_municipality: 'Napoli', 
    geo_quarter: 'Vomero',
    household_size: 1,
    has_children: false,
    lifestyle: ['outdoor'],
    mobility: ['car'],
    income_monthly: 4200,
    intent_buy_home: true,
    budget_range: '400K-600K',
    property_type_preference: 'apartment',
    desired_sqm: 75,
    down_payment_available: 80000,
    simulation_count: 2,
    last_simulation_date: '2025-09-04T16:20:00Z',
    favorite_neighborhoods: ['Vomero'],
    lead_temperature: 'warm',
    b2c_engagement_score: 65,
    created_at: '2025-09-04T16:20:00Z'
  }
]

// Convert B2C leads to PersonCard format for display
function convertB2CLeadToPersonCard(b2cLead: B2BLeadFromB2C): PersonCard {
  const insuranceScores = InsuranceLeadScorer.scoreInsuranceOpportunities(b2cLead)
  
  // Determine hot policy based on B2C lead characteristics
  let hot_policy: PersonCard['hot_policy'] = 'prima_casa'
  if (b2cLead.intent_buy_home && b2cLead.budget_range) {
    hot_policy = 'prima_casa'
  } else if (b2cLead.lifestyle?.includes('sport')) {
    hot_policy = 'sport'
  } else if (b2cLead.mobility?.includes('car')) {
    hot_policy = 'rc_auto'
  }
  
  return {
    id: b2cLead.id,
    name: b2cLead.name,
    geo_city: b2cLead.geo_city,
    lifestyle: b2cLead.lifestyle,
    mobility: b2cLead.mobility,
    hot_policy,
    policy_temperature: b2cLead.lead_temperature,
    scores: insuranceScores
  }
}

// Mock data for development - including B2C converted leads
const mockPersons: PersonCard[] = [
  // B2C-sourced leads (premium quality)
  ...mockB2CLeads.map(convertB2CLeadToPersonCard),
  // Original mock leads
  {
    id: '1',
    name: 'Mario Rossi',
    geo_city: 'Milano',
    lifestyle: ['sport', 'travel'],
    mobility: ['car', 'bike'],
    hot_policy: 'sport',
    policy_temperature: 'hot',
    scores: {
      risk_home: 0.75,
      risk_mobility: 0.60,
      opportunity_home: 0.85,
      opportunity_life: 0.70
    }
  },
  {
    id: '2', 
    name: 'Laura Bianchi',
    geo_city: 'Roma',
    lifestyle: ['family', 'wellness'],
    mobility: ['car', 'public_transport'],
    hot_policy: 'prima_casa',
    policy_temperature: 'hot',
    scores: {
      risk_home: 0.65,
      risk_mobility: 0.45,
      opportunity_home: 0.90,
      opportunity_life: 0.80
    }
  },
  {
    id: '3',
    name: 'Giuseppe Verdi', 
    geo_city: 'Napoli',
    lifestyle: ['outdoor', 'family'],
    mobility: ['car'],
    hot_policy: 'rc_auto',
    policy_temperature: 'warm',
    scores: {
      risk_home: 0.80,
      risk_mobility: 0.70,
      opportunity_home: 0.75,
      opportunity_life: 0.65
    }
  },
  {
    id: '4',
    name: 'Francesca Gallo', 
    geo_city: 'Torino',
    lifestyle: ['family', 'tech'],
    mobility: ['car'],
    hot_policy: 'cane',
    policy_temperature: 'hot',
    scores: {
      risk_home: 0.55,
      risk_mobility: 0.40,
      opportunity_home: 0.75,
      opportunity_life: 0.85
    }
  },
  {
    id: '5',
    name: 'Alessandro Conti', 
    geo_city: 'Firenze',
    lifestyle: ['sport', 'outdoor'],
    mobility: ['bike', 'car'],
    hot_policy: 'infortuni',
    policy_temperature: 'warm',
    scores: {
      risk_home: 0.60,
      risk_mobility: 0.75,
      opportunity_home: 0.65,
      opportunity_life: 0.70
    }
  }
]

const mockCompanies: CompanyCard[] = [
  {
    id: '1',
    name: 'TechCorp Italia S.r.l.',
    ateco: '62.01',
    geo_city: 'Milano', 
    employees: 45,
    scores: {
      risk_flood: 0.30,
      risk_crime: 0.25,
      risk_business_continuity: 0.40,
      opportunity_employee_benefits: 0.85,
      opportunity_property: 0.75
    }
  },
  {
    id: '2',
    name: 'Innovazione Digitale S.p.A.',
    ateco: '63.11',
    geo_city: 'Roma',
    employees: 120, 
    scores: {
      risk_flood: 0.20,
      risk_crime: 0.35,
      risk_business_continuity: 0.30,
      opportunity_employee_benefits: 0.90,
      opportunity_property: 0.80
    }
  },
  {
    id: '3',
    name: 'Manifattura Sud S.r.l.',
    ateco: '25.62',
    geo_city: 'Napoli',
    employees: 25,
    scores: {
      risk_flood: 0.60,
      risk_crime: 0.45,
      risk_business_continuity: 0.55,
      opportunity_employee_benefits: 0.70,
      opportunity_property: 0.85
    }
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function searchPersons(filters: PersonFilters & { page?: number; page_size?: number }): Promise<SearchResponse<PersonCard>> {
  await delay(500) // Simulate network delay
  
  let filteredPersons = [...mockPersons]
  
  // Apply filters
  if (filters.city) {
    filteredPersons = filteredPersons.filter(p => p.geo_city === filters.city)
  }
  
  if (filters.q) {
    filteredPersons = filteredPersons.filter(p => 
      p.name?.toLowerCase().includes(filters.q!.toLowerCase()) ||
      p.geo_city?.toLowerCase().includes(filters.q!.toLowerCase())
    )
  }
  
  if (filters.min_income) {
    // Mock filter - in reality this would be in database
    filteredPersons = filteredPersons.filter(p => Math.random() > 0.3) // simulate income filter
  }
  
  if (filters.risk_home_min) {
    filteredPersons = filteredPersons.filter(p => (p.scores.risk_home || 0) >= filters.risk_home_min!)
  }
  
  if (filters.opportunity_home_min) {
    filteredPersons = filteredPersons.filter(p => (p.scores.opportunity_home || 0) >= filters.opportunity_home_min!)
  }

  if (filters.hot_policy) {
    filteredPersons = filteredPersons.filter(p => p.hot_policy === filters.hot_policy)
  }

  if (filters.policy_temperature) {
    filteredPersons = filteredPersons.filter(p => p.policy_temperature === filters.policy_temperature)
  }
  
  const page = filters.page || 1
  const pageSize = filters.page_size || 12
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  const paginatedResults = filteredPersons.slice(startIndex, endIndex)
  
  return {
    items: paginatedResults,
    total: filteredPersons.length,
    page,
    total_pages: Math.ceil(filteredPersons.length / pageSize)
  }
}

export async function searchCompanies(filters: CompanyFilters & { page?: number; page_size?: number }): Promise<SearchResponse<CompanyCard>> {
  await delay(500)
  
  let filteredCompanies = [...mockCompanies]
  
  if (filters.city) {
    filteredCompanies = filteredCompanies.filter(c => c.geo_city === filters.city)
  }
  
  if (filters.q) {
    filteredCompanies = filteredCompanies.filter(c => 
      c.name.toLowerCase().includes(filters.q!.toLowerCase()) ||
      c.ateco?.includes(filters.q!)
    )
  }
  
  if (filters.ateco) {
    filteredCompanies = filteredCompanies.filter(c => c.ateco === filters.ateco)
  }
  
  if (filters.min_employees) {
    filteredCompanies = filteredCompanies.filter(c => (c.employees || 0) >= filters.min_employees!)
  }
  
  const page = filters.page || 1
  const pageSize = filters.page_size || 12
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  const paginatedResults = filteredCompanies.slice(startIndex, endIndex)
  
  return {
    items: paginatedResults,
    total: filteredCompanies.length,
    page,
    total_pages: Math.ceil(filteredCompanies.length / pageSize)
  }
}

export async function getLeadSuggestions(entityType: 'person' | 'company', id: string): Promise<{ suggestions: PolicySuggestion[] }> {
  await delay(1000) // Simulate AI processing time
  
  const suggestions: PolicySuggestion[] = entityType === 'person' 
    ? [
        {
          policy: 'casa',
          confidence: 0.85,
          reason: 'Alto rischio abitazione e buona capacità economica indicano necessità di protezione casa completa'
        },
        {
          policy: 'vita', 
          confidence: 0.70,
          reason: 'Profilo familiare suggerisce protezione vita per i cari'
        },
        {
          policy: 'rc_auto',
          confidence: 0.90,
          reason: 'Utilizzo frequente auto richiede copertura RC completa'
        }
      ]
    : [
        {
          policy: 'property',
          confidence: 0.80,
          reason: 'Sede aziendale in zona a rischio, protezione property consigliata'
        },
        {
          policy: 'business_continuity',
          confidence: 0.75,
          reason: 'Settore tech ad alto valore, business continuity essenziale'
        },
        {
          policy: 'benefit_dipendenti',
          confidence: 0.85,
          reason: 'Team numeroso, benefit dipendenti attrattivi per retention'
        }
      ]
  
  return { suggestions }
}

export async function exportListToCSV(listId: string): Promise<string> {
  await delay(500)
  
  // Mock CSV export
  const csvHeader = 'Name,City,Type,Score\n'
  const csvRows = mockPersons.map(p => 
    `"${p.name}","${p.geo_city}","Person","${p.scores.opportunity_home}"`
  ).join('\n')
  
  return csvHeader + csvRows
}

// Lists management
export async function getLists(type?: 'person' | 'company') {
  await delay(300)
  
  const mockLists = [
    { id: '1', name: 'Lead Q1 2024', type: 'person', created_at: new Date().toISOString() },
    { id: '2', name: 'Aziende Tech Milano', type: 'company', created_at: new Date().toISOString() },
    { id: '3', name: 'Famiglie Benestanti', type: 'person', created_at: new Date().toISOString() }
  ]
  
  return type ? mockLists.filter(l => l.type === type) : mockLists
}

export async function createList(name: string, type: 'person' | 'company') {
  await delay(300)
  
  return {
    id: Math.random().toString(),
    name,
    type,
    created_at: new Date().toISOString()
  }
}

export async function addToList(listId: string, entityType: 'person' | 'company', entityId: string, notes?: string) {
  await delay(300)
  
  return {
    id: Math.random().toString(),
    list_id: listId,
    entity_type: entityType,
    entity_id: entityId,
    notes,
    created_at: new Date().toISOString()
  }
}

// Analytics tracking
export async function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  console.log(`[MOCK] Analytics Event: ${eventName}`, properties)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }
}

// B2C Integration APIs
export async function getB2CLeads(filters?: {
  temperature?: 'hot' | 'warm' | 'cold'
  minBudget?: number
  maxDaysOld?: number
  cities?: string[]
}): Promise<B2BLeadFromB2C[]> {
  await delay(500)
  
  let filteredLeads = [...mockB2CLeads]
  
  if (filters?.temperature) {
    filteredLeads = filteredLeads.filter(l => l.lead_temperature === filters.temperature)
  }
  
  if (filters?.cities?.length) {
    filteredLeads = filteredLeads.filter(l => filters.cities!.includes(l.geo_city))
  }
  
  if (filters?.minBudget) {
    filteredLeads = filteredLeads.filter(l => {
      const budget = extractBudgetNumber(l.budget_range)
      return budget >= filters.minBudget!
    })
  }
  
  if (filters?.maxDaysOld) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - filters.maxDaysOld)
    filteredLeads = filteredLeads.filter(l => new Date(l.last_simulation_date) >= cutoff)
  }
  
  return filteredLeads.sort((a, b) => b.b2c_engagement_score - a.b2c_engagement_score)
}

export async function getB2CAnalytics(): Promise<{
  totalLeads: number
  hotLeads: number
  avgEngagementScore: number
  topCities: { city: string; count: number }[]
  conversionFunnel: {
    simulations: number
    completedSimulations: number
    qualifiedLeads: number
    estimatedValue: number
  }
  recentActivity: {
    last24h: number
    last7days: number
    last30days: number
  }
}> {
  await delay(300)
  
  const leads = mockB2CLeads
  const hotLeads = leads.filter(l => l.lead_temperature === 'hot')
  
  // Calculate city distribution
  const cityCount: Record<string, number> = {}
  leads.forEach(l => {
    cityCount[l.geo_city] = (cityCount[l.geo_city] || 0) + 1
  })
  
  const topCities = Object.entries(cityCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }))
  
  // Mock activity data
  const recentActivity = {
    last24h: 5,
    last7days: 12,
    last30days: leads.length
  }
  
  // Mock conversion funnel
  const totalSimulations = leads.reduce((sum, l) => sum + l.simulation_count, 0)
  const completedSims = Math.round(totalSimulations * 0.7)
  const estimatedValue = leads.reduce((sum, l) => {
    const budget = extractBudgetNumber(l.budget_range)
    return sum + (budget * 0.02) // 2% commission estimate
  }, 0)
  
  return {
    totalLeads: leads.length,
    hotLeads: hotLeads.length,
    avgEngagementScore: Math.round(leads.reduce((sum, l) => sum + l.b2c_engagement_score, 0) / leads.length),
    topCities,
    conversionFunnel: {
      simulations: totalSimulations,
      completedSimulations: completedSims,
      qualifiedLeads: leads.length,
      estimatedValue: Math.round(estimatedValue)
    },
    recentActivity
  }
}

function extractBudgetNumber(budgetRange: string): number {
  const ranges: Record<string, number> = {
    '<200K': 150000,
    '200K-400K': 300000,
    '400K-600K': 500000,
    '600K-800K': 700000,
    '800K-1M': 900000,
    '1M+': 1200000
  }
  return ranges[budgetRange] || 0
}