# 🔧 Setup Tabella Milano Leads in Supabase

## 📋 Istruzioni per creare la tabella manualmente:

1. **Vai su Supabase Console**: https://supabase.com/dashboard
2. **Accedi al progetto**: `dpqmcnrfgicsqvjvbrwu`
3. **Vai su SQL Editor** (icona </> nella sidebar)
4. **Esegui questo SQL**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milano_leads table
CREATE TABLE IF NOT EXISTS public.milano_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_street TEXT,
  address_cap TEXT,
  zona TEXT,
  estimated_income INTEGER,
  family_size INTEGER DEFAULT 1,
  home_ownership TEXT DEFAULT 'unknown',
  propensity_casa INTEGER DEFAULT 0,
  propensity_auto INTEGER DEFAULT 0,
  propensity_vita INTEGER DEFAULT 0,
  propensity_business INTEGER DEFAULT 0,
  data_source TEXT,
  data_quality_score INTEGER DEFAULT 50,
  lead_status TEXT DEFAULT 'new',
  conversion_probability INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.milano_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (per demo)
CREATE POLICY "Public milano_leads policy" 
ON public.milano_leads 
FOR ALL 
USING (true);
```

5. **Clicca RUN** per eseguire

## ✅ Verifica:
- La tabella `milano_leads` dovrebbe apparire in "Table Editor"
- I leads inizieranno a essere salvati automaticamente dal scraper

## 📊 Dashboard:
- URL: `http://localhost:3004/milano`
- Mostrerà i leads raccolti in tempo reale