# 🔍 Google OAuth Authentication Debug Guide

## 🚨 **Current Issue: "Accedi con Google" loads infinitely**

### **📋 Checklist to Fix Google OAuth**

### **Step 1: Update Google Cloud Console**

1. **Go to:** https://console.cloud.google.com
2. **Select your project** (or the one used for budgetcasa.it B2C)
3. **APIs & Services → Credentials**
4. **Find your OAuth 2.0 Client ID**

### **Step 2: Update Authorized Redirect URIs**

**Add these EXACT URIs to your Google OAuth client:**

```
https://pro.budgetcasa.it/auth/callback
https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
```

**Replace `YOUR_SUPABASE_REF` with your actual Supabase project reference**

### **Step 3: Update Supabase Auth Configuration**

1. **Go to:** https://supabase.com/dashboard
2. **Select BudgetCasa Pro project**
3. **Authentication → Providers → Google**

**Configure these settings:**
- ✅ **Enabled:** ON
- ✅ **Client ID:** (from Google Cloud Console)  
- ✅ **Client Secret:** (from Google Cloud Console)

### **Step 4: Update Supabase Auth URLs**

**In Authentication → URL Configuration:**

- **Site URL:** `https://pro.budgetcasa.it`
- **Redirect URLs:** Add these:
  ```
  https://pro.budgetcasa.it/**
  https://pro.budgetcasa.it/dashboard
  https://pro.budgetcasa.it/auth/callback
  ```

### **Step 5: Check Environment Variables**

**Verify in Vercel Dashboard → Environment Variables:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://YOUR_REF.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
- ✅ `NEXT_PUBLIC_APP_URL` = `https://pro.budgetcasa.it`

---

## 🔧 **Common Issues & Fixes**

### **❌ Issue 1: Wrong Redirect URI**
**Problem:** Google OAuth redirects to wrong URL
**Fix:** Add `https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback` to Google Console

### **❌ Issue 2: CORS Error**  
**Problem:** Browser blocks cross-origin request
**Fix:** Ensure Site URL matches your domain exactly

### **❌ Issue 3: Infinite Loading**
**Problem:** Callback URL not configured
**Fix:** Add all redirect URLs to both Google and Supabase

### **❌ Issue 4: "Error 400: redirect_uri_mismatch"**
**Problem:** Google doesn't recognize the callback URL
**Fix:** Copy exact URL from error and add to Google Console

---

## 📱 **Debug Steps**

### **Step 1: Check Browser Console**
1. **Open Developer Tools** (F12)
2. **Go to Console tab** 
3. **Click "Accedi con Google"**
4. **Look for errors** - copy any error messages

### **Step 2: Check Network Tab**
1. **Open Network tab** in Developer Tools
2. **Click "Accedi con Google"**
3. **Look for failed requests** (red status codes)
4. **Check if redirect URLs are correct**

### **Step 3: Test OAuth Flow**
1. **Start authentication**
2. **Check what URL it redirects to**
3. **Verify it matches your configured redirect URI**

---

## ✅ **Expected Flow**

1. **Click "Accedi con Google"** → Redirects to Google OAuth
2. **Google login page** → User enters credentials  
3. **Google redirects back** → `https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback`
4. **Supabase processes** → Redirects to `https://pro.budgetcasa.it/dashboard`
5. **User is authenticated** → Shows dashboard

---

**Check these configurations and let me know what specific error you see in the browser console! 🎯**