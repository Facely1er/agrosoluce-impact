/**
 * Time-lag indicator: flag periods aligned with cocoa harvest window
 * Aug–Dec overlaps with main harvest (Oct–Mar); high antimalarial = potential workforce impact
 */

import type { EnrichmentLayer } from '../pipeline/types';
import type { EnrichedVracPeriod } from './healthIndexEnrichment';

/** Cocoa main harvest: Oct–Mar; mid crop: Apr–Sep. Aug–Dec spans rainy season + harvest start */
const HARVEST_MONTHS = new Set([8, 9, 10, 11, 12, 1, 2, 3]);

export interface TimeLagEnrichedPeriod extends EnrichedVracPeriod {
  timeLagIndicator: {
    inHarvestWindow: boolean;
    /** High antimalarial during harvest = elevated workforce risk */
    harvestAlignedRisk: 'low' | 'medium' | 'high';
  };
}

function getHarvestAlignedRisk(antimalarialShare: number): 'low' | 'medium' | 'high' {
  if (antimalarialShare >= 0.15) return 'high';
  if (antimalarialShare >= 0.08) return 'medium';
  return 'low';
}

export const timeLagIndicatorEnrichment: EnrichmentLayer<EnrichedVracPeriod, TimeLagEnrichedPeriod> = {
  id: 'time-lag-indicator',
  description: 'Flag periods aligned with harvest window and workforce risk',
  dependsOn: ['health-index'],
  enrich(p) {
    const periodStartMonth = parseInt(p.periodStart.split('-')[1], 10);
    const inHarvestWindow = HARVEST_MONTHS.has(periodStartMonth);
    const harvestAlignedRisk = getHarvestAlignedRisk(p.healthIndex.antimalarialShare);

    return {
      ...p,
      timeLagIndicator: {
        inHarvestWindow,
        harvestAlignedRisk,
      },
    };
  },
};
