-- Add enrichment columns to milano_leads table
-- Execute this in Supabase SQL Editor

-- Add missing basic columns
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS contact_attempts INTEGER DEFAULT 0;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add enrichment data columns
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS partita_iva VARCHAR(11);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS codice_fiscale VARCHAR(16);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS settore VARCHAR(100);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS dipendenti INTEGER;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS fatturato_stimato INTEGER;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);

-- Add enrichment metadata
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS enrichment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS enrichment_status VARCHAR(50);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS phone_enriched VARCHAR(20);

-- Add enhanced scoring columns  
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS enhanced_quality_score INTEGER;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS revenue_opportunity INTEGER;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS business_type VARCHAR(50);
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS zone_rating INTEGER;

-- Add activity tracking columns
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS assigned_agent_id UUID;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS agent_notes TEXT;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP WITH TIME ZONE;

-- Add B2C correlation fields
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS b2c_correlation_score INTEGER;
ALTER TABLE milano_leads ADD COLUMN IF NOT EXISTS preferred_products TEXT[];

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_milano_leads_updated_at ON milano_leads;
CREATE TRIGGER update_milano_leads_updated_at 
    BEFORE UPDATE ON milano_leads 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_milano_leads_partita_iva ON milano_leads(partita_iva);
CREATE INDEX IF NOT EXISTS idx_milano_leads_settore ON milano_leads(settore);
CREATE INDEX IF NOT EXISTS idx_milano_leads_dipendenti ON milano_leads(dipendenti);
CREATE INDEX IF NOT EXISTS idx_milano_leads_enrichment_status ON milano_leads(enrichment_status);
CREATE INDEX IF NOT EXISTS idx_milano_leads_enhanced_quality_score ON milano_leads(enhanced_quality_score);
CREATE INDEX IF NOT EXISTS idx_milano_leads_assigned_agent ON milano_leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_milano_leads_last_contacted ON milano_leads(last_contacted_at);

-- Add some sample data to existing leads (optional)
UPDATE milano_leads 
SET contact_attempts = 0, 
    updated_at = now()
WHERE contact_attempts IS NULL;