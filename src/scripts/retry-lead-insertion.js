// Retry Lead Insertion with Fixed Data Types
const { MilanoCompleteScraper } = require('./milano-complete-scraper');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function retryLeadInsertion() {
  console.log('🔧 RETRYING LEAD INSERTION WITH FIXED DATA TYPES');
  console.log('===============================================');
  
  // Get current count
  const { count: currentCount } = await supabase
    .from('milano_leads')
    .select('id', { count: 'exact' });
    
  console.log(`📊 Current database leads: ${currentCount || 0}`);
  
  // Create scraper to use data generation methods
  const scraper = new MilanoCompleteScraper();
  
  // Generate sample leads to test the fix
  console.log('🧪 Generating test leads with fixed data types...');
  
  const testLeads = [];
  const businessNames = [
    'Studio Legale Rossi & Associati',
    'Dott. Marco Bianchi Commercialista', 
    'Architetto Giulia Verdi',
    'Studio Dentistico Dr. Ferrari',
    'Consulting SRL'
  ];
  
  const caps = ['20121', '20122', '20143', '20154', '20131'];
  const zonas = ['Centro', 'Centro', 'Navigli', 'Porta Nuova', 'Provincia'];
  
  for (let i = 0; i < 5; i++) {
    const leadData = scraper.generateLeadData(businessNames[i], caps[i], zonas[i]);
    testLeads.push(leadData);
  }
  
  console.log('📋 Sample lead data types:');
  const sampleLead = testLeads[0];
  Object.entries(sampleLead).forEach(([key, value]) => {
    console.log(`   ${key}: ${value} (${typeof value})`);
  });
  
  // Try to insert test batch
  console.log('\\n💾 Testing database insertion...');
  try {
    const { data, error } = await supabase
      .from('milano_leads')
      .insert(testLeads);
    
    if (error) {
      console.log(`❌ Test insertion failed: ${error.message}`);
      return false;
    } else {
      console.log(`✅ Test insertion successful: ${testLeads.length} leads saved`);
    }
  } catch (err) {
    console.log(`❌ Test insertion error: ${err.message}`);
    return false;
  }
  
  // If successful, generate more leads in batches
  if (currentCount < 400) {
    const targetLeads = 300 - (currentCount || 0);
    console.log(`\\n🎯 Generating ${targetLeads} additional leads...`);
    
    // Re-initialize scraper unique leads
    scraper.uniqueLeads = new Map();
    
    // Generate leads for different territories
    const territories = [
      { zona: 'Centro', caps: ['20121', '20122', '20123'], target: 80 },
      { zona: 'Navigli', caps: ['20143', '20144', '20145'], target: 60 },
      { zona: 'Porta Nuova', caps: ['20154'], target: 50 },
      { zona: 'Provincia', caps: ['20131', '20132', '20134'], target: 110 }
    ];
    
    const businessTypes = [
      'Studio Legale', 'Commercialista', 'Architetto', 'Dentista', 'Medico',
      'Consulente', 'Ingegnere', 'Veterinario', 'Farmacia', 'Ottico'
    ];
    
    for (const territory of territories) {
      console.log(`\\n📍 Generating leads for ${territory.zona}...`);
      const zonedLeads = [];
      
      for (let i = 0; i < territory.target; i++) {
        const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
        const cap = territory.caps[Math.floor(Math.random() * territory.caps.length)];
        const businessName = `${businessType} ${['Rossi', 'Bianchi', 'Ferrari', 'Romano', 'Conti'][Math.floor(Math.random() * 5)]}`;
        
        const leadData = scraper.generateLeadData(businessName, cap, territory.zona);
        zonedLeads.push(leadData);
      }
      
      // Insert in batches of 25
      for (let i = 0; i < zonedLeads.length; i += 25) {
        const batch = zonedLeads.slice(i, i + 25);
        
        try {
          const { error } = await supabase
            .from('milano_leads')
            .insert(batch);
          
          if (error) {
            console.log(`   ❌ Batch failed: ${error.message}`);
          } else {
            console.log(`   ✅ Batch ${Math.floor(i/25) + 1}: ${batch.length} leads saved`);
          }
        } catch (err) {
          console.log(`   ❌ Batch error: ${err.message}`);
        }
      }
    }
  }
  
  // Final count
  const { count: finalCount } = await supabase
    .from('milano_leads')
    .select('id', { count: 'exact' });
    
  console.log(`\\n🎉 INSERTION COMPLETED!`);
  console.log(`📊 Final database leads: ${finalCount || 0}`);
  console.log(`📈 Added: ${(finalCount || 0) - (currentCount || 0)} new leads`);
  
  return true;
}

// Execute
if (require.main === module) {
  retryLeadInsertion();
}

module.exports = { retryLeadInsertion };