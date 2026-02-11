/**
 * Assessment Form Component
 * Create and edit child labor assessments
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import ChildLaborService from '@/services/childLaborService';
import { useCooperatives } from '@/hooks/useCooperatives';
import { AgeVerificationMethod } from '@/types/child-labor-monitoring-types';
import type {
  CreateAssessmentRequest,
} from '@/types/child-labor-monitoring-types';

const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { cooperatives, loading: coopsLoading } = useCooperatives();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateAssessmentRequest>({
    cooperativeId: '',
    assessmentPeriodStart: '',
    assessmentPeriodEnd: '',
    totalChildrenInCommunity: 0,
    childrenEnrolledSchool: 0,
    minimumWorkingAge: 16,
    totalWorkersAssessed: 0,
    underageWorkersFound: 0,
    ageVerificationMethod: AgeVerificationMethod.BirthCertificate,
    childLaborViolations: 0,
    hazardousWorkViolations: 0,
    worstFormsViolations: 0,
    violationDetails: [],
    assessorName: '',
    assessorOrganization: '',
    assessorNotes: '',
    evidenceDocuments: [],
  });

  // Calculate enrollment rate
  const enrollmentRate =
    formData.totalChildrenInCommunity > 0
      ? (formData.childrenEnrolledSchool / formData.totalChildrenInCommunity) * 100
      : 0;

  // Calculate readiness score (self-assessment, not a compliance determination)
  const calculateReadinessScore = (): number => {
    let score = 100;

    // Deduct for violations
    score -= formData.childLaborViolations * 10;
    score -= formData.hazardousWorkViolations * 15;
    score -= formData.worstFormsViolations * 25;

    // Deduct for underage workers
    if (formData.totalWorkersAssessed > 0) {
      const underageRate =
        (formData.underageWorkersFound / formData.totalWorkersAssessed) * 100;
      score -= underageRate * 2;
    }

    // Deduct for low enrollment
    if (enrollmentRate < 80) {
      score -= (80 - enrollmentRate) * 0.5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const readinessScore = calculateReadinessScore();
  // Legacy alias for backward compatibility
  const complianceScore = readinessScore;

  // Load existing assessment if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadAssessment(id);
    }
  }, [id, isEditMode]);

  const loadAssessment = async (assessmentId: string) => {
    setLoading(true);
    try {
      const assessment = await ChildLaborService.getAssessment(assessmentId);
      if (assessment) {
        setFormData({
          cooperativeId: assessment.cooperativeId,
          assessmentPeriodStart: assessment.assessmentPeriodStart,
          assessmentPeriodEnd: assessment.assessmentPeriodEnd,
          totalChildrenInCommunity: assessment.totalChildrenInCommunity,
          childrenEnrolledSchool: assessment.childrenEnrolledSchool,
          minimumWorkingAge: assessment.minimumWorkingAge,
          totalWorkersAssessed: assessment.totalWorkersAssessed,
          underageWorkersFound: assessment.underageWorkersFound,
          ageVerificationMethod: assessment.ageVerificationMethod,
          childLaborViolations: assessment.childLaborViolations,
          hazardousWorkViolations: assessment.hazardousWorkViolations,
          worstFormsViolations: assessment.worstFormsViolations,
          violationDetails: assessment.violationDetails || [],
          assessorName: assessment.assessorName,
          assessorOrganization: assessment.assessorOrganization || '',
          assessorNotes: assessment.assessorNotes || '',
          evidenceDocuments: assessment.evidenceDocuments || [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode && id) {
        await ChildLaborService.updateAssessment(id, formData);
      } else {
        await ChildLaborService.createAssessment(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/compliance/child-labor');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes('Violations') ||
        name.includes('Children') ||
        name.includes('Workers') ||
        name === 'minimumWorkingAge'
          ? parseInt(value) || 0
          : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Auto-évaluation (non certifiante)</p>
            </div>
            <button
              onClick={() => navigate('/compliance/child-labor')}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Fermer et retourner à la liste des évaluations"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>Évaluation enregistrée avec succès!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de base
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cooperativeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Coopérative *
                  </label>
                  <select
                    id="cooperativeId"
                    name="cooperativeId"
                    value={formData.cooperativeId}
                    onChange={handleChange}
                    required
                    disabled={coopsLoading || isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Sélectionner une coopérative</option>
                    {cooperatives.map((coop) => (
                      <option key={coop.id} value={coop.id}>
                        {coop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="assessmentPeriodStart" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    id="assessmentPeriodStart"
                    type="date"
                    name="assessmentPeriodStart"
                    value={formData.assessmentPeriodStart}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="assessmentPeriodEnd" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin *
                  </label>
                  <input
                    id="assessmentPeriodEnd"
                    type="date"
                    name="assessmentPeriodEnd"
                    value={formData.assessmentPeriodEnd}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="assessorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'évaluateur *
                  </label>
                  <input
                    id="assessorName"
                    type="text"
                    name="assessorName"
                    value={formData.assessorName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="assessorOrganization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisation de l'évaluateur
                  </label>
                  <input
                    id="assessorOrganization"
                    type="text"
                    name="assessorOrganization"
                    value={formData.assessorOrganization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </section>

            {/* School Enrollment */}
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Données de scolarisation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="totalChildrenInCommunity" className="block text-sm font-medium text-gray-700 mb-1">
                    Total enfants dans la communauté *
                  </label>
                  <input
                    id="totalChildrenInCommunity"
                    type="number"
                    name="totalChildrenInCommunity"
                    value={formData.totalChildrenInCommunity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="childrenEnrolledSchool" className="block text-sm font-medium text-gray-700 mb-1">
                    Enfants scolarisés *
                  </label>
                  <input
                    id="childrenEnrolledSchool"
                    type="number"
                    name="childrenEnrolledSchool"
                    value={formData.childrenEnrolledSchool}
                    onChange={handleChange}
                    required
                    min="0"
                    max={formData.totalChildrenInCommunity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de scolarisation
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-lg font-semibold text-gray-900">
                      {enrollmentRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Labor Verification */}
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Vérification du travail
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minimumWorkingAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Âge minimum de travail *
                  </label>
                  <input
                    id="minimumWorkingAge"
                    type="number"
                    name="minimumWorkingAge"
                    value={formData.minimumWorkingAge}
                    onChange={handleChange}
                    required
                    min="14"
                    max="18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="ageVerificationMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Méthode de vérification d'âge *
                  </label>
                  <select
                    id="ageVerificationMethod"
                    name="ageVerificationMethod"
                    value={formData.ageVerificationMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Object.values(AgeVerificationMethod).map((method) => (
                      <option key={method} value={method}>
                        {method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="totalWorkersAssessed" className="block text-sm font-medium text-gray-700 mb-1">
                    Total travailleurs évalués *
                  </label>
                  <input
                    id="totalWorkersAssessed"
                    type="number"
                    name="totalWorkersAssessed"
                    value={formData.totalWorkersAssessed}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="underageWorkersFound" className="block text-sm font-medium text-gray-700 mb-1">
                    Travailleurs mineurs trouvés *
                  </label>
                  <input
                    id="underageWorkersFound"
                    type="number"
                    name="underageWorkersFound"
                    value={formData.underageWorkersFound}
                    onChange={handleChange}
                    required
                    min="0"
                    max={formData.totalWorkersAssessed}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </section>

            {/* Violations */}
            <section className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Violations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="childLaborViolations" className="block text-sm font-medium text-gray-700 mb-1">
                    Violations de travail des enfants *
                  </label>
                  <input
                    id="childLaborViolations"
                    type="number"
                    name="childLaborViolations"
                    value={formData.childLaborViolations}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="hazardousWorkViolations" className="block text-sm font-medium text-gray-700 mb-1">
                    Violations de travail dangereux *
                  </label>
                  <input
                    id="hazardousWorkViolations"
                    type="number"
                    name="hazardousWorkViolations"
                    value={formData.hazardousWorkViolations}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="worstFormsViolations" className="block text-sm font-medium text-gray-700 mb-1">
                    Pires formes de violations *
                  </label>
                  <input
                    id="worstFormsViolations"
                    type="number"
                    name="worstFormsViolations"
                    value={formData.worstFormsViolations}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="assessorNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes de l'évaluateur
                </label>
                <textarea
                  id="assessorNotes"
                  name="assessorNotes"
                  value={formData.assessorNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Détails supplémentaires sur les violations, observations, etc."
                />
              </div>
            </section>

            {/* Assessment Score Preview */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Score de préparation</h3>
                  <p className="text-xs text-gray-500 mt-1">Calculé automatiquement (auto-évaluation)</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold ${
                      readinessScore >= 90
                        ? 'text-green-600'
                        : readinessScore >= 75
                        ? 'text-blue-600'
                        : readinessScore >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {readinessScore}
                  </div>
                  <div className="text-xs text-gray-500">
                    sur 100
                    <span className="ml-2 italic">(Auto-évaluation, pas une détermination de conformité)</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Cette évaluation est une auto-évaluation. Elle ne constitue pas une certification, une vérification ou une approbation réglementaire. Elle ne remplace pas les audits ou les vérifications.
                </p>
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/compliance/child-labor')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? 'Mettre à jour' : 'Créer l\'évaluation'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;

