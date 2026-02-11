// Enrichment Service for Phase 1 Data Enrichment
// Pure functions (no React imports, no UI) for computing enrichment data
// These functions provide context and metrics only - they are not legal/compliance guarantees

import type { Cooperative } from '@/types';
import {
  COVERAGE_THRESHOLDS,
  HIGH_DEFORESTATION_RISK_COUNTRIES,
  MEDIUM_DEFORESTATION_RISK_COUNTRIES,
  EUDR_PRODUCER_COUNTRIES,
  EUDR_BUYER_REGIONS,
  CHILD_LABOR_RISK_CROPS,
} from '@/config/enrichmentConfig';

/**
 * Compute contextual risks for a cooperative based on geographic and environmental factors
 * 
 * Phase 1 implementation uses simple rules based on country and region.
 * Future phases may integrate with external APIs for more accurate risk assessment.
 * 
 * @param cooperative - The cooperative to assess
 * @returns Contextual risks object with deforestation_zone, protected_area_overlap, and climate_risk
 */
export function computeContextualRisks(
  cooperative: Cooperative
): Cooperative['contextual_risks'] {
  const country = cooperative.country || '';
  const deforestationZone = (() => {
    if (HIGH_DEFORESTATION_RISK_COUNTRIES.includes(country as any)) {
      return 'high' as const;
    }
    if (MEDIUM_DEFORESTATION_RISK_COUNTRIES.includes(country as any)) {
      return 'medium' as const;
    }
    // For Phase 1, we default to "unknown" if country is not in our lists
    // Future: could integrate with deforestation risk APIs
    return 'unknown' as const;
  })();

  // Phase 1: protected_area_overlap is unknown (would require geo API integration)
  // Future: integrate with protected area databases
  const protectedAreaOverlap: 'unknown' = 'unknown';

  // Phase 1: climate_risk is unknown (would require climate risk assessment)
  // Future: integrate with climate risk models
  const climateRisk: 'unknown' = 'unknown';

  return {
    deforestation_zone: deforestationZone,
    protected_area_overlap: protectedAreaOverlap,
    climate_risk: climateRisk,
  };
}

/**
 * Compute regulatory context for a cooperative based on country, commodity, and buyer regions
 * 
 * Determines which regulations apply to the cooperative's operations.
 * 
 * @param cooperative - The cooperative to assess
 * @param buyerRegions - Optional array of buyer regions (e.g., ['EU', 'US'])
 * @returns Regulatory context object with eudr_applicable, child_labor_due_diligence_required, and other_requirements
 */
export function computeRegulatoryContext(
  cooperative: Cooperative,
  buyerRegions?: string[]
): Cooperative['regulatory_context'] {
  const country = cooperative.country || '';
  const commodity = (cooperative.commodity || '').toLowerCase();
  
  // EUDR is applicable if:
  // 1. The cooperative is in an EUDR producer country
  // 2. AND at least one buyer region is in the EU
  const eudrApplicable = 
    EUDR_PRODUCER_COUNTRIES.includes(country as any) &&
    (buyerRegions?.some(region => 
      EUDR_BUYER_REGIONS.some(eudrRegion => 
        region.toLowerCase().includes(eudrRegion.toLowerCase())
      )
    ) ?? false);

  // Child labor due diligence is required for certain crops
  const childLaborDueDiligenceRequired = 
    CHILD_LABOR_RISK_CROPS.some(riskCrop => 
      commodity.includes(riskCrop.toLowerCase())
    );

  // Other requirements can be added here
  // Phase 1: simple list, can be expanded
  const otherRequirements: string[] = [];
  
  // Example: if cooperative has specific certifications, might trigger other requirements
  // This is a placeholder for future expansion
  if (cooperative.certifications && cooperative.certifications.length > 0) {
    // Could add company-specific or importer-specific requirements here
  }

  return {
    eudr_applicable: eudrApplicable,
    child_labor_due_diligence_required: childLaborDueDiligenceRequired,
    other_requirements: otherRequirements,
  };
}

/**
 * Compute coverage metrics from raw counts
 * 
 * This is a straightforward calculation function - no scoring, just metrics.
 * 
 * @param farmersTotal - Total number of farmers
 * @param farmersWithDeclarations - Number of farmers with declarations
 * @param plotsTotal - Total number of plots
 * @param plotsWithGeo - Number of plots with geo references
 * @param requiredDocsTotal - Total number of required document types
 * @param requiredDocsPresent - Number of required document types that are present
 * @returns Coverage metrics object
 */
export function computeCoverageMetrics(
  farmersTotal: number,
  farmersWithDeclarations: number,
  plotsTotal: number,
  plotsWithGeo: number,
  requiredDocsTotal: number,
  requiredDocsPresent: number
): Cooperative['coverage_metrics'] {
  return {
    farmers_total: farmersTotal,
    farmers_with_declarations: farmersWithDeclarations,
    plots_total: plotsTotal,
    plots_with_geo: plotsWithGeo,
    required_docs_total: requiredDocsTotal,
    required_docs_present: requiredDocsPresent,
  };
}

/**
 * Derive readiness status from coverage metrics
 * 
 * Phase 1 simple rules:
 * - not_ready: farmers_with_declarations / farmers_total < 0.3
 * - in_progress: between 0.3 and 0.8, or missing required documents
 * - buyer_ready: high coverage on all fronts (e.g. >=0.8) AND required_docs_present == required_docs_total
 * 
 * This function provides readiness indicators only - not compliance guarantees.
 * 
 * @param coverage - Coverage metrics object
 * @returns Readiness status: 'not_ready' | 'in_progress' | 'buyer_ready'
 */
export function deriveReadinessStatus(
  coverage: Cooperative['coverage_metrics']
): 'not_ready' | 'in_progress' | 'buyer_ready' {
  if (!coverage) {
    return 'not_ready';
  }

  const {
    farmers_total = 0,
    farmers_with_declarations = 0,
    plots_total = 0,
    plots_with_geo = 0,
    required_docs_total = 0,
    required_docs_present = 0,
  } = coverage;

  // Calculate ratios (avoid division by zero)
  const farmerDeclarationRatio = farmers_total > 0 
    ? farmers_with_declarations / farmers_total 
    : 0;
  
  const plotGeoRatio = plots_total > 0 
    ? plots_with_geo / plots_total 
    : 0;
  
  const docsRatio = required_docs_total > 0 
    ? required_docs_present / required_docs_total 
    : 0;

  // Check if all required documents are present
  const allRequiredDocsPresent = required_docs_total > 0 && required_docs_present >= required_docs_total;

  // Buyer-ready criteria:
  // - At least 80% of farmers have declarations
  // - At least 80% of plots have geo references
  // - All required documents are present
  const isBuyerReady = 
    farmerDeclarationRatio >= COVERAGE_THRESHOLDS.farmerDeclarationsBuyerReady &&
    plotGeoRatio >= COVERAGE_THRESHOLDS.plotsGeoBuyerReady &&
    allRequiredDocsPresent;

  // In-progress criteria:
  // - At least 30% of farmers have declarations, OR
  // - Some progress on plots or documents, but not buyer-ready
  const isInProgress = 
    farmerDeclarationRatio >= COVERAGE_THRESHOLDS.farmerDeclarationsMinimum ||
    (farmerDeclarationRatio > 0 || plotGeoRatio > 0 || docsRatio > 0);

  if (isBuyerReady) {
    return 'buyer_ready';
  }

  if (isInProgress) {
    return 'in_progress';
  }

  return 'not_ready';
}

