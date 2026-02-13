# Quick Start: VRAC Database Migration

## Step 1: Apply Database Schema

### Option A: Using psql Command Line

```bash
# Replace with your actual connection string from .env
CONN_STRING="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"

# Apply VRAC tables migration
psql "$CONN_STRING" -f packages/database/migrations/022_create_vrac_tables.sql
```

### Option B: Using Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql (replace YOUR_PROJECT_ID with your Supabase project ID)
2. Click "New Query"
3. Copy and paste the entire content of: `packages/database/migrations/022_create_vrac_tables.sql`
4. Click "Run" (bottom right)
5. Verify success message

## Step 2: Migrate VRAC Data

```bash
# From project root
npm run vrac:migrate
```

**Expected output:**
- ✓ 4 pharmacy profiles inserted
- ✓ ~10,000 product sales records inserted
- ✓ 8 period aggregates inserted
- ✓ 8 health index records inserted

## Step 3: Verify Data

### Quick Verification Queries

```sql
-- Check pharmacy profiles (should return 4)
SELECT COUNT(*) FROM agrosoluce.pharmacy_profiles;

-- Check product sales (should return ~10,000+)
SELECT COUNT(*) FROM agrosoluce.vrac_product_sales;

-- Check aggregates (should return 8)
SELECT COUNT(*) FROM agrosoluce.vrac_period_aggregates;

-- View antimalarial trends
SELECT 
  pharmacy_id,
  period_label,
  year,
  ROUND(antimalarial_share * 100, 2) as antimalarial_pct
FROM agrosoluce.vrac_period_aggregates
ORDER BY year DESC, period_label;
```

## Step 4: Test the UI

1. Ensure dev server is running: `npm run dev`
2. Open http://localhost:5173/vrac
3. Verify:
   - Page loads without errors
   - Charts display data
   - Filters work
   - Export functions work

## Troubleshooting

### If schema migration fails:

```sql
-- Check if agrosoluce schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'agrosoluce';

-- If not, create it
CREATE SCHEMA IF NOT EXISTS agrosoluce;
```

### If data migration fails:

```bash
# Check processed data exists
ls -lh apps/web/public/data/vrac/processed.json

# Reprocess VRAC data if needed
npm run vrac:process

# Try migration again
npm run vrac:migrate
```

### If UI shows no data:

1. Check browser console for errors
2. Verify environment variables in .env
3. Test Supabase connection:

```javascript
// In browser console on /vrac page
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## Files Reference

- **Schema**: `packages/database/migrations/022_create_vrac_tables.sql`
- **Migration script**: `scripts/vrac/migrateVracToSupabase.ts`
- **Processed data**: `apps/web/public/data/vrac/processed.json`
- **Environment**: `.env` (in project root)

## Support

For detailed information, see:
- `docs/deployment/VRAC_DATABASE_MIGRATION_GUIDE.md` - Complete guide
- `docs/deployment/DATABASE_MIGRATION_CHECKLIST.md` - Step-by-step checklist

---

**Quick Status Check:**

```bash
# All in one check
echo "=== VRAC Migration Status ==="
echo "Schema file: $(ls -lh packages/database/migrations/022_create_vrac_tables.sql | awk '{print $5}')"
echo "Processed data: $(ls -lh apps/web/public/data/vrac/processed.json | awk '{print $5}')"
echo "Env configured: $([ -f .env ] && echo 'Yes' || echo 'No')"
echo "Ready to migrate!"
```
