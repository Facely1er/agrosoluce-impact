/**
 * @agrosoluce/data-insights
 * Data pipeline and enrichment for health/agriculture/environment impact analysis
 */

// Pipeline
export * from './pipeline';

// Sources
export * from './sources';

// Enrichment
export * from './enrichment';

// Catalog
export { PHARMACIES, PERIOD_LABELS } from './catalog';

// Convenience: compute health index from periods (used by app)
export { computeHealthIndexFromPeriod } from './enrichment/healthIndexEnrichment';

/** Compute health index points from periods - backward compat with app */
import type { VracPeriodData } from './sources/vrac/types';
import { computeHealthIndexFromPeriod } from './enrichment/healthIndexEnrichment';

export interface HealthIndexPoint {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  antimalarialQuantity: number;
  totalQuantity: number;
  antimalarialShare: number;
}

export function computeHealthIndex(periods: VracPeriodData[]): HealthIndexPoint[] {
  return periods.map((p) => {
    const hi = computeHealthIndexFromPeriod(p);
    return {
      pharmacyId: p.pharmacyId,
      periodLabel: p.periodLabel,
      year: p.year,
      antimalarialQuantity: hi.antimalarialQuantity,
      totalQuantity: hi.totalQuantity,
      antimalarialShare: hi.antimalarialShare,
    };
  });
}
