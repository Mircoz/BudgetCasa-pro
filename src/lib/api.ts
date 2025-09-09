import { createClient } from './supabase'
import type { PersonCard, CompanyCard, PersonFilters, CompanyFilters, SearchResponse, PolicySuggestion } from './types'

const supabase = createClient()

export async function searchPersons(filters: PersonFilters & { page?: number; page_size?: number }): Promise<SearchResponse<PersonCard>> {
  const { data, error } = await supabase.functions.invoke('search-persons', {
    body: filters
  })

  if (error) throw error
  return data
}

export async function searchCompanies(filters: CompanyFilters & { page?: number; page_size?: number }): Promise<SearchResponse<CompanyCard>> {
  const { data, error } = await supabase.functions.invoke('search-companies', {
    body: filters
  })

  if (error) throw error
  return data
}

export async function getLeadSuggestions(entityType: 'person' | 'company', id: string): Promise<{ suggestions: PolicySuggestion[] }> {
  const { data, error } = await supabase.functions.invoke('lead-suggest', {
    body: { entity_type: entityType, id }
  })

  if (error) throw error
  return data
}

export async function exportListToCSV(listId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('export-csv', {
    body: { list_id: listId }
  })

  if (error) throw error
  return data
}

// Lists management
export async function getLists(type?: 'person' | 'company') {
  let query = supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createList(name: string, type: 'person' | 'company') {
  const { data, error } = await supabase
    .from('lists')
    .insert([{ name, type }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addToList(listId: string, entityType: 'person' | 'company', entityId: string, notes?: string) {
  const { data, error } = await supabase
    .from('list_items')
    .insert([{ list_id: listId, entity_type: entityType, entity_id: entityId, notes }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Analytics tracking
export async function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  // GA4 tracking will be implemented here
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }
}