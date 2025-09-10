// Fixed Milano scraper with correct database schema
const puppeteer = require('puppeteer');
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

// Milano Centro CAPs (focus for 100 premium leads)
const MILANO_CENTRO_CAPS = ['20121', '20122', '20123', '20124', '20125', '20126', '20127'];

// High-value business categories for centro
const PREMIUM_BUSINESS_QUERIES = [
  'studi legali milano',
  'commercialisti milano', 
  'consulenti milano',
  'architetti milano',
  'medici specialisti milano'
];

const getZoneFromCAP = (cap) => {
  const zoneMap = {
    '20121': 'Centro', '20122': 'Centro', '20123': 'Centro', 
    '20124': 'Centro', '20125': 'Centro', '20126': 'Centro', '20127': 'Centro'
  };
  return zoneMap[cap] || 'Centro';
};

const generatePremiumBusinessData = (name, cap) => {
  // Centro Milano = higher income businesses
  const baseIncome = 90000;
  const variance = 60000;
  const estimatedIncome = baseIncome + Math.floor(Math.random() * variance);
  
  // Higher propensity for centro businesses
  const isHighValue = name.toLowerCase().includes('studio') || 
                     name.toLowerCase().includes('dott') ||
                     name.toLowerCase().includes('avv');
  
  const basePropensity = isHighValue ? 70 : 60;
  const variance2 = 20;
  
  return {
    estimated_income: estimatedIncome,
    family_size: Math.floor(Math.random() * 2) + 1,
    home_ownership: Math.random() > 0.2 ? 'owner' : 'renter',
    propensity_casa: Math.min(90, Math.max(50, basePropensity + Math.floor(Math.random() * variance2))),
    propensity_auto: Math.min(90, Math.max(50, basePropensity + Math.floor(Math.random() * variance2))),
    propensity_vita: Math.min(90, Math.max(50, basePropensity + Math.floor(Math.random() * variance2))),
    propensity_business: isHighValue ? Math.min(90, Math.max(60, basePropensity + 15)) : Math.floor(Math.random() * 30) + 50,
    data_quality_score: Math.floor(Math.random() * 20) + 60, // 60-80 for centro
    lead_status: 'new',
    created_at: new Date().toISOString()
  };
};

