# 🔧 SUPABASE SQL SCRIPT EXECUTION INSTRUCTIONS

## 📝 STEP-BY-STEP PROCESS

### 1. Open Supabase Dashboard
- Go to https://supabase.com/dashboard
- Login with your account
- Select project: `dpqmcnrfgicsqvjvbrwu`

### 2. Navigate to SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **+ New Query** to create a new SQL script

### 3. Execute the SQL Script
- Copy the entire contents of `add-enrichment-columns.sql`
- Paste it into the SQL Editor
- Click **Run** to execute all statements

### 4. Verify Column Addition
After execution, verify the columns were added:
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'milano_leads' 
ORDER BY ordinal_position;
```

## ✅ EXPECTED RESULTS

The script will add these columns to `milano_leads`:

### Basic Columns:
- `contact_attempts` (INTEGER, default 0)
- `updated_at` (TIMESTAMP WITH TIME ZONE, default now())

### Enrichment Data:
- `partita_iva` (VARCHAR(11))
- `codice_fiscale` (VARCHAR(16))
- `settore` (VARCHAR(100))
- `dipendenti` (INTEGER)
- `fatturato_stimato` (INTEGER)
- `website` (VARCHAR(255))
- `linkedin_url` (VARCHAR(255))

### Enrichment Metadata:
- `enrichment_date` (TIMESTAMP WITH TIME ZONE)
- `enrichment_status` (VARCHAR(50))
- `phone_enriched` (VARCHAR(20))

### Enhanced Scoring:
- `enhanced_quality_score` (INTEGER)
- `revenue_opportunity` (INTEGER)
- `business_type` (VARCHAR(50))
- `zone_rating` (INTEGER)

### Activity Tracking:
- `assigned_agent_id` (UUID)
- `agent_notes` (TEXT)
- `last_contacted_at` (TIMESTAMP WITH TIME ZONE)
- `next_follow_up` (TIMESTAMP WITH TIME ZONE)

### B2C Correlation:
- `b2c_correlation_score` (INTEGER)
- `preferred_products` (TEXT[])

### Performance Features:
- Auto-update trigger for `updated_at`
- Optimized indexes for key columns
- Sample data initialization

## 🚨 IMPORTANT NOTES

1. **Backup First**: The script uses `ADD COLUMN IF NOT EXISTS` - safe for existing data
2. **Execution Time**: Should complete in under 30 seconds
3. **Row Level Security**: Existing RLS policies will remain intact
4. **Data Integrity**: No existing data will be lost or modified

## 📊 VERIFICATION QUERIES

After execution, run these to verify success:

```sql
-- Count leads with new columns
SELECT COUNT(*) as total_leads,
       COUNT(contact_attempts) as with_contact_attempts,
       COUNT(partita_iva) as with_partita_iva
FROM milano_leads;

-- Check trigger is working
UPDATE milano_leads SET contact_attempts = 1 WHERE id = (SELECT id FROM milano_leads LIMIT 1);
SELECT updated_at FROM milano_leads WHERE contact_attempts = 1;
```

## 🎯 NEXT STEPS

Once columns are added:
1. Run enhanced enrichment pipeline: `node src/scripts/enhanced-enrichment-pipeline.js`
2. Verify enriched data in dashboard: `http://localhost:3001/milano`
3. Check enrichment status: `node check-enriched-status.js`

---
*Execute this in Supabase SQL Editor for complete schema enhancement*