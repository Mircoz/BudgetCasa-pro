#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  console.log('🔧 Creating milano_leads table...');
  
  try {
    // Create table using direct SQL execution via PostgREST
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST', 
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/sql'
      },
      body: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Create milano_leads table
        CREATE TABLE IF NOT EXISTS milano_leads (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address_street TEXT,
          address_cap TEXT,
          zona TEXT,
          estimated_income INTEGER,
          family_size INTEGER DEFAULT 1,
          home_ownership TEXT DEFAULT 'unknown',
          propensity_casa INTEGER DEFAULT 0,
          propensity_auto INTEGER DEFAULT 0,
          propensity_vita INTEGER DEFAULT 0,
          propensity_business INTEGER DEFAULT 0,
          data_source TEXT,
          data_quality_score INTEGER DEFAULT 50,
          lead_status TEXT DEFAULT 'new',
          conversion_probability INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable Row Level Security
        ALTER TABLE milano_leads ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for public access (for demo)
        DROP POLICY IF EXISTS "Public milano_leads policy" ON milano_leads;
        CREATE POLICY "Public milano_leads policy" ON milano_leads FOR ALL USING (true);
      `
    });

    if (response.ok) {
      console.log('✅ Table creation request sent!');
    } else {
      console.log('❌ Failed with status:', response.status, response.statusText);
      console.log(await response.text());
    }

    // Test if table exists
    console.log('🧪 Testing table access...');
    const { data, error } = await supabase
      .from('milano_leads')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Table test failed:', error.message);
      console.log('Will try alternative creation method...');
      
      // Alternative: Insert a test record to force table creation
      const { data: insertData, error: insertError } = await supabase
        .from('milano_leads')
        .insert({
          first_name: 'Test',
          last_name: 'Lead',
          data_source: 'system_test'
        })
        .select();

      if (insertError) {
        console.log('❌ Alternative creation failed:', insertError.message);
      } else {
        console.log('✅ Table created via insert method!');
        
        // Clean up test record
        await supabase
          .from('milano_leads')
          .delete()
          .eq('data_source', 'system_test');
      }
    } else {
      console.log('✅ Table exists and accessible!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTable();