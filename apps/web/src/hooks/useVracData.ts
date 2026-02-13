/**
 * useVracData - Unified VRAC data loader with fallback chain
 * 1. Try Supabase (vracService)
 * 2. Fallback to enriched.json (antibiotic, time-lag, region)
 * 3. Fallback to processed.json + client-side enrichment (always enriched when possible)
 */

import { useState, useEffect, useCallback } from 'react';
import { vracService } from '@/services/vrac/vracService';
import { applyEnrichments } from '@agrosoluce/data-insights';
import type { PharmacyProfile, RegionalHealthIndex } from '@agrosoluce/types';

export interface EnrichedHealthIndex extends RegionalHealthIndex {
  antibioticQuantity?: number;
  antibioticShare?: number;
  analgesicQuantity?: number;
  analgesicShare?: number;
  harvestAlignedRisk?: 'low' | 'medium' | 'high';
  inHarvestWindow?: boolean;
  regionId?: string;
  regionLabel?: string;
  isCocoaRegion?: boolean;
  categoryBreakdown?: Array<{ category: string; quantity: number }>;
}

export interface UseVracDataResult {
  pharmacies: PharmacyProfile[];
  healthIndex: EnrichedHealthIndex[];
  loading: boolean;
  error: string | null;
  source: 'database' | 'enriched' | 'processed' | null;
  refetch: () => void;
}

const PHARMACY_LABELS: PharmacyProfile[] = [
  { id: 'tanda', name: 'Grande Pharmacie de Tanda', region: 'gontougo', location: 'Tanda, Gontougo', regionLabel: 'Gontougo (cocoa)' },
  { id: 'prolife', name: 'Pharmacie Prolife', region: 'gontougo', location: 'Tabagne, Gontougo', regionLabel: 'Gontougo (cocoa)' },
  { id: 'olympique', name: 'Pharmacie Olympique', region: 'abidjan', location: 'Abidjan', regionLabel: 'Abidjan (urban)' },
  { id: 'attobrou', name: 'Pharmacie Attobrou', region: 'la_me', location: 'La Mé', regionLabel: 'La Mé (cocoa)' },
];

export function useVracData(): UseVracDataResult {
  const [pharmacies, setPharmacies] = useState<PharmacyProfile[]>([]);
  const [healthIndex, setHealthIndex] = useState<EnrichedHealthIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'database' | 'enriched' | 'processed' | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [pharmaciesData, healthIndexData] = await Promise.all([
        vracService.getPharmacyProfiles(),
        vracService.getRegionalHealthIndex(),
      ]);
      setPharmacies(pharmaciesData);
      setHealthIndex(healthIndexData as EnrichedHealthIndex[]);
      setSource('database');
    } catch {
      try {
        const res = await fetch('/data/vrac/enriched.json');
        if (res.ok) {
          const { enrichedPeriods } = await res.json();
          setPharmacies(PHARMACY_LABELS);
          const index: EnrichedHealthIndex[] = (enrichedPeriods || []).map((p: any) => ({
            pharmacyId: p.pharmacyId,
            periodLabel: p.periodLabel,
            year: p.year,
            antimalarialQuantity: p.healthIndex?.antimalarialQuantity ?? 0,
            totalQuantity: p.healthIndex?.totalQuantity ?? p.totalQuantity ?? 0,
            antimalarialShare: p.healthIndex?.antimalarialShare ?? 0,
            antibioticQuantity: p.antibioticIndex?.antibioticQuantity,
            antibioticShare: p.antibioticIndex?.antibioticShare,
            analgesicQuantity: p.analgesicIndex?.analgesicQuantity,
            analgesicShare: p.analgesicIndex?.analgesicShare,
            harvestAlignedRisk: p.timeLagIndicator?.harvestAlignedRisk,
            inHarvestWindow: p.timeLagIndicator?.inHarvestWindow,
            regionId: p.regionId,
            regionLabel: p.regionLabel,
            isCocoaRegion: p.isCocoaRegion,
            categoryBreakdown: p.healthIndex?.categoryBreakdown,
          }));
          setHealthIndex(index);
          setSource('enriched');
        } else {
          throw new Error('enriched.json not found');
        }
      } catch {
        try {
          const res = await fetch('/data/vrac/processed.json');
          if (res.ok) {
            const { periods } = await res.json();
            setPharmacies(PHARMACY_LABELS);
            const rawPeriods = periods || [];
            const enrichedPeriods = applyEnrichments(rawPeriods) as any[];
            const index: EnrichedHealthIndex[] = enrichedPeriods.map((p: any) => ({
              pharmacyId: p.pharmacyId,
              periodLabel: p.periodLabel,
              year: p.year,
              antimalarialQuantity: p.healthIndex?.antimalarialQuantity ?? 0,
              totalQuantity: p.healthIndex?.totalQuantity ?? p.totalQuantity ?? 0,
              antimalarialShare: p.healthIndex?.antimalarialShare ?? 0,
              antibioticQuantity: p.antibioticIndex?.antibioticQuantity,
              antibioticShare: p.antibioticIndex?.antibioticShare,
              analgesicQuantity: p.analgesicIndex?.analgesicQuantity,
              analgesicShare: p.analgesicIndex?.analgesicShare,
              harvestAlignedRisk: p.timeLagIndicator?.harvestAlignedRisk,
              inHarvestWindow: p.timeLagIndicator?.inHarvestWindow,
              regionId: p.regionId,
              regionLabel: p.regionLabel,
              isCocoaRegion: p.isCocoaRegion,
              categoryBreakdown: p.healthIndex?.categoryBreakdown,
            }));
            setHealthIndex(index);
            setSource('processed');
          } else {
            throw new Error('No VRAC data available');
          }
        } catch (e: any) {
          setError(e?.message || 'Failed to load VRAC data');
          setSource(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { pharmacies, healthIndex, loading, error, source, refetch: loadData };
}
