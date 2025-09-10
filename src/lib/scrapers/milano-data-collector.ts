import puppeteer from 'puppeteer';
import { MilanoDataService, type MilanoLead } from '../supabase/database-client';

interface MilanoLeadRaw {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address: string;
  cap: string;
  source: string;
  businessType?: string;
}

interface ScrapingResult {
  success: boolean;
  leadsCollected: number;
  errors: string[];
}

export class MilanoDataCollector {
  private browser: puppeteer.Browser | null = null;
  private readonly milanoCAPs = [
    '20121', '20122', '20123', '20124', '20125', '20129', // Centro/Porta Nuova
    '20144', '20143', // Navigli
    '20145', // Sempione  
    '20154', // Isola
    '20131', '20132', '20134', // Provincia Milano
  ];

  async initializeBrowser(): Promise<void> {
    if (this.browser) return;
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    });
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Scrape PagineGialle for Milano businesses
  async scrapePagineGialleMilano(maxLeadsPerCAP: number = 50): Promise<ScrapingResult> {
    console.log('🔍 Starting PagineGialle Milano scraping...');
    
    const errors: string[] = [];
    let totalLeads = 0;
    
    try {
      await this.initializeBrowser();
      const page = await this.browser!.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      for (const cap of this.milanoCAPs) {
        try {
          console.log(`📍 Scraping CAP ${cap}...`);
          const leads = await this.scrapePagineGialleByCAP(page, cap, maxLeadsPerCAP);
          
          if (leads.length > 0) {
            await this.saveLeadsToDatabase(leads);
            totalLeads += leads.length;
            console.log(`✅ Collected ${leads.length} leads from ${cap}`);
          }
          
          // Wait between requests to avoid being blocked
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
          
        } catch (error) {
          const errorMsg = `Error scraping ${cap}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
      
      await page.close();
      
    } catch (error) {
      errors.push(`Browser initialization error: ${error}`);
    } finally {
      await this.closeBrowser();
    }
    
    return {
      success: errors.length < this.milanoCAPs.length / 2, // Success if less than half failed
      leadsCollected: totalLeads,
      errors
    };
  }

  private async scrapePagineGialleByCAP(
    page: puppeteer.Page, 
    cap: string, 
    maxLeads: number
  ): Promise<MilanoLeadRaw[]> {
    const leads: MilanoLeadRaw[] = [];
    
    // Search for businesses in insurance-related sectors
    const searchQueries = [
      'assicurazioni',
      'broker assicurativi',
      'agenti assicurativi',
      'consulenti assicurativi'
    ];
    
    for (const query of searchQueries) {
      try {
        const url = `https://www.paginegialle.it/ricerca/${encodeURIComponent(query)}/${cap}%20milano`;
        console.log(`🌐 Visiting: ${url}`);
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Extract business data
        const businessData = await page.evaluate(() => {
          const businesses: any[] = [];
          const businessElements = document.querySelectorAll('.vcard, .business-item, [itemtype*="LocalBusiness"]');
          
          businessElements.forEach((element, index) => {
            if (index >= 20) return; // Limit per query
            
            try {
              // Try multiple selectors for name
              const nameSelectors = ['.org', '.business-name', '[itemprop="name"]', 'h3', 'h2'];
              let name = '';
              for (const selector of nameSelectors) {
                const nameEl = element.querySelector(selector);
                if (nameEl?.textContent?.trim()) {
                  name = nameEl.textContent.trim();
                  break;
                }
              }
              
              // Try multiple selectors for address
              const addressSelectors = ['.street-address', '[itemprop="streetAddress"]', '.address', '.location'];
              let address = '';
              for (const selector of addressSelectors) {
                const addrEl = element.querySelector(selector);
                if (addrEl?.textContent?.trim()) {
                  address = addrEl.textContent.trim();
                  break;
                }
              }
              
              // Try multiple selectors for phone
              const phoneSelectors = ['.tel', '[itemprop="telephone"]', '.phone', '[href^="tel:"]'];
              let phone = '';
              for (const selector of phoneSelectors) {
                const phoneEl = element.querySelector(selector);
                if (phoneEl?.textContent?.trim()) {
                  phone = phoneEl.textContent.trim().replace(/[^\d\+]/g, '');
                  break;
                }
                // Also check href attribute
                const phoneHref = element.querySelector('[href^="tel:"]')?.getAttribute('href');
                if (phoneHref) {
                  phone = phoneHref.replace('tel:', '').replace(/[^\d\+]/g, '');
                }
              }
              
              // Try to find email (less common but worth trying)
              let email = '';
              const emailEl = element.querySelector('[href^="mailto:"]');
              if (emailEl) {
                email = emailEl.getAttribute('href')?.replace('mailto:', '') || '';
              }
              
              if (name && name.length > 2) {
                businesses.push({
                  name: name,
                  address: address,
                  phone: phone,
                  email: email || undefined
                });
              }
            } catch (error) {
              console.warn('Error extracting business data:', error);
            }
          });
          
          return businesses;
        });
        
        // Transform business data to leads
        for (const business of businessData) {
          if (leads.length >= maxLeads) break;
          
          const leadData = this.transformBusinessToLead(business, cap, 'paginegialle');
          if (leadData) {
            leads.push(leadData);
          }
        }
        
      } catch (error) {
        console.warn(`Error scraping query "${query}" for ${cap}:`, error);
      }
      
      // Wait between queries
      if (searchQueries.indexOf(query) < searchQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }
    }
    
    return leads;
  }

  // Transform business data to lead format
  private transformBusinessToLead(
    business: any, 
    cap: string, 
    source: string
  ): MilanoLeadRaw | null {
    if (!business.name || business.name.length < 2) return null;
    
    // Extract person name from business name (heuristic)
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
      businessType: 'insurance_professional'
    };
  }

  // Save collected leads to database
  private async saveLeadsToDatabase(leads: MilanoLeadRaw[]): Promise<void> {
    const dbLeads: Partial<MilanoLead>[] = leads.map(lead => {
      const zona = this.determineZonaByCAP(lead.cap);
      const estimatedIncome = this.estimateIncomeByZona(zona);
      
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
        propensity_casa: this.calculatePropensityCasa(zona, estimatedIncome),
        propensity_auto: this.calculatePropensityAuto(zona, estimatedIncome),
        propensity_vita: this.calculatePropensityVita(zona, estimatedIncome),
        propensity_business: lead.businessType === 'insurance_professional' ? 85 : 20,
        data_source: lead.source,
        data_quality_score: this.calculateDataQuality(lead),
        lead_status: 'new',
        conversion_probability: Math.floor(Math.random() * 30) + 40 // 40-70%
      };
    });
    
    try {
      const savedLeads = await MilanoDataService.createLeadsBulk(dbLeads);
      console.log(`💾 Saved ${savedLeads.length} leads to database`);
    } catch (error) {
      console.error('Error saving leads to database:', error);
    }
  }

  // Determine Milano zone by CAP
  private determineZonaByCAP(cap: string): MilanoLead['zona'] {
    const zonaMapping: Record<string, MilanoLead['zona']> = {
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
  private estimateIncomeByZona(zona: MilanoLead['zona']): number {
    const incomeByZona: Record<MilanoLead['zona'], number> = {
      'Centro': 70000,
      'Porta Nuova': 80000,
      'Sempione': 65000,
      'Navigli': 58000,
      'Isola': 55000,
      'Brera': 90000,
      'Provincia': 45000
    };
    
    const baseIncome = incomeByZona[zona];
    // Add some randomness ±20%
    const variation = (Math.random() - 0.5) * 0.4;
    return Math.round(baseIncome * (1 + variation));
  }

  // Calculate insurance propensity scores
  private calculatePropensityCasa(zona: MilanoLead['zona'], income: number): number {
    let baseScore = 50;
    
    // Zone influence
    const zoneMultiplier: Record<MilanoLead['zona'], number> = {
      'Centro': 1.2,
      'Porta Nuova': 1.3,
      'Sempione': 1.1,
      'Navigli': 1.0,
      'Isola': 0.9,
      'Brera': 1.4,
      'Provincia': 0.8
    };
    
    baseScore *= zoneMultiplier[zona];
    
    // Income influence
    if (income > 60000) baseScore += 20;
    else if (income > 40000) baseScore += 10;
    else baseScore -= 10;
    
    // Add randomness
    baseScore += (Math.random() - 0.5) * 20;
    
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  private calculatePropensityAuto(zona: MilanoLead['zona'], income: number): number {
    let baseScore = 60; // Higher base for auto insurance
    
    const zoneMultiplier: Record<MilanoLead['zona'], number> = {
      'Centro': 0.7, // Less cars in center
      'Porta Nuova': 0.8,
      'Sempione': 1.0,
      'Navigli': 0.9,
      'Isola': 0.9,
      'Brera': 0.8,
      'Provincia': 1.3 // More cars in suburbs
    };
    
    baseScore *= zoneMultiplier[zona];
    if (income > 50000) baseScore += 15;
    baseScore += (Math.random() - 0.5) * 20;
    
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  private calculatePropensityVita(zona: MilanoLead['zona'], income: number): number {
    let baseScore = 40;
    
    if (income > 70000) baseScore += 25;
    else if (income > 50000) baseScore += 15;
    
    // Life insurance correlates with income more than location
    baseScore += (Math.random() - 0.5) * 15;
    
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  // Calculate data quality score
  private calculateDataQuality(lead: MilanoLeadRaw): number {
    let score = 30; // Base score
    
    if (lead.email) score += 30;
    if (lead.phone) score += 25;
    if (lead.address && lead.address.length > 10) score += 15;
    
    return Math.min(100, score);
  }

  // Method to run full Milano data collection
  async collectMilanoData(maxLeadsTotal: number = 500): Promise<ScrapingResult> {
    console.log(`🚀 Starting Milano data collection (target: ${maxLeadsTotal} leads)`);
    
    const leadsPerCAP = Math.ceil(maxLeadsTotal / this.milanoCAPs.length);
    
    const result = await this.scrapePagineGialleMilano(leadsPerCAP);
    
    console.log(`✅ Milano data collection completed:`);
    console.log(`   - Total leads collected: ${result.leadsCollected}`);
    console.log(`   - Success rate: ${result.success ? 'HIGH' : 'PARTIAL'}`);
    console.log(`   - Errors: ${result.errors.length}`);
    
    return result;
  }
}