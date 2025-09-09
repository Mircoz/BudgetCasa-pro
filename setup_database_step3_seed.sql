-- BudgetCasa Pro Database Setup - Step 3 (Sample Data)
-- Run this AFTER Step 1 and Step 2 complete successfully

-- Seed ATECO taxonomy (sample entries)
insert into industry_taxonomy (code, label, level) values
  ('A', 'Agricoltura, silvicoltura e pesca', 1),
  ('01', 'Produzioni vegetali e animali, caccia e servizi connessi', 2),
  ('01.1', 'Coltivazione di colture non permanenti', 3),
  ('01.11', 'Coltivazione di cereali (escluso riso), leguminosi e semi oleiferi', 4),
  ('C', 'Attività manifatturiere', 1),
  ('10', 'Industrie alimentari', 2),
  ('10.1', 'Lavorazione e conservazione di carne e produzione di prodotti a base di carne', 3),
  ('J', 'Servizi di informazione e comunicazione', 1),
  ('62', 'Produzione di software, consulenza informatica e attività connesse', 2),
  ('62.01', 'Produzione di software non connesso all''edizione', 3),
  ('62.02', 'Consulenza nel settore delle tecnologie dell''informatica', 3),
  ('K', 'Attività finanziarie e assicurative', 1),
  ('64', 'Servizi di intermediazione monetaria e finanziaria (escluse le assicurazioni e i fondi pensione)', 2),
  ('65', 'Assicurazioni, riassicurazioni e fondi pensione (escluse le assicurazioni sociali obbligatorie)', 2),
  ('M', 'Attività professionali, scientifiche e tecniche', 1),
  ('69', 'Attività legali e contabilità', 2),
  ('70', 'Attività di direzione aziendale e di consulenza gestionale', 2)
on conflict (code) do nothing;

-- Create demo organization
insert into orgs (id, name) values 
  ('11111111-1111-1111-1111-111111111111', 'Demo Insurance Agency')
on conflict (id) do nothing;

-- Sample lead persons (anonymized/fictional data)
insert into lead_persons (id, org_id, name, geo_city, geo_municipality, household_size, has_children, lifestyle, mobility, income_monthly, intent_buy_home) values
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Mario Rossi', 'Milano', 'Milano', 3, true, '["family", "tech"]', '["car", "bike"]', 4500, true),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Laura Bianchi', 'Roma', 'Roma', 2, false, '["professional", "travel"]', '["car", "public_transport"]', 3800, true),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Giuseppe Verdi', 'Torino', 'Torino', 4, true, '["family", "sport"]', '["car"]', 5200, true),
  ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'Anna Ferrari', 'Napoli', 'Napoli', 1, false, '["young", "nightlife"]', '["scooter", "public_transport"]', 2800, false),
  ('22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111111', 'Francesco Costa', 'Bologna', 'Bologna', 2, false, '["professional", "eco"]', '["bike", "public_transport"]', 4200, true),
  ('22222222-2222-2222-2222-222222222226', null, 'Elena Conti', 'Firenze', 'Firenze', 3, true, '["family", "culture"]', '["car", "walk"]', 3600, true),
  ('22222222-2222-2222-2222-222222222227', null, 'Davide Moretti', 'Venezia', 'Venezia', 2, false, '["travel", "art"]', '["public_transport", "walk"]', 3200, false),
  ('22222222-2222-2222-2222-222222222228', null, 'Silvia Ricci', 'Palermo', 'Palermo', 4, true, '["family", "traditional"]', '["car"]', 2900, true)
on conflict (id) do nothing;

