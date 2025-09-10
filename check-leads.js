const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLeads() {
  console.log('🔍 Checking Milano leads database...');
  
  const { data, error, count } = await supabase
    .from('milano_leads')
    .select('*', { count: 'exact' })
    .limit(5);

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Total leads in database: ${count}`);
  console.log('\n📋 Sample leads:');
  
  data.forEach((lead, i) => {
    console.log(`${i+1}. ${lead.first_name} ${lead.last_name}`);
    console.log(`   Zona: ${lead.zona} (${lead.address_cap})`);
    console.log(`   Source: ${lead.data_source}`);
    console.log(`   Casa: ${lead.propensity_casa}%, Auto: ${lead.propensity_auto}%, Vita: ${lead.propensity_vita}%`);
    console.log('');
  });
}

checkLeads();