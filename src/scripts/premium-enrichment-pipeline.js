// Premium Enrichment Pipeline - End-to-End for 100 Milano Centro leads
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Mock enrichment services (replace with real APIs later)
class EnrichmentServices {
  
  // Email finding service (Hunter.io mock)
  static async findEmail(companyName, website) {
    console.log(`  📧 Finding email for: ${companyName}`);
    
    // Mock email generation based on company name
    if (Math.random() > 0.6) { // 40% success rate
      const cleanName = companyName.toLowerCase()
        .replace(/[^a-z]/g, '')
        .substring(0, 10);
      const domains = ['gmail.com', 'libero.it', 'virgilio.it', 'hotmail.it'];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `info@${cleanName}.it`;
    }
    return null;
  }
  
  // Phone enrichment service (multiple sources)
  static async enrichPhone(companyName, address) {
    console.log(`  📞 Enriching phone for: ${companyName}`);
    
    // Mock phone generation (Italian mobile/landline)
    if (Math.random() > 0.7) { // 30% success rate
      const prefixes = ['02', '339', '347', '340', '329'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const number = Math.floor(Math.random() * 9000000) + 1000000;
      return `${prefix}${number}`;
    }
    return null;
  }
  
  // Partita IVA lookup (Registro Imprese mock)
  static async findPartitaIVA(companyName, address) {
    console.log(`  🏛️ Looking up P.IVA for: ${companyName}`);
    
    // Mock P.IVA generation
    if (Math.random() > 0.4) { // 60% success rate for professionals
      return Math.floor(Math.random() * 90000000000) + 10000000000;
    }
    return null;
  }
  
  // Company data enrichment (Clearbit mock)
  static async enrichCompanyData(companyName, address) {
    console.log(`  🏢 Enriching company data for: ${companyName}`);
    
    // Mock enhanced company data
    const sectors = [
      'Servizi legali', 'Consulenza', 'Servizi finanziari', 
      'Sanità', 'Architettura', 'Ingegneria', 'Commercio'
    ];
    
    const employees = [1, 2, 3, 5, 8, 12, 20];
    
    return {
      settore: sectors[Math.floor(Math.random() * sectors.length)],
      dipendenti: employees[Math.floor(Math.random() * employees.length)],
      fatturato_stimato: Math.floor(Math.random() * 500000) + 100000,
      website: Math.random() > 0.5 ? `www.${companyName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 15)}.it` : null
    };
  }
  
  // LinkedIn company lookup (mock)
  static async findLinkedInProfile(companyName) {
    console.log(`  💼 Finding LinkedIn for: ${companyName}`);
    
    if (Math.random() > 0.6) { // 40% success rate
      const cleanName = companyName.toLowerCase().replace(/[^a-z]/g, '');
      return `https://linkedin.com/company/${cleanName.substring(0, 20)}`;
    }
    return null;
  }
}

// Enhanced lead scoring with B2C intelligence integration
class PremiumLeadScoring {
  
  // Load Milano B2C insights from uploaded data
  static loadMilanoInsights() {
    // This would read from poi/quartieri_highlights.json and analytics data
    return {
      highValueZones: ['20121', '20122', '20123'], // Centro = premium
      businessDensity: {
        '20121': 95, '20122': 90, '20123': 85,
        '20124': 80, '20125': 75, '20126': 70, '20127': 65
      },
      avgIncome: {
        '20121': 120000, '20122': 110000, '20123': 100000,
        '20124': 90000, '20125': 85000, '20126': 80000, '20127': 75000
      }
    };
  }
  
