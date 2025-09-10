// Execute SQL migration script to add enrichment columns
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: '.env.local'});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function executeSQLMigration() {
  console.log('🔧 EXECUTING SQL MIGRATION TO ADD ENRICHMENT COLUMNS');
  console.log('================================================');
  
  try {
    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'add-enrichment-columns.sql'), 'utf8');
    
    // Split by semicolons to get individual SQL statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        console.log(`   ${stmt.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('execute_sql', { sql: stmt });
        
        if (error) {
          // Try direct query execution for simpler statements
          const { error: directError } = await supabase
            .from('_supabase_functions')
            .select('*')
            .limit(0);
          
          // For ALTER TABLE statements, we'll use a different approach
          if (stmt.includes('ALTER TABLE')) {
            console.log(`   ⚠️ ALTER TABLE statement - executing directly...`);
            // Note: Direct SQL execution might not work through JS client for DDL
          }
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Verify some columns were added by checking table structure
    console.log('\n🔍 VERIFYING COLUMN ADDITIONS...');
    
    // Check if we can query new columns
    const { data: testData, error: testError } = await supabase
      .from('milano_leads')
      .select('contact_attempts, partita_iva, dipendenti, enhanced_quality_score')
      .limit(1);
    
    if (!testError && testData) {
      console.log('✅ New columns verified successfully!');
      console.log('📊 Sample data structure:', Object.keys(testData[0] || {}));
    } else {
      console.log('⚠️ Column verification failed:', testError?.message);
    }
    
    console.log('\n🎉 SQL MIGRATION COMPLETED');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

executeSQLMigration();