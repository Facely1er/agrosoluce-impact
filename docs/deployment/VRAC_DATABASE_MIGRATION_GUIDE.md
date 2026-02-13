# VRAC Database Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the VRAC (Pharmacy Surveillance) data to your Supabase database. The VRAC system tracks antimalarial sales as a proxy for workforce health in Côte d'Ivoire cocoa regions.

## Prerequisites

- Supabase account with admin access
- Database credentials (provided in `.env` file)
- Processed VRAC data (`apps/web/public/data/vrac/processed.json`)
- Node.js >= 18.0.0 installed

## Database Schema

The VRAC system requires the following tables in the `agrosoluce` schema:

### 1. `pharmacy_profiles`
Stores pharmacy location metadata
- 4 pharmacies: Tanda, Prolife, Olympique, Attobrou
- Regions: Gontougo (cocoa), La Mé (cocoa), Abidjan (urban)

### 2. `vrac_product_sales`
Individual product sales records from pharmacy surveillance
- ~10,000+ records across all periods
- Product codes, designations, quantities, prices

### 3. `vrac_period_aggregates`
Pre-calculated period aggregates for performance
- 8 periods (Aug-Dec for multiple years)
- Antimalarial, antibiotic, and analgesic totals
- Antimalarial share calculations

### 4. `vrac_regional_health_index`
Regional health metrics based on antimalarial sales
- Health index by pharmacy and period
- Used for trend analysis and visualizations

## Migration Steps

### Option 1: Run Complete Schema (Recommended for New Databases)

If you're setting up a new Supabase database:

```bash
# 1. Apply all migrations including VRAC tables
psql postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres \
  -f packages/database/migrations/ALL_MIGRATIONS.sql
```

### Option 2: Run VRAC Migration Only (For Existing Databases)

If you already have the base schema and only need VRAC tables:

```bash
# 1. Apply VRAC tables migration
psql postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres \
  -f packages/database/migrations/022_create_vrac_tables.sql
```

### Option 3: Using Supabase SQL Editor (Web Interface)

1. Log into your Supabase dashboard at https://supabase.com/dashboard
2. Navigate to your project
3. Go to the **SQL Editor** section
4. Open a new query
5. Copy and paste the contents of `packages/database/migrations/022_create_vrac_tables.sql`
6. Click **Run** to execute the SQL

### Step 2: Migrate VRAC Data

After the schema is in place, migrate the processed VRAC data:

```bash
# Ensure environment variables are set
export VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
export VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Run the migration script
npm run vrac:migrate
```

**Expected Output:**
```
============================================================
VRAC Data Migration to Supabase
============================================================
Connecting to Supabase: https://nuwfdvwqiynzhbbsqagw.s...
Loading data from: .../apps/web/public/data/vrac/processed.json
Loaded 8 periods

=== Inserting Pharmacy Profiles ===
✓ Pharmacy profile: Grande Pharmacie de Tanda
✓ Pharmacy profile: Pharmacie Prolife
✓ Pharmacy profile: Pharmacie Olympique
✓ Pharmacy profile: Pharmacie Attobrou

=== Inserting Product Sales ===
Processing prolife - Aug–Dec 2025 (2025): 1234 products
✓ Inserted 1234 products
...
Total products inserted: ~10,000

=== Calculating Period Aggregates ===
✓ prolife 2025: Total=5000, Antimalarial=1200 (24.00%)
...
Total aggregates inserted: 8

=== Calculating Regional Health Index ===
✓ prolife Aug–Dec 2025: Antimalarial share=24.00%
...
Total health index records inserted: 8

============================================================
✅ Migration completed successfully!
============================================================

Migrated 8 pharmacy periods
- Pharmacy profiles: 4
- Product sales records: ~10,000
- Period aggregates: 8
- Health index records: 8
```

## Verification

After migration, verify the data in your database:

### Using SQL Editor

```sql
-- Check pharmacy profiles
SELECT * FROM agrosoluce.pharmacy_profiles;
-- Expected: 4 rows

-- Check product sales count
SELECT COUNT(*) FROM agrosoluce.vrac_product_sales;
-- Expected: ~10,000+ rows

-- Check period aggregates
SELECT * FROM agrosoluce.vrac_period_aggregates ORDER BY year DESC, period_label;
-- Expected: 8 rows

-- Check health index
SELECT * FROM agrosoluce.vrac_regional_health_index ORDER BY year DESC, period_label;
-- Expected: 8 rows

-- Verify antimalarial share calculations
SELECT 
  pharmacy_id,
  period_label,
  year,
  antimalarial_quantity,
  total_quantity,
  ROUND(antimalarial_share * 100, 2) as antimalarial_pct
FROM agrosoluce.vrac_period_aggregates
ORDER BY year DESC, period_label;
```

### Using the Application

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:5173/vrac
3. Verify the following:
   - Pharmacy data loads without errors
   - Charts display antimalarial trends
   - Filter by year and pharmacy works
   - CSV/JSON export functions work
   - Data shows for all 4 pharmacies across multiple years

## Troubleshooting

### Connection Errors

If you see `ENOTFOUND` or connection errors:
- Verify your Supabase URL is correct
- Check that your network allows connections to Supabase
- Ensure the anon key is valid and not expired

### Schema Errors

If you see "relation does not exist" errors:
- Run the schema migration first (022_create_vrac_tables.sql)
- Verify the `agrosoluce` schema exists
- Check that Row Level Security policies are enabled

### Data Errors

If product categories aren't recognized:
- Verify `apps/web/src/data/vrac/productTaxonomy.ts` is accessible
- Check that product codes match the taxonomy rules
- Review the console for category classification warnings

### Performance Issues

If queries are slow:
- Ensure all indexes were created (check migration file)
- Verify aggregates table is populated
- Consider adding more indexes for your specific query patterns

## Data Processing

To reprocess VRAC data from raw CSV files:

```bash
# Process raw CSV/PDF data from VRAC directory
npm run vrac:process

# Process with enrichments (additional health calculations)
npm run vrac:process:enrich
```

This generates:
- `apps/web/public/data/vrac/processed.json` - Base processed data
- `apps/web/public/data/vrac/enriched.json` - With enrichments (optional)

## Security Considerations

1. **Environment Variables**: Never commit `.env` to git
2. **Credentials**: Store Supabase credentials securely
3. **RLS Policies**: VRAC tables have public read access (surveillance data is non-sensitive)
4. **Write Access**: Only admins should run migrations in production

## Data Updates

To update VRAC data with new periods:

1. Add new CSV files to the `VRAC/` directory
2. Update `packages/data-insights/src/sources/vrac/vracSource.ts` with new file mappings
3. Run `npm run vrac:process` to regenerate processed.json
4. Run `npm run vrac:migrate` to update the database

The migration script uses `UPSERT` operations, so it's safe to run multiple times.

## Support

For issues or questions:
- Check console logs for detailed error messages
- Review migration script: `scripts/vrac/migrateVracToSupabase.ts`
- Check schema definition: `packages/database/migrations/022_create_vrac_tables.sql`

---

**Last Updated**: 2026-02-13  
**Migration Version**: 022_create_vrac_tables  
**Status**: Ready for Production
