# Dataset Enrichment Guide for AgroSoluce

This guide provides comprehensive strategies for enriching the AgroSoluce dataset to improve data quality, completeness, and analytical capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Enrichment Strategies](#enrichment-strategies)
3. [Implementation Examples](#implementation-examples)
4. [Data Sources](#data-sources)
5. [Best Practices](#best-practices)

## Overview

Dataset enrichment involves adding additional fields, computed metrics, reference data, and relationships to improve the value and usability of your data. For AgroSoluce, enrichment helps:

- **Improve matching accuracy** between buyers and cooperatives
- **Enable better analytics** and reporting
- **Support compliance verification** (EUDR, certifications)
- **Enhance user experience** with richer profiles
- **Enable data-driven decisions** with calculated metrics

## Enrichment Strategies

### 1. Add Enrichment Fields to Existing Tables

**What it is:** Extending existing tables with additional columns to capture more information.

**Example fields added:**
- **Cooperatives:** `member_count`, `established_year`, `financial_health_score`, `sustainability_score`, `export_experience_years`
- **Farmers:** `farm_size_hectares`, `farming_experience_years`, `education_level`, `annual_income_usd`

**When to use:**
- When you need to store additional attributes directly related to an entity
- When the data is frequently queried with the main entity
- When you need to maintain referential integrity

**Implementation:**
```sql
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS member_count INTEGER,
ADD COLUMN IF NOT EXISTS financial_health_score NUMERIC(3, 1);
```

### 2. Create Enrichment Lookup Tables

**What it is:** Separate reference tables for data that can be shared across entities.

**Example tables:**
- `market_prices` - Commodity prices by country and date
- `geographic_data` - Climate, soil, and agricultural potential data
- `certification_standards` - Reference data for certification types

**When to use:**
- When data is shared across multiple entities
- When data changes independently (e.g., market prices update daily)
- When you need to maintain historical records

**Implementation:**
```sql
CREATE TABLE agrosoluce.market_prices (
    commodity VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    price_per_ton_usd NUMERIC(10, 2) NOT NULL,
    price_date DATE NOT NULL,
    source VARCHAR(255)
);
```

### 3. Create Computed/Enriched Views

**What it is:** Database views that combine data from multiple tables and calculate derived metrics.

**Example views:**
- `enriched_cooperatives` - Cooperatives with calculated metrics, market prices, and geographic data
- `enriched_farmers` - Farmers with cooperative context and productivity scores

**When to use:**
- When you need to combine data from multiple tables frequently
- When you want to calculate metrics without storing them
- When you need consistent, reusable data transformations

**Benefits:**
- No data duplication
- Always up-to-date calculations
- Simplified querying for applications

### 4. Create Enrichment Functions

**What it is:** PostgreSQL functions that calculate enrichment scores or perform enrichment operations.

**Example functions:**
- `calculate_cooperative_enrichment_score()` - Calculates data completeness score (0-100)
- `auto_enrich_cooperative()` - Automatically enriches data from external sources

**When to use:**
- When you need reusable calculation logic
- When you want to standardize enrichment processes
- When you need to trigger enrichment automatically

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION agrosoluce.calculate_cooperative_enrichment_score(coop_id UUID)
RETURNS NUMERIC AS $$
-- Function logic here
$$ LANGUAGE plpgsql;
```

### 5. Create Enrichment Triggers

**What it is:** Database triggers that automatically update enrichment fields when data changes.

**Example:**
- Auto-calculate `data_quality_score` when cooperative data is updated

**When to use:**
- When you want enrichment to happen automatically
- When you need to maintain consistency
- When enrichment should be real-time

### 6. Seed Reference Data

**What it is:** Pre-populating lookup tables with standard reference data.

**Example data:**
- Certification standards (Fairtrade, Rainforest Alliance, etc.)
- Market price baselines
- Geographic data for common regions

**When to use:**
- For standard, relatively static reference data
- To bootstrap the system with useful defaults
- To provide examples for users

### 7. Create Enrichment Metadata Tracking

**What it is:** Logging table to track enrichment operations and data sources.

**Example table:**
- `enrichment_log` - Tracks what was enriched, when, by whom, and from what source

**When to use:**
- When you need audit trails
- When you want to track data quality improvements
- When you need to debug enrichment issues

## Implementation Examples

### Example 1: Enriching Cooperative Data from JSON Import

```sql
-- After importing cooperatives from JSON, enrich them
UPDATE agrosoluce.cooperatives
SET 
    member_count = (metadata->>'member_count')::INTEGER,
    established_year = (metadata->>'established_year')::INTEGER,
    financial_health_score = (metadata->>'financial_health_score')::NUMERIC,
    data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(id)
WHERE metadata IS NOT NULL;
```

### Example 2: Enriching with Market Prices

```sql
-- Update cooperative view with current market prices
UPDATE agrosoluce.cooperatives c
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{current_market_price}',
    to_jsonb(mp.price_per_ton_usd)
)
FROM (
    SELECT commodity, country, price_per_ton_usd
    FROM agrosoluce.market_prices
    WHERE price_date = (SELECT MAX(price_date) FROM agrosoluce.market_prices)
) mp
WHERE c.commodity = mp.commodity AND c.country = mp.country;
```

### Example 3: Enriching with Geographic Data

```sql
-- Enrich cooperatives with geographic/climate data
UPDATE agrosoluce.cooperatives c
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{geographic_data}',
    jsonb_build_object(
        'climate_zone', gd.climate_zone,
        'agricultural_potential', gd.agricultural_potential_score,
        'rainfall_mm', gd.rainfall_mm_per_year
    )
)
FROM agrosoluce.geographic_data gd
WHERE c.country = gd.country 
  AND c.region = gd.region 
  AND c.department = gd.department;
```

### Example 4: Batch Enrichment Script

```sql
-- Enrich all cooperatives that need enrichment
DO $$
DECLARE
    coop_record RECORD;
BEGIN
    FOR coop_record IN 
        SELECT id FROM agrosoluce.cooperatives 
        WHERE data_quality_score IS NULL OR data_quality_score < 70
    LOOP
        PERFORM agrosoluce.auto_enrich_cooperative(coop_record.id);
        
        INSERT INTO agrosoluce.enrichment_log (
            entity_type, entity_id, enrichment_type, enrichment_source
        ) VALUES (
            'cooperative', coop_record.id, 'batch', 'automated_script'
        );
    END LOOP;
END $$;
```

## Data Sources for Enrichment

### Internal Sources
- **User input** - Data entered by cooperative members
- **Calculated metrics** - Derived from existing data (e.g., productivity scores)
- **Historical data** - Trends from past transactions and reports

### External Sources (Future Integration)
- **Google Maps API** - Location data, coordinates validation
- **Certification databases** - Verify certification status
- **Market data APIs** - Real-time commodity prices
- **Weather APIs** - Climate and rainfall data
- **Government databases** - Official cooperative registrations
- **Financial APIs** - Credit scores, financial health indicators

### Manual Enrichment
- **Admin input** - Verified data entered by administrators
- **Third-party verification** - Data verified by external auditors
- **Survey data** - Information collected through satisfaction surveys

## Best Practices

### 1. Data Quality Scoring
- Always calculate and maintain a `data_quality_score` for entities
- Use this score to prioritize enrichment efforts
- Display scores to users to encourage data completion

### 2. Incremental Enrichment
- Don't try to enrich everything at once
- Start with high-value, frequently-used entities
- Prioritize based on user needs and business value

### 3. Source Tracking
- Always log where enrichment data came from
- Track when data was last verified
- Maintain audit trails for compliance

### 4. Validation
- Validate enriched data before storing
- Use CHECK constraints where possible
- Implement data validation functions

### 5. Performance
- Index enrichment fields that are frequently queried
- Use materialized views for expensive calculations (if needed)
- Consider caching for frequently accessed enrichment data

### 6. User Experience
- Show enrichment progress to users
- Allow users to verify/update enriched data
- Provide clear indicators of data completeness

### 7. Maintenance
- Regularly update reference data (market prices, etc.)
- Recalculate enrichment scores periodically
- Clean up stale or invalid enrichment data

## Migration File

The complete implementation is available in:
```
database/migrations/009_dataset_enrichment_guide.sql
```

This migration includes:
- ✅ Additional enrichment fields for cooperatives and farmers
- ✅ Lookup tables for market prices, geographic data, and certifications
- ✅ Enriched views with calculated metrics
- ✅ Enrichment functions and triggers
- ✅ Seed data for reference tables
- ✅ Enrichment logging and tracking

## Next Steps

1. **Run the migration** to add enrichment structures
2. **Import your JSON data** and map to enrichment fields
3. **Populate reference tables** with real data
4. **Run batch enrichment** on existing cooperatives
5. **Monitor enrichment logs** to track progress
6. **Iterate** based on user feedback and business needs

## Questions?

For questions about dataset enrichment, refer to:
- The migration file: `009_dataset_enrichment_guide.sql`
- The enriched views: `enriched_cooperatives`, `enriched_farmers`
- The enrichment functions: `calculate_cooperative_enrichment_score()`, `auto_enrich_cooperative()`

