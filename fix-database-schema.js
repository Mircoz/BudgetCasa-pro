// Fix database schema and add missing columns
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

async function fixDatabaseSchema() {
  console.log('🔧 Fixing database schema...');
  
  try {
    // Test current structure by trying to insert a simple lead
    const testLead = {
      first_name: 'Test',
      last_name: 'Lead',
      address_cap: '20121',
      zona: 'Centro',
      estimated_income: 50000,
      family_size: 1,
      home_ownership: 'owner',
      propensity_casa: 60,
      propensity_auto: 65,
      propensity_vita: 55,
      propensity_business: 70,
      data_source: 'test',
      data_quality_score: 75,
      lead_status: 'new',
      conversion_probability: 62,
      contact_attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('🧪 Testing current schema...');
    const { data, error } = await supabase
      .from('milano_leads')
      .insert(testLead)
      .select()
      .single();

    if (error) {
      console.log('❌ Schema issues found:', error.message);
      
      if (error.message.includes('contact_attempts')) {
        console.log('🔧 Missing contact_attempts column');
      }
      if (error.message.includes('created_at')) {
        console.log('🔧 Missing created_at column');
      }
      if (error.message.includes('updated_at')) {
        console.log('🔧 Missing updated_at column');
      }
    } else {
      console.log('✅ Schema test passed, cleaning up test record');
      await supabase
        .from('milano_leads')
        .delete()
        .eq('id', data.id);
    }

    // Check current leads structure
    const { data: existingLeads } = await supabase
      .from('milano_leads')
      .select('*')
      .limit(1);
      
    if (existingLeads && existingLeads.length > 0) {
      console.log('\n📋 Current lead structure:');
      console.log('Available columns:', Object.keys(existingLeads[0]));
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

fixDatabaseSchema();