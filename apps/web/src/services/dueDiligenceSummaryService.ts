// Due-Diligence Summary Service
// Generates structured summary data for export
// Reuses existing logic for evidence, coverage, and readiness

import type { CanonicalCooperativeDirectory } from '@/types';
import type { EvidenceDocument } from '@/features/evidence/api/evidenceDocumentsApi';
import type { CoverageMetrics } from './coverageService';
import type { DocumentPresence } from './coverageService';
import type { ReadinessSnapshot } from './readinessSnapshotService';
import type { RegulatoryReference, Jurisdiction } from '@/data/regulatoryReferences';
import { REGULATORY_REFERENCES } from '@/data/regulatoryReferences';
import { getCountryPackByCode, getCountryPackByName } from '@/data/countryPacks';
import { getCommodityPackByName } from '@/data/commodityPacks';
import {
  computeContextualRisks,
  computeRegulatoryContext,
} from './enrichmentService';
import {
  HIGH_DEFORESTATION_RISK_COUNTRIES,
  MEDIUM_DEFORESTATION_RISK_COUNTRIES,
  EUDR_PRODUCER_COUNTRIES,
  CHILD_LABOR_RISK_CROPS,
} from '../config/enrichmentConfig';

export interface DueDiligenceSummary {
  cooperative_identity: {
    coop_id: string;
    name: string;
    country?: string;
    region?: string;
    department?: string;
    primary_crop?: string;
    source_registry?: string;
    record_status?: string;
  };
  market_context_snapshot: {
    country?: string;
    region?: string;
    primary_crop?: string;
    is_high_deforestation_risk: boolean;
    is_medium_deforestation_risk: boolean;
    is_eudr_producer_country: boolean;
    is_child_labor_risk_crop: boolean;
    deforestation_zone?: string;
    protected_area_overlap?: string;
    climate_risk?: string;
    eudr_applicable?: boolean;
  };
  evidence_summary: {
    total_documents: number;
    documents_by_type: Record<string, number>;
  };
  evidence_documents?: Array<{
    id: string;
    doc_type: string;
    title: string;
    issuer?: string;
    issue_date?: string;
    expiration_date?: string;
    uploaded_at?: string;
    evidence_type?: string;
  }>;
  coverage_metrics: {
    required_docs_total: number;
    required_docs_present: number;
    coverage_percentage: number;
    last_updated?: string;
  };
  documentation_gaps: {
    missing_doc_types: string[];
  };
  readiness: {
    readiness_status?: string;
    snapshot_timestamp?: string;
    snapshot_reason?: string;
  };
  evidence_typology_summary?: {
    total_by_type: Record<string, number>;
    note: string;
  };
  applicable_regulatory_references?: Array<{
    ref_id: string;
    jurisdiction: string;
    regulation_name: string;
    article_reference: string;
    due_diligence_expectation: string;
  }>;
  country_pack_summary?: {
    country_code: string;
    country_name: string;
    land_tenure_overview: string;
    commonly_accepted_documents: string[];
    known_limitations: string[];
  };
  commodity_pack_summary?: {
    commodity: string;
    typical_supply_chain: string;
    common_document_patterns: string[];
    buyer_expectations_summary: string;
    known_challenges: string[];
  };
  disclaimer: string;
  generated_at: string;
}

/**
 * Generate due-diligence summary for a cooperative
 */
