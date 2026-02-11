import { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getOnboardingByCooperativeId, getOnboardingSteps } from '../api';
import type { CooperativeOnboarding, OnboardingStep } from '../types';
import { DEFAULT_ONBOARDING_STEPS } from '../types';

interface OnboardingProgressProps {
  cooperativeId: string;
}

export default function OnboardingProgress({ cooperativeId }: OnboardingProgressProps) {
  const [onboarding, setOnboarding] = useState<CooperativeOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [cooperativeId]);

  const loadProgress = async () => {
    setLoading(true);
    const { data } = await getOnboardingByCooperativeId(cooperativeId);
    if (data) {
      setOnboarding(data);
      const { data: stepsData } = await getOnboardingSteps(data.id);
      if (stepsData) {
        setSteps(stepsData);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!onboarding) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <p>L'onboarding n'a pas encore commencé pour cette coopérative.</p>
        </div>
      </div>
    );
  }

  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = DEFAULT_ONBOARDING_STEPS.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'on_hold':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progrès de l'Onboarding</h3>
          <p className="text-sm text-gray-600 mt-1">
            {completedSteps} sur {totalSteps} étapes complétées
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(onboarding.status)}`}>
          {onboarding.status === 'completed' ? 'Terminé' : 
           onboarding.status === 'in_progress' ? 'En cours' : 
           onboarding.status === 'on_hold' ? 'En pause' : 'En attente'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-right">{Math.round(progressPercentage)}% complété</p>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {DEFAULT_ONBOARDING_STEPS.map((stepDef) => {
          const step = steps.find(s => s.stepNumber === stepDef.stepNumber);
          const isCompleted = step?.isCompleted || false;
          const isCurrent = stepDef.stepNumber === onboarding.currentStep;

          return (
            <div
              key={stepDef.stepNumber}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isCurrent ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-700'}`}>
                  {stepDef.stepNumber}. {stepDef.stepName}
                </p>
                {step?.completedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Complété le {new Date(step.completedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {onboarding.welcomeCallScheduledAt && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Appel de bienvenue programmé</p>
          <p className="text-sm text-blue-700 mt-1">
            {new Date(onboarding.welcomeCallScheduledAt).toLocaleString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  );
}

