# Environment Variables Setup

## Quick Setup

Create a `.env` file in the root directory with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8
VITE_SUPABASE_SCHEMA=agrosoluce

# PostgreSQL Connection (for migrations and scripts)
DATABASE_URL=postgresql://postgres:K1551d0ug0u@db.nuwfdvwqiynzhbbsqagw.supabase.co:5432/postgres
SUPABASE_DB_PASSWORD=K1551d0ug0u
SUPABASE_DB_HOST=db.nuwfdvwqiynzhbbsqagw.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_ENVIRONMENT=development
```

## Verification

After creating the `.env` file:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check if Supabase connection works by opening the app in browser and checking console logs.

3. Run migration check:
   ```bash
   npm run migrate:check
   ```

## Running Migrations

Since Supabase doesn't allow direct SQL execution via API, you need to run migrations in the Supabase SQL Editor:

1. Generate combined migration file:
   ```bash
   npm run migrate:generate
   ```

2. Open Supabase Dashboard:
   - Go to: https://supabase.com/dashboard/project/nuwfdvwqiynzhbbsqagw
   - Navigate to SQL Editor

3. Copy and execute:
   - Open `database/migrations/ALL_MIGRATIONS.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Click "Run" to execute

4. Verify migrations:
   ```bash
   npm run migrate:check
   ```

## Important Notes

- The `.env` file is in `.gitignore` and will not be committed to git
- Never commit credentials to version control
- For production deployments (Vercel), add these as environment variables in the Vercel dashboard

