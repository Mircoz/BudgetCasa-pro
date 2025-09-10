// Test dashboard access with fixed configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

// Use the same configuration as the fixed dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcW1jbnJmZ2ljc3F2anZicnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg0NTA2MiwiZXhwIjoyMDcxNDIxMDYyfQ.GMSGrHcUpS11JBj3vIp75fgsKWO9tOfzEdPlz56m5f4';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDashboardQuery() {
  console.log('🧪 Testing dashboard query with fixed config...');
  
  try {
    // Test the exact query the dashboard uses
    const { data, error, count } = await supabase
      .from('milano_leads')
      .select('*', { count: 'exact' })
      .limit(100);

    if (error) {
      console.log('❌ Dashboard query error:', error);
      return;
    }

    console.log(`✅ Dashboard query SUCCESS: ${count} leads found`);
    console.log('First 3 leads:', data.slice(0, 3).map(lead => ({
      name: `${lead.first_name} ${lead.last_name}`,
      zona: lead.zona,
      propensity_casa: lead.propensity_casa
    })));

    // Test stats query too
    const allLeads = data || [];
    const totalLeads = allLeads.length;
    const avgPropensityCasa = totalLeads > 0 
      ? Math.round(allLeads.reduce((sum, lead) => sum + lead.propensity_casa, 0) / totalLeads)
      : 0;
    const leadsWithEmail = allLeads.filter(lead => lead.email).length;
    const leadsWithPhone = allLeads.filter(lead => lead.phone).length;

    console.log('📊 Stats calculation:');
    console.log(`  Total: ${totalLeads}`);
    console.log(`  Avg Casa Score: ${avgPropensityCasa}`);
    console.log(`  With Email: ${leadsWithEmail} (${Math.round((leadsWithEmail/totalLeads)*100) || 0}%)`);
    console.log(`  With Phone: ${leadsWithPhone} (${Math.round((leadsWithPhone/totalLeads)*100) || 0}%)`);

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testDashboardQuery();