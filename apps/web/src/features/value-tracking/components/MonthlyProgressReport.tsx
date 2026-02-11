import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getMonthlyProgress, submitMonthlyProgress, getBaselineMeasurement } from '../api';
import type { MonthlyProgress, BaselineMeasurement } from '../types';

interface MonthlyProgressReportProps {
  cooperativeId: string;
  month?: string; // ISO date string (first day of month)
  onComplete?: () => void;
}

export default function MonthlyProgressReport({ cooperativeId, month, onComplete }: MonthlyProgressReportProps) {
  const currentMonth = month || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [progress, setProgress] = useState<Partial<MonthlyProgress>>({
    cooperativeId,
    progressMonth: currentMonth,
    status: 'draft'
  });
  const [baseline, setBaseline] = useState<BaselineMeasurement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, [cooperativeId, currentMonth]);

  const loadData = async () => {
    setLoading(true);
    
    // Load baseline
    const { data: baselineData } = await getBaselineMeasurement(cooperativeId);
    if (baselineData) {
      setBaseline(baselineData);
      // Pre-fill baseline values
      setProgress(prev => ({
        ...prev,
        baselineAdminHoursPerWeek: baselineData.totalAdminHoursPerWeek
      }));
    }

    // Load existing progress
    const { data: progressData } = await getMonthlyProgress(cooperativeId, currentMonth);
    if (progressData && progressData.length > 0) {
      setProgress(progressData[0]);
      setSubmitted(progressData[0].status === 'submitted');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (status: 'draft' | 'submitted' = 'submitted') => {
    setSaving(true);
    
    // Calculate derived values
    const calculatedProgress = { ...progress };
    if (calculatedProgress.currentAdminHoursPerWeek && calculatedProgress.baselineAdminHoursPerWeek) {
      calculatedProgress.hoursReduction = 
        calculatedProgress.baselineAdminHoursPerWeek - calculatedProgress.currentAdminHoursPerWeek;
      calculatedProgress.percentageReduction = 
        ((calculatedProgress.hoursReduction / calculatedProgress.baselineAdminHoursPerWeek) * 100);
    }

    const { error } = await submitMonthlyProgress({
      ...calculatedProgress,
      status
    } as MonthlyProgress);

    if (!error) {
      setSubmitted(status === 'submitted');
      if (status === 'submitted' && onComplete) {
        onComplete();
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Rapport mensuel soumis avec succès</h3>
        <p className="text-green-700">Merci ! Votre rapport nous aide à mesurer l'impact d'AgroSoluce.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Rapport de Progrès Mensuel</h3>
        <p className="text-gray-600">
          Mois de {new Date(currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>
        {baseline && (
          <div className="mt-2 text-sm text-gray-500">
            Baseline: {baseline.totalAdminHoursPerWeek} heures/semaine
          </div>
        )}
      </div>

      <form className="space-y-6">
        {/* Administrative Time Savings */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Gains de Temps Administratif</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heures administratives actuelles/semaine
              </label>
              <input
                type="number"
                step="0.5"
                value={progress.currentAdminHoursPerWeek || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || undefined;
                  setProgress({
                    ...progress,
                    currentAdminHoursPerWeek: value,
                    hoursReduction: value && progress.baselineAdminHoursPerWeek 
                      ? progress.baselineAdminHoursPerWeek - value 
                      : undefined,
                    percentageReduction: value && progress.baselineAdminHoursPerWeek
                      ? ((progress.baselineAdminHoursPerWeek - value) / progress.baselineAdminHoursPerWeek * 100)
                      : undefined
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réduction d'heures
              </label>
              <input
                type="number"
                step="0.5"
                value={progress.hoursReduction || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % de réduction
              </label>
              <input
                type="number"
                step="0.1"
                value={progress.percentageReduction?.toFixed(1) || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tâches automatisées
              </label>
              <input
                type="number"
                value={progress.automatedTasksCount || ''}
                onChange={(e) => setProgress({ ...progress, automatedTasksCount: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Commercial Improvement */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Amélioration Commerciale</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amélioration prix moyen (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={progress.avgPriceImprovementPercentage || ''}
                onChange={(e) => setProgress({ ...progress, avgPriceImprovementPercentage: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouvelles opportunités identifiées
              </label>
              <input
                type="number"
                value={progress.newOpportunitiesIdentified || ''}
                onChange={(e) => setProgress({ ...progress, newOpportunitiesIdentified: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Conformité et Certification</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéances respectées
              </label>
              <input
                type="number"
                value={progress.deadlinesMet || ''}
                onChange={(e) => setProgress({ ...progress, deadlinesMet: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total échéances
              </label>
              <input
                type="number"
                value={progress.totalDeadlines || ''}
                onChange={(e) => setProgress({ ...progress, totalDeadlines: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Member Satisfaction */}
        <div className="pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Satisfaction des Membres</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score de satisfaction (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={progress.memberSatisfactionScore || ''}
                onChange={(e) => setProgress({ ...progress, memberSatisfactionScore: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % membres utilisant activement la plateforme
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={progress.activePlatformUsersPercentage || ''}
                onChange={(e) => setProgress({ ...progress, activePlatformUsersPercentage: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer comme brouillon'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('submitted')}
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Soumission...' : 'Soumettre le rapport'}
          </button>
        </div>
      </form>
    </div>
  );
}

