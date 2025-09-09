# 🔧 Vercel Environment Variables Setup Guide

## ❌ **Common Issue: Build fails due to missing environment variables**

### **📋 Required Environment Variables**

You need to add these **EXACT** variables to Vercel:

| Variable Name | Where to Find Value | Example |
|---------------|-------------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | `https://abcdefghijklmn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | Your domain | `https://pro.budgetcasa.it` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics (optional) | `G-XXXXXXXXXX` |

---

## **🎯 Step-by-Step Setup**

### **Step 1: Get Supabase Values**

1. **Go to:** https://supabase.com/dashboard
2. **Select your BudgetCasa Pro project**
3. **Click:** Settings → API
4. **Copy these values:**
   - **Project URL** (for NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)  
   - **service_role** key (for SUPABASE_SERVICE_ROLE_KEY) ⚠️ **Keep this secret!**

### **Step 2: Add to Vercel**

1. **Go to:** https://vercel.com/mirco-zurlos-projects/[YOUR_PROJECT_NAME]/settings/environment-variables
2. **For each variable, click "Add New":**

#### **Variable 1:**
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://YOUR_PROJECT_REF.supabase.co` (from Step 1)
- **Environment:** Production ✅

#### **Variable 2:**
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- **Value:** Your anon key from Supabase (starts with `eyJhbGci...`)
- **Environment:** Production ✅

#### **Variable 3:**
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your service role key from Supabase (starts with `eyJhbGci...`)
- **Environment:** Production ✅

#### **Variable 4:**
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://pro.budgetcasa.it`
- **Environment:** Production ✅

#### **Variable 5 (Optional):**
- **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Value:** `G-XXXXXXXXXX` (if you have Google Analytics)
- **Environment:** Production ✅

### **Step 3: Verify Configuration**

After adding all variables, you should see:
```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY  
✅ NEXT_PUBLIC_APP_URL
✅ NEXT_PUBLIC_GA_MEASUREMENT_ID (optional)
```

### **Step 4: Redeploy**

1. **Go to:** Deployments tab
2. **Click:** "..." on latest deployment
3. **Click:** "Redeploy"

---

## **🔍 Troubleshooting**

### **❌ "Invalid supabaseUrl" Error**
- Check that `NEXT_PUBLIC_SUPABASE_URL` is a valid HTTPS URL
- Should look like: `https://abcdefg.supabase.co`
- **NOT:** `supabase.co` or `http://...`

### **❌ "API key required" Error**
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Should be a long JWT token starting with `eyJhbGci...`
- **NOT:** empty or placeholder value

### **❌ Still failing?**
- Make sure variables are set for **Production** environment
- Variable names are **EXACT** (case-sensitive)
- No extra spaces in values
- Click "Save" after each variable

---

## **📸 Screenshot Checklist**

When configuring, verify:
1. ✅ All 5 variables are visible in the Environment Variables list
2. ✅ Each variable shows "Production" environment
3. ✅ Values are not empty or placeholder text
4. ✅ No typos in variable names

**After setup, trigger a new deployment and it should succeed! 🎉**