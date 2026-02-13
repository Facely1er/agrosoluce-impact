import { useMemo, useState, useEffect } from 'react';
import { computeHealthIndex, PHARMACIES } from '@agrosoluce/data-insights';
import type { PharmacyId } from '@agrosoluce/types';
import { MapPin, Download, TrendingUp, AlertCircle } from 'lucide-react';
import {
  ANALYTICS_DATA_RANGE,
  HEALTH_INDEX_METHODOLOGY,
  CORRELATION_STRENGTH_METHODOLOGY,
} from '@/data/analyticsMethodology';

interface ProcessedPeriod {
  pharmacyId: PharmacyId;
  periodLabel: string;
  year: number;
  products: Array<{ code: string; designation: string; quantitySold: number }>;
  totalQuantity: number;
}

interface RegionalStats {
  regionId: string;
  regionName: string;
  pharmacies: string[];
  avgAntimalarialShare: number;
  peakMonths: string[];
  totalDataPoints: number;
  correlationStrength: 'Strong' | 'Moderate' | 'Weak' | 'Unknown';
}

export function RegionalHealthComparison() {
  const [data, setData] = useState<{ periods: ProcessedPeriod[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/vrac/processed.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load VRAC data'))))
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const healthIndex = useMemo(() => {
    if (!data?.periods) return [];
    return computeHealthIndex(data.periods);
  }, [data]);

  const regionalStats = useMemo(() => {
    if (healthIndex.length === 0) return [];

    // Define regional groupings
    const regions: Record<
      string,
      { name: string; pharmacies: PharmacyId[]; correlationStrength: RegionalStats['correlationStrength'] }
    > = {
      gontougo: {
        name: 'Gontougo (Cocoa Region)',
        pharmacies: ['tanda', 'prolife'],
        correlationStrength: 'Strong',
      },
      la_me: {
        name: 'La Mé (Mixed Agriculture)',
        pharmacies: ['attobrou'],
        correlationStrength: 'Moderate',
      },
      abidjan: {
        name: 'Abidjan (Urban Control)',
        pharmacies: ['olympique'],
        correlationStrength: 'Weak',
      },
    };

    const stats: RegionalStats[] = [];

    for (const [regionId, config] of Object.entries(regions)) {
      const regionalData = healthIndex.filter((item) =>
        config.pharmacies.includes(item.pharmacyId as PharmacyId)
      );

      if (regionalData.length === 0) continue;

      // Calculate average antimalarial share
      const avgShare =
        regionalData.reduce((sum, item) => sum + item.antimalarialShare, 0) / regionalData.length;

      // Find peak months (months with highest antimalarial share)
      const monthlyShares: Record<string, { total: number; count: number }> = {};
      for (const item of regionalData) {
        const month = item.periodLabel.split(' ')[0]; // Extract month name
        if (!monthlyShares[month]) {
          monthlyShares[month] = { total: 0, count: 0 };
        }
        monthlyShares[month].total += item.antimalarialShare;
        monthlyShares[month].count += 1;
      }

      const monthlyAvg = Object.entries(monthlyShares).map(([month, data]) => ({
        month,
        avg: data.total / data.count,
      }));

      monthlyAvg.sort((a, b) => b.avg - a.avg);
      const peakMonths = monthlyAvg.slice(0, 3).map((m) => m.month);

      stats.push({
        regionId,
        regionName: config.name,
        pharmacies: config.pharmacies.map((id) => {
          const pharmacy = PHARMACIES.find((p) => p.id === id);
          return pharmacy?.name || id;
        }),
        avgAntimalarialShare: avgShare * 100, // Convert to percentage
        peakMonths,
        totalDataPoints: regionalData.length,
        correlationStrength: config.correlationStrength,
      });
    }

    return stats;
  }, [healthIndex]);

  const exportToCSV = () => {
    if (regionalStats.length === 0) return;

    const headers = [
      'Region',
      'Pharmacies',
      'Avg Antimalarial Share (%)',
      'Peak Months',
      'Correlation Strength',
      'Data Points',
    ];

    const rows = regionalStats.map((stat) => [
      stat.regionName,
      stat.pharmacies.join('; '),
      stat.avgAntimalarialShare.toFixed(2),
      stat.peakMonths.join(', '),
      stat.correlationStrength,
      stat.totalDataPoints.toString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `regional_health_comparison_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Failed to load regional comparison data</p>
            <p className="text-sm text-gray-600 mt-1">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Regional Health Comparison</h3>
            <p className="text-sm text-gray-600 mt-1">
              Aggregated antimalarial share by region (2020-2024)
            </p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>

      {/* Grid Layout for Desktop, Stack for Mobile */}
      <div className="grid md:grid-cols-3 gap-6">
        {regionalStats.map((stat) => {
          const getCorrelationColor = (strength: string) => {
            switch (strength) {
              case 'Strong':
                return 'bg-red-50 border-red-300 text-red-700';
              case 'Moderate':
                return 'bg-amber-50 border-amber-300 text-amber-700';
              case 'Weak':
                return 'bg-green-50 border-green-300 text-green-700';
              default:
                return 'bg-gray-50 border-gray-300 text-gray-700';
            }
          };

          const correlationColorClass = getCorrelationColor(stat.correlationStrength);

          return (
            <div
              key={stat.regionId}
              className="border-2 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{stat.regionName}</h4>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${correlationColorClass}`}
                >
                  {stat.correlationStrength}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Pharmacies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stat.pharmacies.map((pharmacy, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                      >
                        {pharmacy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Avg. Antimalarial Share
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-600">
                      {stat.avgAntimalarialShare.toFixed(2)}%
                    </span>
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Peak Malaria Months
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {stat.peakMonths.map((month, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded"
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Correlation:</strong> {stat.correlationStrength} correlation with harvest
                    data
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Data points:</strong> {stat.totalDataPoints} periods analyzed
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology & substantiation */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            <strong>Health index:</strong> {HEALTH_INDEX_METHODOLOGY.metric} {HEALTH_INDEX_METHODOLOGY.taxonomy} Source: {HEALTH_INDEX_METHODOLOGY.source}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Data range:</strong> {ANALYTICS_DATA_RANGE.health.label}. Regional averages use all periods per region; sample size (data points) shown per region.
          </p>
          <p className="text-xs text-blue-700 mt-2">
            {HEALTH_INDEX_METHODOLOGY.limitation}
          </p>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-800 mb-2">Correlation strength</p>
          <p className="text-sm text-gray-700 mb-2">{CORRELATION_STRENGTH_METHODOLOGY.description}</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {Object.entries(CORRELATION_STRENGTH_METHODOLOGY.classification).map(([k, v]) => (
              <li key={k}><strong>{k}:</strong> {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
