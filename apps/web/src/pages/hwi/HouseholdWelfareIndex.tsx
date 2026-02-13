/**
 * Household Welfare Index Dashboard
 * 
 * Main dashboard for viewing HWI scores, alerts, and trends
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PageHeader from '@/components/layout/PageHeader';
import { HWICard } from '../../components/hwi/HWICard';
import { HWIGauge } from '../../components/hwi/HWIGauge';
import { AlertLevelBadge } from '../../components/hwi/AlertLevelBadge';
import { 
  getLatestHWIScores, 
  getActiveAlerts, 
  getAlertDistribution,
  HWIScoreWithPharmacy 
} from '../../services/hwi/hwiService';
import { generateSummaryStats } from '../../utils/data/hwiDataUtils';

export default function HouseholdWelfareIndex() {
  const [latestScores, setLatestScores] = useState<HWIScoreWithPharmacy[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<HWIScoreWithPharmacy[]>([]);
  const [alertDistribution, setAlertDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [scores, alerts, distribution] = await Promise.all([
        getLatestHWIScores(),
        getActiveAlerts(),
        getAlertDistribution(),
      ]);

      setLatestScores(scores);
      setActiveAlerts(alerts);
      setAlertDistribution(distribution);
    } catch (err) {
      console.error('Error loading HWI data:', err);
      setError('Failed to load HWI data. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-semibold">Error</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              <button
                onClick={loadData}
                className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = latestScores.length > 0 ? generateSummaryStats(latestScores) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Household Welfare Index', path: '/hwi' }]} />
        <PageHeader
          badge="ESG Monitoring"
          icon={AlertCircle}
          title="Household Welfare Index"
          subtitle="Pharmacy-derived welfare alerts in cocoa-growing regions; supports impact and risk monitoring."
        />

        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Pharmacies Monitored"
              value={stats.count}
              icon={<AlertCircle className="h-5 w-5" />}
            />
            <StatCard
              title="Average HWI Score"
              value={stats.mean.toFixed(1)}
              subtitle="Lower is better"
              icon={<TrendingDown className="h-5 w-5" />}
            />
            <StatCard
              title="Active Alerts"
              value={activeAlerts.length}
              subtitle={`${activeAlerts.filter(a => a.alert_level === 'red' || a.alert_level === 'black').length} critical`}
              icon={<AlertCircle className="h-5 w-5" />}
              variant={activeAlerts.length > 0 ? 'warning' : 'success'}
            />
            <StatCard
              title="Score Range"
              value={`${stats.min} - ${stats.max}`}
              icon={<Minus className="h-5 w-5" />}
            />
          </div>
        )}

        {/* Alert Distribution */}
        {alertDistribution.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Alert Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {alertDistribution.map((dist) => (
                <div key={dist.alert_level} className="text-center">
                  <AlertLevelBadge level={dist.alert_level as any} />
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dist.count}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      ({dist.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Active Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAlerts.slice(0, 6).map((alert) => (
                <HWICard
                  key={alert.id}
                  score={alert.hwi_score}
                  alertLevel={alert.alert_level}
                  pharmacyName={alert.pharmacy_name}
                  departement={alert.departement}
                  period={alert.period_label}
                  year={alert.year}
                  size="sm"
                />
              ))}
            </div>
            {activeAlerts.length > 6 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing 6 of {activeAlerts.length} alerts
                </span>
              </div>
            )}
          </div>
        )}

        {/* Latest Scores */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Latest Scores by Pharmacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestScores.map((score) => (
              <HWICard
                key={score.id}
                score={score.hwi_score}
                alertLevel={score.alert_level}
                pharmacyName={score.pharmacy_name}
                departement={score.departement}
                period={score.period_label}
                year={score.year}
                showComponents
                components={{
                  workforce_health: score.workforce_health_score || 0,
                  child_welfare: score.child_welfare_score || 0,
                  womens_health: score.womens_health_score || 0,
                  womens_empowerment: score.womens_empowerment_score || 0,
                  nutrition: score.nutrition_score || 0,
                  chronic_illness: score.chronic_illness_score || 0,
                  acute_illness: score.acute_illness_score || 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {latestScores.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No HWI Data Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Run the VRAC migration to calculate HWI scores.
            </p>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
              npm run vrac:migrate
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  return (
    <div className={`rounded-lg shadow-md p-6 border ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
