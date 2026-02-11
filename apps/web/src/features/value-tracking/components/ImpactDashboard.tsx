import { useEffect, useState } from 'react';
import { TrendingUp, Clock, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { getImpactSummary } from '../api';
import type { ImpactSummary } from '../types';

interface ImpactDashboardProps {
  cooperativeId: string;
}

export default function ImpactDashboard({ cooperativeId }: ImpactDashboardProps) {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [cooperativeId]);

  const loadSummary = async () => {
    setLoading(true);
    const { data } = await getImpactSummary(cooperativeId);
    if (data) {
      setSummary(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!summary || !summary.baseline) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          Veuillez compléter l'évaluation de base pour voir le tableau de bord d'impact.
        </p>
      </div>
    );
  }

  const baseline = summary.baseline;
  const progress = summary.latestProgress;
  const metrics = summary.latestMetrics;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {summary.totalTimeSaved?.toFixed(1) || '0'}h
            </span>
          </div>
          <p className="text-sm text-gray-600">Temps économisé/semaine</p>
          {summary.improvementPercentage && (
            <p className="text-xs text-green-600 mt-1">
              {summary.improvementPercentage.toFixed(1)}% de réduction
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              ${summary.totalEconomicImpact?.toFixed(0) || '0'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Impact économique total</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {progress?.avgPriceImprovementPercentage?.toFixed(1) || '0'}%
            </span>
          </div>
          <p className="text-sm text-gray-600">Amélioration des prix</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              {metrics?.securityIncidentsAvoided || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Incidents évités</p>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison Baseline vs Actuel</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Heures administratives/semaine</p>
              <p className="text-sm text-gray-600">Temps total consacré aux tâches administratives</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {baseline.totalAdminHoursPerWeek || 0}h → {progress?.currentAdminHoursPerWeek || baseline.totalAdminHoursPerWeek || 0}h
              </p>
              {progress?.percentageReduction && (
                <p className="text-sm text-green-600">
                  -{progress.percentageReduction.toFixed(1)}%
                </p>
              )}
            </div>
          </div>

          {progress && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Échéances respectées</p>
                  <p className="text-sm text-gray-600">Taux de conformité aux échéances</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {progress.deadlinesMet || 0}/{progress.totalDeadlines || 0}
                  </p>
                  {progress.totalDeadlines && progress.deadlinesMet && (
                    <p className="text-sm text-green-600">
                      {((progress.deadlinesMet / progress.totalDeadlines) * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Satisfaction des membres</p>
                  <p className="text-sm text-gray-600">Score de satisfaction globale</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {progress.memberSatisfactionScore || 'N/A'}/10
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      {progress && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progrès Mensuel</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Rapport soumis</p>
                <p className="text-sm text-gray-600">
                  {new Date(progress.progressMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {progress.hoursReduction && (
              <div className="ml-8 pl-4 border-l-2 border-green-500">
                <p className="text-sm text-gray-700">
                  <strong>{progress.hoursReduction.toFixed(1)} heures</strong> économisées ce mois
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

