import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Building2, MapPin, Package, FileCheck, TrendingUp } from 'lucide-react';
import type { CanonicalCooperativeDirectory } from '@/types';
import type { EudrCommodity } from '@/types';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';

const CHART_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function getCommoditiesFromRecord(record: CanonicalCooperativeDirectory): EudrCommodity[] {
  if (record.commodities && record.commodities.length > 0) return record.commodities;
  if (record.primary_crop) {
    const cropLower = record.primary_crop.toLowerCase();
    const map: Record<string, EudrCommodity> = {
      cocoa: 'cocoa', cacao: 'cocoa', coffee: 'coffee', café: 'coffee',
      palm: 'palm_oil', 'palm oil': 'palm_oil', rubber: 'rubber', soy: 'soy',
      soja: 'soy', cattle: 'cattle', wood: 'wood', timber: 'wood',
    };
    for (const [key, value] of Object.entries(map)) {
      if (cropLower.includes(key)) return [value];
    }
  }
  return [];
}

export interface DirectoryVisualizationDashboardProps {
  records: CanonicalCooperativeDirectory[];
  /** When user clicks a region in the dashboard, filter by it */
  onRegionClick?: (region: string) => void;
  /** Optional class for the container */
  className?: string;
}

export default function DirectoryVisualizationDashboard({
  records,
  onRegionClick,
  className = '',
}: DirectoryVisualizationDashboardProps) {
  const { regionCounts, commodityCounts, coverageCounts, total, regionCount, commodityCount } = useMemo(() => {
    const regionMap: Record<string, number> = {};
    const commodityMap: Record<string, number> = {};
    const coverageMap: Record<string, number> = {};
    records.forEach((r) => {
      const region = r.regionName || r.region || 'Unspecified';
      regionMap[region] = (regionMap[region] || 0) + 1;
      getCommoditiesFromRecord(r).forEach((c) => {
        commodityMap[c] = (commodityMap[c] || 0) + 1;
      });
      const band = r.coverageBand || 'Not set';
      coverageMap[band] = (coverageMap[band] || 0) + 1;
    });
    const regionCounts = Object.entries(regionMap)
      .map(([name, count]) => ({ name, count, fullName: name }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
    const commodityCounts = Object.entries(commodityMap).map(([id, count]) => ({
      name: EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === id)?.label || id,
      value: count,
    }));
    const coverageCounts = Object.entries(coverageMap).map(([band, value]) => ({
      name: band === 'Not set' ? 'Not set' : band.charAt(0).toUpperCase() + band.slice(1),
      value,
    }));
    return {
      regionCounts,
      commodityCounts,
      coverageCounts,
      total: records.length,
      regionCount: Object.keys(regionMap).length,
      commodityCount: Object.keys(commodityMap).length,
    };
  }, [records]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Key indicators */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Building2 className="h-4 w-4 text-primary-600" />
            <span className="text-xs font-medium">Cooperatives</span>
          </div>
          <div className="text-2xl font-bold text-primary-600">{total.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <MapPin className="h-4 w-4 text-secondary-600" />
            <span className="text-xs font-medium">Regions</span>
          </div>
          <div className="text-2xl font-bold text-secondary-600">{regionCount}</div>
        </div>
      </div>

      {/* Top regions bar chart (clickable) */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" /> Cooperatives by region
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionCounts}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (v.length > 14 ? v.slice(0, 12) + '…' : v)}
              />
              <RechartsTooltip
                content={({ payload }) =>
                  payload?.[0] ? (
                    <div className="bg-white border rounded shadow-lg px-2 py-1 text-xs">
                      {payload[0].payload.fullName}: {payload[0].value} coop.
                      {onRegionClick && (
                        <button
                          type="button"
                          onClick={() => onRegionClick(payload[0].payload.fullName)}
                          className="mt-1 block text-primary-600 hover:underline"
                        >
                          Filter by this region →
                        </button>
                      )}
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commodity breakdown */}
      {commodityCounts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Package className="h-3.5 w-3.5" /> By commodity
          </h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={commodityCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={44}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {commodityCounts.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => [`${value} cooperatives`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Coverage breakdown */}
      {coverageCounts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <FileCheck className="h-3.5 w-3.5" /> Documentation coverage
          </h3>
          <div className="space-y-1.5">
            {coverageCounts.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{c.name}</span>
                <span className="font-medium text-gray-900">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick region list (click to filter) */}
      {onRegionClick && regionCounts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Filter by region</h3>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {regionCounts.map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => onRegionClick(r.fullName)}
                className="px-2 py-1 rounded bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-xs transition-colors"
              >
                {r.fullName.length > 14 ? r.fullName.slice(0, 12) + '…' : r.fullName} ({r.count})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
