import { useState, useEffect } from 'react';
import { getOnboardingByCooperativeId, getOnboardingSteps } from '../api';
import type { CooperativeOnboarding, OnboardingStep } from '../types';

export function useOnboarding(cooperativeId: string) {
  const [onboarding, setOnboarding] = useState<CooperativeOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cooperativeId) {
      setLoading(false);
      return;
    }

    loadOnboarding();
  }, [cooperativeId]);

  const loadOnboarding = async () => {
    setLoading(true);
    setError(null);

    const { data, error: onboardingError } = await getOnboardingByCooperativeId(cooperativeId);
    
    if (onboardingError) {
      setError(onboardingError.message);
      setLoading(false);
      return;
    }

    if (data) {
      setOnboarding(data);
      
      // Load steps
      const { data: stepsData, error: stepsError } = await getOnboardingSteps(data.id);
      if (stepsError) {
        setError(stepsError.message);
      } else if (stepsData) {
        setSteps(stepsData);
      }
    }

    setLoading(false);
  };

  return {
    onboarding,
    steps,
    loading,
    error,
    refetch: loadOnboarding
  };
}

