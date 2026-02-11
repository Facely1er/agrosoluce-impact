# Environment Variables Configuration

This document describes all environment variables required for AgroSoluce.

## Required Environment Variables

### Supabase Configuration

```bash
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (public, safe for client-side)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Database Schema (default: agrosoluce)
VITE_SUPABASE_SCHEMA=agrosoluce
```

## Setup Instructions

### Local Development

1. Copy this template to `.env.local`:
   ```bash
   cp ENV_VARIABLES.md .env.local
   ```

2. Fill in your Supabase credentials:
   - Get `VITE_SUPABASE_URL` from your Supabase project settings
   - Get `VITE_SUPABASE_ANON_KEY` from your Supabase project API settings
   - Set `VITE_SUPABASE_SCHEMA=agrosoluce` (default schema)

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - `VITE_SUPABASE_URL` (Production, Preview, Development)
   - `VITE_SUPABASE_ANON_KEY` (Production, Preview, Development)
   - `VITE_SUPABASE_SCHEMA` (Production, Preview, Development) = `agrosoluce`

4. Redeploy your application

### Production (Other Platforms)

Set the environment variables in your hosting platform's configuration:
- **Netlify**: Site settings → Environment variables
- **Railway**: Project settings → Variables
- **Render**: Environment → Environment Variables

## Security Notes

- ✅ `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code (it's public)
- ✅ `VITE_SUPABASE_URL` is safe to expose (it's public)
- ❌ Never commit `.env.local` or `.env` files to version control
- ❌ Never expose service role keys or admin credentials

## Verification

After setting environment variables, verify they're loaded:

1. Check browser console (development mode) for Supabase initialization logs
2. Test database connection by loading any page that uses Supabase
3. Check Vercel deployment logs for environment variable errors

## Troubleshooting

### "Supabase not configured" errors

- Verify environment variables are set correctly
- Check variable names match exactly (case-sensitive)
- Restart development server after adding variables
- Clear browser cache and reload

### Database connection issues

- Verify `VITE_SUPABASE_URL` is correct (no trailing slash)
- Verify `VITE_SUPABASE_ANON_KEY` is the anon/public key (not service role)
- Check Supabase project is active and not paused
- Verify RLS policies allow access for authenticated/anonymous users

