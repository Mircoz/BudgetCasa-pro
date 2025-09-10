// Milano Companies API - Business View of Milano Leads
import { searchMilanoLeads, getLeadStats, type MilanoLead } from './supabase-leads-api'

export interface MilanoCompany {
  id: string
  name: string // Business name
  legalName?: string // Full legal name  
  industry: string
  sector: string
  employees: number
  revenue: number
  city: string
  address: string
  cap: string
  zona: string
  partitaIva?: string
  codiceFiscale?: string
  
  // Contact info
  contactPerson: string
  email?: string
  phone: string
  website?: string
  linkedinUrl?: string
  
  // Business metrics
  foundedYear?: number
  legalForm: string // SRL, SPA, etc.
  atecoCode?: string
  businessType: string
  
  // Lead scoring (business-focused)
  leadScore: number
  revenueOpportunity: number
  businessValue: number
  conversionProbability: number
  riskProfile: string
  
  // Insurance propensity (B2B focus)
  businessInsurancePropensity: number
  propertyInsurancePropensity: number
  liabilityInsurancePropensity: number
  employeeInsurancePropensity: number
  
  // Status
  lead_status: string
  assigned_agent_id?: string
  enrichment_status?: string
  urgencyLevel: 'high' | 'medium' | 'low'
  nextAction: string
  
  // Metadata
  created_at: string
  updated_at?: string
}

// Transform Milano lead to Company format
export function transformLeadToCompany(lead: MilanoLead): MilanoCompany {
  const businessName = extractBusinessName(lead.last_name)
  const industry = determineIndustry(lead.last_name, lead.business_type)
  const legalForm = determineLegalForm(lead.last_name)
  
  return {
    id: lead.id,
    name: businessName,
    legalName: lead.last_name,
    industry,
    sector: mapIndustryToSector(industry),
    employees: lead.dipendenti || estimateEmployees(lead.last_name, lead.fatturato_stimato),
    revenue: lead.fatturato_stimato || estimateRevenue(lead.estimated_income, lead.zona),
    city: lead.zona,
    address: lead.address_street ? `${lead.address_street}, ${lead.address_cap} ${lead.zona}` : `${lead.address_cap} ${lead.zona}`,
    cap: lead.address_cap,
    zona: lead.zona,
    partitaIva: lead.partita_iva,
    codiceFiscale: lead.partita_iva, // Often same for small businesses
    
    // Contact
    contactPerson: `${lead.first_name} ${extractContactName(lead.last_name)}`,
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    linkedinUrl: lead.linkedin_url,
    
    // Business details
    foundedYear: estimateFoundedYear(lead.last_name),
    legalForm,
    businessType: lead.business_type || industry,
    
    // B2B Lead scoring
    leadScore: Math.min(100, lead.data_quality_score + (lead.dipendenti ? 10 : 0) + (lead.partita_iva ? 15 : 0)),
    revenueOpportunity: calculateB2BRevenueOpportunity(lead),
    businessValue: calculateBusinessValue(lead),
    conversionProbability: Math.min(90, lead.conversion_probability + (lead.business_type ? 15 : 0)),
    riskProfile: determineRiskProfile(lead),
    
    // B2B Insurance propensity
    businessInsurancePropensity: lead.propensity_business,
    propertyInsurancePropensity: Math.max(lead.propensity_casa, 60), // Professional properties
    liabilityInsurancePropensity: calculateLiabilityPropensity(lead),
    employeeInsurancePropensity: calculateEmployeePropensity(lead),
    
    // Status
    lead_status: lead.lead_status,
    assigned_agent_id: lead.assigned_agent_id,
    enrichment_status: lead.enrichment_status,
    urgencyLevel: determineBusinessUrgency(lead),
    nextAction: getB2BNextAction(lead),
    
    created_at: lead.created_at,
    updated_at: lead.updated_at
  }
}

// Business-focused search filters
export interface CompanySearchFilters {
  q?: string
  zona?: string
  industry?: string
  min_employees?: number
  max_employees?: number
  min_revenue?: number
  max_revenue?: number
  legal_form?: string
  business_type?: string
  lead_status?: string
  assigned_agent_id?: string
  enrichment_status?: string
  min_business_propensity?: number
  risk_profile?: string
  page?: number
  page_size?: number
}

