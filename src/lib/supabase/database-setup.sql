-- Milano MVP Database Schema
-- BudgetCasa Pro - Insurance Lead Generation Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Milano Leads Table (Core entity)
CREATE TABLE IF NOT EXISTS milano_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address_street TEXT,
  address_cap TEXT CHECK (address_cap ~ '^20[0-9]{3}$'), -- Milano CAP format
  zona TEXT CHECK (zona IN ('Centro', 'Navigli', 'Porta Nuova', 'Sempione', 'Provincia', 'Isola', 'Brera')),
  
  -- Demographics
  estimated_age INTEGER CHECK (estimated_age BETWEEN 18 AND 100),
  estimated_income INTEGER CHECK (estimated_income > 0),
  family_size INTEGER DEFAULT 1 CHECK (family_size > 0),
  home_ownership TEXT CHECK (home_ownership IN ('owner', 'renter', 'family', 'unknown')) DEFAULT 'unknown',
  
  -- Insurance Propensity Scores (0-100)
  propensity_casa INTEGER DEFAULT 0 CHECK (propensity_casa BETWEEN 0 AND 100),
  propensity_auto INTEGER DEFAULT 0 CHECK (propensity_auto BETWEEN 0 AND 100),
  propensity_vita INTEGER DEFAULT 0 CHECK (propensity_vita BETWEEN 0 AND 100),
  propensity_business INTEGER DEFAULT 0 CHECK (propensity_business BETWEEN 0 AND 100),
  
  -- Data Management
  data_source TEXT NOT NULL,
  data_quality_score INTEGER DEFAULT 50 CHECK (data_quality_score BETWEEN 0 AND 100),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Agent Management
  assigned_agent_id UUID,
  agent_notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  contact_attempts INTEGER DEFAULT 0,
  
  -- Status Tracking
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'interested', 'qualified', 'converted', 'not_interested', 'invalid')),
  conversion_probability INTEGER DEFAULT 0 CHECK (conversion_probability BETWEEN 0 AND 100)
);

