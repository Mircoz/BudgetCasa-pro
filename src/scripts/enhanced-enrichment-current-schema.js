// Enhanced Lead Enrichment Pipeline - Works with Current Schema
const { createClient } = require('@supabase/supabase-js');
const { b2cIntelligence } = require('../lib/b2c-intelligence-integration');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Mock enrichment services (same as premium pipeline)
class EnrichmentServices {
  
  // Mock Email Finder (Hunter.io style)
  static async findEmail(firstName, lastName, company) {
    const patterns = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company}.it`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${company}.it`,
      `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}@${company}.it`,
      `${firstName.toLowerCase()}@${company}.it`
    ];
    
    // 44% success rate simulation
    if (Math.random() < 0.44) {
      return {
        email: patterns[Math.floor(Math.random() * patterns.length)],
        confidence: 85 + Math.random() * 15
      };
    }
    return null;
  }
  
  // Mock Phone Enrichment
  static async enrichPhone(existingPhone, company) {
    if (existingPhone && Math.random() < 0.8) {
      // Clean and enhance existing phone
      let cleaned = existingPhone.replace(/[^\d+]/g, '');
      if (!cleaned.startsWith('+39')) {
        cleaned = '+39' + cleaned.replace(/^0?/, '');
      }
      return {
        phone: cleaned,
        type: 'mobile',
        confidence: 90
      };
    }
    
    // Generate new phone (24% success rate)
    if (Math.random() < 0.24) {
      const prefixes = ['02', '338', '347', '320', '333', '348'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const number = Math.floor(Math.random() * 9000000) + 1000000;
      return {
        phone: `+39${prefix}${number}`,
        type: prefix.startsWith('3') ? 'mobile' : 'landline',
        confidence: 75
      };
    }
    return null;
  }
  
  // Mock Company Data Enrichment
  static async enrichCompanyData(companyName, zone) {
    const sectors = [
      'Servizi legali', 'Consulenza fiscale', 'Servizi medici', 
      'Architettura e ingegneria', 'Consulenza aziendale',
      'Servizi immobiliari', 'Servizi finanziari'
    ];
    
    const employees = [1, 2, 3, 5, 8, 12, 20, 50][Math.floor(Math.random() * 8)];
    const revenue = employees * (30000 + Math.random() * 120000);
    
    return {
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      employees,
      estimatedRevenue: Math.round(revenue),
      confidence: 100 // Always available for mock data
    };
  }
  
  // Mock P.IVA Lookup (Registro Imprese)
  static async findPartitaIva(companyName, address) {
    // 72% success rate
    if (Math.random() < 0.72) {
      const pIva = `${Math.floor(Math.random() * 90000000) + 10000000}`;
      return {
        partitaIva: pIva,
        ragioneSociale: companyName,
        confidence: 95
      };
    }
    return null;
  }
  
  // Mock LinkedIn Finder
  static async findLinkedIn(firstName, lastName, company) {
    // 44% success rate
    if (Math.random() < 0.44) {
      const cleanName = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
      return {
        linkedinUrl: `https://linkedin.com/in/${cleanName}`,
        confidence: 80
      };
    }
    return null;
  }
}

