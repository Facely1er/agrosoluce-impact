// Gap Guidance Configuration
// Maps document types to human-readable guidance text
// All narrative text is stored here for easy updates without changing logic

import type { DocType } from './expectedDocumentsConfig';

export interface GapGuidance {
  docType: DocType;
  label: string; // Short human-readable label
  whyRequested: string; // Explanation of why this document is commonly requested
  typicalNextStep: string; // Suggested next step for obtaining this document
}

/**
 * Get human-readable label for a document type
 */
export function getDocTypeLabel(docType: DocType | string): string {
  const labels: Record<string, string> = {
    certification: 'Certification',
    policy: 'Policy',
    land_evidence: 'Land Evidence',
    other: 'Other Document',
  };
  return labels[docType] || docType;
}

/**
 * Get guidance for a specific document type
 */
export function getGapGuidance(docType: DocType | string): GapGuidance | null {
  return GAP_GUIDANCE_CONFIG[docType as DocType] || null;
}

/**
 * Get guidance for multiple document types
 */
export function getGapGuidanceForTypes(docTypes: (DocType | string)[]): GapGuidance[] {
  return docTypes
    .map(docType => getGapGuidance(docType))
    .filter((guidance): guidance is GapGuidance => guidance !== null);
}

/**
 * Static guidance configuration
 * Maps each document type to its guidance information
 */
const GAP_GUIDANCE_CONFIG: Record<DocType, GapGuidance> = {
  certification: {
    docType: 'certification',
    label: 'Certification',
    whyRequested: 'Certifications demonstrate that the cooperative meets recognized standards for environmental, social, or quality practices. Buyers often request certifications to help assess alignment with sustainability requirements and to support their own due-diligence processes.',
    typicalNextStep: 'You may want to request certification documents from the cooperative. Common certifications include organic, Fair Trade, Rainforest Alliance, or other commodity-specific certifications. Consider checking that the certification is current and valid.',
  },
  policy: {
    docType: 'policy',
    label: 'Policy',
    whyRequested: 'Policies document the cooperative\'s commitment to key principles such as environmental protection, labor rights, and ethical sourcing. Buyers use policy documents to assess whether the cooperative has formal commitments aligned with their own standards.',
    typicalNextStep: 'You may want to request policy documents from the cooperative. Common policies include environmental policy, child labor policy, deforestation policy, or supplier code of conduct. Policies are typically more useful when they are dated and signed by authorized representatives.',
  },
  land_evidence: {
    docType: 'land_evidence',
    label: 'Land Evidence',
    whyRequested: 'Land evidence documents help verify the origin and legal status of agricultural production. This is particularly important for regulations like EUDR (EU Deforestation Regulation) that require proof of legal land use and absence of deforestation.',
    typicalNextStep: 'You may want to request land-use documentation from the cooperative. This may include land titles, land-use declarations, GPS coordinates of plots, or maps showing production areas. You may need to coordinate with the cooperative to gather this information from farmers.',
  },
  other: {
    docType: 'other',
    label: 'Other Document',
    whyRequested: 'Additional documentation may be requested based on specific buyer requirements, regulatory contexts, or commodity-specific needs. The exact requirements depend on the buyer\'s due-diligence framework.',
    typicalNextStep: 'You may want to clarify with the buyer what specific documentation is needed. You may need to coordinate with the cooperative to identify and gather the requested documents.',
  },
};