// Search Milano companies (transformed from leads)
export async function searchMilanoCompanies(filters: CompanySearchFilters = {}) {
  // Map company filters to lead filters
  const leadFilters = {
    q: filters.q,
    zona: filters.zona,
    lead_status: filters.lead_status,
    assigned_agent_id: filters.assigned_agent_id,
    enrichment_status: filters.enrichment_status,
    propensity_business_min: filters.min_business_propensity,
    min_income: filters.min_revenue ? Math.floor(filters.min_revenue / 12) : undefined, // Annual to monthly
    max_income: filters.max_revenue ? Math.floor(filters.max_revenue / 12) : undefined,
    page: filters.page,
    page_size: filters.page_size
  }
  
  const leadsResponse = await searchMilanoLeads(leadFilters)
  
  // Transform leads to companies
  let transformedCompanies = leadsResponse.items.map(lead => transformLeadToCompany(lead))
  
  // Apply business-specific filters
  if (filters.industry) {
    transformedCompanies = transformedCompanies.filter(c => 
      c.industry.toLowerCase().includes(filters.industry!.toLowerCase())
    )
  }
  
  if (filters.business_type) {
    transformedCompanies = transformedCompanies.filter(c => 
      c.businessType.toLowerCase().includes(filters.business_type!.toLowerCase())
    )
  }
  
  if (filters.min_employees) {
    transformedCompanies = transformedCompanies.filter(c => c.employees >= filters.min_employees!)
  }
  
  if (filters.max_employees) {
    transformedCompanies = transformedCompanies.filter(c => c.employees <= filters.max_employees!)
  }
  
  if (filters.legal_form) {
    transformedCompanies = transformedCompanies.filter(c => 
      c.legalForm.toLowerCase().includes(filters.legal_form!.toLowerCase())
    )
  }
  
  if (filters.risk_profile) {
    transformedCompanies = transformedCompanies.filter(c => 
      c.riskProfile.toLowerCase() === filters.risk_profile!.toLowerCase()
    )
  }
  
  return {
    items: transformedCompanies,
    page: leadsResponse.page,
    page_size: leadsResponse.page_size,
    total: transformedCompanies.length,
    total_pages: leadsResponse.total_pages
  }
}

// Helper functions
function extractBusinessName(fullName: string): string {
  return fullName
    .replace(/^(Dr\.|Dott\.|Avv\.|Ing\.|Arch\.)\s*/i, '')
    .replace(/Studio\s+/i, '')
    .replace(/\s+Associat[io]\s*$/i, ' & Associati')
    .trim()
}

function extractContactName(fullName: string): string {
  const match = fullName.match(/^(Dr\.|Dott\.|Avv\.|Ing\.|Arch\.)\s*(\w+)/)
  return match ? match[2] : 'Titolare'
}

function determineIndustry(businessName: string, businessType?: string): string {
  const name = businessName.toLowerCase()
  
  if (businessType) return businessType
  
  if (name.includes('studio legale') || name.includes('avvocat')) return 'Legal Services'
  if (name.includes('commercialist') || name.includes('fiscal') || name.includes('contabil')) return 'Accounting & Finance'
  if (name.includes('architett') || name.includes('ingegner')) return 'Architecture & Engineering' 
  if (name.includes('medico') || name.includes('dentist') || name.includes('clinic')) return 'Healthcare'
  if (name.includes('consulen')) return 'Business Consulting'
  if (name.includes('software') || name.includes('digital') || name.includes('tech')) return 'Technology'
  if (name.includes('immobiliar')) return 'Real Estate'
  if (name.includes('veterin')) return 'Veterinary Services'
  if (name.includes('farmaci') || name.includes('ottic')) return 'Healthcare Retail'
  
  return 'Professional Services'
}

function mapIndustryToSector(industry: string): string {
  const sectorMap: Record<string, string> = {
    'Legal Services': 'Professional Services',
    'Accounting & Finance': 'Financial Services',
    'Architecture & Engineering': 'Construction & Engineering',
    'Healthcare': 'Healthcare & Life Sciences',
    'Business Consulting': 'Professional Services',
    'Technology': 'Technology & Software',
    'Real Estate': 'Real Estate',
    'Veterinary Services': 'Healthcare & Life Sciences',
    'Healthcare Retail': 'Healthcare & Life Sciences'
  }
  
  return sectorMap[industry] || 'Professional Services'
}

function determineLegalForm(businessName: string): string {
  const name = businessName.toLowerCase()
  
  if (name.includes(' srl') || name.includes(' s.r.l')) return 'SRL'
  if (name.includes(' spa') || name.includes(' s.p.a')) return 'SPA'
  if (name.includes('studio') || name.includes('dott.') || name.includes('dr.')) return 'Studio Professionale'
  if (name.includes('associat')) return 'Associazione Professionale'
  
  return 'Ditta Individuale'
}

function estimateEmployees(businessName: string, revenue?: number): number {
  const name = businessName.toLowerCase()
  
  // Base on business name clues
  if (name.includes('associat') || name.includes('partners')) return Math.floor(Math.random() * 8) + 5 // 5-12
  if (name.includes('studio')) return Math.floor(Math.random() * 5) + 2 // 2-6
  
  // Base on revenue if available
  if (revenue) {
    if (revenue > 500000) return Math.floor(Math.random() * 20) + 10 // 10-29
    if (revenue > 200000) return Math.floor(Math.random() * 8) + 5 // 5-12
    if (revenue > 100000) return Math.floor(Math.random() * 5) + 3 // 3-7
  }
  
  return Math.floor(Math.random() * 3) + 1 // 1-3
}

