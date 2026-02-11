// Enrichment Orchestration Service
// Coordinates fetching data, computing enrichment, and persisting results
// This service is called when cooperative data, farmers, plots, or documents change

import { supabase } from '@/lib/supabase/client';
import type { Cooperative } from '@/types';
import {
  computeContextualRisks,
  computeRegulatoryContext,
  computeCoverageMetrics,
  deriveReadinessStatus,
} from './enrichmentService';
import { REQUIRED_DOC_TYPES } from '@/config/enrichmentConfig';

/**
 * Recompute and persist enrichment data for a cooperative
 * 
 * This function:
 * 1. Fetches current cooperative data
 * 2. Fetches related data (farmers, plots, documents)
 * 3. Computes enrichment metrics
 * 4. Updates the cooperative record with enrichment data
 * 
 * @param cooperativeId - The ID of the cooperative to enrich
 * @param buyerRegions - Optional array of buyer regions for regulatory context
 * @returns Updated cooperative object with enrichment data
 */
export async function recomputeCooperativeEnrichment(
  cooperativeId: string,
  buyerRegions?: string[]
): Promise<{ data: Cooperative | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // 1. Fetch cooperative
    const { data: cooperative, error: coopError } = await supabase
      .from('cooperatives')
      .select('*')
      .eq('id', cooperativeId)
      .single();

    if (coopError || !cooperative) {
      return { data: null, error: new Error(coopError?.message || 'Cooperative not found') };
    }

    // 2. Fetch farmers and count declarations
    const { data: farmers, error: farmersError } = await supabase
      .from('farmers')
      .select('id')
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true);

    if (farmersError) {
      console.error('Error fetching farmers:', farmersError);
    }

    const farmersTotal = farmers?.length || 0;

    // Count farmers with declarations
    const { data: farmerDeclarations, error: declarationsError } = await supabase
      .from('farmer_declarations')
      .select('farmer_id')
      .in('farmer_id', (farmers || []).map(f => f.id));

    if (declarationsError) {
      console.error('Error fetching farmer declarations:', declarationsError);
    }

    const farmersWithDeclarations = new Set(farmerDeclarations?.map(d => d.farmer_id) || []).size;

    // 3. Fetch plots and count geo-referenced ones
    const { data: plots, error: plotsError } = await supabase
      .from('field_declarations')
      .select('field_location_latitude, field_location_longitude')
      .eq('cooperative_id', cooperativeId);

    if (plotsError) {
      console.error('Error fetching plots:', plotsError);
    }

    const plotsTotal = plots?.length || 0;
    const plotsWithGeo = plots?.filter(
      p => p.field_location_latitude != null && p.field_location_longitude != null
    ).length || 0;

    // 4. Fetch documents and count required types
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('doc_type, document_type, is_required_type')
      .eq('entity_type', 'cooperative')
      .eq('entity_id', cooperativeId);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
    }

    // Determine which required doc types are present
    const docTypesPresent = new Set(
      (documents || [])
        .map(d => d.doc_type || inferDocTypeFromDocumentType(d.document_type))
        .filter((type): type is string => REQUIRED_DOC_TYPES.includes(type as any))
    );

    const requiredDocsTotal = REQUIRED_DOC_TYPES.length;
    const requiredDocsPresent = docTypesPresent.size;

    // 5. Compute enrichment
    const contextualRisks = computeContextualRisks(cooperative as Cooperative);
    const regulatoryContext = computeRegulatoryContext(cooperative as Cooperative, buyerRegions);
    const coverageMetrics = computeCoverageMetrics(
      farmersTotal,
      farmersWithDeclarations,
      plotsTotal,
      plotsWithGeo,
      requiredDocsTotal,
      requiredDocsPresent
    );
    const readinessStatus = deriveReadinessStatus(coverageMetrics);

    // 6. Update cooperative with enrichment data
    const { data: updatedCooperative, error: updateError } = await supabase
      .from('cooperatives')
      .update({
        contextual_risks: contextualRisks,
        regulatory_context: regulatoryContext,
        coverage_metrics: coverageMetrics,
        readiness_status: readinessStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cooperativeId)
      .select()
      .single();

    if (updateError) {
      return { data: null, error: new Error(updateError.message) };
    }

    // Transform to match frontend expectations
    const transformed = {
      ...updatedCooperative,
      id: updatedCooperative.id.toString(),
      contextual_risks: updatedCooperative.contextual_risks,
      regulatory_context: updatedCooperative.regulatory_context,
      coverage_metrics: updatedCooperative.coverage_metrics,
      readiness_status: updatedCooperative.readiness_status,
    } as Cooperative;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error recomputing enrichment:', error);
    return { data: null, error };
  }
}

/**
 * Helper function to infer doc_type from document_type (legacy field)
 */
function inferDocTypeFromDocumentType(documentType: string): string {
  const lower = documentType.toLowerCase();
  if (lower.includes('certif') || lower.includes('cert')) return 'certification';
  if (lower.includes('policy') || lower.includes('politique')) return 'policy';
  if (lower.includes('plot') || lower.includes('land') || lower.includes('map') || lower.includes('gps')) {
    return 'land_evidence';
  }
  return 'other';
}

