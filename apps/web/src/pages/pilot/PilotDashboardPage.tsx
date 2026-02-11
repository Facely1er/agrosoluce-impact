import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Info, BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getCanonicalDirectoryRecordsByPilotId } from '@/features/cooperatives/api/canonicalDirectoryApi';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import type { CanonicalCooperativeDirectory } from '@/types';
import { getCoverageMetrics } from '@/features/coverage/api/coverageApi';
import type { CoverageMetrics } from '@/services/coverageService';
import { getLatestReadinessSnapshot } from '@/features/readiness/api/readinessSnapshotsApi';
import type { ReadinessSnapshot } from '@/services/readinessSnapshotService';
import { getReadinessStatusLabel } from '@/data/readinessThresholdsConfig';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface CooperativeWithMetrics extends CanonicalCooperativeDirectory {
  coverage?: CoverageMetrics | null;
  readiness?: ReadinessSnapshot | null;
}

export default function PilotDashboardPage() {
  const { pilot_id } = useParams<{ pilot_id: string }>();
  const { t } = useI18n();
  const [cooperatives, setCooperatives] = useState<CooperativeWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pilotLabel, setPilotLabel] = useState<string>('');

  useEffect(() => {
    if (!pilot_id) {
      setError(t.pilot.pilotIdRequired);
      setLoading(false);
      return;
    }

    loadPilotData();
  }, [pilot_id]);

  const loadPilotData = async () => {
    if (!pilot_id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all cooperatives in this pilot
      const result = await getCanonicalDirectoryRecordsByPilotId(pilot_id);

      if (result.error) {
        throw result.error;
      }

      const coopRecords = result.data || [];

      if (coopRecords.length === 0) {
        setCooperatives([]);
        setLoading(false);
        return;
      }

      // Extract pilot label from first cooperative
      if (coopRecords[0].pilot_label) {
        setPilotLabel(coopRecords[0].pilot_label);
      } else {
        setPilotLabel(pilot_id);
      }

      // Fetch coverage metrics and readiness snapshots for each cooperative
      const cooperativesWithMetrics = await Promise.all(
        coopRecords.map(async (coop) => {
          const [coverageResult, readinessResult] = await Promise.all([
            getCoverageMetrics(coop.coop_id),
            getLatestReadinessSnapshot(coop.coop_id),
          ]);

          return {
            ...coop,
            coverage: coverageResult.data,
            readiness: readinessResult.data,
          };
        })
      );

      setCooperatives(cooperativesWithMetrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading pilot data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate metrics
  const aggregateMetrics = (() => {
    if (cooperatives.length === 0) {
      return {
        averageCoverage: 0,
        notReadyCount: 0,
        inProgressCount: 0,
        buyerReadyCount: 0,
        notReadyPercent: 0,
        inProgressPercent: 0,
        buyerReadyPercent: 0,
      };
    }

    const totalCoverage = cooperatives.reduce((sum, coop) => {
      return sum + (coop.coverage?.coverage_percentage || 0);
    }, 0);
    const averageCoverage = totalCoverage / cooperatives.length;

    const notReadyCount = cooperatives.filter(
      (coop) => coop.readiness?.readiness_status === 'not_ready'
    ).length;
    const inProgressCount = cooperatives.filter(
      (coop) => coop.readiness?.readiness_status === 'in_progress'
    ).length;
    const buyerReadyCount = cooperatives.filter(
      (coop) => coop.readiness?.readiness_status === 'buyer_ready'
    ).length;

    const total = cooperatives.length;
    const notReadyPercent = (notReadyCount / total) * 100;
    const inProgressPercent = (inProgressCount / total) * 100;
    const buyerReadyPercent = (buyerReadyCount / total) * 100;

    return {
      averageCoverage,
      notReadyCount,
      inProgressCount,
      buyerReadyCount,
      notReadyPercent,
      inProgressPercent,
      buyerReadyPercent,
    };
  })();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pilot data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/directory"
            className="text-secondary-600 hover:text-secondary-700"
          >
            {t.pilot.backToDirectory}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Directory', path: '/directory' },
          { label: `Pilot: ${pilotLabel}` }
        ]} />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Pilot Due-Diligence Snapshot
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div>
                    <span className="font-medium">Pilot:</span> {pilotLabel}
                  </div>
                  <div>
                    <span className="font-medium">Cooperatives:</span> {cooperatives.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Metrics Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            Aggregate Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div className="text-sm font-medium text-blue-900">Average Coverage</div>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {aggregateMetrics.averageCoverage.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="text-sm font-medium text-red-900">Not Ready</div>
              </div>
              <div className="text-3xl font-bold text-red-900">
                {aggregateMetrics.notReadyCount}
              </div>
              <div className="text-sm text-red-700 mt-1">
                ({aggregateMetrics.notReadyPercent.toFixed(1)}%)
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div className="text-sm font-medium text-yellow-900">In Progress</div>
              </div>
              <div className="text-3xl font-bold text-yellow-900">
                {aggregateMetrics.inProgressCount}
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                ({aggregateMetrics.inProgressPercent.toFixed(1)}%)
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="text-sm font-medium text-green-900">Buyer Ready</div>
              </div>
              <div className="text-3xl font-bold text-green-900">
                {aggregateMetrics.buyerReadyCount}
              </div>
              <div className="text-sm text-green-700 mt-1">
                ({aggregateMetrics.buyerReadyPercent.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Cooperative Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary-600" />
              Cooperatives
            </h2>
          </div>
          {cooperatives.length === 0 ? (
            <div className="p-12">
              <div className="text-center mb-8">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cooperatives Found in This Pilot</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {t.pilot.emptyDashboard} {t.pilot.emptyDashboardDescription}
                </p>
              </div>

              {/* Information Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="h-6 w-6 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">What is a Pilot?</h4>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    A pilot program groups multiple cooperatives together for monitoring and evaluation purposes. 
                    NGOs and partners use pilots to track progress, measure impact, and support improvement efforts 
                    across a set of cooperatives working toward common goals.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-semibold text-green-900">What You'll See Here</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-2 leading-relaxed">
                    <li>• Aggregate metrics across all cooperatives in the pilot</li>
                    <li>• Documentation coverage percentages</li>
                    <li>• Readiness status tracking (Not Ready, In Progress, Buyer Ready)</li>
                    <li>• Individual cooperative performance details</li>
                  </ul>
                </div>
              </div>

              {/* Action Links */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What You Can Do</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    to="/directory"
                    className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200 hover:bg-primary-100 transition-colors group"
                  >
                    <Building2 className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-primary-900">Browse Directory</div>
                      <div className="text-xs text-primary-700">Explore all cooperatives</div>
                    </div>
                  </Link>
                  <Link
                    to="/partners"
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors group"
                  >
                    <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-green-900">For Partners</div>
                      <div className="text-xs text-green-700">Learn about pilot programs</div>
                    </div>
                  </Link>
                  <Link
                    to="/buyer"
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors group"
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-blue-900">Buyer Portal</div>
                      <div className="text-xs text-blue-700">Access buyer tools</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  {t.pilot.verifyPilotId}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cooperative Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary Crop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Readiness Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Snapshot
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cooperatives.map((coop) => (
                    <tr key={coop.coop_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/workspace/${coop.coop_id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline transition-colors"
                        >
                          {coop.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coop.country || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coop.primary_crop || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coop.coverage?.coverage_percentage !== undefined
                          ? `${coop.coverage.coverage_percentage.toFixed(1)}%`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coop.readiness?.readiness_status
                          ? getReadinessStatusLabel(coop.readiness.readiness_status)
                          : 'No snapshot'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(coop.readiness?.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Disclaimer Section */}
        <div className="bg-yellow-50 rounded-xl shadow-md p-6 mt-6 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2 text-base">Important Disclaimer</p>
              <p className="leading-relaxed">
                This pilot view summarizes documentation coverage and readiness shorthand for the selected cooperatives. 
                It does not constitute a certification, rating, or compliance decision. The data presented here is 
                intended for monitoring and improvement purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

