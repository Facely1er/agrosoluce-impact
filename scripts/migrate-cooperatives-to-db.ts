/**
 * Migration script: JSON to Supabase Database
 * 
 * This script migrates cooperative data from cooperatives_cote_ivoire.json
 * to the Supabase database (agrosoluce schema).
 * 
 * Usage:
 *   npx tsx scripts/migrate-cooperatives-to-db.ts
 * 
 * Requirements:
 *   - Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 *   - Database migration 001_initial_schema_setup.sql must be run first
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('   VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client with agrosoluce schema
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'agrosoluce'
  }
});

interface JsonCooperative {
  id: number;
  name: string;
  region: string;
  departement?: string;
  secteur: string;
  registrationNumber: string;
  president?: string;
  contact?: string;
  phone?: string;
  natureActivite?: string;
  status?: 'pending' | 'verified' | 'rejected';
}

/**
 * Transform JSON cooperative to database format
 */
function transformCooperative(json: JsonCooperative): any {
  return {
    name: json.name,
    region: json.region || null,
    department: json.departement || null,
    commune: null, // Not in JSON, can be added later
    sector: json.secteur || null,
    phone: json.phone || json.contact || null,
    email: null, // Not in JSON, can be added later
    address: null, // Not in JSON, can be added later
    latitude: null, // Will be computed/enriched later
    longitude: null, // Will be computed/enriched later
    description: json.natureActivite || null,
    products: null, // Can be extracted from natureActivite later
    certifications: null, // Can be added later
    is_verified: json.status === 'verified' || false,
    metadata: {
      registrationNumber: json.registrationNumber,
      president: json.president || null,
      originalId: json.id,
      originalContact: json.contact || null,
      natureActivite: json.natureActivite || null,
    }
  };
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting cooperative data migration...\n');

  // Load JSON file
  const jsonPath = path.join(__dirname, '../public/cooperatives_cote_ivoire.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ JSON file not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`📂 Loading data from: ${jsonPath}`);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const cooperatives = jsonData.cooperatives || [];

  if (!Array.isArray(cooperatives) || cooperatives.length === 0) {
    console.error('❌ No cooperatives found in JSON file');
    process.exit(1);
  }

  console.log(`✅ Found ${cooperatives.length} cooperatives in JSON\n`);

  // Test database connection
  console.log('🔌 Testing database connection...');
  const { data: testData, error: testError } = await supabase
    .from('cooperatives')
    .select('id')
    .limit(1);

  if (testError) {
    console.error('❌ Database connection failed:', testError.message);
    console.error('   Make sure:');
    console.error('   1. Database migration has been run');
    console.error('   2. RLS policies allow inserts');
    console.error('   3. Schema "agrosoluce" exists');
    process.exit(1);
  }

  console.log('✅ Database connection successful\n');

  // Transform and insert data in batches
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ name: string; error: string }> = [];

  console.log(`📦 Inserting data in batches of ${batchSize}...\n`);

  for (let i = 0; i < cooperatives.length; i += batchSize) {
    const batch = cooperatives.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(cooperatives.length / batchSize);

    console.log(`   Batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);

    const transformed = batch.map(transformCooperative);

    const { data, error } = await supabase
      .from('cooperatives')
      .insert(transformed)
      .select('id');

    if (error) {
      console.error(`   ❌ Batch ${batchNumber} failed:`, error.message);
      errorCount += batch.length;
      
      // Try inserting one by one to identify problematic records
      if (error.code === '23505') { // Unique constraint violation
        console.log(`   ⚠️  Some records may already exist, skipping duplicates...`);
        for (const coop of batch) {
          try {
            const single = transformCooperative(coop);
            const { error: singleError } = await supabase
              .from('cooperatives')
              .insert(single)
              .select('id');
            
            if (singleError) {
              errors.push({ name: coop.name, error: singleError.message });
              errorCount++;
            } else {
              successCount++;
            }
          } catch (err) {
            errors.push({ 
              name: coop.name, 
              error: err instanceof Error ? err.message : 'Unknown error' 
            });
            errorCount++;
          }
        }
      } else {
        batch.forEach(coop => {
          errors.push({ name: coop.name, error: error.message });
        });
      }
    } else {
      successCount += data?.length || 0;
      console.log(`   ✅ Batch ${batchNumber} inserted: ${data?.length || 0} records`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${successCount} cooperatives`);
  console.log(`❌ Failed: ${errorCount} cooperatives`);
  console.log(`📁 Total in JSON: ${cooperatives.length}`);
  console.log(`📈 Success rate: ${((successCount / cooperatives.length) * 100).toFixed(1)}%`);

  if (errors.length > 0 && errors.length <= 20) {
    console.log('\n⚠️  Errors:');
    errors.slice(0, 20).forEach(({ name, error }) => {
      console.log(`   - ${name}: ${error}`);
    });
    if (errors.length > 20) {
      console.log(`   ... and ${errors.length - 20} more errors`);
    }
  }

  console.log('\n✅ Migration complete!');
  
  // Verify migration
  const { count } = await supabase
    .from('cooperatives')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Total cooperatives in database: ${count}`);
}

// Run migration
migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

