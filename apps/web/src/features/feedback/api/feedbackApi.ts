// API functions for Feedback and Survey System

import { supabase } from '@/lib/supabase/client';
import type { SatisfactionSurvey, FeedbackSubmission } from '../types';

/**
 * Get satisfaction survey for a cooperative and month
 */
export async function getSatisfactionSurvey(
  cooperativeId: string,
  month: string // ISO date string (first day of month)
): Promise<{ data: SatisfactionSurvey | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('satisfaction_surveys')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .eq('survey_month', month)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const transformed = transformSurvey(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create or update satisfaction survey
 */
export async function submitSatisfactionSurvey(
  survey: Partial<SatisfactionSurvey>
): Promise<{ data: SatisfactionSurvey | null; error: Error | null }> {
  if (!supabase || !survey.cooperativeId || !survey.surveyMonth) {
    return { data: null, error: new Error('Missing required fields') };
  }

  try {
    const payload: any = {
      cooperative_id: survey.cooperativeId,
      survey_month: survey.surveyMonth,
      status: survey.status || 'submitted',
    };

    if (survey.submittedBy) payload.submitted_by = survey.submittedBy;
    if (survey.platformMeetsNeeds) payload.platform_meets_needs = survey.platformMeetsNeeds;
    if (survey.technicalSupportSufficient) payload.technical_support_sufficient = survey.technicalSupportSufficient;
    if (survey.trainingAppropriate) payload.training_appropriate = survey.trainingAppropriate;
    if (survey.wouldRecommend) payload.would_recommend = survey.wouldRecommend;
    if (survey.satisfiedWithImprovements) payload.satisfied_with_improvements = survey.satisfiedWithImprovements;
    if (survey.mostHelpfulFeature) payload.most_helpful_feature = survey.mostHelpfulFeature;
    if (survey.mostMissingFeature) payload.most_missing_feature = survey.mostMissingFeature;
    if (survey.howCanWeServeBetter) payload.how_can_we_serve_better = survey.howCanWeServeBetter;
    if (survey.challengesEncountered) payload.challenges_encountered = survey.challengesEncountered;
    if (survey.suggestions) payload.suggestions = survey.suggestions;
    if (survey.hoursSavedPerWeek !== undefined) payload.hours_saved_per_week = survey.hoursSavedPerWeek;
    if (survey.priceImprovementPercentage !== undefined) payload.price_improvement_percentage = survey.priceImprovementPercentage;
    if (survey.problemsAvoided) payload.problems_avoided = survey.problemsAvoided;
    if (survey.unexpectedBenefits) payload.unexpected_benefits = survey.unexpectedBenefits;
    if (survey.otherCooperativesRecommended) payload.other_cooperatives_recommended = survey.otherCooperativesRecommended;
    if (survey.overallSatisfaction) payload.overall_satisfaction = survey.overallSatisfaction;

    const { data, error } = await supabase
      .from('satisfaction_surveys')
      .upsert(payload, {
        onConflict: 'cooperative_id,survey_month',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformSurvey(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get all surveys for a cooperative
 */
export async function getCooperativeSurveys(
  cooperativeId: string
): Promise<{ data: SatisfactionSurvey[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('satisfaction_surveys')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('survey_month', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformSurvey);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Submit feedback
 */
export async function submitFeedback(
  feedback: Omit<FeedbackSubmission, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ data: FeedbackSubmission | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      feedback_type: feedback.feedbackType,
      content: feedback.content,
      priority: feedback.priority,
      status: feedback.status || 'open',
    };

    if (feedback.cooperativeId) payload.cooperative_id = feedback.cooperativeId;
    if (feedback.userProfileId) payload.user_profile_id = feedback.userProfileId;
    if (feedback.subject) payload.subject = feedback.subject;
    if (feedback.assignedTo) payload.assigned_to = feedback.assignedTo;

    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformFeedback(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get feedback submissions for a cooperative
 */
export async function getCooperativeFeedback(
  cooperativeId: string
): Promise<{ data: FeedbackSubmission[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformFeedback);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper functions

function transformSurvey(data: any): SatisfactionSurvey {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    surveyMonth: data.survey_month,
    submittedBy: data.submitted_by,
    submittedAt: data.submitted_at,
    platformMeetsNeeds: data.platform_meets_needs,
    technicalSupportSufficient: data.technical_support_sufficient,
    trainingAppropriate: data.training_appropriate,
    wouldRecommend: data.would_recommend,
    satisfiedWithImprovements: data.satisfied_with_improvements,
    mostHelpfulFeature: data.most_helpful_feature,
    mostMissingFeature: data.most_missing_feature,
    howCanWeServeBetter: data.how_can_we_serve_better,
    challengesEncountered: data.challenges_encountered,
    suggestions: data.suggestions,
    hoursSavedPerWeek: data.hours_saved_per_week,
    priceImprovementPercentage: data.price_improvement_percentage,
    problemsAvoided: data.problems_avoided,
    unexpectedBenefits: data.unexpected_benefits,
    otherCooperativesRecommended: data.other_cooperatives_recommended,
    overallSatisfaction: data.overall_satisfaction,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformFeedback(data: any): FeedbackSubmission {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    userProfileId: data.user_profile_id,
    feedbackType: data.feedback_type,
    subject: data.subject,
    content: data.content,
    priority: data.priority,
    status: data.status,
    assignedTo: data.assigned_to,
    resolvedAt: data.resolved_at,
    resolutionNotes: data.resolution_notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

