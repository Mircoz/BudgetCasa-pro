#!/usr/bin/env ts-node

/**
 * Milano Lead Collection Script
 * 
 * This script collects insurance leads from Milano area using web scraping
 * and saves them to the Supabase database.
 * 
 * Usage:
 * npm run collect-milano-leads [number_of_leads]
 * 
 * Example:
 * npm run collect-milano-leads 200
 */

import { MilanoDataCollector } from '../lib/scrapers/milano-data-collector';
import { MilanoDataService } from '../lib/supabase/database-client';

async function main() {
  console.log('🚀 Milano Lead Collection Started');
  console.log('=====================================');
  
  // Get target number of leads from command line argument
  const targetLeads = process.argv[2] ? parseInt(process.argv[2]) : 100;
  
  if (isNaN(targetLeads) || targetLeads < 1) {
    console.error('❌ Please provide a valid number of leads to collect');
    console.error('Usage: npm run collect-milano-leads [number]');
    process.exit(1);
  }
  
  console.log(`🎯 Target: ${targetLeads} leads from Milano area`);
  console.log(`📅 Started at: ${new Date().toLocaleString('it-IT')}`);
  
  const collector = new MilanoDataCollector();
  
  try {
    // Check current database status
    console.log('\n📊 Checking current database status...');
    const currentStats = await MilanoDataService.getLeads({ limit: 1 });
    console.log(`   Current leads in database: ${currentStats.count}`);
    
    // Run the collection
    console.log('\n🔍 Starting data collection...');
    const result = await collector.collectMilanoData(targetLeads);
    
    // Display results
    console.log('\n📈 Collection Results:');
    console.log('=====================================');
    console.log(`✅ Success: ${result.success ? 'YES' : 'PARTIAL'}`);
    console.log(`📊 Leads collected: ${result.leadsCollected}`);
    console.log(`❌ Errors encountered: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\n⚠️ Errors Details:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Final database status
    console.log('\n📊 Final database status...');
    const finalStats = await MilanoDataService.getLeads({ limit: 1 });
    console.log(`   Total leads in database: ${finalStats.count}`);
    console.log(`   Leads added this run: ${finalStats.count - currentStats.count}`);
    
    // Zone breakdown
    console.log('\n🗺️ Leads by Milano Zone:');
    const zones = ['Centro', 'Porta Nuova', 'Navigli', 'Sempione', 'Isola', 'Provincia'];
    for (const zona of zones) {
      const zoneStats = await MilanoDataService.getLeads({ zona, limit: 1 });
      console.log(`   ${zona}: ${zoneStats.count} leads`);
    }
    
    // Quality metrics
    console.log('\n📊 Data Quality Metrics:');
    const { data: sampleLeads } = await MilanoDataService.getLeads({ limit: 100 });
    
    const withEmail = sampleLeads.filter(lead => lead.email).length;
    const withPhone = sampleLeads.filter(lead => lead.phone).length;
    const avgQualityScore = sampleLeads.reduce((sum, lead) => sum + lead.data_quality_score, 0) / sampleLeads.length;
    
    console.log(`   Leads with email: ${withEmail}/${sampleLeads.length} (${Math.round(withEmail/sampleLeads.length*100)}%)`);
    console.log(`   Leads with phone: ${withPhone}/${sampleLeads.length} (${Math.round(withPhone/sampleLeads.length*100)}%)`);
    console.log(`   Average quality score: ${Math.round(avgQualityScore)}/100`);
    
    console.log('\n✅ Milano lead collection completed successfully!');
    console.log(`📅 Completed at: ${new Date().toLocaleString('it-IT')}`);
    
  } catch (error) {
    console.error('\n❌ Collection failed with error:', error);
    process.exit(1);
  }
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n⏹️ Collection interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Collection terminated');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(console.error);
}