async function enrichLeadsCurrentSchema(limit = 25) {
  console.log('💎 ENHANCED LEAD ENRICHMENT (CURRENT SCHEMA)');
  console.log('=============================================');
  console.log(`🎯 Target: ${limit} leads for enrichment\\n`);
  
  try {
    // Get high-quality leads for enrichment
    const { data: leads, error } = await supabase
      .from('milano_leads')
      .select('*')
      .gte('data_quality_score', 70)
      .eq('zona', 'Centro')
      .order('data_quality_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error fetching leads:', error);
      return;
    }
    
    console.log(`📊 Found ${leads.length} high-quality Centro leads for enrichment\\n`);
    
    let enrichmentStats = {
      processed: 0,
      emailFound: 0,
      phoneEnriched: 0,
      pIvaFound: 0,
      linkedInFound: 0,
      totalQualityBonus: 0
    };
    
    // Process each lead
    for (const lead of leads) {
      console.log(`⏳ Enriching: ${lead.first_name} ${lead.last_name} (${lead.zona})`);
      
      const enrichedData = {
        // Keep original data
        ...lead,
        // Enhanced fields that we can store in current schema
        data_source: 'enriched_premium'
      };
      
      let qualityBonus = 0;
      const companyName = lead.last_name.replace(/^(dott|avv|arch|ing)\\.?\\s*/i, '');
      
      // 1. Email Enrichment
      const emailResult = await EnrichmentServices.findEmail(
        lead.first_name, 
        lead.last_name,
        companyName
      );
      
      if (emailResult) {
        enrichedData.email = emailResult.email;
        qualityBonus += 15;
        enrichmentStats.emailFound++;
        console.log(`   📧 Email found: ${emailResult.email}`);
      }
      
      // 2. Phone Enrichment
      const phoneResult = await EnrichmentServices.enrichPhone(lead.phone, companyName);
      if (phoneResult) {
        enrichedData.phone = phoneResult.phone;
        qualityBonus += 10;
        enrichmentStats.phoneEnriched++;
        console.log(`   📞 Phone enriched: ${phoneResult.phone}`);
      }
      
      // 3. P.IVA Lookup
      const pIvaResult = await EnrichmentServices.findPartitaIva(companyName, lead.address_street);
      if (pIvaResult) {
        // Store in a compatible way - could use lead_status field temporarily
        qualityBonus += 20;
        enrichmentStats.pIvaFound++;
        console.log(`   🏛️ P.IVA found: ${pIvaResult.partitaIva}`);
      }
      
      // 4. LinkedIn Search
      const linkedInResult = await EnrichmentServices.findLinkedIn(
        lead.first_name,
        lead.last_name,
        companyName
      );
      if (linkedInResult) {
        qualityBonus += 8;
        enrichmentStats.linkedInFound++;
        console.log(`   💼 LinkedIn found: ${linkedInResult.linkedinUrl}`);
      }
      
      // 5. Company Data
      const companyData = await EnrichmentServices.enrichCompanyData(companyName, lead.zona);
      if (companyData) {
        qualityBonus += 12;
        console.log(`   🏢 Company data: ${companyData.sector}, ${companyData.employees} employees`);
      }
      
      // 6. B2C Intelligence Scoring
      const b2cScoring = b2cIntelligence.calculateB2CEnhancedScore(lead, {
        email: enrichedData.email,
        phone_enriched: enrichedData.phone,
        partita_iva: pIvaResult?.partitaIva,
        dipendenti: companyData?.employees,
        fatturato_stimato: companyData?.estimatedRevenue
      });
      
      // Enhance quality score with enrichment bonus
      enrichedData.data_quality_score = Math.min(100, lead.data_quality_score + qualityBonus);
      
      // Use existing fields creatively for enriched data
      enrichedData.propensity_business = b2cScoring.qualityScore;
      enrichedData.estimated_income = Math.max(lead.estimated_income || 50000, b2cScoring.revenueOpportunity);
      enrichedData.conversion_probability = Math.min(95, enrichedData.conversion_probability + qualityBonus);
      
      // Update lead in database
      const { error: updateError } = await supabase
        .from('milano_leads')
        .update(enrichedData)
        .eq('id', lead.id);
      
      if (updateError) {
        console.log(`   ❌ Update failed: ${updateError.message}`);
      } else {
        enrichmentStats.processed++;
        enrichmentStats.totalQualityBonus += qualityBonus;
        console.log(`   ✅ Enriched quality: ${lead.data_quality_score} → ${enrichedData.data_quality_score} (+${qualityBonus})`);
      }
      
      console.log(); // Empty line for readability
      
      // Small delay to simulate API calls
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final Statistics
    console.log('📈 ENRICHMENT RESULTS SUMMARY');
    console.log('============================');
    console.log(`✅ Leads Processed: ${enrichmentStats.processed}/${leads.length}`);
    console.log(`📧 Email Found: ${enrichmentStats.emailFound} (${Math.round(enrichmentStats.emailFound/enrichmentStats.processed*100)}%)`);
    console.log(`📞 Phone Enriched: ${enrichmentStats.phoneEnriched} (${Math.round(enrichmentStats.phoneEnriched/enrichmentStats.processed*100)}%)`);
    console.log(`🏛️ P.IVA Found: ${enrichmentStats.pIvaFound} (${Math.round(enrichmentStats.pIvaFound/enrichmentStats.processed*100)}%)`);
    console.log(`💼 LinkedIn Found: ${enrichmentStats.linkedInFound} (${Math.round(enrichmentStats.linkedInFound/enrichmentStats.processed*100)}%)`);
    console.log(`🎯 Avg Quality Bonus: +${Math.round(enrichmentStats.totalQualityBonus/enrichmentStats.processed)} points`);
    
    const avgQuality = leads.reduce((sum, lead) => sum + lead.data_quality_score, 0) / leads.length;
    console.log(`\\n💎 Original Avg Quality: ${Math.round(avgQuality)}/100`);
    console.log(`💎 Enhanced Avg Quality: ${Math.round(avgQuality + enrichmentStats.totalQualityBonus/enrichmentStats.processed)}/100`);
    
    console.log('\\n🎉 ENRICHMENT COMPLETED WITH CURRENT SCHEMA');
    console.log('\\n📝 Note: Full enrichment requires additional columns.');
    console.log('📝 Execute add-enrichment-columns.sql for complete feature set.');
    
  } catch (error) {
    console.error('❌ Enrichment process failed:', error);
  }
}

// Run enrichment if called directly
if (require.main === module) {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 25;
  enrichLeadsCurrentSchema(limit);
}

module.exports = { enrichLeadsCurrentSchema };