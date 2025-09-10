// Analyze real vs dummy data in Milano leads
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function analyzeLeadData() {
  console.log('🔍 Analyzing Milano leads data...\n');
  
  const { data: leads } = await supabase
    .from('milano_leads')
    .select('*')
    .limit(3);

  if (!leads) return;

  console.log('📋 SAMPLE LEAD DATA:');
  leads.forEach((lead, i) => {
    console.log(`\n--- Lead ${i+1} ---`);
    console.log('✅ REAL DATA (from PagineGialle scraping):');
    console.log('  Nome:', lead.first_name, lead.last_name);
    console.log('  CAP:', lead.address_cap);
    console.log('  Zona:', lead.zona);
    console.log('  Source:', lead.data_source);
    
    console.log('\n🤖 CALCULATED/DUMMY DATA:');
    console.log('  Phone:', lead.phone || 'NULL');
    console.log('  Email:', lead.email || 'NULL'); 
    console.log('  Estimated Income:', lead.estimated_income, '€');
    console.log('  Propensity Casa:', lead.propensity_casa);
    console.log('  Propensity Auto:', lead.propensity_auto);
    console.log('  Propensity Vita:', lead.propensity_vita);
    console.log('  Conversion Probability:', lead.conversion_probability, '%');
    console.log('  Data Quality Score:', lead.data_quality_score);
  });

  // Count data completeness
  const { data: allLeads } = await supabase
    .from('milano_leads')
    .select('phone, email, estimated_income, propensity_casa');
    
  const totalLeads = allLeads.length;
  const withPhone = allLeads.filter(l => l.phone).length;
  const withEmail = allLeads.filter(l => l.email).length;
  
  console.log('\n📊 DATA COMPLETENESS (All 85 leads):');
  console.log('  Leads with Phone:', withPhone, '/', totalLeads, '(' + Math.round(withPhone/totalLeads*100) + '%)');
  console.log('  Leads with Email:', withEmail, '/', totalLeads, '(' + Math.round(withEmail/totalLeads*100) + '%)');
  
  console.log('\n💡 EXPLANATION OF CALCULATIONS:');
  console.log('📞 PHONE: Missing because PagineGialle doesn\'t provide phone numbers in search results');
  console.log('📧 EMAIL: Missing because not scraped from public listings');
  console.log('💰 REVENUE: Calculated as estimated_income * 2.5% (typical insurance premium)');
  console.log('🎯 URGENCY: Based on propensity_casa score (80+ = HIGH, 60+ = MEDIUM, <60 = LOW)');
  console.log('📈 CONVERSION %: Average of propensity_casa + propensity_auto scores');
  console.log('🏠 PROPENSITY CASA: Random 30-90 (simulated home insurance interest)');
  console.log('🚗 PROPENSITY AUTO: Random 30-90 (simulated auto insurance interest)');
  console.log('❤️ PROPENSITY VITA: Random 30-90 (simulated life insurance interest)');
}

analyzeLeadData();