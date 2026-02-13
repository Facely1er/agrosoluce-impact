/**
 * Analgesic index enrichment: analgesic share as pain/comfort proxy
 * Complements antimalarial and antibiotic for broader health burden signal
 */

import type { EnrichmentLayer } from '../pipeline/types';
import { getProductCategory } from './productTaxonomy';
import type { EnrichedVracPeriod } from './healthIndexEnrichment';

export interface AnalgesicEnrichedPeriod extends EnrichedVracPeriod {
  analgesicIndex: {
    analgesicQuantity: number;
    analgesicShare: number;
  };
}

export const analgesicIndexEnrichment: EnrichmentLayer<EnrichedVracPeriod, AnalgesicEnrichedPeriod> = {
  id: 'analgesic-index',
  description: 'Compute analgesic share as pain/comfort proxy',
  dependsOn: ['health-index'],
  enrich(p) {
    let analgesicQty = 0;
    for (const prod of p.products) {
      if (getProductCategory(prod.code, prod.designation) === 'analgesic') {
        analgesicQty += prod.quantitySold;
      }
    }
    const total = p.totalQuantity || p.products.reduce((s, x) => s + x.quantitySold, 0);
    return {
      ...p,
      analgesicIndex: {
        analgesicQuantity: analgesicQty,
        analgesicShare: total > 0 ? analgesicQty / total : 0,
      },
    };
  },
};
