// Export API - Excel/CSV Export for CRM Integration
import * as XLSX from 'xlsx'
import { searchMilanoLeads } from './supabase-leads-api'
import { searchMilanoCompanies } from './supabase-companies-api'
import type { MilanoLead } from './supabase-leads-api'
import type { MilanoCompany } from './supabase-companies-api'

export interface ExportFilters {
  zona?: string
  industry?: string
  min_lead_score?: number
  max_lead_score?: number
  lead_status?: string
  assigned_agent_id?: string
  date_from?: string
  date_to?: string
  export_type: 'leads' | 'companies'
  format: 'xlsx' | 'csv'
}

export interface ExportResult {
  filename: string
  data: Blob
  count: number
}

// Lead export format optimized for CRM systems
function formatLeadForExport(lead: MilanoLead) {
  return {
    'ID': lead.id,
    'Nome': lead.first_name,
    'Cognome': lead.last_name,
    'Ragione Sociale': lead.last_name, // Business name for professionals
    'Email': lead.email || '',
    'Telefono': lead.phone || '',
    'Indirizzo': lead.address_street || '',
    'CAP': lead.address_cap,
    'Città': lead.zona,
    'Provincia': 'MI', // Milano
    'Partita IVA': lead.partita_iva || '',
    'Codice Fiscale': lead.partita_iva || '', // Often same for professionals
    
    // Business Intelligence
    'Settore': lead.business_type || 'Professional Services',
    'Dipendenti': lead.dipendenti || 1,
    'Fatturato Stimato': lead.fatturato_stimato || '',
    'Reddito Stimato': lead.estimated_income,
    'Dimensione Famiglia': lead.family_size,
    'Proprietà Casa': lead.home_ownership,
    
    // Insurance Propensity (0-100)
    'Propensity Casa': lead.propensity_casa,
    'Propensity Auto': lead.propensity_auto,
    'Propensity Vita': lead.propensity_vita,
    'Propensity Business': lead.propensity_business,
    
    // Lead Quality & Scoring
    'Lead Score': lead.data_quality_score,
    'Probabilità Conversione': lead.conversion_probability,
    'Status Lead': lead.lead_status,
    'Agente Assegnato': lead.assigned_agent_id || '',
    'Stato Arricchimento': lead.enrichment_status || '',
    
    // Contact & Social
    'Sito Web': lead.website || '',
    'LinkedIn': lead.linkedin_url || '',
    
    // Timestamps
    'Data Creazione': lead.created_at,
    'Ultimo Aggiornamento': lead.updated_at || '',
    
    // Revenue Calculation
    'Opportunità Revenue (€)': lead.revenue_opportunity || Math.floor(lead.estimated_income * 0.05)
  }
}

// Company export format for B2B focus
function formatCompanyForExport(company: MilanoCompany) {
  return {
    'ID': company.id,
    'Nome Azienda': company.name,
    'Ragione Sociale Completa': company.legalName || company.name,
    'Forma Legale': company.legalForm,
    'Settore': company.industry,
    'Tipo Business': company.businessType,
    
    // Contact Information
    'Persona Contatto': company.contactPerson,
    'Email': company.email || '',
    'Telefono': company.phone || '',
    'Sito Web': company.website || '',
    'LinkedIn': company.linkedinUrl || '',
    
    // Address
    'Indirizzo': company.address,
    'CAP': company.cap,
    'Zona Milano': company.zona,
    'Città': company.city,
    
    // Business Data
    'Partita IVA': company.partitaIva || '',
    'Codice Fiscale': company.codiceFiscale || '',
    'Codice ATECO': company.atecoCode || '',
    'Anno Fondazione': company.foundedYear || '',
    'Dipendenti': company.employees,
    'Fatturato (€)': company.revenue,
    
    // B2B Intelligence
    'Lead Score': company.leadScore,
    'Revenue Opportunity (€)': company.revenueOpportunity,
    'Business Value (€)': company.businessValue,
    'Probabilità Conversione (%)': company.conversionProbability,
    'Profilo Rischio': company.riskProfile,
    'Livello Urgenza': company.urgencyLevel,
    'Prossima Azione': company.nextAction,
    
    // Insurance Propensity B2B (0-100)
    'Propensity Business': company.businessInsurancePropensity,
    'Propensity Property': company.propertyInsurancePropensity,
    'Propensity Liability': company.liabilityInsurancePropensity,
    'Propensity Employee': company.employeeInsurancePropensity,
    
    // Status
    'Status Lead': company.lead_status,
    'Agente Assegnato': company.assigned_agent_id || '',
    'Stato Arricchimento': company.enrichment_status || '',
    
    // Timestamps
    'Data Creazione': company.created_at,
    'Ultimo Aggiornamento': company.updated_at || ''
  }
}