-- Sample lead person scores
insert into lead_person_scores (lead_id, risk_home, risk_mobility, opportunity_life, opportunity_home, explanation) values
  ('22222222-2222-2222-2222-222222222221', 0.72, 0.65, 0.68, 0.82, '{"home": "Area urbana ad alta densità", "mobility": "Uso misto auto/bici", "life": "Famiglia con figli"}'),
  ('22222222-2222-2222-2222-222222222222', 0.58, 0.44, 0.75, 0.63, '{"home": "Zona centrale Roma", "mobility": "Trasporti efficienti", "life": "Professionista travel-oriented"}'),
  ('22222222-2222-2222-2222-222222222223', 0.69, 0.71, 0.72, 0.78, '{"home": "Famiglia numerosa", "mobility": "Dipendenza auto", "life": "Famiglia sportiva"}'),
  ('22222222-2222-2222-2222-222222222224', 0.45, 0.52, 0.56, 0.35, '{"home": "Single, reddito medio-basso", "mobility": "Scooter urbano", "life": "Lifestyle giovanile"}'),
  ('22222222-2222-2222-2222-222222222225', 0.61, 0.38, 0.71, 0.69, '{"home": "Coppia eco-conscious", "mobility": "Mobilità sostenibile", "life": "Professionisti"}'),
  ('22222222-2222-2222-2222-222222222226', 0.66, 0.58, 0.74, 0.71, '{"home": "Famiglia culturale", "mobility": "Mobilità mista", "life": "Interesse cultura"}'),
  ('22222222-2222-2222-2222-222222222227', 0.51, 0.41, 0.68, 0.45, '{"home": "Coppia artistica", "mobility": "Trasporti pubblici", "life": "Lifestyle travel"}'),
  ('22222222-2222-2222-2222-222222222228', 0.73, 0.67, 0.65, 0.77, '{"home": "Famiglia tradizionale Sud", "mobility": "Auto-dipendente", "life": "Valori familiari"}')
on conflict (lead_id) do nothing;

-- Sample companies
insert into companies (id, org_id, name, piva, ateco, employees, revenue_range, contact_email, address, geo_city, lat, lng) values
  ('33333333-3333-3333-3333-333333333331', null, 'TechCorp Italia Srl', '12345678901', '62.01', 25, '1M-5M', 'info@techcorp.it', 'Via Roma 123, Milano', 'Milano', 45.4642, 9.1900),
  ('33333333-3333-3333-3333-333333333332', null, 'Consulting Plus Spa', '12345678902', '70.22', 45, '5M-10M', 'contact@consultingplus.it', 'Corso Francia 456, Torino', 'Torino', 45.0703, 7.6869),
  ('33333333-3333-3333-3333-333333333333', null, 'Legal Partners', '12345678903', '69.10', 12, '500K-1M', 'info@legalpartners.it', 'Via Veneto 789, Roma', 'Roma', 41.9028, 12.4964),
  ('33333333-3333-3333-3333-333333333334', null, 'Food Industry Srl', '12345678904', '10.13', 85, '10M-50M', 'hr@foodindustry.it', 'Zona Industriale, Napoli', 'Napoli', 40.8518, 14.2681),
  ('33333333-3333-3333-3333-333333333335', null, 'Green Energy Solutions', '12345678905', '35.11', 32, '2M-5M', 'info@greenenergy.it', 'Via Sustainable 12, Bologna', 'Bologna', 44.4949, 11.3426),
  ('33333333-3333-3333-3333-333333333336', '11111111-1111-1111-1111-111111111111', 'Local Startup Tech', '12345678906', '62.02', 8, '100K-500K', 'team@localstartup.it', 'Via Innovation 34, Firenze', 'Firenze', 43.7696, 11.2558),
  ('33333333-3333-3333-3333-333333333337', null, 'Manufacturing Co.', '12345678907', '25.62', 120, '20M-50M', 'contact@manufacturing.it', 'Area Industriale, Bergamo', 'Bergamo', 45.6983, 9.6773),
  ('33333333-3333-3333-3333-333333333338', null, 'Financial Services Ltd', '12345678908', '64.19', 28, '5M-10M', 'info@finservices.it', 'Centro Direzionale, Padova', 'Padova', 45.4064, 11.8768)
on conflict (id) do nothing;

