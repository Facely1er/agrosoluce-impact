/**
 * Database Migration Runner
 * 
 * This script helps you run database migrations for AgroSoluce.
 * Since Supabase doesn't allow direct SQL execution via the client API,
 * this script provides instructions and can generate a combined SQL file.
 * 
 * Usage:
 *   npx tsx scripts/run-migrations.ts [--generate] [--check]
 * 
 * Options:
 *   --generate  Generate a combined SQL file with all migrations
 *   --check     Check migration status (requires database connection)
 *   --run       Execute migrations via DATABASE_URL (requires pg package)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

/** Load .env from project root into process.env */
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration files in order
const migrations = [
  '001_initial_schema_setup.sql',
  '002_add_farmers_table.sql',
  '003_add_traceability_tables.sql',
  '004_add_compliance_tables.sql',
  '005_add_evidence_tables.sql',
  '006_add_logistics_tables.sql',
  '007_agrosoluce_v1_scope.sql',
  '008_farmers_first_toolkit.sql',
  '009_dataset_enrichment_guide.sql',
  '010_cooperative_dashboard_enhancements.sql',
  '011_phase1_data_enrichment.sql',
  '012_canonical_cooperative_directory.sql',
  '013_coverage_metrics_table.sql',
  '014_readiness_snapshots.sql',
  '015_add_pilot_cohorts.sql',
  '016_farmer_declarations.sql',
  '017_add_farmer_declarations_to_buyer_view.sql',
  '018_add_evidence_type.sql',
  '019_add_assessment_tables.sql',
  '020_rename_compliance_to_readiness.sql',
  '021_fix_rls_permissive_policies.sql',
  '022_create_vrac_tables.sql',
  '023_supabase_performance_security_lints.sql',
  '024_edusoluce_auth_rls_initplan.sql'
];

/**
 * Generate combined SQL file
 */
function generateCombinedSQL() {
  console.log('📝 Generating combined migration file...\n');

  const outputPath = path.join(__dirname, '../packages/database/migrations/ALL_MIGRATIONS.sql');
  let combinedSQL = `-- =============================================
-- AgroSoluce Database Migrations - Combined File
-- =============================================
-- This file contains all migrations in order.
-- Execute this file in Supabase SQL Editor.
-- 
-- Generated: ${new Date().toISOString()}
-- =============================================\n\n`;

  for (const migrationFile of migrations) {
    const migrationPath = path.join(__dirname, '../packages/database/migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      continue;
    }

    const content = fs.readFileSync(migrationPath, 'utf-8');
    
    combinedSQL += `-- =============================================\n`;
    combinedSQL += `-- Migration: ${migrationFile}\n`;
    combinedSQL += `-- =============================================\n\n`;
    combinedSQL += content;
    combinedSQL += `\n\n`;
  }

  fs.writeFileSync(outputPath, combinedSQL, 'utf-8');
  console.log(`✅ Combined migration file created: ${outputPath}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Open your Supabase project dashboard`);
  console.log(`   2. Go to SQL Editor`);
  console.log(`   3. Copy and paste the contents of: ${outputPath}`);
  console.log(`   4. Execute the SQL`);
  console.log(`   5. Verify migrations were applied by checking agrosoluce.migrations table`);
}

/**
 * Check migration status
 */
async function checkMigrationStatus() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables:');
    console.error('   VITE_SUPABASE_URL or SUPABASE_URL');
    console.error('   VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
    return;
  }

  console.log('🔍 Checking migration status...\n');

  const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'agrosoluce' }
  });

  try {
    const { data: executedMigrations, error } = await supabase
      .from('migrations')
      .select('migration_name, executed_at')
      .order('executed_at', { ascending: true });

    if (error) {
      if (error.message.includes('relation') || error.message.includes('schema')) {
        console.log('⚠️  Migrations table not found. Migrations have not been run yet.');
        console.log('\n📋 To run migrations:');
        console.log('   1. Use --generate to create combined SQL file');
        console.log('   2. Execute in Supabase SQL Editor');
        return;
      }
      throw error;
    }

    const executedNames = new Set((executedMigrations || []).map(m => m.migration_name));
    
    console.log('📊 Migration Status:\n');
    
    for (const migrationFile of migrations) {
      const migrationName = migrationFile.replace('.sql', '');
      const isExecuted = executedNames.has(migrationName);
      
      if (isExecuted) {
        const migration = executedMigrations?.find(m => m.migration_name === migrationName);
        const executedAt = migration?.executed_at 
          ? new Date(migration.executed_at).toLocaleString()
          : 'Unknown';
        console.log(`   ✅ ${migrationFile} - Executed at: ${executedAt}`);
      } else {
        console.log(`   ❌ ${migrationFile} - NOT EXECUTED`);
      }
    }

    const totalExecuted = executedNames.size;
    const totalMigrations = migrations.length;

    console.log(`\n📈 Summary: ${totalExecuted}/${totalMigrations} migrations executed`);

    if (totalExecuted < totalMigrations) {
      console.log('\n⚠️  Some migrations are missing. Run --generate to create SQL file.');
    } else {
      console.log('\n✅ All migrations have been executed!');
    }
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    console.log('\n💡 This might mean:');
    console.log('   - Migrations have not been run yet');
    console.log('   - Database connection issue');
    console.log('   - Schema "agrosoluce" does not exist');
  }
}

