/**
 * VRAC Data Migration to Supabase
 * 
 * Migrates processed VRAC pharmacy surveillance data from JSON to Supabase database
 * 
 * Usage: npm run vrac:migrate
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getProductCategory } from '../../apps/web/src/data/vrac/productTaxonomy';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PROCESSED_JSON_PATH = path.resolve(process.cwd(), 'apps/web/public/data/vrac/processed.json');

interface ProductSale {
  code: string;
  designation: string;
  quantitySold: number;
  stock?: number;
  price?: number;
}

interface PeriodData {
  pharmacyId: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  year: number;
  products: ProductSale[];
  totalQuantity?: number;
}

interface ProcessedData {
  periods: PeriodData[];
  processedAt?: string;
}

interface PharmacyProfile {
  id: string;
  name: string;
  region: string;
  location: string;
  region_label: string;
}

// Initialize Supabase client
function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY) environment variables.'
    );
  }

  console.log(`Connecting to Supabase: ${supabaseUrl.substring(0, 30)}...`);
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'agrosoluce'
    }
  });
}

// Load processed JSON data
function loadProcessedData(): ProcessedData {
  console.log(`Loading data from: ${PROCESSED_JSON_PATH}`);
  
  if (!fs.existsSync(PROCESSED_JSON_PATH)) {
    throw new Error(`Processed data file not found: ${PROCESSED_JSON_PATH}\nRun: npm run vrac:process`);
  }

  const content = fs.readFileSync(PROCESSED_JSON_PATH, 'utf-8');
  const data = JSON.parse(content);
  
  console.log(`Loaded ${data.periods?.length || 0} periods`);
  return data;
}

// Insert pharmacy profiles
async function insertPharmacyProfiles(supabase: SupabaseClient): Promise<void> {
  console.log('\n=== Inserting Pharmacy Profiles ===');
  
  const profiles: PharmacyProfile[] = [
    { id: 'tanda', name: 'Grande Pharmacie de Tanda', region: 'gontougo', location: 'Tanda, Gontougo', region_label: 'Gontougo (cocoa)' },
    { id: 'prolife', name: 'Pharmacie Prolife', region: 'gontougo', location: 'Tabagne, Gontougo', region_label: 'Gontougo (cocoa)' },
    { id: 'olympique', name: 'Pharmacie Olympique', region: 'abidjan', location: 'Abidjan', region_label: 'Abidjan (urban)' },
    { id: 'attobrou', name: 'Pharmacie Attobrou', region: 'la_me', location: 'La Mé', region_label: 'La Mé (cocoa)' },
  ];

  for (const profile of profiles) {
    const { error } = await supabase
      .from('pharmacy_profiles')
      .upsert(profile, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting pharmacy ${profile.id}:`, error);
      throw error;
    }
    console.log(`✓ Pharmacy profile: ${profile.name}`);
  }
}

// Insert product sales (bulk)
async function insertProductSales(supabase: SupabaseClient, periods: PeriodData[]): Promise<void> {
  console.log('\n=== Inserting Product Sales ===');
  
  let totalProducts = 0;
  const BATCH_SIZE = 1000;

  for (const period of periods) {
    console.log(`Processing ${period.pharmacyId} - ${period.periodLabel} (${period.year}): ${period.products.length} products`);
    
    const sales = period.products.map(product => ({
      pharmacy_id: period.pharmacyId,
      period_label: period.periodLabel,
      period_start: period.periodStart,
      period_end: period.periodEnd,
      year: period.year,
      code: product.code,
      designation: product.designation,
      quantity_sold: product.quantitySold,
      stock: product.stock || null,
      price: product.price || null,
    }));

    // Insert in batches
    for (let i = 0; i < sales.length; i += BATCH_SIZE) {
      const batch = sales.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('vrac_product_sales')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch for ${period.pharmacyId}:`, error);
        throw error;
      }
      totalProducts += batch.length;
    }
    
    console.log(`✓ Inserted ${sales.length} products`);
  }
  
  console.log(`Total products inserted: ${totalProducts}`);
}

// Calculate and insert period aggregates
async function calculateAndInsertAggregates(supabase: SupabaseClient, periods: PeriodData[]): Promise<void> {
  console.log('\n=== Calculating Period Aggregates ===');
  
  const aggregates = [];

  for (const period of periods) {
    let totalQuantity = 0;
    let antimalarialQuantity = 0;
    let antibioticQuantity = 0;
    let analgesicQuantity = 0;

    for (const product of period.products) {
      const quantity = product.quantitySold;
      totalQuantity += quantity;

      const category = getProductCategory(product.code, product.designation);
      switch (category) {
        case 'antimalarial':
          antimalarialQuantity += quantity;
          break;
        case 'antibiotic':
          antibioticQuantity += quantity;
          break;
        case 'analgesic':
          analgesicQuantity += quantity;
          break;
      }
    }

    const antimalarialShare = totalQuantity > 0 ? antimalarialQuantity / totalQuantity : 0;

    aggregates.push({
      pharmacy_id: period.pharmacyId,
      period_label: period.periodLabel,
      period_start: period.periodStart,
      period_end: period.periodEnd,
      year: period.year,
      total_quantity: totalQuantity,
      antimalarial_quantity: antimalarialQuantity,
      antibiotic_quantity: antibioticQuantity,
      analgesic_quantity: analgesicQuantity,
      antimalarial_share: antimalarialShare,
    });

    console.log(`✓ ${period.pharmacyId} ${period.year}: Total=${totalQuantity}, Antimalarial=${antimalarialQuantity} (${(antimalarialShare * 100).toFixed(2)}%)`);
  }

  // Insert all aggregates
  const { error } = await supabase
    .from('vrac_period_aggregates')
    .upsert(aggregates, { onConflict: 'pharmacy_id,year,period_label' });

  if (error) {
    console.error('Error inserting period aggregates:', error);
    throw error;
  }

  console.log(`Total aggregates inserted: ${aggregates.length}`);
}

// Calculate and insert regional health index
async function calculateAndInsertHealthIndex(supabase: SupabaseClient, periods: PeriodData[]): Promise<void> {
  console.log('\n=== Calculating Regional Health Index ===');
  
  const healthIndex = [];

  for (const period of periods) {
    let totalQuantity = 0;
    let antimalarialQuantity = 0;

    for (const product of period.products) {
      const quantity = product.quantitySold;
      totalQuantity += quantity;

      const category = getProductCategory(product.code, product.designation);
      if (category === 'antimalarial') {
        antimalarialQuantity += quantity;
      }
    }

    const antimalarialShare = totalQuantity > 0 ? antimalarialQuantity / totalQuantity : 0;

    healthIndex.push({
      pharmacy_id: period.pharmacyId,
      period_label: period.periodLabel,
      year: period.year,
      antimalarial_quantity: antimalarialQuantity,
      total_quantity: totalQuantity,
      antimalarial_share: antimalarialShare,
    });

    console.log(`✓ ${period.pharmacyId} ${period.periodLabel} ${period.year}: Antimalarial share=${(antimalarialShare * 100).toFixed(2)}%`);
  }

  // Insert all health index records
  const { error } = await supabase
    .from('vrac_regional_health_index')
    .upsert(healthIndex, { onConflict: 'pharmacy_id,year,period_label' });

  if (error) {
    console.error('Error inserting health index:', error);
    throw error;
  }

  console.log(`Total health index records inserted: ${healthIndex.length}`);
}

// Main migration function
async function main() {
  console.log('='.repeat(60));
  console.log('VRAC Data Migration to Supabase');
  console.log('='.repeat(60));

  try {
    // Initialize
    const supabase = createSupabaseClient();
    const data = loadProcessedData();

    if (!data.periods || data.periods.length === 0) {
      throw new Error('No periods found in processed data');
    }

    // Run migration steps
    await insertPharmacyProfiles(supabase);
    await insertProductSales(supabase, data.periods);
    await calculateAndInsertAggregates(supabase, data.periods);
    await calculateAndInsertHealthIndex(supabase, data.periods);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(60));
    console.log(`\nMigrated ${data.periods.length} pharmacy periods`);
    console.log('- Pharmacy profiles: 4');
    console.log(`- Product sales records: ${data.periods.reduce((sum, p) => sum + p.products.length, 0)}`);
    console.log(`- Period aggregates: ${data.periods.length}`);
    console.log(`- Health index records: ${data.periods.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main();
