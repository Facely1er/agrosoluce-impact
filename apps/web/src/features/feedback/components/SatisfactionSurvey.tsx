import { useState, useEffect } from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { submitSatisfactionSurvey, getSatisfactionSurvey } from '../api';
import type { SatisfactionSurvey } from '../types';

interface SatisfactionSurveyProps {
  cooperativeId: string;
  month?: string; // ISO date string (first day of month)
  onComplete?: () => void;
}

export default function SatisfactionSurvey({ cooperativeId, month, onComplete }: SatisfactionSurveyProps) {
  const currentMonth = month || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [survey, setSurvey] = useState<Partial<SatisfactionSurvey>>({
    cooperativeId,
    surveyMonth: currentMonth,
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, [cooperativeId, currentMonth]);

  const loadSurvey = async () => {
    setLoading(true);
    const { data } = await getSatisfactionSurvey(cooperativeId, currentMonth);
    if (data) {
      setSurvey(data);
      setSubmitted(data.status === 'submitted');
    }
    setLoading(false);
  };

  const handleSubmit = async (status: 'draft' | 'submitted' = 'submitted') => {
    setSaving(true);
    const { error } = await submitSatisfactionSurvey({
      ...survey,
      status
    } as SatisfactionSurvey);

    if (!error) {
      setSubmitted(status === 'submitted');
      if (status === 'submitted' && onComplete) {
        onComplete();
      }
    }
    setSaving(false);
  };

  const renderScaleQuestion = (
    label: string,
    value: number | undefined,
    onChange: (value: number) => void
  ) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                value === num
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-400 hover:border-primary-300'
              }`}
            >
              {num}
            </button>
          ))}
          <span className="ml-4 text-sm text-gray-600">
            {value ? `${value}/5` : 'Non noté'}
          </span>
        </div>
      </div>
    );
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
        <h3 className="text-lg font-semibold text-green-900 mb-2">Enquête soumise avec succès</h3>
        <p className="text-green-700">Merci pour votre retour ! Votre feedback nous aide à améliorer AgroSoluce.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Enquête de Satisfaction Mensuelle</h3>
        <p className="text-gray-600">
          Mois de {new Date(currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <form className="space-y-6">
        {/* Standard Questions (1-5 scale) */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Questions Standard</h4>
          
          {renderScaleQuestion(
            'La plateforme répond-elle à vos besoins ?',
            survey.platformMeetsNeeds,
            (value) => setSurvey({ ...survey, platformMeetsNeeds: value })
          )}

          {renderScaleQuestion(
            'Le support technique est-il suffisant ?',
            survey.technicalSupportSufficient,
            (value) => setSurvey({ ...survey, technicalSupportSufficient: value })
          )}

          {renderScaleQuestion(
            'Les formations sont-elles adaptées ?',
            survey.trainingAppropriate,
            (value) => setSurvey({ ...survey, trainingAppropriate: value })
          )}

          {renderScaleQuestion(
            'Recommanderiez-vous AgroSoluce ?',
            survey.wouldRecommend,
            (value) => setSurvey({ ...survey, wouldRecommend: value })
          )}

          {renderScaleQuestion(
            'Êtes-vous satisfait des améliorations ?',
            survey.satisfiedWithImprovements,
            (value) => setSurvey({ ...survey, satisfiedWithImprovements: value })
          )}
        </div>

        {/* Qualitative Questions */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Questions Qualitatives</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quelle fonctionnalité vous aide le plus ?
            </label>
            <textarea
              value={survey.mostHelpfulFeature || ''}
              onChange={(e) => setSurvey({ ...survey, mostHelpfulFeature: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qu'est-ce qui vous manque le plus ?
            </label>
            <textarea
              value={survey.mostMissingFeature || ''}
              onChange={(e) => setSurvey({ ...survey, mostMissingFeature: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment pouvons-nous mieux vous servir ?
            </label>
            <textarea
              value={survey.howCanWeServeBetter || ''}
              onChange={(e) => setSurvey({ ...survey, howCanWeServeBetter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quels défis rencontrez-vous encore ?
            </label>
            <textarea
              value={survey.challengesEncountered || ''}
              onChange={(e) => setSurvey({ ...survey, challengesEncountered: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestions d'amélioration
            </label>
            <textarea
              value={survey.suggestions || ''}
              onChange={(e) => setSurvey({ ...survey, suggestions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
            />
          </div>
        </div>

        {/* Impact Questions */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Impact</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heures économisées par semaine
              </label>
              <input
                type="number"
                step="0.5"
                value={survey.hoursSavedPerWeek || ''}
                onChange={(e) => setSurvey({ ...survey, hoursSavedPerWeek: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amélioration des prix (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={survey.priceImprovementPercentage || ''}
                onChange={(e) => setSurvey({ ...survey, priceImprovementPercentage: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problèmes évités grâce à AgroSoluce
            </label>
            <textarea
              value={survey.problemsAvoided || ''}
              onChange={(e) => setSurvey({ ...survey, problemsAvoided: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bénéfices inattendus découverts
            </label>
            <textarea
              value={survey.unexpectedBenefits || ''}
              onChange={(e) => setSurvey({ ...survey, unexpectedBenefits: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={2}
            />
          </div>
        </div>

        {/* Overall Satisfaction */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Satisfaction globale (1-10)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSurvey({ ...survey, overallSatisfaction: num })}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  survey.overallSatisfaction === num
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-300 text-gray-400 hover:border-primary-300'
                }`}
              >
                {num}
              </button>
            ))}
            <span className="ml-4 text-sm text-gray-600">
              {survey.overallSatisfaction ? `${survey.overallSatisfaction}/10` : 'Non noté'}
            </span>
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
            {saving ? 'Soumission...' : 'Soumettre l\'enquête'}
          </button>
        </div>
      </form>
    </div>
  );
}

