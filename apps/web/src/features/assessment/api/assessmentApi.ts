// API functions for AgroSoluce Farm Assessment
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { AssessmentResults, AssessmentResponse } from '@/types/assessment.types';

export interface AssessmentRecord {
  id: string;
  cooperative_id: string;
  assessment_data: any;
  overall_score: number;
  section_scores: Record<string, number>;
  recommendations: any[];
  toolkit_ready: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponseRecord {
  id: string;
  assessment_id: string;
  question_id: string;
  response_value: string;
  score: number;
  created_at: string;
}

/**
 * Create a new assessment and persist to database
 */
export async function createAssessment(
  coopId: string,
  results: AssessmentResults
): Promise<{
  data: AssessmentRecord | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // First, create the main assessment record
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        cooperative_id: coopId,
        assessment_data: {
          responses: results.responses.map(r => ({
            questionId: r.questionId,
            selectedOption: r.selectedOption,
            timestamp: r.timestamp.toISOString(),
          })),
          completedAt: results.completedAt.toISOString(),
        },
        overall_score: results.overallScore,
        section_scores: results.sectionScores,
        recommendations: results.recommendations,
        toolkit_ready: results.toolkitReady,
        completed_at: results.completedAt.toISOString(),
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError);
      return { data: null, error: new Error(assessmentError.message) };
    }

    if (!assessmentData) {
      return { data: null, error: new Error('Failed to create assessment') };
    }

    // Then, create individual response records
    const responseRecords = results.responses.map(response => ({
      assessment_id: assessmentData.id,
      question_id: response.questionId,
      response_value: response.selectedOption.value,
      score: response.selectedOption.score,
    }));

    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .insert(responseRecords);

    if (responsesError) {
      console.error('Error creating assessment responses:', responsesError);
      // Don't fail the whole operation if responses fail - assessment is still created
    }

    return { data: transformAssessmentRecord(assessmentData), error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error in createAssessment:', error);
    return { data: null, error };
  }
}

/**
 * Get all assessments for a cooperative
 */
export async function getAssessmentsByCoop(
  coopId: string
): Promise<{
  data: AssessmentRecord[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('cooperative_id', coopId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformAssessmentRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get the latest assessment for a cooperative
 */
export async function getLatestAssessment(
  coopId: string
): Promise<{
  data: AssessmentRecord | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('cooperative_id', coopId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no assessment found, that's okay - return null
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('Error fetching latest assessment:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return { data: transformAssessmentRecord(data), error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get assessment responses for a specific assessment
 */
export async function getAssessmentResponses(
  assessmentId: string
): Promise<{
  data: AssessmentResponseRecord[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching assessment responses:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data || [], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper function to transform database records to TypeScript types
function transformAssessmentRecord(data: any): AssessmentRecord {
  return {
    id: data.id,
    cooperative_id: data.cooperative_id,
    assessment_data: data.assessment_data,
    overall_score: data.overall_score,
    section_scores: data.section_scores || {},
    recommendations: data.recommendations || [],
    toolkit_ready: data.toolkit_ready || false,
    completed_at: data.completed_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