export function generateDueDiligenceSummary(
  cooperative: CanonicalCooperativeDirectory,
  evidenceDocuments: EvidenceDocument[],
  coverageMetrics: CoverageMetrics | null,
  documentPresence: DocumentPresence[],
  readinessSnapshot: ReadinessSnapshot | null
): DueDiligenceSummary {
  // Cooperative Identity
  const cooperativeIdentity = {
    coop_id: cooperative.coop_id,
    name: cooperative.name,
    country: cooperative.country,
    region: cooperative.region,
    department: cooperative.department,
    primary_crop: cooperative.primary_crop,
    source_registry: cooperative.source_registry,
    record_status: cooperative.record_status,
  };

  // Market Context Snapshot
  const cooperativeLike = {
    country: cooperative.country || '',
    commodity: cooperative.primary_crop || '',
    region: cooperative.region,
    department: cooperative.department,
  } as any;

  const contextualRisks = computeContextualRisks(cooperativeLike);
  const regulatoryContext = computeRegulatoryContext(cooperativeLike, ['EU']);

  const marketContextSnapshot = {
    country: cooperative.country,
    region: cooperative.region,
    primary_crop: cooperative.primary_crop,
    is_high_deforestation_risk: HIGH_DEFORESTATION_RISK_COUNTRIES.includes(cooperative.country as any),
    is_medium_deforestation_risk: MEDIUM_DEFORESTATION_RISK_COUNTRIES.includes(cooperative.country as any),
    is_eudr_producer_country: EUDR_PRODUCER_COUNTRIES.includes(cooperative.country as any),
    is_child_labor_risk_crop: CHILD_LABOR_RISK_CROPS.some(crop =>
      (cooperative.primary_crop || '').toLowerCase().includes(crop.toLowerCase())
    ),
    deforestation_zone: contextualRisks?.deforestation_zone,
    protected_area_overlap: contextualRisks?.protected_area_overlap,
    climate_risk: contextualRisks?.climate_risk,
    eudr_applicable: regulatoryContext?.eudr_applicable,
  };

  // Evidence Summary
  const documentsByType: Record<string, number> = {};
  evidenceDocuments.forEach(doc => {
    const docType = doc.doc_type || 'other';
    documentsByType[docType] = (documentsByType[docType] || 0) + 1;
  });

  const evidenceSummary = {
    total_documents: evidenceDocuments.length,
    documents_by_type: documentsByType,
  };

  // Include full document details with evidence_type for export
  const evidenceDocumentsExport = evidenceDocuments.map(doc => ({
    id: doc.id,
    doc_type: doc.doc_type || 'other',
    title: doc.title,
    issuer: doc.issuer,
    issue_date: doc.issue_date,
    expiration_date: doc.expiration_date,
    uploaded_at: doc.uploaded_at,
    evidence_type: doc.evidence_type,
  }));

  // Coverage Metrics
  const coverageMetricsData = coverageMetrics ? {
    required_docs_total: coverageMetrics.required_docs_total,
    required_docs_present: coverageMetrics.required_docs_present,
    coverage_percentage: coverageMetrics.coverage_percentage,
    last_updated: coverageMetrics.last_updated,
  } : {
    required_docs_total: 0,
    required_docs_present: 0,
    coverage_percentage: 0,
  };

  // Documentation Gaps
  const missingDocTypes = documentPresence
    .filter(item => !item.present)
    .map(item => item.doc_type);

  const documentationGaps = {
    missing_doc_types: missingDocTypes,
  };

  // Readiness
  const readiness = readinessSnapshot ? {
    readiness_status: readinessSnapshot.readiness_status,
    snapshot_timestamp: readinessSnapshot.created_at,
    snapshot_reason: readinessSnapshot.snapshot_reason,
  } : {};

  // Evidence Typology Summary
  const evidenceTypologyCounts: Record<string, number> = {};
  evidenceDocuments.forEach(doc => {
    const evidenceType = doc.evidence_type || 'documented';
    evidenceTypologyCounts[evidenceType] = (evidenceTypologyCounts[evidenceType] || 0) + 1;
  });
  const evidenceTypologySummary = {
    total_by_type: evidenceTypologyCounts,
    note: 'Evidence typology classification: documented, declared, attested, or contextual. This classification is descriptive only and does not indicate quality, validity, or compliance status.',
  };

  // Applicable Regulatory References
  const applicableRegulatoryReferences = (() => {
    const jurisdictions = getJurisdictionFromCountry(cooperative.country);
    if (jurisdictions.length === 0) {
      return undefined;
    }
    
    let filtered = REGULATORY_REFERENCES.filter(ref => 
      jurisdictions.includes(ref.jurisdiction)
    );
    
    // Basic commodity matching
    if (cooperative.primary_crop) {
      const commodityLower = cooperative.primary_crop.toLowerCase();
      if (commodityLower.includes('cocoa') || commodityLower.includes('cacao')) {
        const ciCocoaRefs = REGULATORY_REFERENCES.filter(ref => 
          ref.jurisdiction === 'CI' && ref.regulation_name.toLowerCase().includes('cocoa')
        );
        filtered = [...filtered, ...ciCocoaRefs];
      }
    }
    
    // Remove duplicates
    const uniqueRefs = Array.from(new Map(filtered.map(ref => [ref.ref_id, ref])).values());
    
    return uniqueRefs.map(ref => ({
      ref_id: ref.ref_id,
      jurisdiction: ref.jurisdiction,
      regulation_name: ref.regulation_name,
      article_reference: ref.article_reference,
      due_diligence_expectation: ref.due_diligence_expectation,
    }));
  })();

  // Country Pack Summary
  const countryPackSummary = (() => {
    const countryPack = cooperative.country 
      ? (getCountryPackByCode(cooperative.country) || getCountryPackByName(cooperative.country))
      : null;
    
    if (!countryPack) {
      return undefined;
    }
    
    return {
      country_code: countryPack.country_code,
      country_name: countryPack.country_name,
      land_tenure_overview: countryPack.land_tenure_overview,
      commonly_accepted_documents: countryPack.commonly_accepted_documents,
      known_limitations: countryPack.known_limitations,
    };
  })();

  // Commodity Pack Summary
  const commodityPackSummary = (() => {
    const commodityPack = cooperative.primary_crop 
      ? getCommodityPackByName(cooperative.primary_crop)
      : null;
    
    if (!commodityPack) {
      return undefined;
    }
    
    return {
      commodity: commodityPack.commodity,
      typical_supply_chain: commodityPack.typical_supply_chain,
      common_document_patterns: commodityPack.common_document_patterns,
      buyer_expectations_summary: commodityPack.buyer_expectations_summary,
      known_challenges: commodityPack.known_challenges,
    };
  })();

  // Disclaimer with explicit clause
  const disclaimer = 'This summary structures supplier-provided information to support due-diligence processes. It is not a certification or compliance determination. Responsibility for due care and final sourcing decisions remains with the buyer. This export supports due-diligence documentation. It is not a legal, regulatory, or compliance determination.';

  return {
    cooperative_identity: cooperativeIdentity,
    market_context_snapshot: marketContextSnapshot,
    evidence_summary: evidenceSummary,
    evidence_documents: evidenceDocumentsExport,
    coverage_metrics: coverageMetricsData,
    documentation_gaps: documentationGaps,
    readiness: readiness,
    evidence_typology_summary: evidenceTypologySummary,
    applicable_regulatory_references: applicableRegulatoryReferences,
    country_pack_summary: countryPackSummary,
    commodity_pack_summary: commodityPackSummary,
    disclaimer: disclaimer,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Helper function to map country to jurisdiction for regulatory references
 * Basic mapping only - for informational context
 */
function getJurisdictionFromCountry(country?: string): Jurisdiction[] {
  if (!country) return [];
  
  const countryUpper = country.toUpperCase();
  const jurisdictions: Jurisdiction[] = [];
  
  // EU countries (basic mapping)
  if (['FRANCE', 'FR'].includes(countryUpper)) {
    jurisdictions.push('FR');
  }
  if (['GERMANY', 'DE', 'DEUTSCHLAND'].includes(countryUpper)) {
    jurisdictions.push('DE');
  }
  // EU member states get EU jurisdiction
  const euCountries = [
    'AUSTRIA', 'BELGIUM', 'BULGARIA', 'CROATIA', 'CYPRUS', 'CZECH REPUBLIC', 'DENMARK',
    'ESTONIA', 'FINLAND', 'FRANCE', 'GERMANY', 'GREECE', 'HUNGARY', 'IRELAND',
    'ITALY', 'LATVIA', 'LITHUANIA', 'LUXEMBOURG', 'MALTA', 'NETHERLANDS', 'POLAND',
    'PORTUGAL', 'ROMANIA', 'SLOVAKIA', 'SLOVENIA', 'SPAIN', 'SWEDEN'
  ];
  if (euCountries.some(eu => countryUpper.includes(eu))) {
    jurisdictions.push('EU');
  }
  
  // Côte d'Ivoire
  if (['COTE D\'IVOIRE', 'CÔTE D\'IVOIRE', 'IVORY COAST', 'CI'].includes(countryUpper)) {
    jurisdictions.push('CI');
  }
  
  return jurisdictions;
}