export async function exportData(filters: ExportFilters): Promise<ExportResult> {
  try {
    let data: any[] = []
    let filename = ''
    
    if (filters.export_type === 'leads') {
      // Export leads
      const leadsResponse = await searchMilanoLeads({
        zona: filters.zona,
        lead_status: filters.lead_status,
        assigned_agent_id: filters.assigned_agent_id,
        min_quality_score: filters.min_lead_score,
        max_quality_score: filters.max_lead_score,
        page_size: 1000 // Export up to 1000 leads
      })
      
      data = leadsResponse.items.map(formatLeadForExport)
      filename = `milano-leads-${new Date().toISOString().split('T')[0]}`
      
    } else {
      // Export companies
      const companiesResponse = await searchMilanoCompanies({
        zona: filters.zona,
        industry: filters.industry,
        lead_status: filters.lead_status,
        assigned_agent_id: filters.assigned_agent_id,
        page_size: 1000 // Export up to 1000 companies
      })
      
      data = companiesResponse.items.map(formatCompanyForExport)
      filename = `milano-companies-${new Date().toISOString().split('T')[0]}`
    }
    
    // Apply date filters if provided
    if (filters.date_from || filters.date_to) {
      data = data.filter(item => {
        const createdAt = new Date(item['Data Creazione'])
        const dateFrom = filters.date_from ? new Date(filters.date_from) : new Date('2020-01-01')
        const dateTo = filters.date_to ? new Date(filters.date_to) : new Date()
        
        return createdAt >= dateFrom && createdAt <= dateTo
      })
    }
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    
    // Set column widths for better readability
    const colWidths = Object.keys(data[0] || {}).map(key => ({ 
      wch: Math.max(key.length, 15) 
    }))
    ws['!cols'] = colWidths
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, filters.export_type === 'leads' ? 'Leads Milano' : 'Companies Milano')
    
    // Generate file
    let fileData: Uint8Array
    let mimeType: string
    
    if (filters.format === 'xlsx') {
      fileData = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      filename += '.xlsx'
    } else {
      const csvData = XLSX.utils.sheet_to_csv(ws)
      fileData = new TextEncoder().encode(csvData)
      mimeType = 'text/csv'
      filename += '.csv'
    }
    
    const blob = new Blob([fileData], { type: mimeType })
    
    return {
      filename,
      data: blob,
      count: data.length
    }
    
  } catch (error) {
    console.error('Export error:', error)
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Utility function to download file in browser
export function downloadFile(result: ExportResult) {
  const url = URL.createObjectURL(result.data)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Get export preview (first 5 rows) for UI
export async function getExportPreview(filters: ExportFilters) {
  const previewFilters = { ...filters }
  
  try {
    if (filters.export_type === 'leads') {
      const response = await searchMilanoLeads({
        zona: previewFilters.zona,
        lead_status: previewFilters.lead_status,
        page_size: 5
      })
      
      return {
        columns: Object.keys(formatLeadForExport(response.items[0] || {} as MilanoLead)),
        rows: response.items.map(formatLeadForExport),
        totalCount: response.total
      }
      
    } else {
      const response = await searchMilanoCompanies({
        zona: previewFilters.zona,
        industry: previewFilters.industry,
        page_size: 5
      })
      
      return {
        columns: Object.keys(formatCompanyForExport(response.items[0] || {} as MilanoCompany)),
        rows: response.items.map(formatCompanyForExport),
        totalCount: response.total
      }
    }
  } catch (error) {
    console.error('Preview error:', error)
    return {
      columns: [],
      rows: [],
      totalCount: 0
    }
  }
}