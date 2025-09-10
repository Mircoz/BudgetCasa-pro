// Lead Export System for Sara Assicurazioni
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

class LeadExportSystem {
  
  constructor() {
    this.exportFormats = ['csv', 'json', 'xlsx'];
    this.exportDir = path.join(process.cwd(), 'exports');
    this.ensureExportDirectory();
  }
  
  // Create exports directory if it doesn't exist
  ensureExportDirectory() {
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
      console.log(`✅ Created export directory: ${this.exportDir}`);
    }
  }
  
  // Get leads with various filters
  async getLeadsForExport(filters = {}) {
    const {
      territory = null,
      assignedAgent = null,
      enrichmentStatus = null,
      qualityScoreMin = null,
      leadStatus = null,
      zona = null,
      limit = 1000
    } = filters;
    
    let query = supabase
      .from('milano_leads')
      .select('*')
      .order('data_quality_score', { ascending: false })
      .limit(limit);
    
    // Apply filters
    if (territory) {
      query = query.in('address_cap', this.getTerritoryCAPs(territory));
    }
    
    if (assignedAgent) {
      query = query.eq('assigned_agent_id', assignedAgent);
    }
    
    if (enrichmentStatus) {
      query = query.eq('enrichment_status', enrichmentStatus);
    }
    
    if (qualityScoreMin) {
      query = query.gte('data_quality_score', qualityScoreMin);
    }
    
    if (leadStatus) {
      query = query.eq('lead_status', leadStatus);
    }
    
    if (zona) {
      query = query.eq('zona', zona);
    }
    
    const { data: leads, error } = await query;
    
    if (error) {
      console.error('❌ Error fetching leads:', error);
      return [];
    }
    
    console.log(`📋 Retrieved ${leads?.length || 0} leads for export`);
    return leads || [];
  }
  
  // Get territory CAPs mapping
  getTerritoryCAPs(territory) {
    const territoryMapping = {
      'centro': ['20121', '20122', '20123', '20124', '20125', '20126', '20127'],
      'navigli': ['20143', '20144', '20145'],
      'porta_nuova': ['20154', '20124', '20121'],
      'isola': ['20154', '20155'],
      'brera': ['20121', '20154'],
      'sempione': ['20145', '20154'],
      'provincia': ['20131', '20132', '20134', '20135', '20136', '20137', '20138', '20139']
    };
    
    return territoryMapping[territory.toLowerCase()] || [];
  }
  
  // Export to CSV format
  exportToCSV(leads, filename = 'milano_leads_export.csv') {
    const csvHeaders = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Street', 'CAP', 'Zona',
      'Business Type', 'Estimated Income', 'Family Size', 'Home Ownership',
      'Propensity Casa', 'Propensity Auto', 'Propensity Vita', 'Propensity Business',
      'Quality Score', 'Lead Status', 'Assigned Agent', 'Enrichment Status',
      'P.IVA', 'Dipendenti', 'Fatturato Stimato', 'LinkedIn', 'Website',
      'Revenue Opportunity', 'Conversion Probability', 'Created At'
    ];
    
    const csvRows = leads.map(lead => [
      lead.id,
      lead.first_name || '',
      lead.last_name || '',
      lead.email || '',
      lead.phone || '',
      lead.address_street || '',
      lead.address_cap || '',
      lead.zona || '',
      lead.business_type || '',
      lead.estimated_income || '',
      lead.family_size || '',
      lead.home_ownership || '',
      lead.propensity_casa || '',
      lead.propensity_auto || '',
      lead.propensity_vita || '',
      lead.propensity_business || '',
      lead.data_quality_score || '',
      lead.lead_status || '',
      lead.assigned_agent_id || '',
      lead.enrichment_status || '',
      lead.partita_iva || '',
      lead.dipendenti || '',
      lead.fatturato_stimato || '',
      lead.linkedin_url || '',
      lead.website || '',
      lead.revenue_opportunity || '',
      lead.conversion_probability || '',
      lead.created_at || ''
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\\n');
    
    const filepath = path.join(this.exportDir, filename);
    fs.writeFileSync(filepath, csvContent, 'utf8');
    
    console.log(`✅ CSV export saved: ${filepath}`);
    return filepath;
  }
  
  // Export to JSON format
  exportToJSON(leads, filename = 'milano_leads_export.json') {
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalLeads: leads.length,
      exportedBy: 'BudgetCasa Pro - Sara Assicurazioni',
      leads: leads.map(lead => ({
        // Core contact info
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        
        // Location
        address: {
          street: lead.address_street,
          cap: lead.address_cap,
          zona: lead.zona
        },
        
        // Demographics
        demographics: {
          estimatedIncome: lead.estimated_income,
          familySize: lead.family_size,
          homeOwnership: lead.home_ownership
        },
        
        // Insurance propensity
        propensity: {
          casa: lead.propensity_casa,
          auto: lead.propensity_auto,
          vita: lead.propensity_vita,
          business: lead.propensity_business
        },
        
        // Business data
        business: {
          type: lead.business_type,
          partitaIva: lead.partita_iva,
          dipendenti: lead.dipendenti,
          fatturatoStimato: lead.fatturato_stimato,
          linkedinUrl: lead.linkedin_url,
          website: lead.website
        },
        
        // Lead management
        leadManagement: {
          qualityScore: lead.data_quality_score,
          leadStatus: lead.lead_status,
          assignedAgentId: lead.assigned_agent_id,
          enrichmentStatus: lead.enrichment_status,
          revenueOpportunity: lead.revenue_opportunity,
          conversionProbability: lead.conversion_probability,
          createdAt: lead.created_at,
          updatedAt: lead.updated_at
        }
      }))
    }, null, 2);
    
    const filepath = path.join(this.exportDir, filename);
    fs.writeFileSync(filepath, jsonContent, 'utf8');
    
    console.log(`✅ JSON export saved: ${filepath}`);
    return filepath;
  }
  
  // Export by agent assignments
  async exportByAgent(agentId = null) {
    console.log('👤 EXPORTING LEADS BY AGENT ASSIGNMENT');
    console.log('=====================================');
    
    if (agentId) {
      const leads = await this.getLeadsForExport({ assignedAgent: agentId });
      const timestamp = new Date().toISOString().split('T')[0];
      
      const csvFile = this.exportToCSV(leads, `leads_agent_${agentId}_${timestamp}.csv`);
      const jsonFile = this.exportToJSON(leads, `leads_agent_${agentId}_${timestamp}.json`);
      
      return { csvFile, jsonFile, leadCount: leads.length };
    } else {
      // Export all agent assignments
      const { data: agents } = await supabase
        .from('milano_leads')
        .select('assigned_agent_id')
        .not('assigned_agent_id', 'is', null);
      
      const uniqueAgents = [...new Set(agents?.map(a => a.assigned_agent_id) || [])];
      const exports = [];
      
      for (const agentId of uniqueAgents) {
        const result = await this.exportByAgent(agentId);
        exports.push({ agentId, ...result });
        console.log(`   ✅ Agent ${agentId}: ${result.leadCount} leads exported`);
      }
      
      return exports;
    }
  }
  
  // Export by territory
  async exportByTerritory(territory = null) {
    console.log('🗺️ EXPORTING LEADS BY TERRITORY');
    console.log('===============================');
    
    const territories = territory ? [territory] : 
      ['centro', 'navigli', 'porta_nuova', 'isola', 'brera', 'sempione', 'provincia'];
    
    const exports = [];
    const timestamp = new Date().toISOString().split('T')[0];
    
    for (const terr of territories) {
      const leads = await this.getLeadsForExport({ territory: terr });
      
      if (leads.length > 0) {
        const csvFile = this.exportToCSV(leads, `leads_territory_${terr}_${timestamp}.csv`);
        const jsonFile = this.exportToJSON(leads, `leads_territory_${terr}_${timestamp}.json`);
        
        exports.push({
          territory: terr,
          csvFile,
          jsonFile,
          leadCount: leads.length
        });
        
        console.log(`   ✅ Territory ${terr}: ${leads.length} leads exported`);
      }
    }
    
    return exports;
  }
  
  // Export high-quality leads for immediate follow-up
  async exportPriorityLeads(minQualityScore = 80) {
    console.log('💎 EXPORTING PRIORITY LEADS FOR IMMEDIATE FOLLOW-UP');
    console.log('==================================================');
    
    const leads = await this.getLeadsForExport({ 
      qualityScoreMin: minQualityScore,
      limit: 100 
    });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const csvFile = this.exportToCSV(leads, `priority_leads_${minQualityScore}+_${timestamp}.csv`);
    const jsonFile = this.exportToJSON(leads, `priority_leads_${minQualityScore}+_${timestamp}.json`);
    
    // Create summary report
    const summary = {
      exportDate: new Date().toISOString(),
      criteriaUsed: `Quality score >= ${minQualityScore}`,
      totalLeads: leads.length,
      averageQualityScore: leads.length > 0 ? 
        Math.round(leads.reduce((sum, l) => sum + (l.data_quality_score || 0), 0) / leads.length) : 0,
      totalRevenueOpportunity: leads.reduce((sum, l) => sum + (l.revenue_opportunity || 0), 0),
      zoneDistribution: this.getZoneDistribution(leads),
      businessTypeDistribution: this.getBusinessTypeDistribution(leads),
      enrichmentStats: this.getEnrichmentStats(leads)
    };
    
    const summaryFile = path.join(this.exportDir, `priority_leads_summary_${timestamp}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log(`✅ Priority leads exported: ${leads.length} leads`);
    console.log(`📊 Average quality score: ${summary.averageQualityScore}/100`);
    console.log(`💰 Total revenue opportunity: €${summary.totalRevenueOpportunity.toLocaleString()}`);
    console.log(`📋 Summary report: ${summaryFile}`);
    
    return { csvFile, jsonFile, summaryFile, summary };
  }
  
  // Generate comprehensive export for Sara meeting
  async generateSaraMeetingExport() {
    console.log('🎯 GENERATING COMPREHENSIVE EXPORT FOR SARA MEETING');
    console.log('==================================================');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const exports = {};
    
    // 1. All leads overview
    console.log('📊 Exporting all leads overview...');
    const allLeads = await this.getLeadsForExport({ limit: 1000 });
    exports.allLeads = {
      csv: this.exportToCSV(allLeads, `sara_meeting_all_leads_${timestamp}.csv`),
      json: this.exportToJSON(allLeads, `sara_meeting_all_leads_${timestamp}.json`)
    };
    
    // 2. Priority leads (80+ quality score)
    console.log('💎 Exporting priority leads...');
    exports.priorityLeads = await this.exportPriorityLeads(80);
    
    // 3. Enriched leads
    console.log('🔍 Exporting enriched leads...');
    const enrichedLeads = await this.getLeadsForExport({ 
      enrichmentStatus: 'completed',
      limit: 500 
    });
    exports.enrichedLeads = {
      csv: this.exportToCSV(enrichedLeads, `sara_meeting_enriched_leads_${timestamp}.csv`),
      json: this.exportToJSON(enrichedLeads, `sara_meeting_enriched_leads_${timestamp}.json`),
      count: enrichedLeads.length
    };
    
    // 4. By territory exports
    console.log('🗺️ Exporting by territory...');
    exports.territories = await this.exportByTerritory();
    
    // 5. Agent assignments
    console.log('👥 Exporting agent assignments...');
    exports.agentAssignments = await this.exportByAgent();
    
    // 6. Demo statistics
    const stats = await this.generateDemoStatistics();
    const statsFile = path.join(this.exportDir, `sara_meeting_statistics_${timestamp}.json`);
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf8');
    exports.statistics = { file: statsFile, data: stats };
    
    console.log('\\n🎉 SARA MEETING EXPORT COMPLETED!');
    console.log('=================================');
    console.log(`📁 Export directory: ${this.exportDir}`);
    console.log(`📊 Total leads: ${allLeads.length}`);
    console.log(`💎 Priority leads: ${exports.priorityLeads.summary.totalLeads}`);
    console.log(`🔍 Enriched leads: ${exports.enrichedLeads.count}`);
    console.log(`🗺️ Territories covered: ${exports.territories.length}`);
    console.log(`👥 Agents with assignments: ${exports.agentAssignments.length}`);
    
    return exports;
  }
  
  // Generate demo statistics
  async generateDemoStatistics() {
    const { count: totalLeads } = await supabase
      .from('milano_leads')
      .select('id', { count: 'exact' });
    
    const { count: assignedLeads } = await supabase
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .not('assigned_agent_id', 'is', null);
    
    const { count: enrichedLeads } = await supabase
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .eq('enrichment_status', 'completed');
    
    const { data: qualityDistribution } = await supabase
      .from('milano_leads')
      .select('data_quality_score')
      .gte('data_quality_score', 50);
    
    const { data: zoneData } = await supabase
      .from('milano_leads')
      .select('zona, revenue_opportunity');
    
    return {
      overview: {
        totalLeads: totalLeads || 0,
        assignedLeads: assignedLeads || 0,
        enrichedLeads: enrichedLeads || 0,
        assignmentRate: totalLeads > 0 ? Math.round((assignedLeads / totalLeads) * 100) : 0,
        enrichmentRate: totalLeads > 0 ? Math.round((enrichedLeads / totalLeads) * 100) : 0
      },
      quality: {
        averageScore: qualityDistribution?.length > 0 ? 
          Math.round(qualityDistribution.reduce((sum, l) => sum + (l.data_quality_score || 0), 0) / qualityDistribution.length) : 0,
        highQuality: qualityDistribution?.filter(l => (l.data_quality_score || 0) >= 80).length || 0,
        mediumQuality: qualityDistribution?.filter(l => (l.data_quality_score || 0) >= 60 && (l.data_quality_score || 0) < 80).length || 0,
        lowQuality: qualityDistribution?.filter(l => (l.data_quality_score || 0) < 60).length || 0
      },
      revenue: {
        totalOpportunity: zoneData?.reduce((sum, l) => sum + (l.revenue_opportunity || 0), 0) || 0,
        avgPerLead: zoneData?.length > 0 ? 
          Math.round((zoneData.reduce((sum, l) => sum + (l.revenue_opportunity || 0), 0)) / zoneData.length) : 0
      },
      zones: this.getZoneDistribution(zoneData || []),
      exportDate: new Date().toISOString(),
      platform: 'BudgetCasa Pro - Sara Assicurazioni MVP'
    };
  }
  
  // Helper methods
  getZoneDistribution(leads) {
    const distribution = {};
    leads.forEach(lead => {
      const zona = lead.zona || 'Unknown';
      distribution[zona] = (distribution[zona] || 0) + 1;
    });
    return distribution;
  }
  
  getBusinessTypeDistribution(leads) {
    const distribution = {};
    leads.forEach(lead => {
      const type = lead.business_type || 'Unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  }
  
  getEnrichmentStats(leads) {
    return {
      withEmail: leads.filter(l => l.email).length,
      withPIVA: leads.filter(l => l.partita_iva).length,
      withLinkedIn: leads.filter(l => l.linkedin_url).length,
      withRevenueData: leads.filter(l => l.fatturato_stimato).length,
      fullyEnriched: leads.filter(l => 
        l.email && l.partita_iva && l.linkedin_url && l.fatturato_stimato
      ).length
    };
  }
}

// CLI interface
async function runLeadExport() {
  const exportSystem = new LeadExportSystem();
  const command = process.argv[2] || 'sara-meeting';
  
  try {
    switch (command) {
      case 'sara-meeting':
        await exportSystem.generateSaraMeetingExport();
        break;
        
      case 'priority':
        const minScore = parseInt(process.argv[3]) || 80;
        await exportSystem.exportPriorityLeads(minScore);
        break;
        
      case 'territory':
        const territory = process.argv[3] || null;
        await exportSystem.exportByTerritory(territory);
        break;
        
      case 'agent':
        const agentId = process.argv[3] || null;
        await exportSystem.exportByAgent(agentId);
        break;
        
      default:
        console.log('Available commands:');
        console.log('  sara-meeting  - Complete export for Sara meeting');
        console.log('  priority [score] - Export high-priority leads');
        console.log('  territory [name] - Export by territory');
        console.log('  agent [id] - Export by agent assignment');
    }
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  runLeadExport();
}

module.exports = { LeadExportSystem };