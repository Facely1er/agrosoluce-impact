import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PageHeader from '@/components/layout/PageHeader';
import { Activity, TrendingUp, MapPin, Info, Download, Filter, AlertTriangle, TrendingDown, Heart } from 'lucide-react';
import { useVracData } from '@/hooks/useVracData';
import { AntibioticTrendChart, HarvestRiskBadges, CategoryBreakdownChart } from '@/components/vrac';

export default function VracAnalysisPage() {
  const { pharmacies, healthIndex, loading, error, source, refetch } = useVracData();

  // Filter states
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | 'all'>('all');
  const [viewType, setViewType] = useState<'quantity' | 'share'>('quantity');
  const [categoryView, setCategoryView] = useState<'stacked' | 'pie'>('stacked');

  const hasEnrichedData =
    source === 'enriched' ||
    healthIndex.some((h) => h.antibioticShare != null) ||
    healthIndex.some((h) => h.analgesicShare != null) ||
    healthIndex.some((h) => h.harvestAlignedRisk != null) ||
    healthIndex.some((h) => (h.categoryBreakdown?.length ?? 0) > 0);

  // Get available years
  const availableYears = useMemo(() => {
    if (!healthIndex.length) return [];
    const years = Array.from(new Set(healthIndex.map((h) => h.year)));
    return years.sort((a, b) => a - b);
  }, [healthIndex]);

  // Filter health index data
  const filteredHealthIndex = useMemo(() => {
    let filtered = healthIndex;

    if (selectedYear !== 'all') {
      filtered = filtered.filter((h) => h.year === selectedYear);
    }

    if (selectedPharmacy !== 'all') {
      filtered = filtered.filter((h) => h.pharmacyId === selectedPharmacy);
    }

    return filtered;
  }, [healthIndex, selectedYear, selectedPharmacy]);

  const chartData = useMemo(() => {
    const byKey: Record<string, { period: string; year: number; [key: string]: string | number }> = {};
    for (const p of filteredHealthIndex) {
      const key = `${p.periodLabel}`;
      if (!byKey[key]) {
        byKey[key] = { period: p.periodLabel, year: p.year };
      }
      if (viewType === 'share') {
        byKey[key][p.pharmacyId] = p.antimalarialShare * 100; // Store as number, format in tooltip
      } else {
        byKey[key][p.pharmacyId] = p.antimalarialQuantity;
      }
    }
    return Object.values(byKey).sort((a, b) => (a.year as number) - (b.year as number));
  }, [filteredHealthIndex, viewType]);

  const pharmacyLabels: Record<string, string> = {
    tanda: 'Tanda (Gontougo)',
    prolife: 'Prolife (Gontougo)',
    olympique: 'Olympique (Abidjan)',
    attobrou: 'Attobrou (La Mé)',
  };

  // Export functionality
  const exportToCSV = () => {
    if (!filteredHealthIndex.length) return;

    const hasExtra = filteredHealthIndex.some(
      (h) => h.antibioticShare != null || h.analgesicShare != null || h.harvestAlignedRisk != null
    );
    const headers = hasExtra
      ? [
          'Pharmacy',
          'Period',
          'Year',
          'Antimalarial Quantity',
          'Total Quantity',
          'Antimalarial Share (%)',
          'Antibiotic Share (%)',
          'Analgesic Share (%)',
          'Harvest Risk',
        ]
      : [
          'Pharmacy',
          'Period',
          'Year',
          'Antimalarial Quantity',
          'Total Quantity',
          'Antimalarial Share (%)',
        ];

    const rows = filteredHealthIndex.map((item) => {
      const base = [
        item.pharmacyId,
        item.periodLabel,
        item.year.toString(),
        item.antimalarialQuantity.toString(),
        item.totalQuantity.toString(),
        (item.antimalarialShare * 100).toFixed(2),
      ];
      if (hasExtra) {
        base.push(
          item.antibioticShare != null ? (item.antibioticShare * 100).toFixed(2) : '',
          item.analgesicShare != null ? (item.analgesicShare * 100).toFixed(2) : '',
          item.harvestAlignedRisk ?? ''
        );
      }
      return base;
    });

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `vrac_analysis_${selectedYear}_${selectedPharmacy}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (!filteredHealthIndex.length) return;

    const jsonData = JSON.stringify(
      {
        filters: {
          year: selectedYear,
          pharmacy: selectedPharmacy,
        },
        data: filteredHealthIndex,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );

    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `vrac_analysis_${selectedYear}_${selectedPharmacy}_${new Date().toISOString().split('T')[0]}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Run <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run vrac:process</code> to generate
            processed.json, or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run vrac:process:enrich</code> for enriched data.
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!healthIndex.length) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No VRAC data available.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Run <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run vrac:process</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Health Intelligence', path: '/vrac' }]} />

        <PageHeader
          badge="Health Intelligence • Pharmacy Surveillance"
          icon={Activity}
          title="Workforce Health Analysis"
          subtitle="Antimalarial sales (VRAC) from Côte d'Ivoire cocoa regions as a proxy for workforce health burden. Research shows a 3–4 week lag before harvest efficiency impact; use trends for early warning and supply chain risk assessment."
        />

        {/* Health Alert Cards */}
        {healthIndex.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Alert Card 1 - Malaria Activity */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                    Health Status
                  </h3>
                </div>
                <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                Elevated Activity
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Antimalarial share in Gontougo above recent baseline in one or more periods; interpret with harvest calendar and regional context.
              </p>
            </div>

            {/* Alert Card 2 - Productivity Impact */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                    Harvest Impact
                  </h3>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  HIGH
                </span>
              </div>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
                40-60% Risk
              </p>
              <p className="text-sm text-red-800 dark:text-red-200">
                Estimated harvest efficiency loss during malaria peaks based on academic research
              </p>
            </div>

            {/* Alert Card 3 - Early Warning */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    Early Warning
                  </h3>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  3-4 WEEKS
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                Predictive Signal
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Pharmacy data provides advance notice before satellite imagery shows crop stress
              </p>
            </div>
          </div>
        )}

        {/* Filters and Export Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filters & Export
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={exportToJSON}
                className="flex items-center gap-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vrac-filter-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                id="vrac-filter-year"
                aria-label="Filter by year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vrac-filter-pharmacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pharmacy
              </label>
              <select
                id="vrac-filter-pharmacy"
                aria-label="Filter by pharmacy"
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Pharmacies</option>
                {pharmacies.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vrac-filter-view-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Type
              </label>
              <select
                id="vrac-filter-view-type"
                aria-label="Chart view type: quantity or share"
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'quantity' | 'share')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="quantity">Quantity (units)</option>
                <option value="share">Share (%)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Showing:</strong> {filteredHealthIndex.length} data points
              {selectedYear !== 'all' && ` from ${selectedYear}`}
              {selectedPharmacy !== 'all' && ` for ${pharmacies.find((p) => p.id === selectedPharmacy)?.name || selectedPharmacy}`}
              {source && (
                <span className="ml-2 text-blue-600 dark:text-blue-300">
                  (Source: {source})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Pharmacy Network
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {pharmacies.map((p) => (
                <li key={p.id}>
                  <span className="font-medium">{p.name}</span> — {p.regionLabel}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Data Coverage
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {healthIndex.length} pharmacy-periods from Aug–Dec 2022 to Aug–Dec 2025.
              ARTEFAN and PLUFENTRINE sales are used as the antimalarial proxy.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Antimalarial Sales by Pharmacy & Period
              {viewType === 'share' ? ' (%)' : ' (Quantity)'}
            </h2>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 13, fill: '#6B7280' }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 13, fill: '#6B7280' }} 
                  label={{ 
                    value: viewType === 'share' ? 'Antimalarial Share (%)' : 'Quantity (units)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 14, fill: '#374151' }
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {Array.from(new Set(healthIndex.map((h) => h.pharmacyId))).map((phId) => (
                  <Bar
                    key={phId}
                    dataKey={phId}
                    name={pharmacyLabels[phId] ?? phId}
                    fill={phId === 'tanda' ? '#059669' : phId === 'prolife' ? '#0d9488' : phId === 'olympique' ? '#6366f1' : '#8b5cf6'}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Antimalarial Trend Over Time
            {viewType === 'share' ? ' (%)' : ' (Quantity)'}
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 13, fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 13, fill: '#6B7280' }} 
                  label={{ 
                    value: viewType === 'share' ? 'Antimalarial Share (%)' : 'Quantity (units)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 14, fill: '#374151' }
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {Array.from(new Set(healthIndex.map((h) => h.pharmacyId))).map((phId) => (
                  <Line
                    key={phId}
                    type="monotone"
                    dataKey={phId}
                    name={pharmacyLabels[phId] ?? phId}
                    stroke={phId === 'tanda' ? '#059669' : phId === 'prolife' ? '#0d9488' : phId === 'olympique' ? '#6366f1' : '#8b5cf6'}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enriched Insights - Antibiotic, Harvest Risk, Category Breakdown */}
        {hasEnrichedData && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Enriched Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AntibioticTrendChart data={filteredHealthIndex} pharmacyLabels={pharmacyLabels} />
              <HarvestRiskBadges data={filteredHealthIndex} pharmacyLabels={pharmacyLabels} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor="vrac-category-view" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category view:
              </label>
              <select
                id="vrac-category-view"
                aria-label="Category breakdown view: by period or overall mix"
                value={categoryView}
                onChange={(e) => setCategoryView(e.target.value as 'stacked' | 'pie')}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
              >
                <option value="stacked">By Period</option>
                <option value="pie">Overall Mix</option>
              </select>
            </div>
            <CategoryBreakdownChart
              data={filteredHealthIndex}
              pharmacyLabels={pharmacyLabels}
              view={categoryView}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Key Insights Panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Key Insights
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Regional Pattern:</strong> Gontougo pharmacies (Tanda, Prolife) show elevated antimalarial
                  sales during Aug–Dec 2024–2025, consistent with the production crisis timeline in cocoa-producing regions.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Health-Agriculture Correlation:</strong> Academic research shows malaria reduces harvest 
                  efficiency by 40–60% among affected farmers, creating a direct supply chain impact.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Predictive Value:</strong> Pharmacy surveillance provides 3-4 week early warning before
                  productivity impacts become visible in satellite crop monitoring data.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Actions Panel */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Actions
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  For Buyers
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Consider flexible delivery timelines for Gontougo cooperatives
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  For Cooperatives
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Monitor quality control closely during health stress periods
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  For Partners
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Engage health support programs in affected regions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
