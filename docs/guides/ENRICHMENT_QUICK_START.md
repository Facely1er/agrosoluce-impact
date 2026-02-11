# Dataset Enrichment - Quick Start Guide

## ✅ What's Been Done

1. **Migration file created**: `009_dataset_enrichment_guide.sql`
2. **Migration runner updated**: Added to migration list
3. **Combined migration file updated**: `ALL_MIGRATIONS.sql` now includes enrichment migration
4. **Documentation created**: Complete guide in `DATASET_ENRICHMENT_GUIDE.md`
5. **Example scripts created**: `enrich_cooperatives_example.sql` with 10 practical examples

## 🚀 Next Steps to Apply Enrichment

### Option 1: Run Only the Enrichment Migration (Recommended)

If you've already run migrations 001-008, you can run just the enrichment migration:

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/nuwfdvwqiynzhbbsqagw
   - Navigate to SQL Editor

2. **Copy and run the enrichment migration**:
   - Open: `database/migrations/009_dataset_enrichment_guide.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Click "Run" to execute

3. **Verify the migration**:
   ```sql
   SELECT * FROM agrosoluce.migrations 
   WHERE migration_name = '009_dataset_enrichment_guide';
   ```

### Option 2: Run All Migrations (If Starting Fresh)

If you need to run all migrations from scratch:

1. **Open Supabase SQL Editor**
2. **Copy and run the combined file**:
   - Open: `database/migrations/ALL_MIGRATIONS.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Click "Run" to execute

## 📊 What the Enrichment Migration Adds

### New Fields on Existing Tables

**Cooperatives:**
- `member_count`, `established_year`, `legal_structure`
- `financial_health_score`, `sustainability_score`, `market_reputation_score`
- `export_experience_years`, `processing_capacity_tons_per_year`
- `data_quality_score` (auto-calculated)
- And more...

**Farmers:**
- `farm_size_hectares`, `primary_crop`, `farming_experience_years`
- `education_level`, `annual_income_usd`, `yield_per_hectare`
- And more...

### New Tables

- `market_prices` - Commodity prices by country and date
- `geographic_data` - Climate, soil, and agricultural potential
- `certification_standards` - Reference data for certifications
- `enrichment_log` - Audit log of enrichment operations

### New Views

- `enriched_cooperatives` - Cooperatives with calculated metrics
- `enriched_farmers` - Farmers with cooperative context

### New Functions

- `calculate_cooperative_enrichment_score()` - Calculates data completeness (0-100)
- `auto_enrich_cooperative()` - Auto-enriches cooperative data

### Automatic Features

- **Trigger**: Auto-calculates `data_quality_score` when cooperative data changes
- **Seed data**: Pre-populated certification standards and sample market prices

## 🎯 After Running the Migration

### 1. Calculate Initial Data Quality Scores

```sql
-- Calculate scores for all existing cooperatives
UPDATE agrosoluce.cooperatives
SET data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(id)
WHERE data_quality_score IS NULL;
```

### 2. Enrich Existing Data (Optional)

Run the example enrichment script:

```sql
-- See database/scripts/enrich_cooperatives_example.sql
-- This includes 10 practical examples of enriching data
```

### 3. Query Enriched Data

```sql
-- Use the enriched view
SELECT 
    name,
    country,
    commodity,
    data_completeness_score,
    current_market_price_per_ton,
    climate_zone
FROM agrosoluce.enriched_cooperatives
WHERE data_completeness_score >= 70
ORDER BY data_completeness_score DESC;
```

## 📝 Example: Enrich a Single Cooperative

```sql
-- Enrich a specific cooperative
SELECT agrosoluce.auto_enrich_cooperative('cooperative-uuid-here');

-- Check the enrichment log
SELECT * FROM agrosoluce.enrichment_log
WHERE entity_id = 'cooperative-uuid-here'
ORDER BY performed_at DESC;
```

## 🔍 Verify Everything Works

```sql
-- Check if views exist
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'agrosoluce' 
AND table_name IN ('enriched_cooperatives', 'enriched_farmers');

-- Check if functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'agrosoluce'
AND routine_name IN ('calculate_cooperative_enrichment_score', 'auto_enrich_cooperative');

-- Check if new tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'agrosoluce'
AND table_name IN ('market_prices', 'geographic_data', 'certification_standards', 'enrichment_log');
```

## 📚 Additional Resources

- **Complete Guide**: `docs/DATASET_ENRICHMENT_GUIDE.md`
- **Example Scripts**: `database/scripts/enrich_cooperatives_example.sql`
- **Migration File**: `database/migrations/009_dataset_enrichment_guide.sql`

## ⚠️ Important Notes

1. **Safe to run multiple times**: The migration uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`
2. **No data loss**: Only adds new fields and tables, doesn't modify existing data
3. **Backward compatible**: Existing queries will continue to work
4. **Performance**: New indexes are created for optimal query performance

## 🆘 Troubleshooting

If you encounter errors:

1. **Check migration status**:
   ```sql
   SELECT * FROM agrosoluce.migrations ORDER BY executed_at DESC;
   ```

2. **Check for conflicts**:
   - If a field already exists, the migration will skip it (safe)
   - If a table already exists, it will be skipped (safe)

3. **View errors in Supabase**:
   - Check the SQL Editor output for specific error messages
   - Most errors are self-explanatory

## ✨ Next Steps After Enrichment

1. **Populate reference data**: Add real market prices and geographic data
2. **Enrich existing cooperatives**: Use the example scripts to enrich your data
3. **Build enrichment UI**: Create admin interfaces for manual enrichment
4. **Set up automated enrichment**: Schedule batch enrichment jobs
5. **Monitor enrichment logs**: Track what's being enriched and by whom

---

**Ready to proceed?** Open Supabase SQL Editor and run the migration! 🚀