-- Agents Table (Insurance professionals using the platform)
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  
  -- Territory Management
  territory_caps TEXT[] DEFAULT '{}', -- Array of Milano CAP codes they cover
  territory_zones TEXT[] DEFAULT '{}', -- Array of zones they cover
  
  -- Subscription & Access
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'suspended', 'cancelled')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
  monthly_lead_limit INTEGER DEFAULT 100,
  leads_used_this_month INTEGER DEFAULT 0,
  
  -- Performance Tracking
  total_leads_accessed INTEGER DEFAULT 0,
  total_policies_sold INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Account Management
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Lead Activities Table (Tracking agent interactions with leads)
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES milano_leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type TEXT NOT NULL CHECK (activity_type IN ('viewed', 'called', 'emailed', 'sms_sent', 'appointment_scheduled', 'appointment_completed', 'proposal_sent', 'policy_sold', 'marked_not_interested')),
  notes TEXT,
  outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'negative', 'no_answer', 'follow_up_needed')),
  
  -- Follow-up Management
  follow_up_date TIMESTAMP WITH TIME ZONE,
  follow_up_completed BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Lead Sources Table (Tracking where leads come from)
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('scraping', 'api', 'manual', 'import', 'referral')),
  description TEXT,
  cost_per_lead DECIMAL(10,2) DEFAULT 0.00,
  quality_score INTEGER DEFAULT 50 CHECK (quality_score BETWEEN 0 AND 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Subscriptions Table (Billing and subscription management)  
CREATE TABLE IF NOT EXISTS agent_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Subscription Details
  plan_name TEXT NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  lead_limit INTEGER NOT NULL,
  features JSONB DEFAULT '{}',
  
  -- Billing Cycle
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Payment Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid')),
  stripe_subscription_id TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_milano_leads_zona ON milano_leads(zona);
CREATE INDEX IF NOT EXISTS idx_milano_leads_cap ON milano_leads(address_cap);
CREATE INDEX IF NOT EXISTS idx_milano_leads_status ON milano_leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_milano_leads_propensity_casa ON milano_leads(propensity_casa DESC);
CREATE INDEX IF NOT EXISTS idx_milano_leads_propensity_auto ON milano_leads(propensity_auto DESC);
CREATE INDEX IF NOT EXISTS idx_milano_leads_assigned_agent ON milano_leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_milano_leads_created_at ON milano_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_subscription_status ON agents(subscription_status);
CREATE INDEX IF NOT EXISTS idx_agents_territory_caps ON milano_leads USING GIN(territory_caps);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_agent_id ON lead_activities(agent_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_milano_leads_zona_status ON milano_leads(zona, lead_status);
CREATE INDEX IF NOT EXISTS idx_milano_leads_cap_propensity ON milano_leads(address_cap, propensity_casa DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milano_leads_updated_at BEFORE UPDATE ON milano_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE milano_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_subscriptions ENABLE ROW LEVEL SECURITY;

-- Agents can only see their own profile
CREATE POLICY "Agents can view own profile" ON agents
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Agents can update own profile" ON agents  
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Agents can only see leads assigned to them or unassigned leads in their territory
CREATE POLICY "Agents can view territory leads" ON milano_leads
  FOR SELECT USING (
    assigned_agent_id IS NULL OR 
    assigned_agent_id::text = auth.uid()::text OR
    address_cap = ANY(
      SELECT unnest(territory_caps) 
      FROM agents 
      WHERE id::text = auth.uid()::text
    )
  );

-- Agents can update leads assigned to them
CREATE POLICY "Agents can update assigned leads" ON milano_leads
  FOR UPDATE USING (assigned_agent_id::text = auth.uid()::text);

-- Agents can view their own activities
CREATE POLICY "Agents can view own activities" ON lead_activities
  FOR SELECT USING (agent_id::text = auth.uid()::text);

-- Agents can insert their own activities  
CREATE POLICY "Agents can insert own activities" ON lead_activities
  FOR INSERT WITH CHECK (agent_id::text = auth.uid()::text);

-- Service role bypasses all RLS (for admin operations and data imports)
CREATE POLICY "Service role full access milano_leads" ON milano_leads
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access agents" ON agents  
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access activities" ON lead_activities
  TO service_role USING (true) WITH CHECK (true);

-- Insert initial lead sources
INSERT INTO lead_sources (name, source_type, description, cost_per_lead, quality_score) VALUES
  ('PagineGialle Milano', 'scraping', 'Business directory scraping for Milano area', 0.50, 75),
  ('Camera Commercio Milano', 'api', 'Official business registry data', 0.30, 90),
  ('LinkedIn Milano', 'scraping', 'Professional network data mining', 1.00, 85),
  ('Immobiliare.it Milano', 'scraping', 'Real estate platform property owners', 0.75, 80),
  ('Facebook Business Milano', 'scraping', 'Social media business pages', 0.25, 65),
  ('Manual Entry', 'manual', 'Manually entered leads from networking events', 0.00, 95)
ON CONFLICT (name) DO NOTHING;

-- Initial Milano CAP codes reference
CREATE TABLE IF NOT EXISTS milano_cap_zones (
  cap TEXT PRIMARY KEY,
  zona TEXT NOT NULL,
  district_name TEXT,
  avg_income INTEGER,
  population INTEGER,
  business_density INTEGER
);

INSERT INTO milano_cap_zones (cap, zona, district_name, avg_income, population, business_density) VALUES
  ('20121', 'Centro', 'Duomo', 65000, 15000, 95),
  ('20122', 'Centro', 'Università Statale', 60000, 25000, 85),
  ('20123', 'Centro', 'Sant''Alessandro', 70000, 20000, 90),
  ('20124', 'Porta Nuova', 'Porta Nuova', 75000, 30000, 88),
  ('20125', 'Porta Nuova', 'Buenos Aires', 55000, 35000, 75),
  ('20129', 'Porta Nuova', 'Porta Garibaldi', 58000, 28000, 80),
  ('20144', 'Navigli', 'Navigli', 52000, 40000, 70),
  ('20143', 'Navigli', 'Porta Romana', 48000, 35000, 65),
  ('20145', 'Sempione', 'Sempione', 60000, 32000, 75),
  ('20154', 'Isola', 'Isola', 50000, 25000, 70),
  ('20121', 'Brera', 'Brera', 85000, 12000, 95)
ON CONFLICT (cap) DO NOTHING;