async function collectPremiumMilanoLeads(targetLeads = 100) {
  console.log('🏢 Collecting 100 PREMIUM Milano Centro leads...');
  console.log('Focus: High-value professionals in centro storico\n');
  
  // Check existing leads 
  const { data: existingLeads } = await supabase
    .from('milano_leads')
    .select('first_name, last_name, address_cap');
  
  const existingSet = new Set(
    existingLeads?.map(lead => `${lead.first_name}_${lead.last_name}_${lead.address_cap}`) || []
  );
  
  console.log(`📋 Existing leads: ${existingSet.size}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const allNewLeads = [];
  
  try {
    for (const query of PREMIUM_BUSINESS_QUERIES) {
      if (allNewLeads.length >= targetLeads) break;
      
      console.log(`\n🔍 Searching: ${query}`);
      
      for (const cap of MILANO_CENTRO_CAPS) {
        if (allNewLeads.length >= targetLeads) break;
        
        const searchQuery = `${query} ${cap}`;
        console.log(`  📍 ${cap}: ${searchQuery}`);
        
        const page = await browser.newPage();
        
        try {
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          
          const url = `https://www.paginegialle.it/ricerca/${encodeURIComponent(searchQuery)}`;
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          
          const leads = await page.evaluate(() => {
            const results = [];
            
            // Multiple selector strategies
            const selectors = [
              '.vcard',
              '[data-testid="listing"]', 
              '.listing-item',
              'h2 a, h3 a',
              '.business-name'
            ];
            
            let elements = [];
            for (const selector of selectors) {
              elements = document.querySelectorAll(selector);
              if (elements.length > 0) break;
            }
            
            elements.forEach((el, index) => {
              if (index >= 15) return; // Limit per page
              
              let name = '';
              let address = '';
              let phone = '';
              
              // Extract name
              const nameEl = el.querySelector('h2, h3, .business-name, .company-name') || el;
              name = nameEl.textContent?.trim() || nameEl.innerText?.trim() || '';
              
              // Extract address
              const addrEl = el.querySelector('.address, .locality, [class*="address"]');
              address = addrEl?.textContent?.trim() || '';
              
              // Extract phone
              const phoneEl = el.querySelector('[href^="tel:"], .phone, [class*="phone"]');
              phone = phoneEl?.textContent?.trim() || phoneEl?.href?.replace('tel:', '') || '';
              
              if (name && name.length > 3) {
                results.push({ name, address, phone });
              }
            });
            
            return results;
          });
          
          // Process leads
          for (const lead of leads) {
            if (allNewLeads.length >= targetLeads) break;
            
            // Clean name
            let cleanName = lead.name.replace(/[^\w\s\.\&\-]/g, ' ').trim();
            if (cleanName.length < 3 || cleanName.length > 100) continue;
            
            // Extract CAP
            let extractedCAP = cap;
            const capMatch = lead.address.match(/\b(\d{5})\b/);
            if (capMatch && capMatch[1].startsWith('20')) {
              extractedCAP = capMatch[1];
            }
            
            // Clean phone
            let cleanPhone = lead.phone.replace(/[^\d\+]/g, '');
            if (cleanPhone && cleanPhone.length < 8) cleanPhone = '';
            
            // Create unique key
            const [firstName, ...lastNameParts] = cleanName.split(' ');
            const lastName = lastNameParts.join(' ');
            const uniqueKey = `${firstName}_${lastName}_${extractedCAP}`;
            
            // Skip duplicates
            if (existingSet.has(uniqueKey)) continue;
            existingSet.add(uniqueKey);
            
            // Generate premium data
            const businessData = generatePremiumBusinessData(cleanName, extractedCAP);
            
            const newLead = {
              first_name: firstName || 'Business',
              last_name: lastName || cleanName,
              email: null,
              phone: cleanPhone || null,
              address_street: lead.address || `Milano ${extractedCAP}`,
              address_cap: extractedCAP,
              zona: getZoneFromCAP(extractedCAP),
              data_source: 'paginegialle_premium',
              ...businessData
            };
            
            // Calculate conversion probability
            newLead.conversion_probability = Math.round(
              (newLead.propensity_casa + newLead.propensity_auto) / 2
            );
            
            allNewLeads.push(newLead);
          }
          
          console.log(`    ✓ Found ${leads.length} leads, ${allNewLeads.length} total unique`);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.log(`    ❌ Error on ${cap}: ${error.message}`);
        } finally {
          await page.close();
        }
      }
    }
    
    console.log(`\n💾 Saving ${allNewLeads.length} premium leads to database...`);
    
    if (allNewLeads.length > 0) {
      const batchSize = 20;
      let inserted = 0;
      
      for (let i = 0; i < allNewLeads.length; i += batchSize) {
        const batch = allNewLeads.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('milano_leads')
          .insert(batch)
          .select('id');
        
        if (error) {
          console.error(`❌ Batch insert error:`, error);
        } else {
          inserted += data?.length || 0;
          console.log(`✅ Inserted batch: ${inserted}/${allNewLeads.length}`);
        }
      }
      
      console.log(`\n🎉 Successfully added ${inserted} premium Milano centro leads!`);
      console.log(`📊 Total leads in database: ${existingSet.size}`);
      
      return inserted;
    }
    
  } catch (error) {
    console.error('❌ Scraping error:', error);
  } finally {
    await browser.close();
  }
  
  return 0;
}

if (require.main === module) {
  const targetLeads = parseInt(process.argv[2]) || 100;
  collectPremiumMilanoLeads(targetLeads)
    .then((inserted) => {
      console.log(`\n✅ Premium scraping completed! Added ${inserted} leads`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { collectPremiumMilanoLeads };