-- Sample company scores
insert into company_scores (company_id, risk_flood, risk_crime, risk_business_continuity, opportunity_employee_benefits, opportunity_property, explanation) values
  ('33333333-3333-3333-3333-333333333331', 0.45, 0.32, 0.58, 0.78, 0.81, '{"flood": "Milano centro, rischio moderato", "crime": "Zona sicura", "continuity": "Tech dipendente da infrastrutture", "benefits": "Team giovane", "property": "Uffici di valore"}'),
  ('33333333-3333-3333-3333-333333333332', 0.38, 0.29, 0.52, 0.82, 0.75, '{"flood": "Torino, rischio basso", "crime": "Area business sicura", "continuity": "Consulting stabile", "benefits": "Staff qualificato", "property": "Sede prestigiosa"}'),
  ('33333333-3333-3333-3333-333333333333', 0.42, 0.35, 0.48, 0.71, 0.68, '{"flood": "Roma centro", "crime": "Area centrale", "continuity": "Legale poco volatile", "benefits": "Studio professionale", "property": "Immobile di pregio"}'),
  ('33333333-3333-3333-3333-333333333334', 0.67, 0.44, 0.72, 0.85, 0.78, '{"flood": "Napoli zona industriale", "crime": "Area industriale", "continuity": "Food industry essenziale", "benefits": "Molti dipendenti", "property": "Impianti di valore"}'),
  ('33333333-3333-3333-3333-333333333335', 0.41, 0.31, 0.45, 0.79, 0.73, '{"flood": "Bologna, gestibile", "crime": "Zona sicura", "continuity": "Green energy in crescita", "benefits": "Team specializzato", "property": "Uffici moderni"}'),
  ('33333333-3333-3333-3333-333333333336', 0.39, 0.33, 0.69, 0.65, 0.58, '{"flood": "Firenze, rischio medio", "crime": "Centro città", "continuity": "Startup volatilità", "benefits": "Team piccolo", "property": "Ufficio in affitto"}'),
  ('33333333-3333-3333-3333-333333333337', 0.71, 0.48, 0.68, 0.88, 0.82, '{"flood": "Bergamo area industriale", "crime": "Zona sicura", "continuity": "Manufacturing stabile", "benefits": "Molti operai", "property": "Stabilimento di valore"}'),
  ('33333333-3333-3333-3333-333333333338', 0.43, 0.36, 0.51, 0.74, 0.71, '{"flood": "Padova centro", "crime": "Area business", "continuity": "Finanza regolamentata", "benefits": "Professionisti qualificati", "property": "Uffici direzionali"}')
on conflict (company_id) do nothing;

-- Sample risk tiles
insert into risk_tiles (type, geo_hash, score) values
  ('flood', 'u0nd9', 0.72), -- Milano
  ('flood', 'sr2y5', 0.45), -- Roma  
  ('flood', 'u0nd2', 0.38), -- Torino
  ('flood', 'sr2x0', 0.67), -- Napoli
  ('crime', 'u0nd9', 0.32), -- Milano
  ('crime', 'sr2y5', 0.35), -- Roma
  ('crime', 'u0nd2', 0.29), -- Torino
  ('crime', 'sr2x0', 0.44), -- Napoli
  ('traffic', 'u0nd9', 0.85), -- Milano
  ('traffic', 'sr2y5', 0.82), -- Roma
  ('traffic', 'u0nd2', 0.65), -- Torino
  ('traffic', 'sr2x0', 0.78)  -- Napoli
on conflict do nothing;

-- Sample places (POI)
insert into places (type, name, lat, lng, geo_city) values
  ('hospital', 'Ospedale San Raffaele', 45.4973, 9.2628, 'Milano'),
  ('hospital', 'Policlinico Gemelli', 41.9222, 12.4548, 'Roma'),
  ('school', 'Liceo Berchet', 45.4748, 9.1895, 'Milano'),
  ('school', 'Liceo Tasso', 41.9086, 12.4789, 'Roma'),
  ('police', 'Questura Milano', 45.4773, 9.1815, 'Milano'),
  ('police', 'Questura Roma', 41.9070, 12.4777, 'Roma'),
  ('transport', 'Milano Centrale', 45.4864, 9.2057, 'Milano'),
  ('transport', 'Roma Termini', 41.9010, 12.5027, 'Roma'),
  ('supermarket', 'Esselunga Porta Nuova', 45.4816, 9.1897, 'Milano'),
  ('supermarket', 'Conad Prati', 41.9072, 12.4598, 'Roma')
on conflict do nothing;