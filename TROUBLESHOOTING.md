# 🔧 Login Troubleshooting Guide

## Common Issues & Solutions

### ❌ Issue 1: "Invalid login credentials" Error

**Cause**: The user doesn't exist yet or password is wrong.

**Solution**:
1. Make sure you **registered first** at `/register`
2. Use the exact same email and password you registered with
3. Password must be at least 6 characters

---

### ❌ Issue 2: Database Schema Not Set Up

**Cause**: The `profiles` table doesn't exist in Supabase.

**Solution**: Run the database schema in Supabase SQL Editor

**Step-by-step:**

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv)
2. Click **SQL Editor** in the left sidebar (looks like `<>`)
3. Click **New query**
4. Copy the ENTIRE content from `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

**Verify it worked:**
- Click **Table Editor** in sidebar
- You should see tables: `profiles`, `customers`, `invoices`, `invoice_items`

---

### ❌ Issue 3: Email Confirmation Required

**Cause**: Supabase requires email verification by default.

**Solution**: Disable email confirmation

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv)
2. Click **Authentication** → **Settings**
3. Scroll down to **Email Auth**
4. Find "Enable email confirmations"
5. **Toggle it OFF**
6. Click **Save**

---

### ❌ Issue 4: User Already Exists

**Cause**: You're trying to register with an email that's already used.

**Solution**: Either login with that email, or delete the user

**To delete user:**
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find the user
3. Click the **...** menu → **Delete user**
4. Try registering again

---

### ❌ Issue 5: Stuck on Login Page After Login

**Cause**: Middleware not redirecting properly.

**Solution**: Check browser console for errors

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try logging in again
4. Look for red error messages
5. Share the error message

---

## 🧪 Step-by-Step Test

### Step 1: Check Database Setup
1. Go to [Supabase Table Editor](https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv/editor)
2. Do you see these tables?
   - ✅ profiles
   - ✅ customers
   - ✅ invoices
   - ✅ invoice_items

**If NO**: Run `supabase-schema.sql` in SQL Editor (see Issue 2 above)

### Step 2: Disable Email Confirmation
1. Go to [Supabase Auth Settings](https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv/auth/settings)
2. Turn OFF "Enable email confirmations"
3. Click Save

### Step 3: Register a New Account
1. Go to http://localhost:3000/register
2. Enter:
   - Email: `test@example.com`
   - Password: `test123456`
   - Confirm: `test123456`
3. Click **ลงทะเบียน** (Register)

**Expected result**: You should be redirected to `/dashboard`

**If it fails**:
- Open browser console (F12)
- Look for error messages
- Check the **Network** tab for failed requests

### Step 4: Try Logging In
1. If you were logged in, click **ออกจากระบบ** (Logout)
2. Go to http://localhost:3000/login
3. Enter:
   - Email: `test@example.com`
   - Password: `test123456`
4. Click **เข้าสู่ระบบ** (Login)

**Expected result**: Redirected to `/dashboard`

---

## 🔍 Debug Checklist

Before asking for help, check these:

- [ ] Database schema is set up (see tables in Supabase)
- [ ] Email confirmation is disabled
- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal
- [ ] No errors in browser console (F12)
- [ ] Environment variables are set correctly in `.env.local`
- [ ] You registered BEFORE trying to login
- [ ] Using the same email/password you registered with

---

## 🆘 Still Not Working?

### Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try logging in
4. Look for errors (red text)
5. Take a screenshot and share it

### Check Network Tab
1. Press **F12** to open DevTools
2. Go to **Network** tab
3. Try logging in
4. Look for failed requests (red)
5. Click on the failed request
6. Look at the **Response** tab
7. Share the error message

### Check Supabase Auth Logs
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv)
2. Click **Authentication** → **Users**
3. Do you see your user account?
4. Click **Logs** tab
5. Look for authentication events

---

## 💡 Most Common Solution

**90% of login issues are caused by:**

1. **Not running the database schema** → Run `supabase-schema.sql`
2. **Email confirmation enabled** → Disable it in Supabase settings
3. **Trying to login before registering** → Register first!

---

## 📞 Quick Fix Commands

If all else fails, try this:

1. **Delete everything and start fresh:**
   ```
   # In Supabase SQL Editor, run:
   DROP TABLE IF EXISTS invoice_items CASCADE;
   DROP TABLE IF EXISTS invoices CASCADE;
   DROP TABLE IF EXISTS customers CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```

2. **Then run the schema again:**
   - Copy content from `supabase-schema.sql`
   - Paste in SQL Editor
   - Click Run

3. **Register a new account:**
   - Go to http://localhost:3000/register
   - Create fresh account

---

## 🎯 What Error Are You Seeing?

Tell me which error you're getting:

1. **"Invalid login credentials"** → User doesn't exist, register first
2. **"Invalid supabaseUrl"** → Environment variables issue (we fixed this)
3. **Page just refreshes** → Check browser console for errors
4. **Stuck on login page** → Middleware issue, check console
5. **"Email not confirmed"** → Disable email confirmation in Supabase
6. **Other error** → Share the error message

---

**Let me know what you see and I'll help you fix it!** 🚀