function estimateRevenue(personalIncome: number, zona: string): number {
  // Professional business revenue typically 2-5x personal income
  const multiplier = zona === 'Centro' ? 4.5 : zona === 'Porta Nuova' ? 4 : zona === 'Navigli' ? 3.5 : 3
  return Math.floor(personalIncome * multiplier * 12) // Annual revenue
}

function estimateFoundedYear(businessName: string): number {
  // Estimate based on business type and current year
  const currentYear = new Date().getFullYear()
  const name = businessName.toLowerCase()
  
  if (name.includes('studio') || name.includes('associat')) {
    // Professional firms typically established 10-30 years ago
    return currentYear - Math.floor(Math.random() * 20) - 10
  }
  
  // Other businesses 5-25 years ago  
  return currentYear - Math.floor(Math.random() * 20) - 5
}

function calculateB2BRevenueOpportunity(lead: MilanoLead): number {
  const baseRevenue = lead.fatturato_stimato || (lead.estimated_income * 3 * 12) // 3x annual
  const employeeCount = lead.dipendenti || 3
  
  // B2B insurance premiums typically 0.5-2% of revenue + per-employee costs
  const revenueBasedPremium = baseRevenue * 0.015 // 1.5%
  const employeeBasedPremium = employeeCount * 800 // €800 per employee
  
  // Zone multiplier
  const zoneMultiplier = lead.zona === 'Centro' ? 1.5 : lead.zona === 'Porta Nuova' ? 1.4 : 1.2
  
  return Math.floor((revenueBasedPremium + employeeBasedPremium) * zoneMultiplier)
}

function calculateBusinessValue(lead: MilanoLead): number {
  // Lifetime value of business client
  const annualPremium = calculateB2BRevenueOpportunity(lead)
  const avgClientLifetime = 7 // years
  const crossSellMultiplier = 2.3 // Additional policies
  
  return Math.floor(annualPremium * avgClientLifetime * crossSellMultiplier)
}

function calculateLiabilityPropensity(lead: MilanoLead): number {
  // Professional liability insurance propensity
  const basePropensity = lead.propensity_business
  const businessName = lead.last_name.toLowerCase()
  
  // High liability professions
  if (businessName.includes('medico') || businessName.includes('avvocat') || businessName.includes('architett')) {
    return Math.min(95, basePropensity + 25)
  }
  
  if (businessName.includes('consulen') || businessName.includes('ingegner')) {
    return Math.min(90, basePropensity + 20)
  }
  
  return Math.min(85, basePropensity + 10)
}

function calculateEmployeePropensity(lead: MilanoLead): number {
  // Employee benefits insurance propensity
  const employeeCount = lead.dipendenti || 1
  const basePropensity = lead.propensity_vita
  
  if (employeeCount >= 10) return Math.min(90, basePropensity + 25)
  if (employeeCount >= 5) return Math.min(80, basePropensity + 15)
  if (employeeCount >= 3) return Math.min(75, basePropensity + 10)
  
  return Math.min(60, basePropensity)
}

function determineRiskProfile(lead: MilanoLead): string {
  const businessName = lead.last_name.toLowerCase()
  const qualityScore = lead.data_quality_score
  
  // High risk professions
  if (businessName.includes('medico') || businessName.includes('architett') || businessName.includes('ingegner')) {
    return qualityScore >= 80 ? 'High Risk - Premium' : 'High Risk'
  }
  
  // Medium risk
  if (businessName.includes('avvocat') || businessName.includes('consulen') || businessName.includes('immobiliar')) {
    return qualityScore >= 80 ? 'Medium Risk - Quality' : 'Medium Risk'
  }
  
  // Low risk
  return qualityScore >= 80 ? 'Low Risk - Premium' : 'Low Risk'
}

function determineBusinessUrgency(lead: MilanoLead): 'high' | 'medium' | 'low' {
  const businessScore = lead.propensity_business
  const qualityScore = lead.data_quality_score
  
  if (businessScore >= 80 && qualityScore >= 80) return 'high'
  if (businessScore >= 65 || qualityScore >= 70) return 'medium'
  return 'low'
}

function getB2BNextAction(lead: MilanoLead): string {
  if (lead.assigned_agent_id) {
    return 'Follow-up B2B Meeting'
  }
  
  if (lead.data_quality_score >= 85 && lead.propensity_business >= 80) {
    return 'Schedule Corporate Meeting'
  }
  
  if (lead.email && lead.partita_iva) {
    return 'Send B2B Proposal'
  }
  
  if (lead.phone) {
    return 'Call Decision Maker'
  }
  
  return 'Email Risk Assessment'
}

// Company statistics for dashboard
export async function getCompanyStats() {
  const leadStats = await getLeadStats()
  
  // Transform lead stats to business context
  return {
    totalCompanies: leadStats.totalLeads,
    assignedCompanies: leadStats.assignedLeads,
    enrichedCompanies: leadStats.enrichedLeads,
    highValueCompanies: leadStats.highQualityLeads,
    assignmentRate: leadStats.assignmentRate,
    enrichmentRate: leadStats.enrichmentRate,
    qualityRate: leadStats.qualityRate
  }
}