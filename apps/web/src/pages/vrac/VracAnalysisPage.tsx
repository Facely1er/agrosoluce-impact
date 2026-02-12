import { useMemo, useState, useEffect } from 'react';
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
import { PHARMACIES, computeHealthIndex } from '@agrosoluce/data-insights';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Activity, TrendingUp, MapPin, Info, Download, Filter } from 'lucide-react';

interface ProcessedPeriod {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  products: Array<{ code: string; designation: string; quantitySold: number }>;
  totalQuantity: number;
}

export default function VracAnalysisPage() {
  const [data, setData] = useState<{ periods: ProcessedPeriod[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | 'all'>('all');
  const [viewType, setViewType] = useState<'quantity' | 'share'>('quantity');

  useEffect(() => {
    fetch('/data/vrac/processed.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load'))))
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const healthIndex = useMemo(() => {
    if (!data?.periods) return [];
    return computeHealthIndex(data.periods);
  }, [data]);

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

    const headers = [
      'Pharmacy',
      'Period',
      'Year',
      'Antimalarial Quantity',
      'Total Quantity',
      'Antimalarial Share (%)',
    ];

    const rows = filteredHealthIndex.map((item) => [
      item.pharmacyId,
      item.periodLabel,
      item.year.toString(),
      item.antimalarialQuantity.toString(),
      item.totalQuantity.toString(),
      (item.antimalarialShare * 100).toFixed(2),
    ]);

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

  if (error || !data) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'No data available. Run: npm run vrac:process'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            VRAC pharmacy data must be processed before viewing the analysis dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Workforce Health', path: '/vrac' }]} />

        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-xl shadow-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-8 w-8 text-white/90" />
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Pharmacy Surveillance
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Workforce Health Analysis
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-3xl">
              Antimalarial sales as a proxy for community health in Côte d'Ivoire cocoa regions
            </p>
            <p className="text-base text-white/80 max-w-3xl">
              Pharmacy sales data from Gontougo (cocoa), La Mé (cocoa), and Abidjan (urban) provide
              regional health signals for supply chain intelligence and ESG monitoring.
            </p>
          </div>
        </div>

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pharmacy
              </label>
              <select
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Pharmacies</option>
                {PHARMACIES.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Type
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'quantity' | 'share')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="quantity">Quantity (units)</option>
                <option value="share">Share (%)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Showing:</strong> {filteredHealthIndex.length} data points
              {selectedYear !== 'all' && ` from ${selectedYear}`}
              {selectedPharmacy !== 'all' && ` for ${PHARMACIES.find(p => p.id === selectedPharmacy)?.name || selectedPharmacy}`}
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
              {PHARMACIES.map((p) => (
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
              {data.periods.length} pharmacy-periods from Aug–Dec 2022 to Aug–Dec 2025.
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: viewType === 'share' ? 'Share (%)' : 'Quantity', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {Array.from(new Set(healthIndex.map((h) => h.pharmacyId))).map((phId) => (
                  <Bar
                    key={phId}
                    dataKey={phId}
                    name={pharmacyLabels[phId] ?? phId}
                    fill={phId === 'tanda' ? '#059669' : phId === 'prolife' ? '#0d9488' : phId === 'olympique' ? '#6366f1' : '#8b5cf6'}
                    radius={[4, 4, 0, 0]}
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: viewType === 'share' ? 'Share (%)' : 'Quantity', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {Array.from(new Set(healthIndex.map((h) => h.pharmacyId))).map((phId) => (
                  <Line
                    key={phId}
                    type="monotone"
                    dataKey={phId}
                    name={pharmacyLabels[phId] ?? phId}
                    stroke={phId === 'tanda' ? '#059669' : phId === 'prolife' ? '#0d9488' : phId === 'olympique' ? '#6366f1' : '#8b5cf6'}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Insight:</strong> Gontougo pharmacies (Tanda, Prolife) show elevated antimalarial
            sales during Aug–Dec 2024–2025, consistent with the production crisis timeline. Academic
            literature suggests malaria reduces harvest efficiency by 40–60% among affected farmers.
          </p>
        </div>
      </div>
    </div>
  );
}
