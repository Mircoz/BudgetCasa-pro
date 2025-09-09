# 🔍 How to Get Vercel Deployment Logs

## 📋 **Steps to Get Error Details**

1. **Go to Vercel Dashboard:**
   - https://vercel.com/mirco-zurlos-projects/[YOUR_PROJECT_NAME]

2. **Click on the Failed Deployment:**
   - Look for the red ❌ deployment
   - Click on it

3. **Check These Sections:**
   
   ### **Build Logs Tab:**
   - Look for red error messages
   - Copy the complete error stack trace
   
   ### **Function Logs Tab:**
   - Check for runtime errors
   - Look for specific error messages

4. **Look for These Common Errors:**

   ```
   ❌ "Command failed with exit code 1"
   ❌ "Build failed with error:"
   ❌ "TypeError: Cannot read properties"
   ❌ "Module not found"
   ❌ "Invalid supabaseUrl"
   ❌ "Network error"
   ```

5. **Copy the EXACT Error Message:**
   - Include the full stack trace
   - Include line numbers if shown
   - Include file paths mentioned

## 📱 **What to Send Me:**

Please copy and paste:

1. **The main error message** (in red)
2. **The stack trace** (the lines showing file paths and line numbers)  
3. **Which phase failed** (Build, Deploy, Function)
4. **Any warnings** that appear before the error

## 🔧 **Common Fixes Based on Error Type:**

- **Build Error:** Code/configuration issue
- **Deploy Error:** Environment variables issue  
- **Function Error:** Runtime/API issue
- **Network Error:** Supabase connection issue

**Please share the exact error message and I can provide the specific fix! 🎯**