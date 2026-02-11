# 🗄️ AgroSoluce Database Migration Guide

This guide explains how to run database migrations for the AgroSoluce marketplace platform.

## 📋 Overview

The AgroSoluce database uses the `agrosoluce` schema in Supabase to avoid conflicts with other projects. There are 6 migration files that need to be executed in order:

1. `001_initial_schema_setup.sql` - Creates the base schema, tables, and RLS policies
2. `002_add_farmers_table.sql` - Adds farmers/producers table
3. `003_add_traceability_tables.sql` - Adds batch tracking and traceability tables
4. `004_add_compliance_tables.sql` - Adds compliance and certification tables
5. `005_add_evidence_tables.sql` - Adds evidence, audits, and attestation tables
6. `006_add_logistics_tables.sql` - Adds shipping and logistics tables

## 🚀 Quick Start

### Option 1: Automated (Recommended)

1. **Generate combined SQL file:**
   ```bash
   npm run migrate:generate
   ```
   This creates `database/migrations/ALL_MIGRATIONS.sql` with all migrations combined.

2. **Run migrations in Supabase:**
   - Open your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Open `database/migrations/ALL_MIGRATIONS.sql`
   - Copy all contents and paste into SQL Editor
   - Click **Run** to execute

3. **Verify migrations:**
   ```bash
   npm run migrate:check
   ```

### Option 2: PowerShell Script (Windows)

```powershell
npm run migrate:run
```

This will:
- Generate the combined SQL file
- Provide step-by-step instructions
- Optionally check migration status

### Option 3: Manual Execution

1. **Execute each migration file individually:**
   - Open Supabase SQL Editor
   - Execute each file from `database/migrations/` in order:
     - `001_initial_schema_setup.sql`
     - `002_add_farmers_table.sql`
     - `003_add_traceability_tables.sql`
     - `004_add_compliance_tables.sql`
     - `005_add_evidence_tables.sql`
     - `006_add_logistics_tables.sql`

2. **Verify execution:**
   ```sql
   SELECT * FROM agrosoluce.migrations ORDER BY executed_at;
   ```

## 📝 Migration Scripts

### Available NPM Scripts

```bash
# Generate combined SQL file
npm run migrate:generate

# Check migration status (requires database connection)
npm run migrate:check

# Run PowerShell helper script (Windows)
npm run migrate:run

# Migrate cooperative data from JSON to database
npm run migrate:data
```

### Manual Script Execution

```bash
# Generate combined SQL
npx tsx scripts/run-migrations.ts --generate

# Check status
npx tsx scripts/run-migrations.ts --check
```

## 🔍 Verifying Migrations

### Check Migration Status

After running migrations, verify they were executed:

```bash
npm run migrate:check
```

Or manually in Supabase SQL Editor:

```sql
SELECT 
    migration_name,
    executed_at,
    description
FROM agrosoluce.migrations
ORDER BY executed_at;
```

### Expected Output

You should see all 6 migrations listed:
- ✅ `001_initial_schema_setup`
- ✅ `002_add_farmers_table`
- ✅ `003_add_traceability_tables`
- ✅ `004_add_compliance_tables`
- ✅ `005_add_evidence_tables`
- ✅ `006_add_logistics_tables`

## 🗂️ Schema Structure

After migrations, the following tables will be created in the `agrosoluce` schema:

### Core Tables
- `migrations` - Migration tracking
- `user_profiles` - User account information
- `cooperatives` - Cooperative organizations
- `products` - Product listings
- `product_categories` - Product categories
- `orders` - Order records
- `order_items` - Order line items
- `messages` - User messages

### Producer Registry
- `farmers` - Individual farmers/producers

### Traceability
- `batches` - Product batches with origin tracking
- `batch_transactions` - Traceability chain

### Compliance
- `certifications` - Certifications (organic, fair trade, etc.)
- `eudr_verifications` - EUDR compliance verifications
- `compliance_requirements` - Regulatory requirements

### Evidence
- `field_declarations` - Field declarations
- `audits` - Audit records
- `attestations` - Attestations and declarations

### Logistics
- `shipping_records` - Shipping records
- `shipping_tracking_events` - Shipping tracking events

## ⚙️ Environment Variables

Ensure these environment variables are set:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SCHEMA=agrosoluce
```

For migration checking, you can also use:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- **Public read access** for cooperatives and products
- **Authenticated users** can manage their own data
- **Cooperative owners** can manage their cooperative data
- **Admins** have full access

## 🐛 Troubleshooting

### Migration Fails with "schema does not exist"

The first migration should create the schema. If it fails:
1. Manually create the schema in Supabase SQL Editor:
   ```sql
   CREATE SCHEMA IF NOT EXISTS agrosoluce;
   ```
2. Then re-run the migrations

### Migration Already Executed Error

If a migration shows as already executed but you want to re-run:
1. Check the `agrosoluce.migrations` table
2. Remove the migration record if needed:
   ```sql
   DELETE FROM agrosoluce.migrations WHERE migration_name = '001_initial_schema_setup';
   ```
3. **Warning:** Only do this if you understand the implications. Re-running migrations on existing data can cause errors.

### Permission Denied Errors

If you get permission errors:
1. Ensure you're using the correct Supabase project
2. Check that your API key has the necessary permissions
3. For schema creation, you may need to use the Supabase dashboard SQL Editor directly

### Migration Status Check Fails

If `migrate:check` fails:
- The migrations table might not exist (migrations haven't been run)
- Database connection issue
- Environment variables not set correctly

## 📊 After Migrations

Once migrations are complete:

1. **Migrate cooperative data:**
   ```bash
   npm run migrate:data
   ```
   This migrates data from `public/cooperatives_cote_ivoire.json` to the database.

2. **Verify data:**
   ```sql
   SELECT COUNT(*) FROM agrosoluce.cooperatives;
   ```

3. **Test the application:**
   - Start the dev server: `npm run dev`
   - Verify cooperatives load from database
   - Test search and filtering features

## 🔄 Migration Order

**Important:** Migrations must be run in order because:
- Migration 001 creates the base schema and tables
- Migration 002 adds farmers table (references cooperatives)
- Migration 003 adds batches (references farmers and products)
- Migration 004 adds compliance (references batches)
- Migration 005 adds evidence (references cooperatives and farmers)
- Migration 006 adds logistics (references orders)

## 📚 Additional Resources

- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/tables)
- [Row Level Security Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Migration Script README](./scripts/README.md)

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Combined SQL file generated (`npm run migrate:generate`)
- [ ] Migrations executed in Supabase SQL Editor
- [ ] Migration status verified (`npm run migrate:check`)
- [ ] All 6 migrations show as executed
- [ ] Cooperative data migrated (`npm run migrate:data`)
- [ ] Application tested with database

---

**Last Updated:** 2025-12-06  
**Status:** ✅ Ready for Migration

