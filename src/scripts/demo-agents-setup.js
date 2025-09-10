// Demo Agents Setup for Sara Assicurazioni Meeting
const { createClient } = require('@supabase/supabase-js');
const { AgentTerritoryManager } = require('../lib/agent-territory-management');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

class DemoAgentsSetup {
  
  constructor() {
    this.territoryManager = new AgentTerritoryManager();
    this.demoAgents = [];
  }
  
  // Create realistic demo agents for Milano territories
  getAgentProfiles() {
    return [
      // Premium agents for Centro
      {
        firstName: 'Marco',
        lastName: 'Santini',
        email: 'marco.santini@sara-assicurazioni.it',
        phone: '+39 02 1234 5678',
        skills: ['high_value_sales', 'professional_services', 'italian_fluent', 'consultative_sales'],
        languages: ['italian', 'english'],
        experience: 'expert',
        maxLeads: 50,
        preferredTerritories: ['Centro Premium', 'Porta Nuova Business'],
        successRate: 85,
        avgDealSize: 18000,
        specializations: ['Polizza Vita Premium', 'Assicurazione Professionale']
      },
      
      {
        firstName: 'Giulia',
        lastName: 'Romano',
        email: 'giulia.romano@sara-assicurazioni.it',
        phone: '+39 02 2345 6789',
        skills: ['corporate_sales', 'english_fluent', 'tech_savvy', 'consultative_sales'],
        languages: ['italian', 'english', 'spanish'],
        experience: 'expert', 
        maxLeads: 60,
        preferredTerritories: ['Porta Nuova Business', 'Centro Extended'],
        successRate: 82,
        avgDealSize: 16500,
        specializations: ['Business Insurance', 'Corporate Life Insurance']
      },
      
      // Strong senior agents
      {
        firstName: 'Andrea',
        lastName: 'Bianchi',
        email: 'andrea.bianchi@sara-assicurazioni.it',
        phone: '+39 02 3456 7890',
        skills: ['lifestyle_sales', 'creative_approach', 'relationship_building'],
        languages: ['italian'],
        experience: 'senior',
        maxLeads: 80,
        preferredTerritories: ['Navigli & Brera', 'Centro Extended'],
        successRate: 78,
        avgDealSize: 12000,
        specializations: ['Casa Insurance', 'Auto Premium']
      },
      
      {
        firstName: 'Francesca',
        lastName: 'Ferrari',
        email: 'francesca.ferrari@sara-assicurazioni.it',
        phone: '+39 02 4567 8901',
        skills: ['volume_sales', 'local_knowledge', 'relationship_building'],
        languages: ['italian'],
        experience: 'senior',
        maxLeads: 100,
        preferredTerritories: ['Sempione & North', 'Provincia Milano'],
        successRate: 75,
        avgDealSize: 8500,
        specializations: ['Auto Insurance', 'Famiglia Protection']
      },
      
      // Junior but promising agents
      {
        firstName: 'Luca',
        lastName: 'Rossi',
        email: 'luca.rossi@sara-assicurazioni.it',
        phone: '+39 02 5678 9012',
        skills: ['volume_sales', 'persistence', 'digital_engagement'],
        languages: ['italian'],
        experience: 'junior',
        maxLeads: 120,
        preferredTerritories: ['Provincia Milano', 'Sempione & North'],
        successRate: 68,
        avgDealSize: 6500,
        specializations: ['Auto Base', 'Casa Base']
      },
      
      {
        firstName: 'Elena',
        lastName: 'Conti',
        email: 'elena.conti@sara-assicurazioni.it',
        phone: '+39 02 6789 0123',
        skills: ['relationship_building', 'customer_retention', 'phone_sales'],
        languages: ['italian', 'english'],
        experience: 'junior',
        maxLeads: 100,
        preferredTerritories: ['Provincia Milano', 'Navigli & Brera'],
        successRate: 72,
        avgDealSize: 7200,
        specializations: ['Vita Base', 'Protezione Famiglia']
      }
    ];
  }
  
  // Register all demo agents
  async registerDemoAgents() {
    console.log('👥 DEMO AGENTS SETUP FOR SARA ASSICURAZIONI');
    console.log('===========================================');
    console.log('🎯 Setting up 6 demo agents with realistic profiles\n');
    
    const agentProfiles = this.getAgentProfiles();
    
    for (const profile of agentProfiles) {
      try {
        console.log(`📝 Registering ${profile.firstName} ${profile.lastName} (${profile.experience})...`);
        
        const agent = await this.territoryManager.registerAgent(profile);
        this.demoAgents.push({...agent, ...profile});
        
        console.log(`   ✅ Registered with skills: ${profile.skills.slice(0,2).join(', ')}`);
        console.log(`   📊 Max leads: ${profile.maxLeads} | Success rate: ${profile.successRate}%`);
        console.log(`   🎯 Specializations: ${profile.specializations.join(', ')}\n`);
        
      } catch (error) {
        console.log(`   ❌ Failed to register ${profile.firstName}: ${error.message}\n`);
      }
    }
    
    console.log(`✅ Successfully registered ${this.demoAgents.length} demo agents\n`);
  }
  
  // Assign leads to demo agents
  async assignLeadsToAgents() {
    console.log('🎯 ASSIGNING LEADS TO DEMO AGENTS');
    console.log('=================================');
    
    try {
      // Use the territory manager to assign leads
      const assignments = await this.territoryManager.assignLeadsToAgents(100);
      
      return assignments;
      
    } catch (error) {
      console.log(`❌ Lead assignment failed: ${error.message}`);
      return null;
    }
  }
  
