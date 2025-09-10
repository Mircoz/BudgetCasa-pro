// Advanced Milano scraper for comprehensive coverage
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

// Milano CAP expansion
const MILANO_CAPS = [
  // Centro (highest priority)
  '20121', '20122', '20123', '20124', '20125', '20126', '20127',
  // Semicentro 
  '20129', '20131', '20132', '20133', '20134', '20135',
  // Periferia selected
  '20141', '20142', '20143', '20144', '20145', '20146', '20151', '20152'
];

// High-value business categories
const BUSINESS_QUERIES = [
  'studi legali milano',
  'commercialisti milano', 
  'consulenti milano',
  'medici specialisti milano',
  'dentisti milano',
  'architetti milano',
  'ristoranti milano',
  'agenzie immobiliari milano'
];

// Zone mapping
const getZoneFromCAP = (cap) => {
  const zoneMap = {
    '20121': 'Centro', '20122': 'Centro', '20123': 'Centro', '20124': 'Centro', '20125': 'Centro', '20126': 'Centro', '20127': 'Centro',
    '20129': 'Porta Nuova', '20131': 'Isola', '20132': 'Isola', '20133': 'Navigli', '20134': 'Navigli', '20135': 'Brera',
    '20141': 'Sempione', '20142': 'Sempione', '20143': 'Sempione', '20144': 'Sempione', '20145': 'Sempione', '20146': 'Sempione',
    '20151': 'Provincia', '20152': 'Provincia'
  };
  return zoneMap[cap] || 'Provincia';
};

// Generate realistic business data
const generateBusinessData = (name, cap) => {
  const zona = getZoneFromCAP(cap);
  
  // Base income by zone
  const incomeRanges = {
    'Centro': [80000, 150000],
    'Porta Nuova': [70000, 120000], 
    'Isola': [60000, 100000],
    'Navigli': [55000, 95000],
    'Brera': [65000, 110000],
    'Sempione': [50000, 85000],
    'Provincia': [40000, 70000]
  };
  
  const [min, max] = incomeRanges[zona];
  const estimatedIncome = Math.floor(Math.random() * (max - min) + min);
  
  // Propensity based on business type and income
  const isHighValue = name.toLowerCase().includes('studio') || 
                     name.toLowerCase().includes('dott') ||
                     name.toLowerCase().includes('avv') ||
                     estimatedIncome > 80000;
  
  const basePropensity = isHighValue ? 60 : 40;
  const variance = 25;
  
  return {
    estimated_income: estimatedIncome,
    family_size: Math.floor(Math.random() * 3) + 1,
    home_ownership: Math.random() > 0.3 ? 'owner' : 'renter',
    propensity_casa: Math.min(90, Math.max(30, basePropensity + Math.floor(Math.random() * variance))),
    propensity_auto: Math.min(90, Math.max(30, basePropensity + Math.floor(Math.random() * variance))),
    propensity_vita: Math.min(90, Math.max(30, basePropensity + Math.floor(Math.random() * variance))),
    propensity_business: isHighValue ? Math.min(90, Math.max(50, basePropensity + 10)) : Math.floor(Math.random() * 40) + 30,
    data_quality_score: Math.floor(Math.random() * 40) + 40, // 40-80
    lead_status: 'new',
    contact_attempts: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

async function scrapeAdvancedMilano(targetLeads = 500) {
  console.log('🚀 Starting advanced Milano scraping...');
  console.log(`Target: ${targetLeads} new premium leads\n`);
  
  // Check existing leads to avoid duplicates
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
  let processed = 0;
  
  try {
    for (const query of BUSINESS_QUERIES) {
      if (allNewLeads.length >= targetLeads) break;
      
      console.log(`\n🔍 Searching: ${query}`);
      
      for (const cap of MILANO_CAPS) {
        if (allNewLeads.length >= targetLeads) break;
        
        const searchQuery = `${query} ${cap}`;
        console.log(`  📍 ${cap}: ${searchQuery}`);
        
        const page = await browser.newPage();
        
        try {
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          
          const url = `https://www.paginegialle.it/ricerca/${encodeURIComponent(searchQuery)}`;
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          
          // Updated selectors for current PagineGialle
          const leads = await page.evaluate(() => {
            const results = [];
            
            // Try multiple selector patterns
            const selectors = [
              '.vcard',
              '[data-testid="listing"]', 
              '.listing-item',
              '.result-item',
              'h2 a, h3 a', // Fallback to headings
              '.business-name'
            ];
            
            let elements = [];
            for (const selector of selectors) {
              elements = document.querySelectorAll(selector);
              if (elements.length > 0) break;
            }
            
            elements.forEach((el, index) => {
              if (index >= 20) return; // Limit per page
              
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
          
          // Process and filter leads
          for (const lead of leads) {
            if (allNewLeads.length >= targetLeads) break;
            
            // Clean and validate data
            let cleanName = lead.name.replace(/[^\w\s\.\&\-]/g, ' ').trim();
            if (cleanName.length < 3 || cleanName.length > 100) continue;
            
            // Extract CAP from address or use search CAP
            let extractedCAP = cap;
            const capMatch = lead.address.match(/\b(\d{5})\b/);
            if (capMatch) {
              extractedCAP = capMatch[1];
            }
            
            // Skip if not Milano area
            if (!extractedCAP.startsWith('20') && !extractedCAP.startsWith('24') && !extractedCAP.startsWith('25')) {
              continue;
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
            
            // Generate business data
            const businessData = generateBusinessData(cleanName, extractedCAP);
            
            const newLead = {
              first_name: firstName || 'Business',
              last_name: lastName || cleanName,
              email: null,
              phone: cleanPhone || null,
              address_street: lead.address || `Milano ${extractedCAP}`,
              address_cap: extractedCAP,
              zona: getZoneFromCAP(extractedCAP),
              data_source: 'paginegialle_advanced',
              ...businessData
            };
            
            // Calculate conversion probability
            newLead.conversion_probability = Math.round(
              (newLead.propensity_casa + newLead.propensity_auto) / 2
            );
            
            allNewLeads.push(newLead);
          }
          
          processed++;
          console.log(`    ✓ Found ${leads.length} leads, ${allNewLeads.length} total unique`);
          
          // Small delay to be respectful
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          
        } catch (error) {
          console.log(`    ❌ Error on ${cap}: ${error.message}`);
        } finally {
          await page.close();
        }
      }
    }
    
    console.log(`\n💾 Saving ${allNewLeads.length} new leads to database...`);
    
    if (allNewLeads.length > 0) {
      // Insert in batches
      const batchSize = 50;
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
      
      console.log(`\n🎉 Successfully added ${inserted} new Milano leads!`);
      console.log(`📊 Total leads in database: ${existingSet.size + inserted}`);
    }
    
  } catch (error) {
    console.error('❌ Scraping error:', error);
  } finally {
    await browser.close();
  }
}

// Command line usage
if (require.main === module) {
  const targetLeads = parseInt(process.argv[2]) || 500;
  scrapeAdvancedMilano(targetLeads)
    .then(() => {
      console.log('\n✅ Advanced Milano scraping completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { scrapeAdvancedMilano };