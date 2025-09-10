// Agent Territory Management System
// Gestione territoriale agenti con assignment intelligente
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

class AgentTerritoryManager {
  
  constructor() {
    this.territories = this.defineTerritories();
    this.agents = new Map();
    this.loadBalancingStrategy = 'quality_weighted'; // 'round_robin', 'quality_weighted', 'zone_expertise'
  }
  
  // Define Milano territories with characteristics
  defineTerritories() {
    return {
      'centro_premium': {
        name: 'Centro Premium',
        caps: ['20121', '20122', '20123'],
        zones: ['Centro'],
        priority: 'high',
        difficulty: 'high',
        avgDealSize: 15000,
        leadMultiplier: 1.5,
        requiredSkills: ['high_value_sales', 'professional_services', 'italian_fluent'],
        maxLeadsPerAgent: 50
      },
      
      'centro_extended': {
        name: 'Centro Extended',
        caps: ['20124', '20125', '20126', '20127'],
        zones: ['Centro'],
        priority: 'high',
        difficulty: 'medium',
        avgDealSize: 12000,
        leadMultiplier: 1.3,
        requiredSkills: ['consultative_sales', 'professional_services'],
        maxLeadsPerAgent: 75
      },
      
      'porta_nuova': {
        name: 'Porta Nuova Business',
        caps: ['20154'],
        zones: ['Porta Nuova', 'Isola'],
        priority: 'high',
        difficulty: 'medium',
        avgDealSize: 14000,
        leadMultiplier: 1.4,
        requiredSkills: ['corporate_sales', 'english_fluent', 'tech_savvy'],
        maxLeadsPerAgent: 60
      },
      
      'navigli_brera': {
        name: 'Navigli & Brera',
        caps: ['20143', '20144', '20145'],
        zones: ['Navigli', 'Brera'],
        priority: 'medium',
        difficulty: 'medium',
        avgDealSize: 9000,
        leadMultiplier: 1.2,
        requiredSkills: ['lifestyle_sales', 'creative_approach'],
        maxLeadsPerAgent: 80
      },
      
      'sempione': {
        name: 'Sempione & North',
        caps: ['20154', '20145'],
        zones: ['Sempione', 'Isola'],
        priority: 'medium',
        difficulty: 'low',
        avgDealSize: 7000,
        leadMultiplier: 1.0,
        requiredSkills: ['volume_sales', 'local_knowledge'],
        maxLeadsPerAgent: 100
      },
      
      'provincia': {
        name: 'Provincia Milano',
        caps: ['20131', '20132', '20134', '20135', '20136', '20137', '20138', '20139'],
        zones: ['Provincia'],
        priority: 'low',
        difficulty: 'low',
        avgDealSize: 5000,
        leadMultiplier: 0.8,
        requiredSkills: ['relationship_building', 'persistence'],
        maxLeadsPerAgent: 150
      }
    };
  }
  
  // Agent registration with skills and preferences
  async registerAgent(agentData) {
    const agent = {
      id: agentData.id || crypto.randomUUID(),
      firstName: agentData.firstName,
      lastName: agentData.lastName,
      email: agentData.email,
      phone: agentData.phone,
      skills: agentData.skills || [],
      languages: agentData.languages || ['italian'],
      experience: agentData.experience || 'junior', // junior, senior, expert
      maxLeads: agentData.maxLeads || 100,
      preferredTerritories: agentData.preferredTerritories || [],
      currentLeads: 0,
      totalAssigned: 0,
      successRate: agentData.successRate || 50,
      avgDealSize: agentData.avgDealSize || 8000,
      lastAssignment: null,
      status: 'active', // active, busy, vacation
      created_at: new Date().toISOString()
    };
    
    // Create agent in database
    const { error } = await supabase
      .from('agents')
      .insert(agent);
    
    if (error && !error.message.includes('already exists')) {
      console.log(`⚠️ Note: Could not save agent to database: ${error.message}`);
    }
    
    this.agents.set(agent.id, agent);
    console.log(`✅ Agent registered: ${agent.firstName} ${agent.lastName} (${agent.experience})`);
    
    return agent;
  }
  
  // Smart territory assignment based on agent skills and territory requirements
  getOptimalAgentForTerritory(territoryId) {
    const territory = this.territories[territoryId];
    if (!territory) return null;
    
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.status === 'active' &&
        agent.currentLeads < agent.maxLeads &&
        this.agentMatchesTerritory(agent, territory)
      );
    
    if (availableAgents.length === 0) return null;
    
