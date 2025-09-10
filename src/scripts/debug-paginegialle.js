#!/usr/bin/env node

/**
 * Debug script per PagineGialle - Analizza la struttura della pagina
 */

const puppeteer = require('puppeteer');
require('dotenv').config({ path: '.env.local' });

async function debugPagineGialle() {
  console.log('🔍 PagineGialle Debug Started');
  console.log('============================');
  
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
      ],
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Test URL - search for restaurants in Milano centro
    const testUrl = 'https://www.paginegialle.it/ricerca/ristoranti/20121%20milano';
    console.log(`🌐 Testing URL: ${testUrl}`);
    
    await page.goto(testUrl, { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    
    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'paginegialle-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as paginegialle-debug.png');
    
    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for CAPTCHA or blocks
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('captcha') || bodyText.includes('blocked') || bodyText.includes('robot')) {
      console.log('🚫 CAPTCHA or bot detection found!');
      console.log('Body preview:', bodyText.substring(0, 200));
    }
    
    // Try different selectors to find business listings
    const selectors = [
      '.vcard',
      '.business-item',
      '[itemtype*="LocalBusiness"]',
      '.listing-item',
      '.result-item',
      '.scheda',
      '.item_scheda',
      '.listing',
      '[data-testid*="listing"]',
      '.search-result',
      '.business-listing'
    ];
    
    console.log('🔍 Testing selectors...');
    
    for (const selector of selectors) {
      const elements = await page.$$(selector);
      console.log(`   ${selector}: ${elements.length} elements found`);
      
      if (elements.length > 0) {
        // Get some sample data from first element
        try {
          const sampleData = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return null;
            
            return {
              innerHTML: element.innerHTML.substring(0, 300),
              textContent: element.textContent?.substring(0, 100),
              className: element.className,
              tagName: element.tagName
            };
          }, selector);
          
          console.log(`   Sample data for ${selector}:`, sampleData);
        } catch (error) {
          console.log(`   Error getting sample data: ${error.message}`);
        }
      }
    }
    
    // Check for different name selectors
    const nameSelectors = [
      '.org',
      '.business-name', 
      '[itemprop="name"]',
      'h1', 'h2', 'h3',
      '.title',
      '.nome',
      '.ragione-sociale',
      '[data-testid*="name"]'
    ];
    
    console.log('🏷️ Testing name selectors...');
    
    for (const selector of nameSelectors) {
      const elements = await page.$$(selector);
      console.log(`   ${selector}: ${elements.length} elements found`);
    }
    
    // Get all visible text elements that might contain business names
    console.log('📝 Looking for business names in page...');
    
    const possibleBusinessNames = await page.evaluate(() => {
      // Look for elements that might contain business names
      const elements = document.querySelectorAll('h1, h2, h3, h4, .title, [class*="name"], [class*="business"]');
      const names = [];
      
      elements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 3 && text.length < 100) {
          names.push(text);
        }
      });
      
      return names.slice(0, 10); // First 10 potential names
    });
    
    console.log('Potential business names found:');
    possibleBusinessNames.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    
    // Check if there are any results at all
    const resultsText = await page.evaluate(() => {
      const keywords = ['risultati', 'trovati', 'schede', 'aziende'];
      const bodyText = document.body.innerText.toLowerCase();
      
      for (const keyword of keywords) {
        if (bodyText.includes(keyword)) {
          const sentences = bodyText.split('.').filter(s => s.includes(keyword));
          return sentences[0]?.trim() || null;
        }
      }
      return null;
    });
    
    if (resultsText) {
      console.log(`📊 Results info: ${resultsText}`);
    }
    
    console.log('\n✅ Debug completed - check paginegialle-debug.png for visual inspection');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run debug
debugPagineGialle().catch(console.error);