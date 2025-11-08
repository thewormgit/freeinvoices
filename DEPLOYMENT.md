# InvoiceThai - Vercel Deployment Guide

## Quick Deploy (Recommended)

### Method 1: Deploy via Vercel Dashboard (Easiest - 5 minutes)

1. **Visit Vercel**: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Repository**:
   - Click "Import Git Repository"
   - Search for: `freeinvoices`
   - Select branch: `claude/init-project-011CUdYUeVhBRoSMAT4uc6uM`

3. **Configure Environment Variables** (CRITICAL):
   Click "Environment Variables" and add:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://vtcpvvzlxpqwmnjvvldv.supabase.co

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [Get from https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv/settings/api]
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

---

### Method 2: Deploy via Vercel CLI

If you prefer command line:

```bash
# 1. Login to Vercel (opens browser for authentication)
vercel login

# 2. Deploy to production
vercel --prod

# 3. When prompted for environment variables, enter:
# NEXT_PUBLIC_SUPABASE_URL=https://vtcpvvzlxpqwmnjvvldv.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

---

## Getting Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/vtcpvvzlxpqwmnjvvldv/settings/api
2. Look for "Project API keys"
3. Copy the **anon/public** key (starts with `eyJ...`)
4. This key is safe to use in the browser (it's public)

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test login
- [ ] Create a test customer (verify Tax ID validation)
- [ ] Create a test invoice (verify form validation)
- [ ] Update profile (verify PromptPay validation)

---

## Troubleshooting

### Build Fails with PDF Errors

The app has PDF generation dependencies that are optional. To fix:

```bash
npm install pdfmake
git add package.json package-lock.json
git commit -m "Add pdfmake dependency"
git push
```

Then redeploy on Vercel (auto-deploys on push).

### Environment Variables Not Working

- Ensure both variables start with `NEXT_PUBLIC_`
- Values should have NO quotes around them
- After adding variables, trigger a redeploy

### Database Connection Issues

- Verify Supabase schema is initialized (run `supabase-schema.sql`)
- Check RLS policies are enabled
- Verify the anon key is correct

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to: Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `invoicethai.com`)
3. Update DNS records as instructed by Vercel

---

## Monitoring

- **Vercel Dashboard**: View deployment logs and analytics
- **Supabase Dashboard**: Monitor database queries and auth
- **Logs**: Check Vercel Functions logs for any errors

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

Generated: 2025-11-08
Project: InvoiceThai SaaS Application
