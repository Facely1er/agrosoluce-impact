/**
 * Register default enrichment layers
 * Call this before running the pipeline with enrich=true
 */

import { registerEnrichment } from '../pipeline/enrichmentRegistry';
import { healthIndexEnrichment } from './healthIndexEnrichment';
import { regionNormalizationEnrichment } from './regionNormalizationEnrichment';
import { antibioticIndexEnrichment } from './antibioticIndexEnrichment';
import { analgesicIndexEnrichment } from './analgesicIndexEnrichment';
import { timeLagIndicatorEnrichment } from './timeLagIndicatorEnrichment';

let registered = false;

export function registerDefaultEnrichmentLayers(): void {
  if (registered) return;
  registerEnrichment(healthIndexEnrichment);
  registerEnrichment(regionNormalizationEnrichment);
  registerEnrichment(antibioticIndexEnrichment);
  registerEnrichment(analgesicIndexEnrichment);
  registerEnrichment(timeLagIndicatorEnrichment);
  registered = true;
}
