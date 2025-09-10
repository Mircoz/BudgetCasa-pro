#!/usr/bin/env node

/**
 * Milano Lead Collection Script (JavaScript version)
 * 
 * This script collects insurance leads from Milano area using web scraping
 * and saves them to the Supabase database.
 */

const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer');

// Environment setup
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Make sure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const milanoCAPs = [
  '20121', '20122', '20123', '20124', '20125', '20129', // Centro/Porta Nuova
  '20144', '20143', // Navigli
  '20145', // Sempione  
  '20154', // Isola
  '20131', '20132', '20134', // Provincia Milano
];

// Determine Milano zone by CAP
function determineZonaByCAP(cap) {
  const zonaMapping = {
    '20121': 'Centro',
    '20122': 'Centro', 
    '20123': 'Centro',
    '20124': 'Porta Nuova',
    '20125': 'Porta Nuova',
    '20129': 'Porta Nuova',
    '20144': 'Navigli',
    '20143': 'Navigli', 
    '20145': 'Sempione',
    '20154': 'Isola',
    '20131': 'Provincia',
    '20132': 'Provincia',
    '20134': 'Provincia'
  };
  
  return zonaMapping[cap] || 'Provincia';
}

// Estimate income by Milano zone
function estimateIncomeByZona(zona) {
  const incomeByZona = {
    'Centro': 70000,
    'Porta Nuova': 80000,
    'Sempione': 65000,
    'Navigli': 58000,
    'Isola': 55000,
    'Brera': 90000,
    'Provincia': 45000
  };
  
  const baseIncome = incomeByZona[zona] || 45000;
  // Add some randomness ±20%
  const variation = (Math.random() - 0.5) * 0.4;
  return Math.round(baseIncome * (1 + variation));
}

