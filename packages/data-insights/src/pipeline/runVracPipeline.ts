/**
 * Run VRAC pipeline: read files, parse, deduplicate, optionally enrich
 * Called from scripts/vrac/processVracData.ts
 */

import type { VracPeriodData } from '../sources/vrac/types';

export interface VracPipelineOptions {
  /** Root directory for VRAC files (default: VRAC) */
  vracRoot?: string;
  /** Run enrichment layers (default: false for backward compat) */
  enrich?: boolean;
}

export interface VracPipelineOutput {
  periods: VracPeriodData[];
  processedAt: string;
}

/** Deduplicate: prefer period with more products (Liste over 2080) */
function deduplicatePeriods(periods: VracPeriodData[]): VracPeriodData[] {
  const byKey = new Map<string, VracPeriodData>();
  for (const p of periods) {
    const key = `${p.pharmacyId}-${p.year}`;
    const existing = byKey.get(key);
    if (!existing || (p.products.length > existing.products.length)) {
      byKey.set(key, p);
    }
  }
  return Array.from(byKey.values()).sort((a, b) => {
    if (a.pharmacyId !== b.pharmacyId) return a.pharmacyId.localeCompare(b.pharmacyId);
    return b.year - a.year;
  });
}

/**
 * Process parsed periods - deduplication and sort
 * Call this from the script after reading files
 */
export function processVracPeriods(periods: VracPeriodData[]): VracPeriodData[] {
  return deduplicatePeriods(periods);
}
