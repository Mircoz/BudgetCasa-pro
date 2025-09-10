// Budget calculator for premium lead enrichment
console.log('💰 BUDGET CALCULATOR - Premium Lead Enrichment\n');

const TARGET_LEADS = 2000;
const QUALITY_THRESHOLD = 80; // Only leads with 80%+ data completeness

console.log(`🎯 TARGET: ${TARGET_LEADS} premium leads Milano + Provincia\n`);

// API Costs (per lead)
const costs = {
  // Primary data sources (free/scraping)
  pagineGialle: 0,
  registroImprese: 0, // API gratuita Camera Commercio
  googleMyBusiness: 0, // Scraping
  
  // Enrichment services
  hunterIO: 0.10,      // Email finding
  clearbit: 0.20,      // Company enrichment  
  pipl: 0.15,          // Contact info
  zoomInfo: 0.25,      // B2B database
  truecaller: 0.05,    // Phone validation
  
  // Premium data
  linkedin: 0.30,      // LinkedIn Sales Navigator data
  infocamere: 0.08,    // Partite IVA ufficiali
  
  // Total per lead
  totalPerLead: 0
};

costs.totalPerLead = costs.hunterIO + costs.clearbit + costs.pipl + 
                    costs.zoomInfo + costs.truecaller + costs.linkedin + 
                    costs.infocamere;

console.log('📊 COSTI PER LEAD:');
console.log(`• Email finding (Hunter.io): €${costs.hunterIO}`);
console.log(`• Company data (Clearbit): €${costs.clearbit}`);  
console.log(`• Contact info (Pipl): €${costs.pipl}`);
console.log(`• B2B data (ZoomInfo): €${costs.zoomInfo}`);
console.log(`• Phone validation (Truecaller): €${costs.truecaller}`);
console.log(`• LinkedIn data: €${costs.linkedin}`);
console.log(`• Partite IVA (Infocamere): €${costs.infocamere}`);
console.log(`─────────────────────────────────────`);
console.log(`💎 TOTALE PER LEAD: €${costs.totalPerLead.toFixed(2)}\n`);

// Budget scenarios
const scenarios = {
  basic: {
    name: 'BASIC ENRICHMENT',
    services: ['hunterIO', 'infocamere', 'truecaller'],
    costPerLead: costs.hunterIO + costs.infocamere + costs.truecaller,
    quality: '60-70%'
  },
  premium: {
    name: 'PREMIUM ENRICHMENT', 
    services: ['hunterIO', 'clearbit', 'pipl', 'infocamere', 'truecaller'],
    costPerLead: costs.hunterIO + costs.clearbit + costs.pipl + costs.infocamere + costs.truecaller,
    quality: '80-85%'
  },
  enterprise: {
    name: 'ENTERPRISE ENRICHMENT',
    services: ['hunterIO', 'clearbit', 'pipl', 'zoomInfo', 'truecaller', 'linkedin', 'infocamere'],
    costPerLead: costs.totalPerLead,
    quality: '90-95%'
  }
};

console.log('🎭 SCENARI BUDGET:');
Object.entries(scenarios).forEach(([key, scenario]) => {
  const totalCost = scenario.costPerLead * TARGET_LEADS;
  console.log(`\n${scenario.name}:`);
  console.log(`• Qualità dati: ${scenario.quality}`);
  console.log(`• Costo per lead: €${scenario.costPerLead.toFixed(2)}`);
  console.log(`• Costo totale ${TARGET_LEADS} leads: €${totalCost.toFixed(0)}`);
  console.log(`• Servizi: ${scenario.services.join(', ')}`);
});

// ROI calculation
const agentSubscription = 199; // €/mese
const leadsPerAgent = 500;
const agentsNeeded = Math.ceil(TARGET_LEADS / leadsPerAgent);

console.log(`\n📈 ROI ANALYSIS:`);
console.log(`• Subscription agente: €${agentSubscription}/mese`);
console.log(`• Lead per agente: ${leadsPerAgent}`);
console.log(`• Agenti potenziali: ${agentsNeeded}`);
console.log(`• Revenue mensile potenziale: €${agentsNeeded * agentSubscription}`);
console.log(`• Payback enrichment premium: ${Math.ceil(scenarios.premium.costPerLead * TARGET_LEADS / (agentsNeeded * agentSubscription))} mesi`);

console.log(`\n🚀 RACCOMANDAZIONE: PREMIUM ENRICHMENT`);
console.log(`Budget consigliato: €${Math.round(scenarios.premium.costPerLead * TARGET_LEADS)} per qualità 80-85%`);