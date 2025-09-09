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

-- Indexes for full-text search
create index if not exists idx_lead_persons_fts on lead_persons using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(geo_city,'')));
create index if not exists idx_lead_persons_trigram on lead_persons using gin (name gin_trgm_ops);
create index if not exists idx_lead_persons_city on lead_persons(geo_city);
create index if not exists idx_lead_persons_income on lead_persons(income_monthly);
create index if not exists idx_lead_persons_children on lead_persons(has_children);

create index if not exists idx_companies_fts on companies using gin (to_tsvector('simple', name || ' ' || coalesce(ateco,'')));
create index if not exists idx_companies_trigram on companies using gin (name gin_trgm_ops);
create index if not exists idx_companies_city on companies(geo_city);
create index if not exists idx_companies_ateco on companies(ateco);
create index if not exists idx_companies_employees on companies(employees);

-- Composite indexes for scores
create index if not exists idx_lead_person_scores_composite on lead_person_scores(risk_home, opportunity_home);
create index if not exists idx_company_scores_composite on company_scores(risk_flood, opportunity_property);

-- Spatial indexes
create index if not exists idx_companies_location on companies using btree(lat, lng) where lat is not null and lng is not null;
create index if not exists idx_places_location on places using btree(lat, lng);

-- Vector index
create index if not exists idx_embeddings_vector on embeddings using ivfflat (vector vector_cosine_ops) with (lists = 100);

-- Enable RLS on all tables
alter table orgs enable row level security;
alter table org_members enable row level security;
alter table lead_persons enable row level security;
alter table lead_person_scores enable row level security;
alter table companies enable row level security;
alter table company_scores enable row level security;
alter table lists enable row level security;
alter table list_items enable row level security;
alter table audit_logs enable row level security;
alter table embeddings enable row level security;

-- RLS Policies

-- Orgs: users can see their own org
create policy "users_own_org" on orgs
  for select using (id in (select org_id from org_members where user_id = auth.uid()));

-- Org members: users can see members of their org
create policy "org_members_visibility" on org_members
  for select using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Lead persons: org members can see org leads + shared budgetcasa leads if enabled
create policy "lead_persons_access" on lead_persons
  for select using (
    org_id in (select org_id from org_members where user_id = auth.uid())
    or (source = 'budgetcasa' and exists(select 1 from feature_flags where key = 'pro_share_persons' and enabled = true))
  );

-- Lead person scores: same as lead persons
create policy "lead_person_scores_access" on lead_person_scores
  for select using (
    lead_id in (
      select id from lead_persons 
      where org_id in (select org_id from org_members where user_id = auth.uid())
      or (source = 'budgetcasa' and exists(select 1 from feature_flags where key = 'pro_share_persons' and enabled = true))
    )
  );

-- Companies: org members can see org companies + shared global companies
create policy "companies_access" on companies
  for select using (
    org_id in (select org_id from org_members where user_id = auth.uid())
    or org_id is null -- global shared companies
  );

-- Company scores: follow companies access
create policy "company_scores_access" on company_scores
  for select using (
    company_id in (
      select id from companies 
      where org_id in (select org_id from org_members where user_id = auth.uid())
      or org_id is null
    )
  );

-- Lists: org members can manage their org's lists
create policy "lists_org_access" on lists
  for all using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- List items: access through lists
create policy "list_items_access" on list_items
  for all using (
    list_id in (
      select id from lists 
      where org_id in (select org_id from org_members where user_id = auth.uid())
    )
  );

-- Audit logs: users can see their own actions
create policy "audit_logs_own" on audit_logs
  for select using (user_id = auth.uid());

-- Insert seed feature flags
insert into feature_flags (key, enabled, description) values
  ('pro_share_persons', false, 'Allow sharing BudgetCasa person leads with Pro users'),
  ('enable_embeddings', false, 'Enable vector-based semantic search'),
  ('premium_data_enabled', false, 'Show premium data fields for companies')
on conflict (key) do nothing;