/**
 * Antibiotic index enrichment: antibiotic share as infection proxy
 * Complements antimalarial for broader health burden signal
 */

import type { EnrichmentLayer } from '../pipeline/types';
import { getProductCategory } from './productTaxonomy';
import type { EnrichedVracPeriod } from './healthIndexEnrichment';

export interface AntibioticEnrichedPeriod extends EnrichedVracPeriod {
  antibioticIndex: {
    antibioticQuantity: number;
    antibioticShare: number;
  };
}

export const antibioticIndexEnrichment: EnrichmentLayer<EnrichedVracPeriod, AntibioticEnrichedPeriod> = {
  id: 'antibiotic-index',
  description: 'Compute antibiotic share as infection/respiratory proxy',
  dependsOn: ['health-index'],
  enrich(p) {
    let antibioticQty = 0;
    for (const prod of p.products) {
      if (getProductCategory(prod.code, prod.designation) === 'antibiotic') {
        antibioticQty += prod.quantitySold;
      }
    }
    const total = p.totalQuantity || p.products.reduce((s, x) => s + x.quantitySold, 0);
    return {
      ...p,
      antibioticIndex: {
        antibioticQuantity: antibioticQty,
        antibioticShare: total > 0 ? antibioticQty / total : 0,
      },
    };
  },
};
