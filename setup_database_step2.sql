-- BudgetCasa Pro Database Setup - Step 2
-- Run this AFTER Step 1 completes successfully

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