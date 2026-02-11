/**
 * Pilot Listing Page
 * Shows all available pilot programs
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Users, BarChart3, Info } from 'lucide-react';
import { getCanonicalDirectoryRecords } from '@/features/cooperatives/api/canonicalDirectoryApi';
import type { CanonicalCooperativeDirectory } from '@/types';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface PilotInfo {
  pilot_id: string;
  pilot_label: string;
  cooperativeCount: number;
}

export default function PilotListingPage() {
  const { t } = useI18n();
  const [pilots, setPilots] = useState<PilotInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPilots();
  }, []);

  const loadPilots = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCanonicalDirectoryRecords();

      if (result.error) {
        throw result.error;
      }

      const records = result.data || [];

      // Group by pilot_id
      const pilotMap = new Map<string, PilotInfo>();

      records.forEach((record: CanonicalCooperativeDirectory) => {
        if (record.pilot_id) {
          const existing = pilotMap.get(record.pilot_id) || {
            pilot_id: record.pilot_id,
            pilot_label: record.pilot_label || record.pilot_id,
            cooperativeCount: 0,
          };

          existing.cooperativeCount += 1;
          if (record.pilot_label && !existing.pilot_label) {
            existing.pilot_label = record.pilot_label;
          }

          pilotMap.set(record.pilot_id, existing);
        }
      });

      setPilots(Array.from(pilotMap.values()).sort((a, b) => 
        a.pilot_label.localeCompare(b.pilot_label)
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading pilots:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Error loading pilots: {error}</p>
            <Link
              to="/directory"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700 underline"
            >
              Go to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilot Programs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our pilot programs that group cooperatives together for monitoring, 
            evaluation, and impact measurement.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Info className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">What is a Pilot?</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Pilot programs group multiple cooperatives together for monitoring and evaluation purposes. 
              NGOs and partners use pilots to track progress, measure impact, and support improvement efforts 
              across a set of cooperatives working toward common goals.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">What You'll See</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-2 leading-relaxed">
              <li>• Aggregate metrics across all cooperatives</li>
              <li>• Documentation coverage percentages</li>
              <li>• Readiness status tracking</li>
              <li>• Individual cooperative performance</li>
            </ul>
          </div>
        </div>

        {/* Pilots List */}
        {pilots.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pilot Programs Available
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no active pilot programs. Check back later or explore the directory.
            </p>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              {t.pilot.exploreDirectory}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilots.map((pilot) => (
              <Link
                key={pilot.pilot_id}
                to={`/pilot/${pilot.pilot_id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-primary-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 rounded-lg p-3 group-hover:bg-primary-200 transition-colors">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {pilot.pilot_label}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {pilot.pilot_id}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>
                    {pilot.cooperativeCount} {pilot.cooperativeCount === 1 ? 'cooperative' : 'cooperatives'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            {t.pilot.backToDirectory}
          </Link>
        </div>
      </div>
    </div>
  );
}

