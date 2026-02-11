// Coverage Service
// Pure functions for computing document coverage metrics
// No React imports, no UI - business logic only

import { getRequiredDocTypes } from '@/data/expectedDocumentsConfig';
import type { DocType } from '@/data/expectedDocumentsConfig';

export interface CoverageMetrics {
  coop_id: string;
  required_docs_total: number;
  required_docs_present: number;
  coverage_percentage: number;
  last_updated?: string;
}

export interface DocumentPresence {
  doc_type: DocType;
  present: boolean;
}

/**
 * Compute coverage metrics for a cooperative
 * 
 * @param cooperativeId - The cooperative ID
 * @param evidenceDocTypes - Array of distinct doc_types found in evidence documents
 * @param commodity - Optional commodity for determining required docs
 * @param regulationContext - Optional regulation context for determining required docs
 * @returns Coverage metrics object
 */
export function computeCoverageMetrics(
  cooperativeId: string,
  evidenceDocTypes: string[],
  commodity?: string,
  regulationContext?: string[]
): CoverageMetrics {
  // Get required document types based on commodity and regulation context
  const requiredDocTypes = getRequiredDocTypes(commodity, regulationContext);
  const requiredDocsTotal = requiredDocTypes.length;

  // Count how many required doc types are present
  const evidenceDocTypesSet = new Set(evidenceDocTypes.map(type => type.toLowerCase()));
  const requiredDocsPresent = requiredDocTypes.filter(docType =>
    evidenceDocTypesSet.has(docType.toLowerCase())
  ).length;

  // Calculate coverage percentage
  const coveragePercentage = requiredDocsTotal > 0
    ? Math.round((requiredDocsPresent / requiredDocsTotal) * 100 * 100) / 100 // Round to 2 decimal places
    : 0;

  return {
    coop_id: cooperativeId,
    required_docs_total: requiredDocsTotal,
    required_docs_present: requiredDocsPresent,
    coverage_percentage: coveragePercentage,
    last_updated: new Date().toISOString(),
  };
}

/**
 * Get document presence status for each required document type
 * 
 * @param requiredDocTypes - Array of required document types
 * @param evidenceDocTypes - Array of distinct doc_types found in evidence documents
 * @returns Array of document presence statuses
 */
export function getDocumentPresence(
  requiredDocTypes: DocType[],
  evidenceDocTypes: string[]
): DocumentPresence[] {
  const evidenceDocTypesSet = new Set(evidenceDocTypes.map(type => type.toLowerCase()));

  return requiredDocTypes.map(docType => ({
    doc_type: docType,
    present: evidenceDocTypesSet.has(docType.toLowerCase()),
  }));
}

