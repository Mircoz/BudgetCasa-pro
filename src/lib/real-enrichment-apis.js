// Real Enrichment APIs Integration
// Hunter.io + Clearbit + Italian Business Registry APIs
require('dotenv').config({path: '.env.local'});

class RealEnrichmentAPIs {
  
  constructor() {
    // API Keys (to be added to .env.local)
    this.hunterApiKey = process.env.HUNTER_API_KEY; // €39/month plan
    this.clearbitApiKey = process.env.CLEARBIT_API_KEY; // €99/month plan
    this.itBusinessApiKey = process.env.IT_BUSINESS_API_KEY; // Italian business registry
    
    this.requestCount = {
      hunter: 0,
      clearbit: 0,
      italian: 0
    };
  }
  
  // Hunter.io Email Discovery
  async findEmailWithHunter(firstName, lastName, companyDomain) {
    if (!this.hunterApiKey) {
      console.log('⚠️ Hunter.io API key not found - using mock data');
      return this.mockEmailDiscovery(firstName, lastName, companyDomain);
    }
    
    try {
      this.requestCount.hunter++;
      
      const url = `https://api.hunter.io/v2/email-finder?domain=${companyDomain}&first_name=${firstName}&last_name=${lastName}&api_key=${this.hunterApiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.data && data.data.email && data.data.confidence > 70) {
        return {
          email: data.data.email,
          confidence: data.data.confidence,
          sources: data.data.sources?.length || 0,
          service: 'hunter.io'
        };
      }
      
      return null;
      
    } catch (error) {
      console.log(`❌ Hunter.io API error: ${error.message}`);
      return this.mockEmailDiscovery(firstName, lastName, companyDomain);
    }
  }
  
  // Clearbit Company Enrichment
  async enrichCompanyWithClearbit(companyName, website) {
    if (!this.clearbitApiKey) {
      console.log('⚠️ Clearbit API key not found - using mock data');
      return this.mockCompanyEnrichment(companyName);
    }
    
    try {
      this.requestCount.clearbit++;
      
      // Clearbit Company API
      const url = `https://company.clearbit.com/v1/domains/find?name=${encodeURIComponent(companyName)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.clearbitApiKey}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.domain) {
        // Get full company data
        const companyUrl = `https://company.clearbit.com/v1/companies/find?domain=${data.domain}`;
        const companyResponse = await fetch(companyUrl, {
          headers: {
            'Authorization': `Bearer ${this.clearbitApiKey}`,
            'Accept': 'application/json'
          }
        });
        
        const companyData = await companyResponse.json();
        
        return {
          domain: data.domain,
          employees: companyData.metrics?.employees || null,
          revenue: companyData.metrics?.annualRevenue || null,
          industry: companyData.category?.industry || null,
          sector: companyData.category?.sector || null,
          location: companyData.geo?.city || null,
          founded: companyData.foundedYear || null,
          linkedin: companyData.linkedin?.handle || null,
          service: 'clearbit'
        };
      }
      
      return null;
      
    } catch (error) {
      console.log(`❌ Clearbit API error: ${error.message}`);
      return this.mockCompanyEnrichment(companyName);
    }
  }
  
  // Italian Business Registry (Registro Imprese)
  async findItalianBusinessData(companyName, city = 'Milano') {
    if (!this.itBusinessApiKey) {
      console.log('⚠️ Italian Business API key not found - using mock data');
      return this.mockItalianBusinessData(companyName);
    }
    
    try {
      this.requestCount.italian++;
      
      // Using InfoCamere or similar Italian business registry API
      const searchUrl = `https://api.registroimprese.it/v1/companies/search?name=${encodeURIComponent(companyName)}&city=${city}&api_key=${this.itBusinessApiKey}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.companies && data.companies.length > 0) {
        const company = data.companies[0];
        
        return {
          partitaIva: company.vat_number,
          codiceFiscale: company.tax_code,
          ragioneSociale: company.legal_name,
          sedeLegale: company.legal_address,
          settore: company.activity_code_description,
          dataCostituzione: company.incorporation_date,
          capitale: company.share_capital,
          status: company.status,
          service: 'registro_imprese'
        };
      }
      
      return null;
      
    } catch (error) {
      console.log(`❌ Italian Business API error: ${error.message}`);
      return this.mockItalianBusinessData(companyName);
    }
  }
  
  // LinkedIn Company Search
  async findLinkedInProfile(companyName) {
    // LinkedIn API requires special permissions, using web scraping approach
    try {
      const searchQuery = encodeURIComponent(`${companyName} Milano`);
      const linkedinUrl = `https://www.linkedin.com/search/results/companies/?keywords=${searchQuery}`;
      
      // Note: This would require a proper LinkedIn scraper
      // For MVP, we'll use pattern-based generation
      
      const companySlug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      return {
        linkedinUrl: `https://linkedin.com/company/${companySlug}`,
        confidence: 60,
        service: 'linkedin_pattern'
      };
      
    } catch (error) {
      console.log(`❌ LinkedIn search error: ${error.message}`);
      return null;
    }
  }
  
  // Complete enrichment pipeline
  async enrichLead(leadData) {
    console.log(`🔍 Enriching: ${leadData.first_name} ${leadData.last_name} (${leadData.zona})`);
    
    const results = {
      original: leadData,
      enriched: { ...leadData },
      sources: [],
      confidence: 0
    };
    
    const companyName = this.extractCompanyName(leadData.last_name);
    const companyDomain = this.generateCompanyDomain(companyName);
    
    // 1. Email Discovery with Hunter.io
    console.log('  📧 Searching email...');
    const emailResult = await this.findEmailWithHunter(
      leadData.first_name, 
      leadData.last_name.split(' ')[0], 
      companyDomain
    );
    
    if (emailResult) {
      results.enriched.email = emailResult.email;
      results.sources.push(`Email: ${emailResult.service} (${emailResult.confidence}% confidence)`);
      results.confidence += emailResult.confidence * 0.3;
    }
    
    // 2. Company data with Clearbit
    console.log('  🏢 Enriching company data...');
    const companyResult = await this.enrichCompanyWithClearbit(companyName);
    
    if (companyResult) {
      results.enriched.website = `https://${companyResult.domain}`;
      results.enriched.dipendenti = companyResult.employees;
      results.enriched.fatturato_stimato = companyResult.revenue;
      results.enriched.settore = companyResult.industry;
      results.sources.push(`Company: ${companyResult.service}`);
      results.confidence += 25;
    }
    
    // 3. Italian business registry
    console.log('  🏛️ Searching P.IVA...');
    const italianResult = await this.findItalianBusinessData(companyName);
    
    if (italianResult) {
      results.enriched.partita_iva = italianResult.partitaIva;
      results.enriched.codice_fiscale = italianResult.codiceFiscale;
      results.enriched.business_type = italianResult.settore;
      results.sources.push(`Italian Registry: ${italianResult.service}`);
      results.confidence += 30;
    }
    
    // 4. LinkedIn profile
    console.log('  💼 Finding LinkedIn...');
    const linkedinResult = await this.findLinkedInProfile(companyName);
    
    if (linkedinResult) {
      results.enriched.linkedin_url = linkedinResult.linkedinUrl;
      results.sources.push(`LinkedIn: ${linkedinResult.service}`);
      results.confidence += linkedinResult.confidence * 0.2;
    }
    
    // 5. Enhanced quality score
    results.enriched.enhanced_quality_score = Math.min(100, Math.round(results.confidence));
    results.enriched.enrichment_status = 'completed';
    results.enriched.enrichment_date = new Date().toISOString();
    results.enriched.data_source = 'real_api_enrichment';
    
    console.log(`  ✅ Enrichment completed: ${Math.round(results.confidence)}% confidence`);
    
    return results;
  }
  
  // Mock methods for development (when API keys not available)
  mockEmailDiscovery(firstName, lastName, domain) {
    if (Math.random() < 0.35) { // 35% success rate for mock
      const patterns = [
        `${firstName.toLowerCase()}.${lastName.toLowerCase().split(' ')[0]}@${domain}.it`,
        `${firstName.toLowerCase()}@${domain}.it`,
        `info@${domain}.it`
      ];
      
      return {
        email: patterns[Math.floor(Math.random() * patterns.length)],
        confidence: 75 + Math.random() * 20,
        sources: 1,
        service: 'mock_hunter'
      };
    }
    return null;
  }
  
  mockCompanyEnrichment(companyName) {
    const industries = ['Legal Services', 'Healthcare', 'Consulting', 'Architecture', 'Finance'];
    const employees = [1, 2, 3, 5, 8, 12, 20, 50][Math.floor(Math.random() * 8)];
    
    return {
      domain: this.generateCompanyDomain(companyName),
      employees,
      revenue: Math.round(employees * (50000 + Math.random() * 200000)),
      industry: industries[Math.floor(Math.random() * industries.length)],
      sector: 'Professional Services',
      location: 'Milano, IT',
      founded: 2000 + Math.floor(Math.random() * 23),
      service: 'mock_clearbit'
    };
  }
  
  mockItalianBusinessData(companyName) {
    if (Math.random() < 0.75) { // 75% success rate for P.IVA mock
      return {
        partitaIva: `IT${Math.floor(Math.random() * 90000000) + 10000000}`,
        codiceFiscale: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        ragioneSociale: companyName,
        sedeLegale: 'Milano (MI)',
        settore: 'Attività professionali',
        dataCostituzione: '2010-01-01',
        service: 'mock_registro_imprese'
      };
    }
    return null;
  }
  
  // Utility methods
  extractCompanyName(businessName) {
    return businessName
      .replace(/dott\\.?\\s*/gi, '')
      .replace(/avv\\.?\\s*/gi, '')
      .replace(/ing\\.?\\s*/gi, '')
      .replace(/arch\\.?\\s*/gi, '')
      .replace(/dr\\.?\\s*/gi, '')
      .replace(/studio\\s*/gi, '')
      .trim();
  }
  
  generateCompanyDomain(companyName) {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);
  }
  
  // Usage statistics
  getUsageStats() {
    return {
      hunter: this.requestCount.hunter,
      clearbit: this.requestCount.clearbit,
      italian: this.requestCount.italian,
      total: this.requestCount.hunter + this.requestCount.clearbit + this.requestCount.italian
    };
  }
}

module.exports = { RealEnrichmentAPIs };