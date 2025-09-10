// Check enriched leads status
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkEnrichedLeads() {
  console.log('💎 ENRICHED LEADS STATUS');
  console.log('========================');
  
  const { data: enriched } = await supabase
    .from('milano_leads')
    .select('*')
    .not('email', 'is', null)
    .order('data_quality_score', { ascending: false })
    .limit(5);
  
  console.log('Top 5 enriched leads:');
  enriched?.forEach((lead, i) => {
    console.log(`${i+1}. ${lead.first_name} ${lead.last_name} (${lead.zona})`);
    console.log(`   📧 ${lead.email || 'N/A'}`);
    console.log(`   📞 ${lead.phone || 'N/A'}`);
    console.log(`   🎯 Quality: ${lead.data_quality_score}/100`);
    console.log(`   💰 Revenue: €${Math.round((lead.estimated_income || 50000) * 0.025)}`);
    console.log();
  });
  
  const { count: totalEnriched } = await supabase
    .from('milano_leads')
    .select('id', { count: 'exact' })
    .not('email', 'is', null);
    
  const { count: totalLeads } = await supabase
    .from('milano_leads')
    .select('id', { count: 'exact' });
    
  console.log(`📊 Total enriched leads: ${totalEnriched}/${totalLeads} (${Math.round(totalEnriched/totalLeads*100)}%)`);
  
  // Check phone enrichment
  const { count: withPhone } = await supabase
    .from('milano_leads')
    .select('id', { count: 'exact' })
    .not('phone', 'is', null);
    
  console.log(`📞 Leads with phone: ${withPhone}/${totalLeads} (${Math.round(withPhone/totalLeads*100)}%)`);
  
  // Zone distribution of enriched
  const { data: zoneStats } = await supabase
    .from('milano_leads')  
    .select('zona')
    .not('email', 'is', null);
    
  const zones = {};
  zoneStats?.forEach(lead => {
    zones[lead.zona] = (zones[lead.zona] || 0) + 1;
  });
  
  console.log('\n🗺️ Enriched by zone:');
  Object.entries(zones).forEach(([zona, count]) => 
    console.log(`  ${zona}: ${count} enriched`)
  );
}

checkEnrichedLeads();