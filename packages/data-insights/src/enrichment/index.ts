/**
 * Enrichment layers - registry and exports
 * Add new enrichment layers here when new derived metrics are needed
 */

export { registerEnrichment, getEnrichment, listEnrichments, getEnrichmentOrder } from '../pipeline/enrichmentRegistry';
export { registerDefaultEnrichmentLayers } from './registerDefaultLayers';
export { healthIndexEnrichment, computeHealthIndexFromPeriod } from './healthIndexEnrichment';
export type { EnrichedVracPeriod } from './healthIndexEnrichment';
export { regionNormalizationEnrichment } from './regionNormalizationEnrichment';
export type { RegionEnrichedPeriod } from './regionNormalizationEnrichment';
export { antibioticIndexEnrichment } from './antibioticIndexEnrichment';
export type { AntibioticEnrichedPeriod } from './antibioticIndexEnrichment';
export { analgesicIndexEnrichment } from './analgesicIndexEnrichment';
export type { AnalgesicEnrichedPeriod } from './analgesicIndexEnrichment';
export { timeLagIndicatorEnrichment } from './timeLagIndicatorEnrichment';
export type { TimeLagEnrichedPeriod } from './timeLagIndicatorEnrichment';
export { getProductCategory } from './productTaxonomy';
export type { TherapeuticCategory } from './productTaxonomy';
