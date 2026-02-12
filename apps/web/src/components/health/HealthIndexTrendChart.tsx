import { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { computeHealthIndex, PHARMACIES } from '@agrosoluce/data-insights';
import type { PharmacyId } from '@agrosoluce/types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ProcessedPeriod {
  pharmacyId: PharmacyId;
  periodLabel: string;
  year: number;
  products: Array<{ code: string; designation: string; quantitySold: number }>;
  totalQuantity: number;
}

interface HealthIndexTrendChartProps {
  pharmacyIds?: PharmacyId[];
}

export function HealthIndexTrendChart({ pharmacyIds }: HealthIndexTrendChartProps) {
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

  const chartData = useMemo(() => {
    const selectedIds = pharmacyIds || ['tanda', 'prolife', 'olympique', 'attobrou'];
    const filteredData = healthIndex.filter((item) =>
      selectedIds.includes(item.pharmacyId as PharmacyId)
    );

    // Group by period
    const byPeriod: Record<
      string,
      { period: string; year: number; month?: string; [key: string]: string | number | undefined }
    > = {};

    for (const item of filteredData) {
      const key = `${item.year}-${item.periodLabel}`;
      if (!byPeriod[key]) {
        byPeriod[key] = {
          period: item.periodLabel,
          year: item.year,
          month: item.periodLabel.split(' ')[0], // Extract month name for sorting
        };
      }
      // Store antimalarial share as percentage (number, not string)
      byPeriod[key][item.pharmacyId] = item.antimalarialShare * 100;
    }

    // Sort by year and month
    const monthOrder: Record<string, number> = {
      JANVIER: 1,
      FEVRIER: 2,
      MARS: 3,
      AVRIL: 4,
      MAI: 5,
      JUIN: 6,
      JUILLET: 7,
      AOUT: 8,
      SEPTEMBRE: 9,
      OCTOBRE: 10,
      NOVEMBRE: 11,
      DECEMBRE: 12,
    };

    return Object.values(byPeriod).sort((a, b) => {
      if (a.year !== b.year) return (a.year as number) - (b.year as number);
      const monthA = monthOrder[a.month?.toUpperCase() || ''] || 0;
      const monthB = monthOrder[b.month?.toUpperCase() || ''] || 0;
      return monthA - monthB;
    });
  }, [healthIndex, pharmacyIds]);

  // Check if current period is malaria surge period (Aug-Dec)
  const isMalariaSurgePeriod = (month: string) => {
    const surgePeriods = ['AOUT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE'];
    return surgePeriods.includes(month.toUpperCase());
  };

  const pharmacyColors: Record<string, string> = {
    tanda: '#3b82f6', // blue-500
    prolife: '#10b981', // green-500
    olympique: '#f59e0b', // amber-500
    attobrou: '#ef4444', // red-500
  };

  const pharmacyLabels: Record<string, string> = {
    tanda: 'Tanda (Gontougo)',
    prolife: 'Prolife (Gontougo)',
    olympique: 'Olympique (Abidjan)',
    attobrou: 'Attobrou (La Mé)',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
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
            <p className="font-medium">Failed to load health index data</p>
            <p className="text-sm text-gray-600 mt-1">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Health Index Trend (2020-2024)</h3>
          <p className="text-sm text-gray-600 mt-1">
            Antimalarial share by pharmacy - Higher values indicate increased malaria burden
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Malaria Surge Period:</strong> August-December (shaded regions show peak transmission months)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Antimalarial Share (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '14px', fill: '#374151' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number) => [`${value}%`, '']}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => pharmacyLabels[value] || value}
          />

          {/* Add reference lines for malaria surge periods if needed */}
          {chartData.some((d) => d.month && isMalariaSurgePeriod(d.month as string)) && (
            <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="3 3" />
          )}

          {/* Render lines for each pharmacy */}
          {(pharmacyIds || (['tanda', 'prolife', 'olympique', 'attobrou'] as PharmacyId[])).map(
            (pharmacyId) => (
              <Line
                key={pharmacyId}
                type="monotone"
                dataKey={pharmacyId}
                stroke={pharmacyColors[pharmacyId]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={pharmacyId}
              />
            )
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {(pharmacyIds || (['tanda', 'prolife', 'olympique', 'attobrou'] as PharmacyId[])).map(
          (pharmacyId) => {
            const pharmacy = PHARMACIES.find((p) => p.id === pharmacyId);
            const avgShare =
              chartData.length > 0
                ? (
                    chartData.reduce((sum, d) => sum + (Number(d[pharmacyId]) || 0), 0) /
                    chartData.filter((d) => d[pharmacyId]).length
                  ).toFixed(2)
                : '0.00';

            return (
              <div
                key={pharmacyId}
                className="p-3 rounded-lg border"
                style={{ borderColor: pharmacyColors[pharmacyId] }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pharmacyColors[pharmacyId] }}
                  />
                  <p className="font-medium text-gray-900">{pharmacy?.name || pharmacyId}</p>
                </div>
                <p className="text-xs text-gray-600">{pharmacy?.regionLabel || 'Unknown'}</p>
                <p className="text-lg font-semibold mt-1" style={{ color: pharmacyColors[pharmacyId] }}>
                  {avgShare}%
                </p>
                <p className="text-xs text-gray-500">Avg. antimalarial share</p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