/**
 * Run migrations via direct PostgreSQL connection (DATABASE_URL)
 * Executes each migration file in order to avoid multi-statement parsing issues.
 */
async function runMigrations() {
  loadEnv();
  // Also load from cwd for when script is run from repo root
  const cwdEnv = path.join(process.cwd(), '.env');
  if (fs.existsSync(cwdEnv)) {
    const content = fs.readFileSync(cwdEnv, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found. Set it in .env (e.g. postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres)');
    process.exit(1);
  }

  let pg: typeof import('pg');
  try {
    pg = await import('pg');
  } catch {
    console.error('❌ pg package not found. Install with: npm install pg');
    process.exit(1);
  }

  const migrationsDir = path.join(__dirname, '../packages/database/migrations');
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Load already-executed migrations from agrosoluce.migrations (if schema exists)
    let executedSet = new Set<string>();
    try {
      const res = await client.query(
        `SELECT migration_name FROM agrosoluce.migrations`
      );
      executedSet = new Set((res.rows || []).map((r: { migration_name: string }) => r.migration_name));
    } catch {
      // Schema or table may not exist yet
    }

    console.log('🔄 Executing migrations...\n');

    for (const migrationFile of migrations) {
      const migrationName = migrationFile.replace('.sql', '');
      if (executedSet.has(migrationName)) {
        console.log(`   ⏭️  ${migrationFile} (already applied)`);
        continue;
      }

      const migrationPath = path.join(migrationsDir, migrationFile);
      if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationFile}`);
        process.exit(1);
      }
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      try {
        await client.query(sql);
        console.log(`   ✅ ${migrationFile}`);
      } catch (err) {
        const msg = (err as Error).message;
        if (msg.includes('already exists') || msg.includes('duplicate key')) {
          console.log(`   ⏭️  ${migrationFile} (already applied)`);
        } else {
          console.error(`   ❌ ${migrationFile}: ${msg}`);
          process.exit(1);
        }
      }
    }

    console.log('\n✅ All migrations executed successfully');
  } catch (err) {
    console.error('❌ Migration error:', (err as Error).message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

/**
 * Main function
 */
async function main() {
  loadEnv();
  const cwdEnv = path.join(process.cwd(), '.env');
  if (fs.existsSync(cwdEnv)) {
    const content = fs.readFileSync(cwdEnv, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }

  const args = process.argv.slice(2);
  const generate = args.includes('--generate') || args.includes('-g');
  const check = args.includes('--check') || args.includes('-c');
  const run = args.includes('--run') || args.includes('-r');

  if (generate) {
    generateCombinedSQL();
  } else if (check) {
    await checkMigrationStatus();
  } else if (run) {
    await runMigrations();
  } else {
    console.log('🚀 AgroSoluce Database Migration Helper\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/run-migrations.ts --generate  # Generate combined SQL file');
    console.log('  npx tsx scripts/run-migrations.ts --check     # Check migration status');
    console.log('  npx tsx scripts/run-migrations.ts --run        # Run migrations via DATABASE_URL (requires pg)\n');
    console.log('To run migrations automatically:');
    console.log('  1. Set DATABASE_URL in .env');
    console.log('  2. npm install pg');
    console.log('  3. npx tsx scripts/run-migrations.ts --run');
    console.log('  4. npx tsx scripts/run-migrations.ts --check\n');
  }
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
