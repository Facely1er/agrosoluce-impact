/**
 * Calculate HWI Scores
 * 
 * Recalculates HWI scores from existing VRAC data in Supabase
 * Useful for updating scores after algorithm changes
 * 
 * Usage: npm run hwi:calculate
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { processBatchHWI } from '../../packages/data-insights/src/pipeline/processHWI';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface ProductSale {
  code: string;
  designation: string;
  quantity_sold: number;
}

interface PeriodAggregate {
  pharmacy_id: string;
  period_label: string;
  year: number;
}

// Initialize Supabase client
function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
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

// Get pharmacy mapping
function getPharmacyMapping(pharmacyId: string) {
  const mapping: Record<string, { departement: string; region: string }> = {
    'tanda': { departement: 'Gontougo', region: 'gontougo' },
    'prolife': { departement: 'Gontougo', region: 'gontougo' },
    'olympique': { departement: 'Abidjan', region: 'abidjan' },
    'attobrou': { departement: 'La Mé', region: 'la_me' },
  };
  return mapping[pharmacyId] || { departement: 'Unknown', region: 'unknown' };
}

// Fetch all periods from database
async function fetchPeriods(supabase: SupabaseClient): Promise<any[]> {
  console.log('Fetching periods from database...');
  
  const { data: aggregates, error } = await supabase
    .from('vrac_period_aggregates')
    .select('pharmacy_id, period_label, year')
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch periods: ${error.message}`);
  }

  console.log(`Found ${aggregates?.length || 0} periods`);
  return aggregates || [];
}

// Fetch products for a period
async function fetchProductsForPeriod(
  supabase: SupabaseClient,
  pharmacyId: string,
  periodLabel: string,
  year: number
): Promise<any[]> {
  const { data: products, error } = await supabase
    .from('vrac_product_sales')
    .select('code, designation, quantity_sold')
    .eq('pharmacy_id', pharmacyId)
    .eq('period_label', periodLabel)
    .eq('year', year);

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return products || [];
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('HWI Calculation Script');
  console.log('='.repeat(60));

  try {
    const supabase = createSupabaseClient();

    // Fetch all periods
    const periods = await fetchPeriods(supabase);
    
    if (periods.length === 0) {
      console.log('No periods found. Run vrac:migrate first.');
      return;
    }

    console.log('\n=== Fetching Products and Calculating HWI ===');
    
    // Build period data with products
    const periodsWithProducts = [];
    
    for (const period of periods) {
      const products = await fetchProductsForPeriod(
        supabase,
        period.pharmacy_id,
        period.period_label,
        period.year
      );
      
      const mapping = getPharmacyMapping(period.pharmacy_id);
      
      periodsWithProducts.push({
        pharmacyId: period.pharmacy_id,
        periodLabel: period.period_label,
        year: period.year,
        departement: mapping.departement,
        region: mapping.region,
        products: products.map(p => ({
          code: p.code,
          designation: p.designation,
          quantitySold: p.quantity_sold,
        })),
      });
      
      process.stdout.write(`\rProcessed ${periodsWithProducts.length}/${periods.length} periods`);
    }
    
    console.log('\n');

    // Calculate HWI
    console.log('=== Calculating HWI Scores ===');
    const { categoryAggregates, hwiScores } = processBatchHWI(periodsWithProducts);
    
    console.log(`Calculated ${hwiScores.length} HWI scores`);
    console.log(`Calculated ${categoryAggregates.length} category aggregates`);

    // Insert category aggregates
    console.log('\n=== Updating Category Aggregates ===');
    const aggregatesToInsert = categoryAggregates.map(agg => ({
      pharmacy_id: agg.pharmacyId,
      period_label: agg.periodLabel,
      year: agg.year,
      category: agg.category,
      quantity: agg.quantity,
      share: agg.share,
    }));

    const BATCH_SIZE = 500;
    for (let i = 0; i < aggregatesToInsert.length; i += BATCH_SIZE) {
      const batch = aggregatesToInsert.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('vrac_category_aggregates')
        .upsert(batch, { onConflict: 'pharmacy_id,year,period_label,category' });

      if (error) {
        throw new Error(`Failed to insert category aggregates: ${error.message}`);
      }
      
      process.stdout.write(`\rInserted ${Math.min(i + BATCH_SIZE, aggregatesToInsert.length)}/${aggregatesToInsert.length} aggregates`);
    }
    
    console.log('\n');

    // Insert HWI scores
    console.log('=== Updating HWI Scores ===');
    const scoresToInsert = hwiScores.map(score => ({
      pharmacy_id: score.pharmacyId,
      departement: score.departement,
      region: score.region || null,
      period_label: score.periodLabel,
      year: score.year,
      hwi_score: score.hwiScore,
      workforce_health_score: score.components.workforce_health,
      child_welfare_score: score.components.child_welfare,
      womens_health_score: score.components.womens_health,
      womens_empowerment_score: score.components.womens_empowerment,
      nutrition_score: score.components.nutrition,
      chronic_illness_score: score.components.chronic_illness,
      acute_illness_score: score.components.acute_illness,
      alert_level: score.alertLevel,
      total_quantity: score.totalQuantity,
      category_breakdown: score.categoryBreakdown,
    }));

    const { error: hwiError } = await supabase
      .from('household_welfare_index')
      .upsert(scoresToInsert, { onConflict: 'pharmacy_id,year,period_label' });

    if (hwiError) {
      throw new Error(`Failed to insert HWI scores: ${hwiError.message}`);
    }

    console.log(`✓ Inserted ${scoresToInsert.length} HWI scores`);

    // Summary
    const alertCounts = {
      green: scoresToInsert.filter(s => s.alert_level === 'green').length,
      yellow: scoresToInsert.filter(s => s.alert_level === 'yellow').length,
      red: scoresToInsert.filter(s => s.alert_level === 'red').length,
      black: scoresToInsert.filter(s => s.alert_level === 'black').length,
    };

    console.log('\n' + '='.repeat(60));
    console.log('✅ HWI Calculation Completed!');
    console.log('='.repeat(60));
    console.log('\nAlert Level Distribution:');
    console.log(`  Green (0-25): ${alertCounts.green}`);
    console.log(`  Yellow (25-50): ${alertCounts.yellow}`);
    console.log(`  Red (50-75): ${alertCounts.red}`);
    console.log(`  Black (75-100): ${alertCounts.black}`);
    
  } catch (error) {
    console.error('\n❌ HWI calculation failed:', error);
    process.exit(1);
  }
}

// Run
main();
