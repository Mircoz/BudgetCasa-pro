// Expand Milano coverage to all CAPs and surrounding areas
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

// All Milano CAP codes for comprehensive coverage
const MILANO_CAPS = {
  // Milano Centro
  centro: ['20121', '20122', '20123', '20124', '20125', '20126', '20127'],
  
  // Milano Semicentro
  semicentro: ['20129', '20131', '20132', '20133', '20134', '20135', '20136', '20137', '20138', '20139'],
  
  // Milano Periferia 
  periferia: ['20141', '20142', '20143', '20144', '20145', '20146', '20147', '20148', '20149', '20151', '20152', '20153', '20154', '20155', '20156', '20157', '20158', '20159', '20161', '20162'],
  
  // Provincia Milano (top municipalities)
  provincia: {
    'Monza': ['20900', '20901', '20902'], 
    'Bergamo': ['24121', '24122', '24123', '24124', '24125'],
    'Brescia': ['25121', '25122', '25123', '25124', '25125'],
    'Cinisello Balsamo': ['20092'],
    'Sesto San Giovanni': ['20099'],
    'Rho': ['20017'],
    'Bollate': ['20021'],
    'Corsico': ['20094']
  }
};

// Business categories for targeted scraping
const BUSINESS_CATEGORIES = [
  // High-value professional services
  'studi legali',
  'commercialisti', 
  'consulenti',
  'medici specialisti',
  'dentisti',
  'architetti',
  'ingegneri',
  
  // SME targets
  'ristoranti',
  'negozi abbigliamento',
  'parrucchieri',
  'centri estetici', 
  'palestre',
  'autofficine',
  'imprese edili',
  'agenzie immobiliari'
];

console.log('🚀 PIANO ESPANSIONE MILANO + PROVINCIA');
console.log('=====================================\n');

// Calculate total coverage
const allCAPs = [
  ...MILANO_CAPS.centro,
  ...MILANO_CAPS.semicentro, 
  ...MILANO_CAPS.periferia,
  ...Object.values(MILANO_CAPS.provincia).flat()
];

console.log(`📍 COPERTURA GEOGRAFICA:`);
console.log(`• Milano Centro: ${MILANO_CAPS.centro.length} CAP`);
console.log(`• Milano Semicentro: ${MILANO_CAPS.semicentro.length} CAP`); 
console.log(`• Milano Periferia: ${MILANO_CAPS.periferia.length} CAP`);
console.log(`• Provincia: ${Object.keys(MILANO_CAPS.provincia).length} comuni`);
console.log(`• TOTALE CAP: ${allCAPs.length}\n`);

console.log(`🏢 CATEGORIE BUSINESS:`);
BUSINESS_CATEGORIES.forEach(cat => console.log(`• ${cat}`));

console.log(`\n📊 STIMA LEAD POTENTIAL:`);
const avgLeadsPerCAP = 15; // Conservative estimate based on current data
const avgLeadsPerCategory = 5;
const estimatedTotal = allCAPs.length * avgLeadsPerCAP * BUSINESS_CATEGORIES.length / 3; // /3 for overlap

console.log(`• Lead stimati totali: ${estimatedTotal.toLocaleString()}`);
console.log(`• Target filtrati (qualità): ${Math.round(estimatedTotal * 0.3).toLocaleString()}`);
console.log(`• Target premium (post-enrichment): 2,000\n`);

console.log(`⚡ PIANO RACCOLTA AUTOMATIZZATA:`);
console.log(`1. Scraping parallelo multi-CAP`);
console.log(`2. Filtering qualità (partita IVA, indirizzo completo)`);
console.log(`3. Deduplicazione automatica`);
console.log(`4. Enrichment premium pipeline`);

// Priority areas based on business density
const PRIORITY_AREAS = {
  high: ['20121', '20122', '20123', '20900', '24121'], // Centro Milano + Monza + Bergamo centro
  medium: [...MILANO_CAPS.semicentro.slice(0, 5), '20092', '20099'],
  low: [...MILANO_CAPS.periferia.slice(0, 10)]
};

console.log(`\n🎯 PRIORITIZZAZIONE RACCOLTA:`);
console.log(`• Alta priorità: ${PRIORITY_AREAS.high.length} CAP (Centro + Capoluoghi)`);
console.log(`• Media priorità: ${PRIORITY_AREAS.medium.length} CAP (Semicentro)`);  
console.log(`• Bassa priorità: ${PRIORITY_AREAS.low.length} CAP (Periferia)`);

module.exports = { MILANO_CAPS, BUSINESS_CATEGORIES, PRIORITY_AREAS };