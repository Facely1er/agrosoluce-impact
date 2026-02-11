// Document Metadata Service for Phase 1 Data Enrichment
// Helper functions for inferring document types and extracting dates from filenames

import type { DocType } from '@/types';

/**
 * Infer document type from filename or path
 * 
 * Uses simple heuristics based on filename keywords:
 * - Contains "policy" → "policy"
 * - Contains "certificate" or "cert" → "certification"
 * - Contains "map", "gps", "plot", or "land" → "land_evidence"
 * - Otherwise → "other"
 * 
 * @param path - File path or filename
 * @returns Inferred document type
 */
export function inferDocumentTypeFromFilenameOrPath(path: string): DocType {
  const lowerPath = path.toLowerCase();
  
  // Check for policy documents
  if (lowerPath.includes('policy') || lowerPath.includes('politique')) {
    return 'policy';
  }
  
  // Check for certification documents
  if (
    lowerPath.includes('certificate') ||
    lowerPath.includes('certificat') ||
    lowerPath.includes('cert') ||
    lowerPath.includes('certification')
  ) {
    return 'certification';
  }
  
  // Check for land/plot evidence documents
  if (
    lowerPath.includes('map') ||
    lowerPath.includes('carte') ||
    lowerPath.includes('gps') ||
    lowerPath.includes('plot') ||
    lowerPath.includes('parcelle') ||
    lowerPath.includes('land') ||
    lowerPath.includes('terrain') ||
    lowerPath.includes('field') ||
    lowerPath.includes('champ')
  ) {
    return 'land_evidence';
  }
  
  // Default to "other" if no match
  return 'other';
}

/**
 * Extract document dates from filename or manual input
 * 
 * Phase 1: Just pass through manual inputs; no heavy parsing.
 * Future: Add regex parsing if needed (e.g., extract dates from filenames like "cert_2024-01-15.pdf")
 * 
 * @param filename - File name (for future regex parsing)
 * @param manualIssuedAt - Optional manually provided issue date (ISO string)
 * @param manualExpiresAt - Optional manually provided expiry date (ISO string)
 * @returns Object with issued_at and expires_at (ISO strings or undefined)
 */
export function extractDocumentDatesFromNameOrManualInput(
  filename: string,
  manualIssuedAt?: string,
  manualExpiresAt?: string
): { issued_at?: string; expires_at?: string } {
  // Phase 1: just pass through manual inputs
  // Future: could add regex parsing here to extract dates from filenames
  // Example: "certificate_2024-01-15_expires_2025-01-15.pdf"
  
  return {
    issued_at: manualIssuedAt,
    expires_at: manualExpiresAt,
  };
}

