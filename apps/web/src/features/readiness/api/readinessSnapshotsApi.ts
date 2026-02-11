// API functions for readiness snapshots
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import { getCoverageMetrics } from '@/features/coverage/api/coverageApi';
import { generateReadinessSnapshot } from '@/services/readinessSnapshotService';
import type { ReadinessSnapshot } from '@/services/readinessSnapshotService';

/**
 * Create a new readiness snapshot for a cooperative
 * Automatically computes snapshot based on current coverage metrics
 */
export async function createReadinessSnapshot(
  cooperativeId: string
): Promise<{
  data: ReadinessSnapshot | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // 1. Get current coverage metrics
    const coverageResult = await getCoverageMetrics(cooperativeId);
    if (coverageResult.error || !coverageResult.data) {
      return { data: null, error: coverageResult.error || new Error('Failed to get coverage metrics') };
    }

    // 2. Generate snapshot
    const snapshot = generateReadinessSnapshot(cooperativeId, coverageResult.data);

    // 3. Save to database
    const { data, error } = await supabase
      .from('readiness_snapshots')
      .insert({
        coop_id: cooperativeId,
        readiness_status: snapshot.readiness_status,
        snapshot_reason: snapshot.snapshot_reason,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: transformSnapshot(data), error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get the latest readiness snapshot for a cooperative
 */
export async function getLatestReadinessSnapshot(
  cooperativeId: string
): Promise<{
  data: ReadinessSnapshot | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('readiness_snapshots')
      .select('*')
      .eq('coop_id', cooperativeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No snapshot found
        return { data: null, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }

    return { data: transformSnapshot(data), error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get all readiness snapshots for a cooperative (ordered by most recent first)
 */
export async function getReadinessSnapshots(
  cooperativeId: string,
  limit?: number
): Promise<{
  data: ReadinessSnapshot[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    let query = supabase
      .from('readiness_snapshots')
      .select('*')
      .eq('coop_id', cooperativeId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data || []).map(transformSnapshot), error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper function to transform database records to TypeScript types
function transformSnapshot(data: any): ReadinessSnapshot {
  return {
    snapshot_id: data.snapshot_id.toString(),
    coop_id: data.coop_id.toString(),
    readiness_status: data.readiness_status,
    snapshot_reason: data.snapshot_reason || '',
    created_at: data.created_at,
  };
}

