// B2C Intelligence Integration for B2B Lead Scoring
const fs = require('fs');
const path = require('path');

class B2CIntelligenceEngine {
  
  constructor() {
    this.milanoInsights = null;
    this.analyticsData = null;
    this.geoData = null;
    this.loadB2CData();
  }
  
  // Load all B2C data from uploaded folders
  loadB2CData() {
    try {
      console.log('🧠 Loading B2C Intelligence Data...');
      
      // Load POI data
      const poiPath = path.join(process.cwd(), 'poi');
      if (fs.existsSync(path.join(poiPath, 'quartieri_highlights.json'))) {
        this.milanoInsights = JSON.parse(fs.readFileSync(path.join(poiPath, 'quartieri_highlights.json'), 'utf8'));
        console.log('✅ Loaded quartieri highlights');
      }
      
      // Load analytics data (sample some key files)
      const analyticsPath = path.join(process.cwd(), 'analytics');
      this.analyticsData = {};
      
      // Bike stations - mobility indicator
      if (fs.existsSync(path.join(analyticsPath, 'bikemi_stazioni.csv'))) {
        console.log('✅ Found BikeMi stations data (mobility indicator)');
        this.analyticsData.mobility = true;
      }
      
      // Green areas - quality of life indicator
      if (fs.existsSync(path.join(analyticsPath, 'parchi_4326.csv'))) {
        console.log('✅ Found parks data (quality of life indicator)');
        this.analyticsData.greenSpaces = true;
      }
      
      // Schools - family density indicator  
      if (fs.existsSync(path.join(analyticsPath, 'ds294_infanzia_gestione-quartiere.csv'))) {
        console.log('✅ Found schools data (family demographics indicator)');
        this.analyticsData.schools = true;
      }
      
      // Air quality - environmental factor
      if (fs.existsSync(path.join(analyticsPath, 'qaria_datoariagiornostazione_2025-04-26.csv'))) {
        console.log('✅ Found air quality data');
        this.analyticsData.airQuality = true;
      }
      
      console.log('🎯 B2C Intelligence Engine initialized\n');
      
    } catch (error) {
      console.error('❌ Error loading B2C data:', error.message);
    }
  }
  
  // Milano Zone Intelligence (based on B2C insights)
  getZoneIntelligence(cap, zona) {
    const zoneProfiles = {
      // Centro storico - Premium business district
      'Centro': {
        businessPotential: 95,
        avgIncome: 120000,
        insuranceAffinity: 85,
        professionalDensity: 90,
        b2cInsights: {
          highValueCustomers: 85,
          premiumProductUsage: 90,
          digitalEngagement: 80
        }
      },
      
      // Porta Nuova - Modern financial district
      'Porta Nuova': {
        businessPotential: 90,
        avgIncome: 110000,
        insuranceAffinity: 80,
        professionalDensity: 85,
        b2cInsights: {
          highValueCustomers: 80,
          premiumProductUsage: 85,
          digitalEngagement: 95
        }
      },
      
      // Navigli - Creative/hospitality district
      'Navigli': {
        businessPotential: 75,
        avgIncome: 75000,
        insuranceAffinity: 70,
        professionalDensity: 65,
        b2cInsights: {
          highValueCustomers: 60,
          premiumProductUsage: 55,
          digitalEngagement: 85
        }
      },
      
      // Isola - Trendy residential/business mix
      'Isola': {
        businessPotential: 80,
        avgIncome: 85000,
        insuranceAffinity: 75,
        professionalDensity: 70,
        b2cInsights: {
          highValueCustomers: 70,
          premiumProductUsage: 65,
          digitalEngagement: 80
        }
      },
      
      // Brera - Luxury/art district
      'Brera': {
        businessPotential: 85,
        avgIncome: 100000,
        insuranceAffinity: 80,
        professionalDensity: 75,
        b2cInsights: {
          highValueCustomers: 75,
          premiumProductUsage: 80,
          digitalEngagement: 70
        }
      },
      
      // Sempione - Mixed residential/business
      'Sempione': {
        businessPotential: 70,
        avgIncome: 70000,
        insuranceAffinity: 65,
        professionalDensity: 60,
        b2cInsights: {
          highValueCustomers: 55,
          premiumProductUsage: 50,
          digitalEngagement: 65
        }
      },
      
      // Provincia - Suburban/industrial
      'Provincia': {
        businessPotential: 60,
        avgIncome: 55000,
        insuranceAffinity: 60,
        professionalDensity: 50,
        b2cInsights: {
          highValueCustomers: 45,
          premiumProductUsage: 40,
          digitalEngagement: 55
        }
      }
    };
    
    return zoneProfiles[zona] || zoneProfiles['Provincia'];
  }
  
