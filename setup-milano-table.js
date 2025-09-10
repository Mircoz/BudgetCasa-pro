#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupMilanoTable() {
  console.log('🔧 Setting up milano_leads table...');
  
  try {
    // Create the table using raw SQL
    const { data, error } = await supabase
      .from('_dummy') // Use any table to execute raw SQL
      .select()
      .limit(0);

    // Alternative approach: Use supabase.rpc if available, or direct SQL execution
    console.log('Creating table via direct SQL...');
    
    // Execute SQL via REST API call
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
          -- Enable UUID extension
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          
          -- Create milano_leads table
          CREATE TABLE IF NOT EXISTS public.milano_leads (
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Enable Row Level Security
          ALTER TABLE public.milano_leads ENABLE ROW LEVEL SECURITY;
          
          -- Create policy for authenticated users
          CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.milano_leads
            FOR SELECT USING (true);
            
          CREATE POLICY IF NOT EXISTS "Enable insert access for all users" ON public.milano_leads
            FOR INSERT WITH CHECK (true);
        `
      })
    });

    if (response.ok) {
      console.log('✅ milano_leads table created successfully!');
      
      // Test the table
      const { data: testData, error: testError } = await supabase
        .from('milano_leads')
        .select('*')
        .limit(1);
        
      if (testError) {
        console.log('❌ Table test failed:', testError.message);
      } else {
        console.log('✅ Table test successful - table is ready!');
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create table:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

setupMilanoTable();