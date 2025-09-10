const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDatabase() {
  console.log('🔍 Testing milano_leads table...');
  
  // Test insert
  const { data: insertData, error: insertError } = await supabase
    .from('milano_leads')
    .insert({
      first_name: 'Test',
      last_name: 'Business',
      data_source: 'system_test',
      address_cap: '20121',
      zona: 'Centro'
    })
    .select();

  if (insertError) {
    console.log('❌ Insert failed:', insertError.message);
    return;
  }

  console.log('✅ Insert successful!');
  
  // Test select
  const { data: selectData, error: selectError } = await supabase
    .from('milano_leads')
    .select('*')
    .limit(5);

  if (selectError) {
    console.log('❌ Select failed:', selectError.message);
    return;
  }

  console.log('✅ Database working! Sample data:');
  console.log(selectData);
  
  // Clean up test data
  await supabase
    .from('milano_leads')
    .delete()
    .eq('data_source', 'system_test');
}

testDatabase();