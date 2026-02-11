// API functions for Training Management System

import { supabase } from '@/lib/supabase/client';
import type { TrainingSession, TrainingChampion, TrainingCompletion } from '../types';

/**
 * Get training sessions for a cooperative
 */
export async function getTrainingSessions(
  cooperativeId: string
): Promise<{ data: TrainingSession[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('scheduled_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformTrainingSession);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a training session
 */
export async function createTrainingSession(
  session: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt' | 'attendanceCount'>
): Promise<{ data: TrainingSession | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      cooperative_id: session.cooperativeId,
      session_type: session.sessionType,
      session_title: session.sessionTitle,
      location: session.location,
      status: session.status || 'scheduled',
      attendance_count: 0,
    };

    if (session.sessionDescription) payload.session_description = session.sessionDescription;
    if (session.scheduledAt) payload.scheduled_at = session.scheduledAt;
    if (session.durationMinutes) payload.duration_minutes = session.durationMinutes;
    if (session.trainerId) payload.trainer_id = session.trainerId;
    if (session.materialsUrl) payload.materials_url = session.materialsUrl;

    const { data, error } = await supabase
      .from('training_sessions')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformTrainingSession(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update training session
 */
export async function updateTrainingSession(
  sessionId: string,
  updates: Partial<TrainingSession>
): Promise<{ data: TrainingSession | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.completedAt) payload.completed_at = updates.completedAt;
    if (updates.attendanceCount !== undefined) payload.attendance_count = updates.attendanceCount;
    if (updates.recordingUrl) payload.recording_url = updates.recordingUrl;
    if (updates.feedbackNotes) payload.feedback_notes = updates.feedbackNotes;

    const { data, error } = await supabase
      .from('training_sessions')
      .update(payload)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformTrainingSession(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get training champions for a cooperative
 */
export async function getTrainingChampions(
  cooperativeId: string
): Promise<{ data: TrainingChampion[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('training_champions')
      .select(`
        *,
        user_profiles:user_profile_id (
          id,
          full_name,
          email,
          phone_number
        )
      `)
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true)
      .order('role', { ascending: true });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(item => transformTrainingChampion(item));
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Add a training champion
 */
export async function addTrainingChampion(
  champion: Omit<TrainingChampion, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>
): Promise<{ data: TrainingChampion | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      cooperative_id: champion.cooperativeId,
      user_profile_id: champion.userProfileId,
      role: champion.role,
      is_active: true,
    };

    if (champion.trainingCompletedAt) payload.training_completed_at = champion.trainingCompletedAt;
    if (champion.responsibilities) payload.responsibilities = champion.responsibilities;

    const { data, error } = await supabase
      .from('training_champions')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformTrainingChampion(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Record training completion
 */
export async function recordTrainingCompletion(
  completion: Omit<TrainingCompletion, 'id' | 'createdAt'>
): Promise<{ data: TrainingCompletion | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const payload: any = {
      training_session_id: completion.trainingSessionId,
      user_profile_id: completion.userProfileId,
      completed_at: completion.completedAt || new Date().toISOString(),
    };

    if (completion.score !== undefined) payload.score = completion.score;
    if (completion.feedback) payload.feedback = completion.feedback;

    const { data, error } = await supabase
      .from('training_completions')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformTrainingCompletion(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper functions

function transformTrainingSession(data: any): TrainingSession {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    sessionType: data.session_type,
    sessionTitle: data.session_title,
    sessionDescription: data.session_description,
    scheduledAt: data.scheduled_at,
    completedAt: data.completed_at,
    durationMinutes: data.duration_minutes,
    trainerId: data.trainer_id,
    location: data.location,
    status: data.status,
    attendanceCount: data.attendance_count || 0,
    materialsUrl: data.materials_url,
    recordingUrl: data.recording_url,
    feedbackNotes: data.feedback_notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformTrainingChampion(data: any): TrainingChampion {
  return {
    id: data.id,
    cooperativeId: data.cooperative_id,
    userProfileId: data.user_profile_id,
    role: data.role,
    trainingCompletedAt: data.training_completed_at,
    isActive: data.is_active,
    responsibilities: data.responsibilities,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userProfile: data.user_profiles ? {
      fullName: data.user_profiles.full_name,
      email: data.user_profiles.email,
      phoneNumber: data.user_profiles.phone_number
    } : undefined
  };
}

function transformTrainingCompletion(data: any): TrainingCompletion {
  return {
    id: data.id,
    trainingSessionId: data.training_session_id,
    userProfileId: data.user_profile_id,
    completedAt: data.completed_at,
    score: data.score,
    feedback: data.feedback,
    createdAt: data.created_at
  };
}

