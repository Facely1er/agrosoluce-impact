/**
 * Enrichment layers - registry and exports
 * Add new enrichment layers here when new derived metrics are needed
 */

export { registerEnrichment, getEnrichment, listEnrichments, getEnrichmentOrder } from '../pipeline/enrichmentRegistry';
export { healthIndexEnrichment, computeHealthIndexFromPeriod } from './healthIndexEnrichment';
export type { EnrichedVracPeriod } from './healthIndexEnrichment';
export { regionNormalizationEnrichment } from './regionNormalizationEnrichment';
export type { RegionEnrichedPeriod } from './regionNormalizationEnrichment';
export { getProductCategory } from './productTaxonomy';
export type { TherapeuticCategory } from './productTaxonomy';
