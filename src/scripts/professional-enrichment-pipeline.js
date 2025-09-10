// Professional Enrichment Pipeline with Real APIs
const { createClient } = require('@supabase/supabase-js');
const { RealEnrichmentAPIs } = require('../lib/real-enrichment-apis');
const { b2cIntelligence } = require('../lib/b2c-intelligence-integration');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

class ProfessionalEnrichmentPipeline {
  
  constructor() {
    this.realAPIs = new RealEnrichmentAPIs();
    this.stats = {
      processed: 0,
      enriched: 0,
      emailsFound: 0,
      phonesEnriched: 0,
      pIvaFound: 0,
      companiesEnriched: 0,
      linkedInFound: 0,
      totalConfidence: 0,
      apiCosts: 0
    };
  }
  
  // Select leads for enrichment with smart prioritization
  async selectLeadsForEnrichment(limit = 50) {
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
      .or('enrichment_status.is.null,enrichment_status.eq.pending')
      .gte('data_quality_score', 70) // Focus on high-quality leads
      .in('zona', ['Centro', 'Porta Nuova', 'Brera', 'Isola']) // Premium zones first
      .order('data_quality_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error selecting leads:', error);
      return [];
    }
    
    console.log(`📋 Selected ${leads?.length || 0} high-priority leads for enrichment`);
    return leads || [];
  }
  
  // Professional enrichment with real APIs
  async enrichSingleLead(lead) {
    console.log(`\\n🔍 ENRICHING: ${lead.first_name} ${lead.last_name} (${lead.zona})`);
    console.log('=' .repeat(60));
    
    try {
      // Use real APIs for enrichment
      const enrichmentResult = await this.realAPIs.enrichLead(lead);
      
      // Calculate API costs (estimated)
      const apiCost = this.calculateAPICost(enrichmentResult.sources);
      this.stats.apiCosts += apiCost;
      
      // Enhance with B2C intelligence
      const b2cScoring = b2cIntelligence.calculateB2CEnhancedScore(
        lead, 
        enrichmentResult.enriched
      );
      
      // Merge all enrichment data
      const finalEnrichment = {
        ...enrichmentResult.enriched,
        enhanced_quality_score: Math.max(
          enrichmentResult.enriched.enhanced_quality_score,
          b2cScoring.qualityScore
        ),
        revenue_opportunity: b2cScoring.revenueOpportunity,
        business_type: b2cScoring.businessType,
        zone_rating: b2cScoring.zoneRating,
        b2c_correlation_score: Math.round(
          (b2cScoring.b2cCorrelation.highValueCustomers + 
           b2cScoring.b2cCorrelation.digitalEngagement) / 2
        ),
        preferred_products: b2cScoring.preferredProducts,
        enrichment_date: new Date().toISOString(),
        enrichment_status: 'completed',
        contact_attempts: 0,
        updated_at: new Date().toISOString()
      };
      
      // Update statistics
      this.updateStatistics(enrichmentResult, finalEnrichment);
      
      // Save to database
      const { error: updateError } = await supabase
        .from('milano_leads')
        .update(finalEnrichment)
        .eq('id', lead.id);
      
      if (updateError) {
        console.log(`   ❌ Database update failed: ${updateError.message}`);
        return null;
      }
      
      // Display enrichment summary
      this.displayEnrichmentSummary(lead, finalEnrichment, enrichmentResult.sources);
      
      return finalEnrichment;
      
    } catch (error) {
      console.log(`   ❌ Enrichment failed: ${error.message}`);
      
      // Mark as failed
      await supabase
        .from('milano_leads')
        .update({
          enrichment_status: 'failed',
          enrichment_date: new Date().toISOString()
        })
        .eq('id', lead.id);
        
      return null;
    }
  }
  
  // Update enrichment statistics
  updateStatistics(enrichmentResult, finalEnrichment) {
    this.stats.processed++;
    
    if (enrichmentResult.confidence > 60) {
      this.stats.enriched++;
    }
    
    if (finalEnrichment.email) {
      this.stats.emailsFound++;
    }
    
    if (finalEnrichment.phone_enriched && finalEnrichment.phone_enriched !== finalEnrichment.phone) {
      this.stats.phonesEnriched++;
    }
    
    if (finalEnrichment.partita_iva) {
      this.stats.pIvaFound++;
    }
    
    if (finalEnrichment.dipendenti || finalEnrichment.fatturato_stimato) {
      this.stats.companiesEnriched++;
    }
    
    if (finalEnrichment.linkedin_url) {
      this.stats.linkedInFound++;
    }
    
    this.stats.totalConfidence += enrichmentResult.confidence;
  }
  
  // Display enrichment summary for each lead
  displayEnrichmentSummary(originalLead, enrichedLead, sources) {
    console.log('\\n📊 ENRICHMENT RESULTS:');
    
    if (enrichedLead.email) {
      console.log(`   📧 Email: ${enrichedLead.email}`);
    }
    
    if (enrichedLead.phone_enriched) {
      console.log(`   📞 Phone: ${enrichedLead.phone_enriched}`);
    }
    
    if (enrichedLead.partita_iva) {
      console.log(`   🏛️ P.IVA: ${enrichedLead.partita_iva}`);
    }
    
    if (enrichedLead.dipendenti) {
      console.log(`   👥 Employees: ${enrichedLead.dipendenti}`);
    }
    
    if (enrichedLead.fatturato_stimato) {
      console.log(`   💰 Revenue: €${enrichedLead.fatturato_stimato.toLocaleString()}`);
    }
    
    if (enrichedLead.linkedin_url) {
      console.log(`   💼 LinkedIn: ${enrichedLead.linkedin_url}`);
    }
    
    console.log(`   🎯 Quality Score: ${originalLead.data_quality_score} → ${enrichedLead.enhanced_quality_score} (+${enrichedLead.enhanced_quality_score - originalLead.data_quality_score})`);
    console.log(`   💎 Revenue Opportunity: €${enrichedLead.revenue_opportunity}`);
    console.log(`   🏢 Business Type: ${enrichedLead.business_type}`);
    
    console.log('\\n🔗 Data Sources:');
    sources.forEach(source => console.log(`   • ${source}`));
  }
  
  // Calculate API usage costs
  calculateAPICost(sources) {
    let cost = 0;
    
    sources.forEach(source => {
      if (source.includes('hunter')) cost += 0.05; // €0.05 per email search
      if (source.includes('clearbit')) cost += 0.08; // €0.08 per company lookup
      if (source.includes('registro_imprese')) cost += 0.03; // €0.03 per P.IVA lookup
      if (source.includes('linkedin')) cost += 0.02; // €0.02 per LinkedIn search
    });
    
    return cost;
  }
  
  // Run complete enrichment pipeline
  async runEnrichmentPipeline(targetLeads = 50) {
    console.log('🚀 PROFESSIONAL ENRICHMENT PIPELINE');
    console.log('===================================');
    console.log(`🎯 Target: ${targetLeads} leads for professional enrichment`);
    console.log(`💰 Estimated cost: €${(targetLeads * 0.18).toFixed(2)} (avg €0.18 per lead)\\n`);
    
    // Get leads for enrichment
    const leads = await this.selectLeadsForEnrichment(targetLeads);
    
    if (leads.length === 0) {
      console.log('❌ No leads available for enrichment');
      return;
    }
    
    console.log(`📋 Processing ${leads.length} priority leads...\\n`);
    
    // Process each lead
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      console.log(`\\n[${i + 1}/${leads.length}] Processing ${lead.first_name} ${lead.last_name}...`);
      
      await this.enrichSingleLead(lead);
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Show progress every 10 leads
      if ((i + 1) % 10 === 0) {
        console.log('\\n📊 PROGRESS UPDATE:');
        console.log(`   Processed: ${i + 1}/${leads.length}`);
        console.log(`   Success rate: ${Math.round(this.stats.enriched / this.stats.processed * 100)}%`);
        console.log(`   API costs so far: €${this.stats.apiCosts.toFixed(2)}`);
      }
    }
    
    // Final results
    await this.displayFinalResults();
  }
  
  // Display final enrichment results
  async displayFinalResults() {
    console.log('\\n\\n🎉 PROFESSIONAL ENRICHMENT COMPLETED');
    console.log('=====================================');
    
    const avgConfidence = this.stats.processed > 0 ? this.stats.totalConfidence / this.stats.processed : 0;
    
    console.log('📊 ENRICHMENT STATISTICS:');
    console.log(`   ✅ Leads processed: ${this.stats.processed}`);
    console.log(`   💎 Successfully enriched: ${this.stats.enriched} (${Math.round(this.stats.enriched / this.stats.processed * 100)}%)`);
    console.log(`   📧 Emails found: ${this.stats.emailsFound} (${Math.round(this.stats.emailsFound / this.stats.processed * 100)}%)`);
    console.log(`   📞 Phones enriched: ${this.stats.phonesEnriched} (${Math.round(this.stats.phonesEnriched / this.stats.processed * 100)}%)`);
    console.log(`   🏛️ P.IVA found: ${this.stats.pIvaFound} (${Math.round(this.stats.pIvaFound / this.stats.processed * 100)}%)`);
    console.log(`   🏢 Companies enriched: ${this.stats.companiesEnriched} (${Math.round(this.stats.companiesEnriched / this.stats.processed * 100)}%)`);
    console.log(`   💼 LinkedIn found: ${this.stats.linkedInFound} (${Math.round(this.stats.linkedInFound / this.stats.processed * 100)}%)`);
    console.log(`   🎯 Average confidence: ${Math.round(avgConfidence)}%`);
    
    console.log('\\n💰 API COSTS:');
    console.log(`   Total spent: €${this.stats.apiCosts.toFixed(2)}`);
    console.log(`   Cost per lead: €${(this.stats.apiCosts / this.stats.processed).toFixed(3)}`);
    
    const apiUsage = this.realAPIs.getUsageStats();
    console.log(`   API requests: ${apiUsage.total} total (Hunter: ${apiUsage.hunter}, Clearbit: ${apiUsage.clearbit}, Italian: ${apiUsage.italian})`);
    
    // Check database final status
    const { count: enrichedCount } = await supabase
      .from('milano_leads')
      .select('id', { count: 'exact' })
      .eq('enrichment_status', 'completed');
    
    const { count: totalCount } = await supabase
      .from('milano_leads') 
      .select('id', { count: 'exact' });
    
    console.log('\\n📊 DATABASE STATUS:');
    console.log(`   Total leads: ${totalCount}`);
    console.log(`   Enriched leads: ${enrichedCount} (${Math.round(enrichedCount / totalCount * 100)}%)`);
    console.log(`   Ready for demo: ✅`);
    
    console.log('\\n🚀 NEXT STEPS:');
    console.log('   1. Review enriched leads in dashboard');
    console.log('   2. Set up agent territory assignments'); 
    console.log('   3. Create lead export functionality');
    console.log('   4. Implement contact tracking system');
    
    console.log('\\n✅ Professional enrichment pipeline completed successfully!');
  }
}

// Run pipeline
async function runProfessionalEnrichment() {
  const pipeline = new ProfessionalEnrichmentPipeline();
  
  const targetLeads = process.argv[2] ? parseInt(process.argv[2]) : 25;
  
  try {
    await pipeline.runEnrichmentPipeline(targetLeads);
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  runProfessionalEnrichment();
}

module.exports = { ProfessionalEnrichmentPipeline };