  // Business Type Intelligence (based on B2C customer behavior)
  getBusinessTypeIntelligence(businessName) {
    const businessTypes = {
      legal: {
        keywords: ['studio legale', 'avv', 'avvocato', 'legale'],
        insurancePropensity: 90,
        avgValue: 15000,
        preferredProducts: ['responsabilità civile', 'tutela legale', 'cyber risk']
      },
      
      accounting: {
        keywords: ['commercialista', 'contabile', 'consulente', 'tributario'],
        insurancePropensity: 85,
        avgValue: 12000,
        preferredProducts: ['responsabilità professionale', 'cyber risk', 'tutela legale']
      },
      
      medical: {
        keywords: ['dott', 'medico', 'studio medico', 'clinica', 'dentista'],
        insurancePropensity: 95,
        avgValue: 20000,
        preferredProducts: ['responsabilità sanitaria', 'studio medico', 'cyber risk']
      },
      
      architecture: {
        keywords: ['architetto', 'ingegnere', 'progettazione', 'studio tecnico'],
        insurancePropensity: 80,
        avgValue: 10000,
        preferredProducts: ['responsabilità professionale', 'decennale postuma', 'tutela legale']
      },
      
      restaurant: {
        keywords: ['ristorante', 'bar', 'caffè', 'osteria', 'trattoria'],
        insurancePropensity: 70,
        avgValue: 8000,
        preferredProducts: ['responsabilità civile', 'incendio', 'furto']
      },
      
      retail: {
        keywords: ['negozio', 'abbigliamento', 'boutique', 'store'],
        insurancePropensity: 65,
        avgValue: 6000,
        preferredProducts: ['furto', 'incendio', 'responsabilità civile']
      }
    };
    
    const businessNameLower = businessName.toLowerCase();
    
    for (const [type, config] of Object.entries(businessTypes)) {
      if (config.keywords.some(keyword => businessNameLower.includes(keyword))) {
        return { type, ...config };
      }
    }
    
    // Default for unknown business types
    return {
      type: 'generic',
      insurancePropensity: 60,
      avgValue: 5000,
      preferredProducts: ['responsabilità civile', 'incendio']
    };
  }
  
  // Enhanced Lead Scoring with B2C Intelligence
  calculateB2CEnhancedScore(lead, enrichedData = {}) {
    let score = 50; // Base score
    
    // Zone intelligence
    const zoneIntel = this.getZoneIntelligence(lead.address_cap, lead.zona);
    score += Math.round(zoneIntel.businessPotential * 0.25); // Up to +24 points
    
    // Business type intelligence
    const businessIntel = this.getBusinessTypeIntelligence(lead.last_name);
    score += Math.round(businessIntel.insurancePropensity * 0.15); // Up to +14 points
    
    // B2C customer behavior correlation
    if (zoneIntel.b2cInsights.highValueCustomers > 70) {
      score += 8; // High-value B2C customers in area = higher B2B potential
    }
    
    if (zoneIntel.b2cInsights.digitalEngagement > 80) {
      score += 5; // High digital engagement = easier to reach
    }
    
    // Enriched data quality bonus
    let enrichmentBonus = 0;
    if (enrichedData.email) enrichmentBonus += 8;
    if (enrichedData.phone_enriched) enrichmentBonus += 10;
    if (enrichedData.partita_iva) enrichmentBonus += 12;
    if (enrichedData.website) enrichmentBonus += 3;
    if (enrichedData.linkedin_url) enrichmentBonus += 5;
    
    score += enrichmentBonus;
    
    // Company size factor
    if (enrichedData.dipendenti >= 5) score += 8;
    if (enrichedData.fatturato_stimato >= 200000) score += 10;
    
    // Revenue potential calculation
    const revenueOpportunity = Math.round(
      (zoneIntel.avgIncome * 0.025) + (businessIntel.avgValue * 0.1)
    );
    
    return {
      qualityScore: Math.min(100, Math.max(30, score)),
      revenueOpportunity,
      businessType: businessIntel.type,
      zoneRating: zoneIntel.businessPotential,
      preferredProducts: businessIntel.preferredProducts,
      b2cCorrelation: zoneIntel.b2cInsights
    };
  }
  
  // Generate B2B insights report
  generateB2BInsightReport(leads) {
    console.log('📊 B2C-B2B INTELLIGENCE REPORT');
    console.log('===============================\n');
    
    const zoneAnalysis = {};
    const businessTypeAnalysis = {};
    
    leads.forEach(lead => {
      // Zone analysis
      if (!zoneAnalysis[lead.zona]) {
        zoneAnalysis[lead.zona] = {
          count: 0,
          avgQuality: 0,
          totalRevenue: 0
        };
      }
      
      const scoring = this.calculateB2CEnhancedScore(lead);
      zoneAnalysis[lead.zona].count++;
      zoneAnalysis[lead.zona].avgQuality += scoring.qualityScore;
      zoneAnalysis[lead.zona].totalRevenue += scoring.revenueOpportunity;
      
      // Business type analysis
      const businessIntel = this.getBusinessTypeIntelligence(lead.last_name);
      if (!businessTypeAnalysis[businessIntel.type]) {
        businessTypeAnalysis[businessIntel.type] = {
          count: 0,
          avgPropensity: businessIntel.insurancePropensity
        };
      }
      businessTypeAnalysis[businessIntel.type].count++;
    });
    
    // Finalize averages
    Object.keys(zoneAnalysis).forEach(zona => {
      zoneAnalysis[zona].avgQuality = Math.round(
        zoneAnalysis[zona].avgQuality / zoneAnalysis[zona].count
      );
      zoneAnalysis[zona].totalRevenue = Math.round(zoneAnalysis[zona].totalRevenue);
    });
    
    console.log('🗺️ ZONE PERFORMANCE RANKING:');
    Object.entries(zoneAnalysis)
      .sort(([,a], [,b]) => b.avgQuality - a.avgQuality)
      .forEach(([zona, data]) => {
        console.log(`${zona}: ${data.count} leads, ${data.avgQuality}/100 quality, €${data.totalRevenue} revenue potential`);
      });
    
    console.log('\n🏢 BUSINESS TYPE DISTRIBUTION:');
    Object.entries(businessTypeAnalysis)
      .sort(([,a], [,b]) => b.count - a.count)
      .forEach(([type, data]) => {
        console.log(`${type}: ${data.count} leads (${data.avgPropensity}% insurance propensity)`);
      });
    
    return { zoneAnalysis, businessTypeAnalysis };
  }
}

// Export singleton instance
const b2cIntelligence = new B2CIntelligenceEngine();

module.exports = { 
  B2CIntelligenceEngine, 
  b2cIntelligence 
};