# ✅ AgroSoluce Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] Node.js 18+ installed
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Vercel account created
- [ ] Logged into Vercel CLI (`vercel login`)
- [ ] Supabase project created (if using database)
- [ ] Environment variables documented

## Vercel Setup

- [ ] Vercel project initialized (`vercel link` or `.\setup-vercel-project.ps1`)
- [ ] Project name configured
- [ ] Build settings verified in `vercel.json`

## Environment Variables

- [ ] `VITE_SUPABASE_URL` set in Vercel dashboard
- [ ] `VITE_SUPABASE_ANON_KEY` set in Vercel dashboard
- [ ] `VITE_SUPABASE_SCHEMA=agrosoluce` set in Vercel dashboard
- [ ] Environment variables set for Production
- [ ] Environment variables set for Preview
- [ ] Environment variables set for Development

## Deployment

- [ ] First deployment successful (`.\deploy-vercel.ps1` or `vercel --prod`)
- [ ] Deployment URL accessible
- [ ] Application loads correctly
- [ ] No console errors
- [ ] All features working (search, filters, map)

## Domain Configuration

- [ ] Custom domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] DNS propagation verified
- [ ] SSL certificate provisioned (automatic)
- [ ] `www.agrosoluce.com` accessible
- [ ] Root domain redirects correctly (if configured)

## Post-Deployment

- [ ] Analytics enabled (optional)
- [ ] Error monitoring set up (optional)
- [ ] Performance monitoring configured
- [ ] Git repository connected (for auto-deploy)
- [ ] Branch deployments configured (optional)

## Supabase Integration (Future)

- [ ] Database schema created in Supabase
- [ ] Tables created in `agrosoluce` schema
- [ ] Cooperative data migrated from JSON
- [ ] Application updated to use Supabase client
- [ ] Authentication configured (if needed)

## Documentation

- [ ] README.md updated
- [ ] Deployment guide reviewed
- [ ] Team members informed of deployment process

---

**Last Updated:** 2025-12-06
**Status:** Ready for deployment ✅

