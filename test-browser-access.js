// Test browser access to supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

// Test with service key to bypass RLS for MVP demo
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service key to test access
);

async function testBrowserAccess() {
  console.log('🧪 Testing browser-like access to milano_leads...');
  
  // Simulate what the dashboard does
  const { data, error, count } = await supabase
    .from('milano_leads')
    .select('*', { count: 'exact' })
    .limit(5);

  if (error) {
    console.log('❌ Browser access error:', error);
  } else {
    console.log(`✅ Browser access SUCCESS: ${count} leads found`);
    console.log('Sample:', data.slice(0, 2));
  }
}

testBrowserAccess();