// Calculate insurance propensity scores
function calculatePropensityCasa(zona, income) {
  let baseScore = 50;
  
  const zoneMultiplier = {
    'Centro': 1.2,
    'Porta Nuova': 1.3,
    'Sempione': 1.1,
    'Navigli': 1.0,
    'Isola': 0.9,
    'Brera': 1.4,
    'Provincia': 0.8
  };
  
  baseScore *= (zoneMultiplier[zona] || 1.0);
  
  if (income > 60000) baseScore += 20;
  else if (income > 40000) baseScore += 10;
  else baseScore -= 10;
  
  // Add randomness
  baseScore += (Math.random() - 0.5) * 20;
  
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

function calculatePropensityAuto(zona, income) {
  let baseScore = 60;
  
  const zoneMultiplier = {
    'Centro': 0.7,
    'Porta Nuova': 0.8,
    'Sempione': 1.0,
    'Navigli': 0.9,
    'Isola': 0.9,
    'Brera': 0.8,
    'Provincia': 1.3
  };
  
  baseScore *= (zoneMultiplier[zona] || 1.0);
  if (income > 50000) baseScore += 15;
  baseScore += (Math.random() - 0.5) * 20;
  
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

function calculatePropensityVita(zona, income) {
  let baseScore = 40;
  
  if (income > 70000) baseScore += 25;
  else if (income > 50000) baseScore += 15;
  
  baseScore += (Math.random() - 0.5) * 15;
  
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

// Transform business data to lead format
function transformBusinessToLead(business, cap, source) {
  if (!business.name || business.name.length < 2) return null;
  
  let firstName = 'Business';
  let lastName = business.name;
  
  // Try to identify personal names vs company names
  const personalNamePatterns = [
    /^(Dott\.?\s+|Dr\.?\s+|Sig\.?\s+|Ing\.?\s+)([A-Z][a-z]+)\s+([A-Z][a-z]+)/i,
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s*-?\s*Assicurazioni/i,
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)$/
  ];
  
  for (const pattern of personalNamePatterns) {
    const match = business.name.match(pattern);
    if (match) {
      firstName = match[match.length - 2] || firstName;
      lastName = match[match.length - 1] || lastName;
      break;
    }
  }
  
  return {
    firstName,
    lastName,
    email: business.email,
    phone: business.phone,
    address: business.address || `Milano ${cap}`,
    cap,
    source,
    businessType: 'potential_customer'
  };
}

// Calculate data quality score
function calculateDataQuality(lead) {
  let score = 30;
  
  if (lead.email) score += 30;
  if (lead.phone) score += 25;
  if (lead.address && lead.address.length > 10) score += 15;
  
  return Math.min(100, score);
}

// Scrape PagineGialle for a specific CAP
async function scrapePagineGialleByCAP(page, cap, maxLeads) {
  console.log(`📍 Scraping CAP ${cap}...`);
  const leads = [];
  
  const searchQueries = [
    // Business & Professionals (potential insurance customers)
    'avvocati',
    'commercialisti',  
    'medici',
    'architetti',
    'ingegneri',
    'dentisti',
    'consulenti',
    'immobiliari',
    'ristoranti',
    'negozi',
    'officine',
    'parrucchieri',
    'centri estetici',
    'palestre',
    'hotel',
    'aziende informatiche',
    'studi legali',
    'cliniche private'
  ];
  
  for (const query of searchQueries) {
    try {
      const url = `https://www.paginegialle.it/ricerca/${encodeURIComponent(query)}/${cap}%20milano`;
      console.log(`🌐 Visiting: ${url.substring(0, 80)}...`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle0', 
        timeout: 30000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract business data with comprehensive strategy
      const businessData = await page.evaluate(() => {
        const businesses = [];
        
        // New approach: Look for business patterns by searching h2 elements that contain business names
        // Based on debug output, businesses are in h2 elements
        const headingElements = document.querySelectorAll('h2, h3');
        
        headingElements.forEach((heading, index) => {
          if (index >= 20) return; // Limit processing
          
          const headingText = heading.textContent?.trim();
          
          // Skip if not a business name (too short, contains generic text, etc.)
          if (!headingText || headingText.length < 5 || headingText.length > 100) return;
          if (headingText.includes('Registra') || headingText.includes('Prenota') || 
              headingText.includes('filtri') || headingText.includes('ordina')) return;
          
          // Find the parent container that likely contains all business info
          let businessContainer = heading.closest('div');
          let attempts = 0;
          while (businessContainer && attempts < 5) {
            const containerText = businessContainer.textContent || '';
            // Look for containers that contain address-like patterns (via, viale, corso, etc.)
            if (containerText.match(/\b(via|viale|corso|piazza|largo)\s+[a-zA-Z\s,]+\d+/i)) {
              break;
            }
            businessContainer = businessContainer.parentElement;
            attempts++;
          }
          
          if (!businessContainer) {
            businessContainer = heading.parentElement;
          }
          try {
            // Use the heading text as business name
            let name = headingText;
            
            // Extract address from container text using regex
            const containerText = businessContainer.textContent || '';
            const addressMatch = containerText.match(/\b(via|viale|corso|piazza|largo)\s+[a-zA-Z\s,'.\-]+\d+[\w\-]*[\s\-]*\d{5}\s*milano/i);
            let address = '';
            if (addressMatch) {
              address = addressMatch[0].trim();
            }
            
            // Look for phone numbers in the container
            let phone = '';
            const phoneMatch = containerText.match(/\b\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}\b/);
            if (phoneMatch) {
              phone = phoneMatch[0].replace(/[^\d]/g, '');
            }
            
            // Look for emails (less common but worth trying)
            let email = '';
            const emailMatch = containerText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
            if (emailMatch) {
              email = emailMatch[0];
            }
            
            // Only add if we have a decent business name
            if (name && name.length > 2 && name.length < 80) {
              businesses.push({
                name: name.replace(/\s+/g, ' ').trim(),
                address: address || undefined,
                phone: phone || undefined,
                email: email || undefined
              });
            }
          } catch (error) {
            console.warn('Error extracting business:', error.message);
          }
        });
        
        return businesses;
      });
      
      console.log(`   Found ${businessData.length} businesses for query "${query}"`);
      
      // Transform to leads
      for (const business of businessData) {
        if (leads.length >= maxLeads) break;
        
        const leadData = transformBusinessToLead(business, cap, 'paginegialle');
        if (leadData) {
          leads.push(leadData);
        }
      }
      
    } catch (error) {
      console.warn(`   Error with query "${query}":`, error.message);
    }
    
    // Wait between queries
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  }
  
  console.log(`✅ Collected ${leads.length} leads from ${cap}`);
  return leads;
}

// Save leads to database
async function saveLeadsToDatabase(leads) {
  console.log(`💾 Saving ${leads.length} leads to database...`);
  
  const dbLeads = leads.map(lead => {
    const zona = determineZonaByCAP(lead.cap);
    const estimatedIncome = estimateIncomeByZona(zona);
    
    return {
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      address_street: lead.address,
      address_cap: lead.cap,
      zona: zona,
      estimated_income: estimatedIncome,
      family_size: 1,
      home_ownership: 'unknown',
      propensity_casa: calculatePropensityCasa(zona, estimatedIncome),
      propensity_auto: calculatePropensityAuto(zona, estimatedIncome),
      propensity_vita: calculatePropensityVita(zona, estimatedIncome),
      propensity_business: lead.businessType === 'potential_customer' ? 60 : 20,
      data_source: lead.source,
      data_quality_score: calculateDataQuality(lead),
      lead_status: 'new',
      conversion_probability: Math.floor(Math.random() * 30) + 40
    };
  });
  
  try {
    const { data, error } = await supabaseAdmin
      .from('milano_leads')
      .insert(dbLeads)
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return 0;
    }
    
    console.log(`✅ Successfully saved ${data?.length || 0} leads`);
    return data?.length || 0;
    
  } catch (error) {
    console.error('Error saving to database:', error);
    return 0;
  }
}

// Main collection function
async function collectMilanoData(targetLeads) {
  console.log('🚀 Milano Lead Collection Started');
  console.log('=====================================');
  console.log(`🎯 Target: ${targetLeads} leads from Milano area`);
  console.log(`📅 Started at: ${new Date().toLocaleString('it-IT')}`);
  
  let browser;
  let totalLeads = 0;
  const errors = [];
  
  try {
    console.log('\n🔍 Initializing browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const leadsPerCAP = Math.ceil(targetLeads / milanoCAPs.length);
    console.log(`📊 Collecting ~${leadsPerCAP} leads per CAP`);
    
    for (const cap of milanoCAPs) {
      try {
        const leads = await scrapePagineGialleByCAP(page, cap, leadsPerCAP);
        
        if (leads.length > 0) {
          const saved = await saveLeadsToDatabase(leads);
          totalLeads += saved;
        }
        
        // Wait between CAPs to avoid detection
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000));
        
      } catch (error) {
        const errorMsg = `Error processing ${cap}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }
    
    await page.close();
    
  } catch (error) {
    console.error('❌ Browser error:', error.message);
    errors.push(`Browser error: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Final results
  console.log('\n📈 Collection Results:');
  console.log('=====================================');
  console.log(`✅ Total leads collected: ${totalLeads}`);
  console.log(`❌ Errors encountered: ${errors.length}`);
  console.log(`📅 Completed at: ${new Date().toLocaleString('it-IT')}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️ Error Details:');
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  // Show database status
  try {
    const { count } = await supabaseAdmin
      .from('milano_leads')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total leads in database: ${count || 0}`);
    
    // Show zone breakdown
    console.log('\n🗺️ Distribution by zone:');
    const zones = ['Centro', 'Porta Nuova', 'Navigli', 'Sempione', 'Isola', 'Provincia'];
    for (const zona of zones) {
      const { count: zoneCount } = await supabaseAdmin
        .from('milano_leads')
        .select('*', { count: 'exact', head: true })
        .eq('zona', zona);
      
      console.log(`   ${zona}: ${zoneCount || 0} leads`);
    }
    
  } catch (error) {
    console.warn('Could not fetch final statistics:', error.message);
  }
  
  return {
    success: totalLeads > 0,
    leadsCollected: totalLeads,
    errors: errors
  };
}

// Main execution
async function main() {
  const targetLeads = process.argv[2] ? parseInt(process.argv[2]) : 100;
  
  if (isNaN(targetLeads) || targetLeads < 1) {
    console.error('❌ Please provide a valid number of leads to collect');
    console.error('Usage: node collect-milano-leads.js [number]');
    process.exit(1);
  }
  
  try {
    await collectMilanoData(targetLeads);
    console.log('\n🎉 Milano lead collection completed successfully!');
  } catch (error) {
    console.error('\n❌ Collection failed:', error.message);
    process.exit(1);
  }
}

// Handle interruptions
process.on('SIGINT', () => {
  console.log('\n⏹️ Collection interrupted by user');
  process.exit(0);
});

if (require.main === module) {
  main();
}