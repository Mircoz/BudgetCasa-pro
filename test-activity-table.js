// Test if lead_activities table exists and create it if needed
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

async function testActivityTable() {
  console.log('🧪 Testing lead_activities table...');
  
  try {
    // Try to insert a test activity
    const { data, error } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: 'test-lead-id',
        agent_id: 'test-agent-id',
        activity_type: 'called',
        notes: 'Test activity',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Activity table error:', error);
      
      if (error.code === '42P01') { // Table doesn't exist
        console.log('📋 Table lead_activities does not exist. Need to create it.');
        return false;
      }
    } else {
      console.log('✅ Activity table works!');
      
      // Clean up test record
      await supabase
        .from('lead_activities')
        .delete()
        .eq('lead_id', 'test-lead-id');
      
      return true;
    }
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
}

testActivityTable();