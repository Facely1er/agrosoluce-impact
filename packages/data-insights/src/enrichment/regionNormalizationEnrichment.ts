/**
 * Region normalization enrichment: map pharmacy to cocoa/urban region
 * Used for comparative analysis (cocoa regions vs urban baseline)
 */

import type { EnrichmentLayer } from '../pipeline/types';
import type { EnrichedVracPeriod } from './healthIndexEnrichment';

const PHARMACY_REGION: Record<string, string> = {
  tanda: 'gontougo',
  prolife: 'gontougo',
  olympique: 'abidjan',
  attobrou: 'la_me',
};

const REGION_LABELS: Record<string, string> = {
  gontougo: 'Gontougo (cocoa)',
  la_me: 'La Mé (cocoa)',
  abidjan: 'Abidjan (urban)',
};

export interface RegionEnrichedPeriod extends EnrichedVracPeriod {
  regionId: string;
  regionLabel: string;
  isCocoaRegion: boolean;
}

export const regionNormalizationEnrichment: EnrichmentLayer<EnrichedVracPeriod, RegionEnrichedPeriod> = {
  id: 'region-normalization',
  description: 'Map pharmacy to region label and cocoa/urban flag',
  dependsOn: ['health-index'],
  enrich(p) {
    const pharmacyId = p.pharmacyId.toLowerCase();
    const regionId = PHARMACY_REGION[pharmacyId] ?? 'unknown';
    const regionLabel = REGION_LABELS[regionId] ?? regionId;
    const isCocoaRegion = regionId === 'gontougo' || regionId === 'la_me';

    return {
      ...p,
      regionId,
      regionLabel,
      isCocoaRegion,
    };
  },
};
