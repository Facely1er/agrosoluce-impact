/**
 * Antibiotic share trend chart - infection proxy complement to antimalarial
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Heart, Activity } from 'lucide-react';
import type { EnrichedHealthIndex } from '@/hooks/useVracData';

interface AntibioticTrendChartProps {
  data: EnrichedHealthIndex[];
  pharmacyLabels: Record<string, string>;
}

export function AntibioticTrendChart({ data, pharmacyLabels }: AntibioticTrendChartProps) {
  const chartData = data
    .filter((d) => d.antibioticShare != null)
    .reduce<Record<string, { period: string; year: number; [key: string]: string | number }>>(
      (acc, p) => {
        const key = p.periodLabel;
        if (!acc[key]) acc[key] = { period: p.periodLabel, year: p.year };
        acc[key][p.pharmacyId] = (p.antibioticShare! * 100);
        return acc;
      },
      {}
    );

  const rows = Object.values(chartData).sort((a, b) => (a.year as number) - (b.year as number));
  const pharmacyIds = Array.from(new Set(data.map((d) => d.pharmacyId)));

  if (rows.length === 0) return null;

  const colors: Record<string, string> = {
    tanda: '#059669',
    prolife: '#0d9488',
    olympique: '#6366f1',
    attobrou: '#8b5cf6',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-rose-500" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Antibiotic Share by Pharmacy & Period
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Infection/respiratory proxy — complements antimalarial for broader health burden
          </p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Share (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(v: number) => [`${Number(v).toFixed(2)}%`, '']} />
            <Legend />
            {pharmacyIds.map((phId) => (
              <Bar
                key={phId}
                dataKey={phId}
                name={pharmacyLabels[phId] ?? phId}
                fill={colors[phId] ?? '#6b7280'}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
