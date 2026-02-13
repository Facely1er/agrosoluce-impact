/**
 * HWI Processing Pipeline
 * 
 * Processes VRAC data and calculates HWI scores for batch processing
 */

import { classifyMedication, MedicationCategory } from '../classification/medicationTaxonomy';
import { calculateHWI, CategoryAggregate, HWIScore } from '../analytics/hwi/calculateHWI';

export interface ProductSale {
  code: string;
  designation: string;
  quantitySold: number;
}

export interface PeriodData {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  products: ProductSale[];
  departement?: string;
  region?: string;
}

export interface CategoryAggregateResult {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  category: MedicationCategory;
  quantity: number;
  share: number;
}

/**
 * Process products and calculate category aggregates for a period
 */
export function processPeriodCategories(period: PeriodData): CategoryAggregateResult[] {
  const categoryCounts: Map<MedicationCategory, number> = new Map();
  let totalQuantity = 0;

  // Count quantities by category
  for (const product of period.products) {
    const { category } = classifyMedication(product.code, product.designation);
    const currentCount = categoryCounts.get(category) || 0;
    categoryCounts.set(category, currentCount + product.quantitySold);
    totalQuantity += product.quantitySold;
  }

  // Convert to aggregates with shares
  const aggregates: CategoryAggregateResult[] = [];
  
  for (const [category, quantity] of categoryCounts.entries()) {
    const share = totalQuantity > 0 ? quantity / totalQuantity : 0;
    aggregates.push({
      pharmacyId: period.pharmacyId,
      periodLabel: period.periodLabel,
      year: period.year,
      category,
      quantity,
      share,
    });
  }

  return aggregates;
}

/**
 * Process period data and calculate HWI score
 */
export function processPeriodHWI(period: PeriodData): HWIScore | null {
  // Get category aggregates
  const categoryAggregates = processPeriodCategories(period);
  
  if (categoryAggregates.length === 0) {
    console.warn(`No category aggregates for ${period.pharmacyId} ${period.periodLabel} ${period.year}`);
    return null;
  }

  // Convert to CategoryAggregate format
  const aggregates: CategoryAggregate[] = categoryAggregates.map(agg => ({
    category: agg.category,
    quantity: agg.quantity,
    share: agg.share,
  }));

  // Determine departement (fallback to region if not provided)
  const departement = period.departement || period.region || 'Unknown';

  // Calculate HWI
  const hwiScore = calculateHWI(
    period.pharmacyId,
    departement,
    period.periodLabel,
    period.year,
    aggregates,
    period.region
  );

  return hwiScore;
}

/**
 * Process multiple periods and calculate all HWI scores
 */
export function processBatchHWI(periods: PeriodData[]): {
  categoryAggregates: CategoryAggregateResult[];
  hwiScores: HWIScore[];
} {
  const allCategoryAggregates: CategoryAggregateResult[] = [];
  const allHWIScores: HWIScore[] = [];

  for (const period of periods) {
    // Process category aggregates
    const categoryAggregates = processPeriodCategories(period);
    allCategoryAggregates.push(...categoryAggregates);

    // Process HWI score
    const hwiScore = processPeriodHWI(period);
    if (hwiScore) {
      allHWIScores.push(hwiScore);
    }
  }

  return {
    categoryAggregates: allCategoryAggregates,
    hwiScores: allHWIScores,
  };
}

/**
 * Get category distribution summary for a period
 */
export function getCategoryDistribution(period: PeriodData): Record<string, number> {
  const categoryCounts: Record<string, number> = {};
  let totalQuantity = 0;

  for (const product of period.products) {
    const { category } = classifyMedication(product.code, product.designation);
    categoryCounts[category] = (categoryCounts[category] || 0) + product.quantitySold;
    totalQuantity += product.quantitySold;
  }

  // Convert to percentages
  const distribution: Record<string, number> = {};
  for (const [category, count] of Object.entries(categoryCounts)) {
    distribution[category] = totalQuantity > 0 ? (count / totalQuantity) * 100 : 0;
  }

  return distribution;
}
