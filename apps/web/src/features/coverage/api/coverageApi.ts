// API functions for coverage metrics
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import { getEvidenceDocuments } from '@/features/evidence/api/evidenceDocumentsApi';
import { getCanonicalDirectoryRecordById } from '@/features/cooperatives/api/canonicalDirectoryApi';
import {
  computeCoverageMetrics,
  getDocumentPresence,
  type CoverageMetrics,
  type DocumentPresence,
} from '@/services/coverageService';
import { getRequiredDocTypes } from '@/data/expectedDocumentsConfig';

/**
 * Get or compute coverage metrics for a cooperative
 */
export async function getCoverageMetrics(
  cooperativeId: string
): Promise<{
  data: CoverageMetrics | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // 1. Get cooperative info to determine required docs
    const coopResult = await getCanonicalDirectoryRecordById(cooperativeId);
    const commodity = coopResult.data?.primary_crop;
    
    // For now, we'll use default requirements
    // In the future, regulation context could be determined from cooperative data
    const regulationContext: string[] = [];

    // 2. Get evidence documents for this cooperative
    const evidenceResult = await getEvidenceDocuments(cooperativeId);
    if (evidenceResult.error) {
      return { data: null, error: evidenceResult.error };
    }

    // 3. Extract distinct doc_types from evidence documents
    const evidenceDocTypes = Array.from(
      new Set(
        (evidenceResult.data || [])
          .map(doc => doc.doc_type)
          .filter(Boolean) as string[]
      )
    );

    // 4. Compute coverage metrics
    const metrics = computeCoverageMetrics(
      cooperativeId,
      evidenceDocTypes,
      commodity,
      regulationContext.length > 0 ? regulationContext : undefined
    );

    // 5. Save or update in database
    const { data: existing, error: fetchError } = await supabase
      .from('coverage_metrics')
      .select('*')
      .eq('coop_id', cooperativeId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching existing metrics:', fetchError);
    }

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('coverage_metrics')
        .update({
          required_docs_total: metrics.required_docs_total,
          required_docs_present: metrics.required_docs_present,
          coverage_percentage: metrics.coverage_percentage,
          last_updated: metrics.last_updated,
        })
        .eq('coop_id', cooperativeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating coverage metrics:', error);
        return { data: metrics, error: null }; // Return computed metrics even if save fails
      }

      return { data: transformCoverageMetrics(data), error: null };
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('coverage_metrics')
        .insert({
          coop_id: cooperativeId,
          required_docs_total: metrics.required_docs_total,
          required_docs_present: metrics.required_docs_present,
          coverage_percentage: metrics.coverage_percentage,
          last_updated: metrics.last_updated,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting coverage metrics:', error);
        return { data: metrics, error: null }; // Return computed metrics even if save fails
      }

      return { data: transformCoverageMetrics(data), error: null };
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get document presence status for a cooperative
 */
export async function getDocumentPresenceStatus(
  cooperativeId: string
): Promise<{
  data: DocumentPresence[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // 1. Get cooperative info
    const coopResult = await getCanonicalDirectoryRecordById(cooperativeId);
    const commodity = coopResult.data?.primary_crop;
    const regulationContext: string[] = [];

    // 2. Get required document types
    const requiredDocTypes = getRequiredDocTypes(commodity, regulationContext);

    // 3. Get evidence documents
    const evidenceResult = await getEvidenceDocuments(cooperativeId);
    if (evidenceResult.error) {
      return { data: null, error: evidenceResult.error };
    }

    // 4. Extract distinct doc_types
    const evidenceDocTypes = Array.from(
      new Set(
        (evidenceResult.data || [])
          .map(doc => doc.doc_type)
          .filter(Boolean) as string[]
      )
    );

    // 5. Compute presence status
    const presence = getDocumentPresence(requiredDocTypes, evidenceDocTypes);

    return { data: presence, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper function to transform database records to TypeScript types
function transformCoverageMetrics(data: any): CoverageMetrics {
  return {
    coop_id: data.coop_id.toString(),
    required_docs_total: data.required_docs_total,
    required_docs_present: data.required_docs_present,
    coverage_percentage: parseFloat(data.coverage_percentage) || 0,
    last_updated: data.last_updated,
  };
}

