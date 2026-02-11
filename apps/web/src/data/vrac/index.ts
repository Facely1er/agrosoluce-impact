/**
 * Re-export from @agrosoluce/data-insights for backward compatibility.
 * Prefer importing from '@agrosoluce/data-insights' directly.
 */
export { PHARMACIES, PERIOD_LABELS, computeHealthIndex, getProductCategory } from '@agrosoluce/data-insights';
export type { TherapeuticCategory, HealthIndexPoint, VracPeriodData } from '@agrosoluce/data-insights';

/** @deprecated Use VracPeriodData from @agrosoluce/data-insights */
export type ProcessedPeriod = import('@agrosoluce/data-insights').VracPeriodData;
