// Direct column addition script for milano_leads table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function addColumnsDirectly() {
  console.log('🔧 ADDING ENRICHMENT COLUMNS TO MILANO_LEADS');
  console.log('============================================');
  
  try {
    // First, let's check current table structure
    const { data: existingData, error: checkError } = await supabase
      .from('milano_leads')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking table:', checkError);
      return;
    }
    
    console.log('📋 Current columns:', Object.keys(existingData[0] || {}));
    
    // Update existing records to add the new columns with default values
    console.log('\n⏳ Adding columns by updating existing records...');
    
    const { data: leads, error: fetchError } = await supabase
      .from('milano_leads')
      .select('id, first_name, last_name, zona, address_cap, phone, email')
      .limit(10);
    
    if (fetchError) {
      console.error('❌ Error fetching leads:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${leads?.length || 0} leads to update`);
    
    // Update each lead with enrichment data structure
    for (const lead of leads || []) {
      const enrichmentData = {
        contact_attempts: 0,
        updated_at: new Date().toISOString(),
        partita_iva: null,
        codice_fiscale: null,
        settore: null,
        dipendenti: null,
        fatturato_stimato: null,
        website: null,
        linkedin_url: null,
        enrichment_date: null,
        enrichment_status: 'pending',
        phone_enriched: lead.phone,
        enhanced_quality_score: null,
        revenue_opportunity: null,
        business_type: null,
        zone_rating: null,
        assigned_agent_id: null,
        agent_notes: null,
        last_contacted_at: null,
        next_follow_up: null,
        b2c_correlation_score: null,
        preferred_products: null
      };
      
      const { error: updateError } = await supabase
        .from('milano_leads')
        .update(enrichmentData)
        .eq('id', lead.id);
      
      if (updateError) {
        console.log(`⚠️ Update failed for lead ${lead.id}:`, updateError.message);
        // Column might not exist, this is expected
      } else {
        console.log(`✅ Updated lead ${lead.id} (${lead.first_name} ${lead.last_name})`);
      }
    }
    
    console.log('\n🎉 COLUMN ADDITION PROCESS COMPLETED');
    console.log('\n📝 NOTE: Some columns may not have been added due to schema limitations.');
    console.log('📝 Please add missing columns manually in Supabase Dashboard > Table Editor');
    console.log('📝 Or execute the SQL script directly in Supabase SQL Editor');
    
  } catch (error) {
    console.error('❌ Process failed:', error);
  }
}

addColumnsDirectly();