  // Generate agent performance report
  async generateAgentPerformanceReport() {
    console.log('\n📊 DEMO AGENT PERFORMANCE REPORT');
    console.log('=================================');
    
    for (const agent of this.demoAgents) {
      const stats = await this.territoryManager.getAgentStats(agent.id);
      
      if (stats) {
        console.log(`\n👤 ${stats.firstName} ${stats.lastName} (${stats.experience})`);
        console.log(`   📧 Email: ${stats.email}`);
        console.log(`   📞 Phone: ${stats.phone}`);
        console.log(`   🎯 Current leads: ${stats.currentLeads}/${stats.maxLeads}`);
        console.log(`   📊 Total assigned: ${stats.totalAssigned}`);
        console.log(`   ✅ Success rate: ${stats.successRate}%`);
        console.log(`   💰 Avg deal size: €${stats.avgDealSize.toLocaleString()}`);
        console.log(`   🏆 Specializations: ${agent.specializations.join(', ')}`);
        console.log(`   🗺️ Preferred territories: ${stats.preferredTerritories.join(', ')}`);
        
        if (stats.stats) {
          console.log(`   📋 Lead performance:`);
          console.log(`      • Total leads: ${stats.stats.totalLeads}`);
          console.log(`      • Contacted: ${stats.stats.contacted}`);
          console.log(`      • Qualified: ${stats.stats.qualified}`);
          console.log(`      • Closed: ${stats.stats.closed}`);
          console.log(`      • Revenue generated: €${stats.stats.totalRevenue.toLocaleString()}`);
        }
      }
    }
  }
  
  // Territory coverage analysis
  async analyzeTerritorycoverage() {
    console.log('\n🗺️ TERRITORY COVERAGE ANALYSIS');
    console.log('==============================');
    
    await this.territoryManager.getTerritoryReport();
    
    // Agent distribution by territory
    console.log('\n👥 AGENT TERRITORY PREFERENCES:');
    const territoryCoverage = {};
    
    for (const agent of this.demoAgents) {
      for (const territory of agent.preferredTerritories) {
        if (!territoryCoverage[territory]) {
          territoryCoverage[territory] = [];
        }
        territoryCoverage[territory].push(`${agent.firstName} ${agent.lastName} (${agent.experience})`);
      }
    }
    
    Object.entries(territoryCoverage).forEach(([territory, agents]) => {
      console.log(`\n🗺️ ${territory}:`);
      agents.forEach(agent => console.log(`   • ${agent}`));
    });
  }
  
  // Export demo data for Sara meeting
  async exportDemoData() {
    console.log('\n📊 EXPORTING DEMO DATA FOR SARA MEETING');
    console.log('=======================================');
    
    // Get current database stats
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
    
    const demoSummary = {
      platform: 'BudgetCasa Pro - Sara Assicurazioni MVP',
      setupDate: new Date().toISOString().split('T')[0],
      agents: {
        total: this.demoAgents.length,
        expert: this.demoAgents.filter(a => a.experience === 'expert').length,
        senior: this.demoAgents.filter(a => a.experience === 'senior').length,
        junior: this.demoAgents.filter(a => a.experience === 'junior').length
      },
      leads: {
        total: totalLeads || 0,
        assigned: assignedLeads || 0,
        enriched: enrichedLeads || 0,
        assignmentRate: totalLeads > 0 ? Math.round((assignedLeads / totalLeads) * 100) : 0,
        enrichmentRate: totalLeads > 0 ? Math.round((enrichedLeads / totalLeads) * 100) : 0
      },
      territories: {
        total: 7,
        coverage: 6,
        premium: ['Centro Premium', 'Porta Nuova Business', 'Centro Extended'],
        volume: ['Provincia Milano', 'Sempione & North']
      },
      readyForDemo: totalLeads >= 300 && this.demoAgents.length >= 6
    };
    
    console.log('\n🎯 DEMO SUMMARY FOR SARA ASSICURAZIONI:');
    console.log(`   📊 Total leads: ${demoSummary.leads.total}`);
    console.log(`   ✅ Assignment rate: ${demoSummary.leads.assignmentRate}%`);
    console.log(`   💎 Enrichment rate: ${demoSummary.leads.enrichmentRate}%`);
    console.log(`   👥 Demo agents: ${demoSummary.agents.total} (${demoSummary.agents.expert} expert, ${demoSummary.agents.senior} senior, ${demoSummary.agents.junior} junior)`);
    console.log(`   🗺️ Territory coverage: ${demoSummary.territories.coverage}/${demoSummary.territories.total}`);
    console.log(`   🚀 Ready for demo: ${demoSummary.readyForDemo ? '✅ YES' : '⚠️ IN PROGRESS'}`);
    
    return demoSummary;
  }
}

// Run demo setup
async function setupDemoAgents() {
  const demo = new DemoAgentsSetup();
  
  try {
    // Step 1: Register agents
    await demo.registerDemoAgents();
    
    // Step 2: Assign leads
    await demo.assignLeadsToAgents();
    
    // Step 3: Generate reports
    await demo.generateAgentPerformanceReport();
    await demo.analyzeTerritorycoverage();
    
    // Step 4: Export demo data
    const summary = await demo.exportDemoData();
    
    console.log('\n🎉 DEMO SETUP COMPLETED SUCCESSFULLY!');
    console.log('Ready for Sara Assicurazioni presentation 🚀');
    
    return summary;
    
  } catch (error) {
    console.error('❌ Demo setup failed:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  setupDemoAgents();
}

module.exports = { DemoAgentsSetup };