    // Score agents based on territory fit
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentTerritoryScore(agent, territory)
    }));
    
    // Return best match
    return scoredAgents.sort((a, b) => b.score - a.score)[0].agent;
  }
  
  // Check if agent skills match territory requirements
  agentMatchesTerritory(agent, territory) {
    // Check required skills
    const hasRequiredSkills = territory.requiredSkills.every(skill =>
      agent.skills.includes(skill) || 
      this.getSkillCategory(skill).some(s => agent.skills.includes(s))
    );
    
    // Check experience level for high-difficulty territories
    if (territory.difficulty === 'high' && agent.experience === 'junior') {
      return false;
    }
    
    return hasRequiredSkills;
  }
  
  // Calculate agent-territory compatibility score
  calculateAgentTerritoryScore(agent, territory) {
    let score = 0;
    
    // Experience bonus
    const experienceBonus = {
      'expert': 30,
      'senior': 20,
      'junior': 10
    };
    score += experienceBonus[agent.experience] || 10;
    
    // Skills match bonus
    const skillMatches = territory.requiredSkills.filter(skill =>
      agent.skills.includes(skill)
    );
    score += skillMatches.length * 15;
    
    // Workload factor (prefer less loaded agents)
    const workloadFactor = (agent.maxLeads - agent.currentLeads) / agent.maxLeads;
    score += workloadFactor * 25;
    
    // Success rate bonus
    score += (agent.successRate - 50) * 0.5;
    
    // Territory preference bonus
    if (agent.preferredTerritories.includes(territory.name)) {
      score += 20;
    }
    
    // Language bonus for specific territories
    if (territory.requiredSkills.includes('english_fluent') && 
        agent.languages.includes('english')) {
      score += 10;
    }
    
    return score;
  }
  
  // Assign leads to agents based on territory and load balancing
  async assignLeadsToAgents(limit = 100) {
    console.log('🎯 AGENT TERRITORY ASSIGNMENT');
    console.log('============================');
    
    // Get unassigned leads
    const { data: unassignedLeads, error } = await supabase
      .from('milano_leads')
      .select('*')
      .is('assigned_agent_id', null)
      .gte('data_quality_score', 60)
      .order('data_quality_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error fetching unassigned leads:', error);
      return;
    }
    
    console.log(`📋 Found ${unassignedLeads?.length || 0} unassigned leads`);
    
    let assignments = {
      successful: 0,
      failed: 0,
      byTerritory: {},
      byAgent: {}
    };
    
    for (const lead of unassignedLeads || []) {
      const assignment = await this.assignSingleLead(lead);
      
      if (assignment) {
        assignments.successful++;
        assignments.byTerritory[assignment.territory] = 
          (assignments.byTerritory[assignment.territory] || 0) + 1;
        assignments.byAgent[assignment.agentId] = 
          (assignments.byAgent[assignment.agentId] || 0) + 1;
      } else {
        assignments.failed++;
      }
    }
    
    this.displayAssignmentResults(assignments);
    
    return assignments;
  }
  
  // Assign single lead to best available agent
  async assignSingleLead(lead) {
    // Determine territory based on CAP and zone
    const territory = this.getLeadTerritory(lead);
    if (!territory) {
      console.log(`⚠️ No territory found for lead: ${lead.first_name} ${lead.last_name} (${lead.zona})`);
      return null;
    }
    
    // Get optimal agent for this territory
    const agent = this.getOptimalAgentForTerritory(territory.id);
    if (!agent) {
      console.log(`⚠️ No available agent for territory: ${territory.name}`);
      return null;
    }
    
    // Create assignment
    const assignment = {
      leadId: lead.id,
      agentId: agent.id,
      territory: territory.id,
      assignedAt: new Date().toISOString(),
      priority: territory.priority,
      estimatedValue: territory.avgDealSize,
      status: 'assigned'
    };
    
    // Update lead with agent assignment
    const { error: updateError } = await supabase
      .from('milano_leads')
      .update({
        assigned_agent_id: agent.id,
        lead_status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id);
    
    if (updateError) {
      console.log(`❌ Failed to assign lead ${lead.id}: ${updateError.message}`);
      return null;
    }
    
    // Update agent stats
    agent.currentLeads++;
    agent.totalAssigned++;
    agent.lastAssignment = new Date().toISOString();
    
    console.log(`✅ Assigned: ${lead.first_name} ${lead.last_name} → ${agent.firstName} ${agent.lastName} (${territory.name})`);
    
    return assignment;
  }
  
  // Determine lead territory based on location
  getLeadTerritory(lead) {
    const cap = lead.address_cap;
    const zone = lead.zona;
    
    for (const [territoryId, territory] of Object.entries(this.territories)) {
      if (territory.caps.includes(cap) || territory.zones.includes(zone)) {
        return { id: territoryId, ...territory };
      }
    }
    
    // Default to provincia if no match
    return { id: 'provincia', ...this.territories.provincia };
  }
  
  // Display assignment results
  displayAssignmentResults(assignments) {
    console.log('\\n📊 ASSIGNMENT RESULTS');
    console.log('====================');
    console.log(`✅ Successfully assigned: ${assignments.successful}`);
    console.log(`❌ Failed assignments: ${assignments.failed}`);
    
    if (Object.keys(assignments.byTerritory).length > 0) {
      console.log('\\n🗺️ By Territory:');
      Object.entries(assignments.byTerritory)
        .sort(([,a], [,b]) => b - a)
        .forEach(([territory, count]) => {
          console.log(`   ${territory}: ${count} leads`);
        });
    }
    
    if (Object.keys(assignments.byAgent).length > 0) {
      console.log('\\n👥 By Agent:');
      Object.entries(assignments.byAgent)
        .sort(([,a], [,b]) => b - a)
        .forEach(([agentId, count]) => {
          const agent = this.agents.get(agentId);
          const agentName = agent ? `${agent.firstName} ${agent.lastName}` : agentId;
          console.log(`   ${agentName}: ${count} leads`);
        });
    }
  }
  
  // Utility methods
  getSkillCategory(skill) {
    const categories = {
      'high_value_sales': ['consultative_sales', 'enterprise_sales', 'luxury_sales'],
      'professional_services': ['b2b_sales', 'consulting_experience'],
      'italian_fluent': ['native_italian', 'business_italian'],
      'english_fluent': ['business_english', 'international_sales'],
      'tech_savvy': ['digital_sales', 'software_knowledge'],
      'relationship_building': ['customer_retention', 'networking'],
      'volume_sales': ['phone_sales', 'direct_sales']
    };
    
    return categories[skill] || [skill];
  }
  
  // Get agent performance stats
  async getAgentStats(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return null;
    
    const { data: leadStats, error } = await supabase
      .from('milano_leads')
      .select('lead_status, data_quality_score, revenue_opportunity')
      .eq('assigned_agent_id', agentId);
    
    if (error) {
      console.log(`⚠️ Could not fetch agent stats: ${error.message}`);
      return { ...agent, stats: null };
    }
    
    const stats = {
      totalLeads: leadStats?.length || 0,
      contacted: leadStats?.filter(l => l.lead_status === 'contacted').length || 0,
      qualified: leadStats?.filter(l => l.lead_status === 'qualified').length || 0,
      closed: leadStats?.filter(l => l.lead_status === 'closed_won').length || 0,
      avgQuality: leadStats?.length ? 
        leadStats.reduce((sum, l) => sum + (l.data_quality_score || 0), 0) / leadStats.length : 0,
      totalRevenue: leadStats?.reduce((sum, l) => sum + (l.revenue_opportunity || 0), 0) || 0
    };
    
    return { ...agent, stats };
  }
  
  // Territory performance report
  async getTerritoryReport() {
    console.log('\\n📊 TERRITORY PERFORMANCE REPORT');
    console.log('================================');
    
    for (const [territoryId, territory] of Object.entries(this.territories)) {
      const { data: territoryLeads } = await supabase
        .from('milano_leads')
        .select('lead_status, data_quality_score, revenue_opportunity')
        .in('address_cap', territory.caps);
      
      const leadCount = territoryLeads?.length || 0;
      const assignedCount = territoryLeads?.filter(l => l.assigned_agent_id).length || 0;
      const avgQuality = leadCount > 0 ? 
        territoryLeads.reduce((sum, l) => sum + (l.data_quality_score || 0), 0) / leadCount : 0;
      const totalRevenue = territoryLeads?.reduce((sum, l) => sum + (l.revenue_opportunity || 0), 0) || 0;
      
      console.log(`\\n🗺️ ${territory.name}:`);
      console.log(`   Total leads: ${leadCount}`);
      console.log(`   Assigned: ${assignedCount} (${Math.round(assignedCount/leadCount*100)}%)`);
      console.log(`   Avg quality: ${Math.round(avgQuality)}/100`);
      console.log(`   Revenue potential: €${totalRevenue.toLocaleString()}`);
    }
  }
}

module.exports = { AgentTerritoryManager };