import type { PersonCard, CompanyCard, PersonFilters, CompanyFilters, SearchResponse, PolicySuggestion } from './types'

// Mock data for development
const mockPersons: PersonCard[] = [
  {
    id: '1',
    name: 'Mario Rossi',
    geo_city: 'Milano',
    lifestyle: ['sport', 'travel'],
    mobility: ['car', 'bike'],
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
    scores: {
      risk_home: 0.80,
      risk_mobility: 0.70,
      opportunity_home: 0.75,
      opportunity_life: 0.65
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