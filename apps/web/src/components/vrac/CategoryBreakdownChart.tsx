/**
 * Therapeutic category breakdown - stacked bar by pharmacy/period
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
  Cell,
} from 'recharts';
import { PieChart, Pie, Cell as PieCell } from 'recharts';
import { Layers } from 'lucide-react';
import type { EnrichedHealthIndex } from '@/hooks/useVracData';

interface CategoryBreakdownChartProps {
  data: EnrichedHealthIndex[];
  pharmacyLabels: Record<string, string>;
  view: 'stacked' | 'pie';
}

const CATEGORY_COLORS: Record<string, string> = {
  antimalarial: '#dc2626',
  antibiotic: '#2563eb',
  analgesic: '#059669',
  other: '#6b7280',
};

export function CategoryBreakdownChart({ data, pharmacyLabels, view }: CategoryBreakdownChartProps) {
  const withBreakdown = data.filter((d) => d.categoryBreakdown && d.categoryBreakdown.length > 0);
  if (withBreakdown.length === 0) return null;

  if (view === 'pie') {
    const totals = withBreakdown.reduce(
      (acc, d) => {
        for (const c of d.categoryBreakdown || []) {
          acc[c.category] = (acc[c.category] || 0) + c.quantity;
        }
        return acc;
      },
      {} as Record<string, number>
    );
    const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }));

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Therapeutic Category Mix (All Periods)
          </h2>
        </div>
        <div className="h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, i) => (
                  <PieCell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#6b7280'} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Quantity']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  const byPeriod: Record<string, { period: string; year: number; [key: string]: string | number }> = {};
  for (const d of withBreakdown) {
    const key = d.periodLabel;
    if (!byPeriod[key]) {
      byPeriod[key] = { period: d.periodLabel, year: d.year };
    }
    for (const c of d.categoryBreakdown || []) {
      const prev = (byPeriod[key][c.category] as number) || 0;
      byPeriod[key][c.category] = prev + c.quantity;
    }
  }
  const rows = Object.values(byPeriod).sort((a, b) => (a.year as number) - (b.year as number));
  const categories = Array.from(new Set(withBreakdown.flatMap((d) => (d.categoryBreakdown || []).map((c) => c.category))));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Therapeutic Category by Period
        </h2>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {categories.map((cat) => (
              <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat] ?? '#6b7280'} name={cat} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
