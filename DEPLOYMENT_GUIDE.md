# 🚀 BudgetCasa Pro - Complete Deployment Guide

## 📋 **Pre-Deployment Checklist**

- [ ] Supabase account created
- [ ] Google Cloud Console project created
- [ ] Vercel account created
- [ ] Domain `pro.budgetcasa.it` DNS access

---

## **Step 1: 🗄️ Database Setup**

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. **Create New Project:**
   - **Name:** `budgetcasa-pro`
   - **Region:** `Europe West (Frankfurt)`
   - **Password:** Generate strong password (SAVE IT!)

3. **Copy Project Credentials:**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiI...
   Service Role Key: eyJhbGciOiJIUzI1NiI... (SECRET!)
   ```

### 1.2 Run Database Migrations

**In Supabase Dashboard → SQL Editor:**

1. **Run Step 1:** Copy entire contents of `setup_database_step1.sql` → Paste → Run
2. **Run Step 2:** Copy entire contents of `setup_database_step2.sql` → Paste → Run  
3. **Run Step 3:** Copy entire contents of `setup_database_step3_seed.sql` → Paste → Run

✅ **Verify:** Check Tables panel - should see 15+ tables created

---

## **Step 2: 🔐 Google OAuth Setup**

### 2.1 Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Create Project:** "BudgetCasa Pro"
3. **Enable APIs:**
   - Google+ API
   - People API

4. **Create OAuth Credentials:**
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application Type: **Web application**
   - Name: "BudgetCasa Pro Auth"

5. **Authorized Redirect URIs:**
   ```
   https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
   ```

6. **Copy Credentials:**
   - Client ID: `123456789-abc.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xyz123...`

### 2.2 Configure Supabase Auth

1. **Supabase Dashboard → Authentication → Providers**
2. **Enable Google Provider**
3. **Paste Google Credentials:**
   - Client ID: (from above)
   - Client Secret: (from above)

---

## **Step 3: 🌐 Deploy to Vercel**

### 3.1 Initial Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
cd budgetcasa-pro
vercel --prod
```

### 3.2 Configure Environment Variables

**In Vercel Dashboard → Project → Settings → Environment Variables:**

Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_REF.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://pro.budgetcasa.it` | Production |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production |

### 3.3 Redeploy with Environment Variables

```bash
vercel --prod
```

---

## **Step 4: 🔗 Custom Domain Setup**

### 4.1 Add Domain to Vercel

1. **Vercel Dashboard → Project → Settings → Domains**
2. **Add Domain:** `pro.budgetcasa.it`
3. **Copy DNS Records** provided by Vercel

### 4.2 Configure DNS

**In your DNS provider (Cloudflare, etc.):**

Add these records:
```
Type: CNAME
Name: pro
Value: cname.vercel-dns.com
TTL: Auto
```

**Wait for propagation (5-10 minutes)**

### 4.3 Verify Domain

✅ **Test:** Visit `https://pro.budgetcasa.it` - should load!

---

## **Step 5: 🔧 Edge Functions Deployment**

### Option A: Manual Edge Function Creation (Recommended)

**In Supabase Dashboard → Edge Functions:**

#### 5.1 Create `search-persons` function:
```typescript
// Copy contents from supabase/functions/search-persons/index.ts
// Create new function → Paste code → Deploy
```

#### 5.2 Create `search-companies` function:
```typescript
// Copy contents from supabase/functions/search-companies/index.ts
// Create new function → Paste code → Deploy
```

#### 5.3 Create `lead-suggest` function:
```typescript  
// Copy contents from supabase/functions/lead-suggest/index.ts
// Create new function → Paste code → Deploy
```

#### 5.4 Create `export-csv` function:
```typescript
// Copy contents from supabase/functions/export-csv/index.ts
// Create new function → Paste code → Deploy
```

### Option B: CLI Deployment (If CLI works)

```bash
# If Supabase CLI is installed
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy search-persons
supabase functions deploy search-companies  
supabase functions deploy lead-suggest
supabase functions deploy export-csv
```

---

## **Step 6: 👥 User Access Setup**

### 6.1 First User Setup

1. **Visit:** `https://pro.budgetcasa.it`
2. **Click "Sign in with Google"**
3. **Complete OAuth flow**

### 6.2 Add User to Demo Organization

**In Supabase Dashboard → Table Editor:**

1. **Find your user ID:**
   - Go to `auth.users` table
   - Copy your `id` (UUID)

2. **Add to org_members:**
   ```sql
   INSERT INTO org_members (org_id, user_id, role) VALUES 
   ('11111111-1111-1111-1111-111111111111', 'YOUR_USER_ID_HERE', 'admin');
   ```

---

## **Step 7: ✅ Production Testing**

### 7.1 Functionality Tests

- [ ] **Authentication:** Google login works
- [ ] **Dashboard:** Loads with sample data
- [ ] **Person Search:** Returns sample leads
- [ ] **Company Search:** Returns sample companies
- [ ] **AI Suggestions:** Shows policy recommendations
- [ ] **Lists:** Can create and manage lists
- [ ] **CSV Export:** Downloads working

### 7.2 Performance Tests

- [ ] **Page Load:** < 3 seconds
- [ ] **Search Response:** < 2 seconds
- [ ] **Mobile Responsive:** Works on phone
- [ ] **Error Handling:** Graceful failures

---

## **Step 8: 📊 Analytics Setup (Optional)**

### 8.1 Google Analytics 4

1. **Create GA4 Property**
2. **Copy Measurement ID:** `G-XXXXXXXXXX`
3. **Add to Vercel Environment Variables**
4. **Redeploy**

### 8.2 Verify Tracking

- Visit site in private browser
- Check GA4 Real-time reports
- Should see events firing

---

## **🎯 Production URLs**

After successful deployment:

- **App:** `https://pro.budgetcasa.it`
- **Supabase Dashboard:** `https://supabase.com/dashboard/project/YOUR_REF`
- **Vercel Dashboard:** `https://vercel.com/dashboard`

---

## **🆘 Troubleshooting**

### Common Issues:

**❌ "Network Error" on login**
- Check Google OAuth redirect URI
- Verify Supabase auth provider is enabled

**❌ "No data found" on search**
- Verify database migrations ran successfully
- Check RLS policies are active
- Confirm user is in org_members table

**❌ Edge Functions not responding**
- Check function logs in Supabase Dashboard
- Verify service role key is correct
- Test functions individually

**❌ Domain not working**
- Check DNS propagation: `dig pro.budgetcasa.it`
- Verify CNAME record points to Vercel
- Wait up to 24h for full propagation

---

## **🔒 Security Checklist**

- [ ] Service role key is secret (not in frontend)
- [ ] RLS policies are enabled and tested
- [ ] Google OAuth only allows intended domains
- [ ] HTTPS enforced on all endpoints
- [ ] Environment variables properly set

---

## **📞 Support**

If you encounter issues:

1. Check Supabase function logs
2. Check Vercel deployment logs  
3. Test each component individually
4. Verify all environment variables are set

**The platform is now ready for production use! 🎉**