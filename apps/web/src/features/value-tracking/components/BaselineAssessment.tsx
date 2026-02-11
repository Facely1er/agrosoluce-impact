import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getBaselineMeasurement, submitBaselineMeasurement } from '../api';
import type { BaselineMeasurement } from '../types';

interface BaselineAssessmentProps {
  cooperativeId: string;
  onComplete?: () => void;
}

export default function BaselineAssessment({ cooperativeId, onComplete }: BaselineAssessmentProps) {
  const [baseline, setBaseline] = useState<Partial<BaselineMeasurement>>({
    cooperativeId
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadBaseline();
  }, [cooperativeId]);

  const loadBaseline = async () => {
    setLoading(true);
    const { data } = await getBaselineMeasurement(cooperativeId);
    if (data) {
      setBaseline(data);
      setSubmitted(true);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { error } = await submitBaselineMeasurement(baseline as BaselineMeasurement);
    
    if (!error) {
      setSubmitted(true);
      if (onComplete) onComplete();
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
        <h3 className="text-lg font-semibold text-green-900 mb-2">Évaluation de base complétée</h3>
        <p className="text-green-700">Merci ! Ces mesures nous aideront à suivre l'impact d'AgroSoluce.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Évaluation de Base</h3>
        <p className="text-gray-600">
          Veuillez remplir cette évaluation avec les données AVANT l'utilisation d'AgroSoluce.
          Cela nous permettra de mesurer l'impact de la plateforme.
        </p>
      </div>

      <form className="space-y-6">
        {/* Administrative Time */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Temps Administratif (heures/semaine)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestion des listes de membres
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursMemberManagement || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursMemberManagement: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation des réunions
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursMeetingOrganization || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursMeetingOrganization: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Préparation des rapports
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursReportPreparation || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursReportPreparation: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suivi des certifications
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursCertificationTracking || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursCertificationTracking: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication avec membres
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursMemberCommunication || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursMemberCommunication: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestion documentaire
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.hoursDocumentManagement || ''}
                onChange={(e) => setBaseline({ ...baseline, hoursDocumentManagement: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total heures administratives/semaine
            </label>
            <input
              type="number"
              step="0.5"
              value={baseline.totalAdminHoursPerWeek || ''}
              onChange={(e) => setBaseline({ ...baseline, totalAdminHoursPerWeek: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Commercial Efficiency */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Efficacité Commerciale</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai moyen pour négocier un prix (jours)
              </label>
              <input
                type="number"
                step="0.5"
                value={baseline.avgDaysToNegotiatePrice || ''}
                onChange={(e) => setBaseline({ ...baseline, avgDaysToNegotiatePrice: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % de ventes au prix optimal
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={baseline.percentageSalesAtOptimalPrice || ''}
                onChange={(e) => setBaseline({ ...baseline, percentageSalesAtOptimalPrice: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Conformité et Certifications</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéances manquées (12 derniers mois)
              </label>
              <input
                type="number"
                value={baseline.missedDeadlines12Months || ''}
                onChange={(e) => setBaseline({ ...baseline, missedDeadlines12Months: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temps préparation audit (jours)
              </label>
              <input
                type="number"
                value={baseline.auditPreparationDays || ''}
                onChange={(e) => setBaseline({ ...baseline, auditPreparationDays: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Sécurité et Risques</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incidents de sécurité (12 derniers mois)
              </label>
              <input
                type="number"
                value={baseline.securityIncidents12Months || ''}
                onChange={(e) => setBaseline({ ...baseline, securityIncidents12Months: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pertes de données importantes
              </label>
              <input
                type="number"
                value={baseline.dataLossIncidents || ''}
                onChange={(e) => setBaseline({ ...baseline, dataLossIncidents: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes additionnelles
          </label>
          <textarea
            value={baseline.notes || ''}
            onChange={(e) => setBaseline({ ...baseline, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-4 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Soumettre l\'évaluation'}
          </button>
        </div>
      </form>
    </div>
  );
}

