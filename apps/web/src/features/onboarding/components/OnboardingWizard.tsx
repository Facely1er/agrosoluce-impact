import { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { DEFAULT_ONBOARDING_STEPS } from '../types';
import { 
  getOnboardingByCooperativeId, 
  createOrUpdateOnboarding, 
  updateOnboardingStep,
  getOnboardingSteps 
} from '../api';
import type { CooperativeOnboarding, OnboardingStep } from '../types';

interface OnboardingWizardProps {
  cooperativeId: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export default function OnboardingWizard({ cooperativeId, onComplete, onClose }: OnboardingWizardProps) {
  const [onboarding, setOnboarding] = useState<CooperativeOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOnboarding();
  }, [cooperativeId]);

  const loadOnboarding = async () => {
    setLoading(true);
    const { data, error } = await getOnboardingByCooperativeId(cooperativeId);
    
    if (error && !data) {
      // Create new onboarding if it doesn't exist
      const { data: newOnboarding } = await createOrUpdateOnboarding({
        cooperativeId,
        status: 'in_progress',
        currentStep: 1
      });
      if (newOnboarding) {
        setOnboarding(newOnboarding);
        setCurrentStepIndex(0);
      }
    } else if (data) {
      setOnboarding(data);
      setCurrentStepIndex(data.currentStep - 1);
      
      // Load steps
      const { data: stepsData } = await getOnboardingSteps(data.id);
      if (stepsData) {
        setSteps(stepsData);
      }
    }
    setLoading(false);
  };

  const handleStepComplete = async (stepNumber: number) => {
    if (!onboarding) return;

    setSaving(true);
    await updateOnboardingStep(onboarding.id, stepNumber, true);
    
    // Update local state
    const updatedSteps = [...steps];
    const stepIndex = updatedSteps.findIndex(s => s.stepNumber === stepNumber);
    if (stepIndex >= 0) {
      updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], isCompleted: true };
    } else {
      updatedSteps.push({
        id: '',
        onboardingId: onboarding.id,
        stepNumber,
        stepName: DEFAULT_ONBOARDING_STEPS[stepNumber - 1]?.stepName || '',
        isCompleted: true,
        completedAt: new Date().toISOString()
      });
    }
    setSteps(updatedSteps);

    // Update onboarding current step
    const nextStep = stepNumber + 1;
    if (nextStep <= DEFAULT_ONBOARDING_STEPS.length) {
      await createOrUpdateOnboarding({
        id: onboarding.id,
        cooperativeId,
        currentStep: nextStep,
        status: 'in_progress'
      });
      setCurrentStepIndex(nextStep - 1);
    } else {
      // Complete onboarding
      await createOrUpdateOnboarding({
        id: onboarding.id,
        cooperativeId,
        status: 'completed'
      });
      if (onComplete) onComplete();
    }
    setSaving(false);
  };

  const handleNext = () => {
    if (currentStepIndex < DEFAULT_ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentStep = DEFAULT_ONBOARDING_STEPS[currentStepIndex];
  const isStepCompleted = steps.find(s => s.stepNumber === currentStepIndex + 1)?.isCompleted || false;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Onboarding - Farmers First</h2>
          <p className="text-gray-600 mt-1">Étape {currentStepIndex + 1} sur {DEFAULT_ONBOARDING_STEPS.length}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          {DEFAULT_ONBOARDING_STEPS.map((step, index) => {
            const stepData = steps.find(s => s.stepNumber === step.stepNumber);
            const isCompleted = stepData?.isCompleted || false;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.stepNumber} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStepIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <span className={`text-xs mt-2 text-center ${isCurrent ? 'font-semibold text-primary-600' : 'text-gray-600'}`}>
                    {step.stepName}
                  </span>
                </div>
                {index < DEFAULT_ONBOARDING_STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentStep.stepName}</h3>
          <p className="text-gray-600">{currentStep.stepDescription}</p>
        </div>

        {/* Step-specific content would go here */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700">
            Contenu spécifique pour l'étape "{currentStep.stepName}" sera implémenté ici.
            Cette étape permet de configurer et compléter: {currentStep.stepDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0 || saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </button>

          <div className="flex gap-3">
            {isStepCompleted && (
              <span className="flex items-center gap-2 text-green-600 px-4 py-2">
                <CheckCircle className="h-5 w-5" />
                Complété
              </span>
            )}
            <button
              onClick={() => handleStepComplete(currentStepIndex + 1)}
              disabled={saving || isStepCompleted}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : isStepCompleted ? 'Complété' : 'Marquer comme complété'}
            </button>
            {currentStepIndex < DEFAULT_ONBOARDING_STEPS.length - 1 && (
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