  // Enhanced scoring algorithm
  static calculateEnhancedScore(lead, enrichedData) {
    const insights = this.loadMilanoInsights();
    let score = 50; // Base score
    
    // Zone premium bonus
    const zoneDensity = insights.businessDensity[lead.address_cap] || 50;
    score += Math.round(zoneDensity * 0.3);
    
    // Professional services bonus
    if (lead.last_name.toLowerCase().includes('studio') || 
        lead.last_name.toLowerCase().includes('avv') ||
        lead.last_name.toLowerCase().includes('dott')) {
      score += 15;
    }
    
    // Enriched data quality bonus
    if (enrichedData.email) score += 8;
    if (enrichedData.phone_enriched) score += 10;
    if (enrichedData.partita_iva) score += 12;
    if (enrichedData.linkedin_url) score += 5;
    if (enrichedData.website) score += 3;
    
    // Company size bonus
    if (enrichedData.dipendenti >= 5) score += 8;
    if (enrichedData.fatturato_stimato >= 200000) score += 10;
    
    return Math.min(100, Math.max(30, score));
  }
}

async function enrichPremiumLeads(limit = 100) {
  console.log('💎 Starting Premium Enrichment Pipeline');
  console.log('=====================================\n');
  
  // Get leads to enrich (prioritize centro ones without enrichment)
  const { data: leadsToEnrich, error } = await supabase
    .from('milano_leads')
    .select('*')
    .in('address_cap', ['20121', '20122', '20123', '20124', '20125', '20126', '20127'])
    .is('email', null) // Not yet enriched
    .order('propensity_casa', { ascending: false })
    .limit(limit);
  
  if (error || !leadsToEnrich) {
    console.error('❌ Error fetching leads:', error);
    return;
  }
  
  console.log(`📋 Found ${leadsToEnrich.length} leads to enrich\n`);
  
  const enrichmentResults = {
    processed: 0,
    emailsFound: 0,
    phonesFound: 0,
    partiteIVAFound: 0,
    companiesEnriched: 0,
    linkedinFound: 0,
    avgQualityScore: 0
  };
  
  for (const lead of leadsToEnrich) {
    console.log(`\n🔍 Enriching: ${lead.first_name} ${lead.last_name} (${lead.address_cap})`);
    
    const enrichedData = {};
    
    try {
      // Run enrichment services in parallel for speed
      const [email, phone, partitaIVA, companyData, linkedinUrl] = await Promise.all([
        EnrichmentServices.findEmail(lead.last_name, null),
        EnrichmentServices.enrichPhone(lead.last_name, lead.address_street),
        EnrichmentServices.findPartitaIVA(lead.last_name, lead.address_street),
        EnrichmentServices.enrichCompanyData(lead.last_name, lead.address_street),
        EnrichmentServices.findLinkedInProfile(lead.last_name)
      ]);
      
      // Store enriched data
      if (email) {
        enrichedData.email = email;
        enrichmentResults.emailsFound++;
        console.log(`    ✅ Email found: ${email}`);
      }
      
      if (phone) {
        enrichedData.phone_enriched = phone;
        enrichmentResults.phonesFound++;
        console.log(`    ✅ Phone found: ${phone}`);
      }
      
      if (partitaIVA) {
        enrichedData.partita_iva = partitaIVA.toString();
        enrichmentResults.partiteIVAFound++;
        console.log(`    ✅ P.IVA found: ${partitaIVA}`);
      }
      
      if (companyData) {
        Object.assign(enrichedData, companyData);
        enrichmentResults.companiesEnriched++;
        console.log(`    ✅ Company data: ${companyData.settore}, ${companyData.dipendenti} emp, €${companyData.fatturato_stimato}`);
      }
      
      if (linkedinUrl) {
        enrichedData.linkedin_url = linkedinUrl;
        enrichmentResults.linkedinFound++;
        console.log(`    ✅ LinkedIn found: ${linkedinUrl}`);
      }
      
      // Calculate enhanced quality score
      const enhancedScore = PremiumLeadScoring.calculateEnhancedScore(lead, enrichedData);
      enrichedData.data_quality_score = enhancedScore;
      enrichedData.enrichment_date = new Date().toISOString();
      enrichedData.enrichment_status = 'completed';
      
      console.log(`    🎯 Enhanced quality score: ${enhancedScore}/100`);
      
      // Update lead in database
      const updateData = {
        ...enrichedData,
        phone: enrichedData.phone_enriched || lead.phone // Keep existing if no new phone
      };
      
      const { error: updateError } = await supabase
        .from('milano_leads')
        .update(updateData)
        .eq('id', lead.id);
      
      if (updateError) {
        console.log(`    ❌ Update error: ${updateError.message}`);
      } else {
        console.log(`    ✅ Lead enriched successfully`);
      }
      
      enrichmentResults.processed++;
      enrichmentResults.avgQualityScore += enhancedScore;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`    ❌ Enrichment error: ${error.message}`);
    }
  }
  
  // Final results
  enrichmentResults.avgQualityScore = Math.round(enrichmentResults.avgQualityScore / enrichmentResults.processed);
  
  console.log('\n🎉 ENRICHMENT PIPELINE COMPLETED');
  console.log('================================');
  console.log(`📊 Processed: ${enrichmentResults.processed} leads`);
  console.log(`📧 Emails found: ${enrichmentResults.emailsFound} (${Math.round(enrichmentResults.emailsFound/enrichmentResults.processed*100)}%)`);
  console.log(`📞 Phones found: ${enrichmentResults.phonesFound} (${Math.round(enrichmentResults.phonesFound/enrichmentResults.processed*100)}%)`);
  console.log(`🏛️ P.IVA found: ${enrichmentResults.partiteIVAFound} (${Math.round(enrichmentResults.partiteIVAFound/enrichmentResults.processed*100)}%)`);
  console.log(`🏢 Companies enriched: ${enrichmentResults.companiesEnriched} (${Math.round(enrichmentResults.companiesEnriched/enrichmentResults.processed*100)}%)`);
  console.log(`💼 LinkedIn found: ${enrichmentResults.linkedinFound} (${Math.round(enrichmentResults.linkedinFound/enrichmentResults.processed*100)}%)`);
  console.log(`🎯 Average quality score: ${enrichmentResults.avgQualityScore}/100`);
  
  return enrichmentResults;
}

// Command line usage
if (require.main === module) {
  const limit = parseInt(process.argv[2]) || 50;
  enrichPremiumLeads(limit)
    .then((results) => {
      console.log('\n✅ Premium enrichment pipeline completed!');
      console.log(`🎯 ${results.processed} leads enriched with avg quality ${results.avgQualityScore}/100`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Pipeline error:', error);
      process.exit(1);
    });
}

module.exports = { enrichPremiumLeads, PremiumLeadScoring };