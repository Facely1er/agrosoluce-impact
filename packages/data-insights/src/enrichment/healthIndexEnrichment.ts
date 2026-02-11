/**
 * Health index enrichment: antimalarial share as malaria proxy
 * Maps product codes to therapeutic categories and computes antimalarial share
 */

import type { EnrichmentLayer } from '../pipeline/types';
import { getProductCategory } from './productTaxonomy';
import type { VracPeriodData } from '../sources/vrac/types';

export interface EnrichedVracPeriod extends VracPeriodData {
  healthIndex: {
    antimalarialQuantity: number;
    antimalarialShare: number;
    totalQuantity: number;
    categoryBreakdown?: Array<{ category: string; quantity: number }>;
  };
}

export function computeHealthIndexFromPeriod(p: VracPeriodData): EnrichedVracPeriod['healthIndex'] {
  let antimalarialQty = 0;
  const categoryCounts: Record<string, number> = {};

  for (const prod of p.products) {
    const cat = getProductCategory(prod.code, prod.designation);
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + prod.quantitySold;
    if (cat === 'antimalarial') {
      antimalarialQty += prod.quantitySold;
    }
  }

  const total = p.totalQuantity || p.products.reduce((s, x) => s + x.quantitySold, 0);
  const antimalarialShare = total > 0 ? antimalarialQty / total : 0;

  return {
    antimalarialQuantity: antimalarialQty,
    antimalarialShare,
    totalQuantity: total,
    categoryBreakdown: Object.entries(categoryCounts).map(([category, quantity]) => ({ category, quantity })),
  };
}

export const healthIndexEnrichment: EnrichmentLayer<VracPeriodData, EnrichedVracPeriod> = {
  id: 'health-index',
  description: 'Compute antimalarial share as malaria burden proxy',
  enrich(p) {
    return {
      ...p,
      healthIndex: computeHealthIndexFromPeriod(p),
    };
  },
};
