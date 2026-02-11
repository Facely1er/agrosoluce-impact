# Migration Scripts

This directory contains scripts for migrating data and managing the AgroSoluce database.

## migrate-cooperatives-to-db.ts

Migrates cooperative data from `public/cooperatives_cote_ivoire.json` to the Supabase database.

### Prerequisites

1. **Database Migration**: Run the database migration first:
   ```sql
   -- Execute database/migrations/001_initial_schema_setup.sql in Supabase
   ```

2. **Environment Variables**: Set up your Supabase credentials:
   ```bash
   export VITE_SUPABASE_URL="your_supabase_url"
   export VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

   Or create a `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Usage

#### Option 1: Using tsx (recommended)
```bash
npx tsx scripts/migrate-cooperatives-to-db.ts
```

#### Option 2: Using ts-node
```bash
npx ts-node scripts/migrate-cooperatives-to-db.ts
```

#### Option 3: Compile and run
```bash
# Compile TypeScript
npx tsc scripts/migrate-cooperatives-to-db.ts --outDir dist --esModuleInterop

# Run
node dist/scripts/migrate-cooperatives-to-db.js
```

### What It Does

1. **Loads JSON Data**: Reads `public/cooperatives_cote_ivoire.json`
2. **Transforms Data**: Converts JSON format to database schema format
3. **Batch Inserts**: Inserts data in batches of 100 records
4. **Error Handling**: Continues on errors and reports issues
5. **Verification**: Counts total records in database after migration

### Data Transformation

The script maps JSON fields to database fields:

| JSON Field | Database Field | Notes |
|------------|----------------|-------|
| `id` | Stored in `metadata.originalId` | JSON ID preserved for reference |
| `name` | `name` | Direct mapping |
| `region` | `region` | Direct mapping |
| `departement` | `department` | Field name change |
| `secteur` | `sector` | Field name change |
| `phone` / `contact` | `phone` | Uses phone if available, else contact |
| `natureActivite` | `description` | Activity description |
| `status` | `is_verified` | Converts 'verified' to boolean |
| `registrationNumber` | `metadata.registrationNumber` | Stored in metadata |
| `president` | `metadata.president` | Stored in metadata |

### Output

The script provides:
- Progress updates for each batch
- Success/error counts
- List of errors (if any)
- Final database count

### Troubleshooting

**Error: "Database connection failed"**
- Verify Supabase URL and key are correct
- Ensure database migration has been run
- Check RLS policies allow inserts

**Error: "Unique constraint violation"**
- Some records may already exist
- Script will skip duplicates and continue

**Error: "JSON file not found"**
- Ensure `public/cooperatives_cote_ivoire.json` exists
- Check file path is correct

### Next Steps

After migration:
1. Verify data in Supabase dashboard
2. Test frontend with database connection
3. Update environment variables in production
4. Remove JSON fallback (optional, after verification)

