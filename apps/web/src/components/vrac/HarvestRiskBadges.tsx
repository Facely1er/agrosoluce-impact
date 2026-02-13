/**
 * Harvest-aligned risk badges - periods with high antimalarial during harvest window
 */

import { AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import type { EnrichedHealthIndex } from '@/hooks/useVracData';

interface HarvestRiskBadgesProps {
  data: EnrichedHealthIndex[];
  pharmacyLabels: Record<string, string>;
}

export function HarvestRiskBadges({ data, pharmacyLabels }: HarvestRiskBadgesProps) {
  const withRisk = data.filter((d) => d.harvestAlignedRisk != null && d.inHarvestWindow);
  if (withRisk.length === 0) return null;

  const highRisk = withRisk.filter((d) => d.harvestAlignedRisk === 'high');
  const mediumRisk = withRisk.filter((d) => d.harvestAlignedRisk === 'medium');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Harvest-Window Risk Indicators
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Periods during Aug–Mar (harvest window) with elevated antimalarial share indicate workforce health risk.
      </p>
      <div className="flex flex-wrap gap-3">
        {highRisk.map((d) => (
          <div
            key={`${d.pharmacyId}-${d.year}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {pharmacyLabels[d.pharmacyId] ?? d.pharmacyId} — {d.periodLabel}
            </span>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">High</span>
          </div>
        ))}
        {mediumRisk.map((d) => (
          <div
            key={`${d.pharmacyId}-${d.year}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <Shield className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {pharmacyLabels[d.pharmacyId] ?? d.pharmacyId} — {d.periodLabel}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Medium</span>
          </div>
        ))}
      </div>
      {highRisk.length === 0 && mediumRisk.length === 0 && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm">No elevated harvest-window risk in current data</span>
        </div>
      )}
    </div>
  );
}
