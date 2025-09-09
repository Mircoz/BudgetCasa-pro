-- BudgetCasa Pro Database Setup - Step 1
-- Copy and paste this entire script into Supabase SQL Editor

-- Enable extensions
create extension if not exists pg_trgm;
create extension if not exists vector;

-- Organizations
create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Org members (extends auth.users)
create table if not exists org_members (
  org_id uuid references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'agent')),
  created_at timestamptz default now(),
  primary key (org_id, user_id)
);

-- Lead persons (individuals/families)
create table if not exists lead_persons (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id),
  source text default 'budgetcasa' check (source in ('budgetcasa', 'import', 'premium')),
  name text,
  email text,
  phone text,
  geo_city text,
  geo_municipality text,
  geo_quarter text,
  household_size int,
  has_children boolean,
  lifestyle jsonb,
  mobility jsonb,
  income_monthly numeric,
  intent_buy_home boolean default true,
  created_at timestamptz default now()
);

-- Lead person scores
create table if not exists lead_person_scores (
  lead_id uuid primary key references lead_persons(id) on delete cascade,
  risk_home numeric,
  risk_mobility numeric,
  opportunity_life numeric,
  opportunity_home numeric,
  explanation jsonb,
  updated_at timestamptz default now()
);

-- Companies (B2B directory)
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id), -- nullable for shared global data
  name text not null,
  piva text unique,
  ateco text,
  employees int,
  revenue_range text,
  contact_email text,
  contact_phone text,
  address text,
  geo_city text,
  geo_municipality text,
  lat numeric,
  lng numeric,
  source text default 'open' check (source in ('open', 'premium', 'import')),
  created_at timestamptz default now()
);

-- Company scores
create table if not exists company_scores (
  company_id uuid primary key references companies(id) on delete cascade,
  risk_flood numeric,
  risk_crime numeric,
  risk_business_continuity numeric,
  opportunity_employee_benefits numeric,
  opportunity_property numeric,
  explanation jsonb,
  updated_at timestamptz default now()
);

-- Risk tiles (normalized open data)
create table if not exists risk_tiles (
  id serial primary key,
  type text not null check (type in ('flood', 'quake', 'crime', 'traffic')),
  geo_hash text not null,
  score numeric not null,
  created_at timestamptz default now()
);

-- Places (POI)
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('hospital', 'school', 'police', 'transport', 'supermarket')),
  name text,
  lat numeric not null,
  lng numeric not null,
  geo_city text,
  created_at timestamptz default now()
);

-- Industry taxonomy (ATECO codes)
create table if not exists industry_taxonomy (
  code text primary key,
  label text not null,
  parent_code text references industry_taxonomy(code),
  level int not null default 1,
  created_at timestamptz default now()
);

-- Lists (saved collections)
create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  type text not null check (type in ('person', 'company')),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz default now()
);

-- List items
create table if not exists list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  entity_type text not null check (entity_type in ('person', 'company')),
  entity_id uuid not null,
  notes text,
  created_at timestamptz default now(),
  unique (list_id, entity_type, entity_id)
);

-- Feature flags
create table if not exists feature_flags (
  key text primary key,
  enabled boolean default false,
  description text,
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Embeddings (for vector search)
create table if not exists embeddings (
  entity_type text not null,
  entity_id uuid not null,
  vector vector(1536), -- OpenAI embedding dimension
  created_at timestamptz default now(),
  primary key (entity_type, entity_id)
);

-- Premium job tracking
create table if not exists premium_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  metadata jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);