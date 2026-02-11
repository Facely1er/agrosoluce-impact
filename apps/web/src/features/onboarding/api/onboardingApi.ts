// API functions for Farmers First Onboarding System

import { supabase } from '@/lib/supabase/client';
import type { CooperativeOnboarding, OnboardingStep } from '../types';

/**
 * Get onboarding status for a cooperative
 */
export async function getOnboardingByCooperativeId(
  cooperativeId: string
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const transformed = transformOnboarding(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create or update onboarding for a cooperative
 */
export async function createOrUpdateOnboarding(
  onboarding: Partial<CooperativeOnboarding>
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      cooperative_id: onboarding.cooperativeId,
      status: onboarding.status || 'pending',
      current_step: onboarding.currentStep || 1,
    };

    if (onboarding.welcomeCallScheduledAt) {
      payload.welcome_call_scheduled_at = onboarding.welcomeCallScheduledAt;
    }
    if (onboarding.welcomeCallCompletedAt) {
      payload.welcome_call_completed_at = onboarding.welcomeCallCompletedAt;
    }
    if (onboarding.onboardingChampionId) {
      payload.onboarding_champion_id = onboarding.onboardingChampionId;
    }
    if (onboarding.notes) {
      payload.notes = onboarding.notes;
    }

    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .upsert(payload, {
        onConflict: 'cooperative_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformOnboarding(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update onboarding step completion
 */
export async function updateOnboardingStep(
  onboardingId: string,
  stepNumber: number,
  isCompleted: boolean,
  completedBy?: string
): Promise<{ data: OnboardingStep | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // First, check if step exists
    const { data: existing } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('onboarding_id', onboardingId)
      .eq('step_number', stepNumber)
      .single();

    const payload: any = {
      onboarding_id: onboardingId,
      step_number: stepNumber,
      is_completed: isCompleted,
    };

    if (isCompleted) {
      payload.completed_at = new Date().toISOString();
      if (completedBy) {
        payload.completed_by = completedBy;
      }
    }

    let result;
    if (existing) {
      // Update existing step
      const { data, error } = await supabase
        .from('onboarding_steps')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      result = data;
    } else {
      // Create new step
      const { data, error } = await supabase
        .from('onboarding_steps')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      result = data;
    }

    const transformed = transformOnboardingStep(result);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get all steps for an onboarding
 */
export async function getOnboardingSteps(
  onboardingId: string
): Promise<{ data: OnboardingStep[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('onboarding_id', onboardingId)
      .order('step_number', { ascending: true });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformOnboardingStep);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(
  onboardingId: string
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', onboardingId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformOnboarding(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper functions to transform database records

function transformOnboarding(data: any): CooperativeOnboarding {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    status: data.status,
    currentStep: data.current_step,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    welcomeCallScheduledAt: data.welcome_call_scheduled_at,
    welcomeCallCompletedAt: data.welcome_call_completed_at,
    onboardingChampionId: data.onboarding_champion_id,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformOnboardingStep(data: any): OnboardingStep {
  return {
    id: data.id,
    onboardingId: data.onboarding_id,
    stepNumber: data.step_number,
    stepName: data.step_name,
    stepDescription: data.step_description,
    isCompleted: data.is_completed,
    completedAt: data.completed_at,
    completedBy: data.completed_by,
    notes: data.notes,
    createdAt: data.created_at
  };
}

