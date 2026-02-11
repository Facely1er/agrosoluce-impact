// Expected Documents Configuration
// Defines required document types per commodity and/or regulation context

export type DocType = 'certification' | 'policy' | 'land_evidence' | 'other';

export interface ExpectedDocumentsConfig {
  commodity?: string; // e.g., 'cocoa', 'coffee'
  regulationContext?: string[]; // e.g., ['EUDR', 'child_labor']
  requiredDocTypes: DocType[];
}

/**
 * Default required document types (applies to all cooperatives)
 */
const DEFAULT_REQUIRED_DOC_TYPES: DocType[] = [
  'certification',
  'policy',
  'land_evidence',
];

/**
 * Commodity-specific document requirements
 */
const COMMODITY_REQUIREMENTS: Record<string, DocType[]> = {
  cocoa: ['certification', 'policy', 'land_evidence'],
  coffee: ['certification', 'policy', 'land_evidence'],
  cashew: ['certification', 'policy'],
  'palm oil': ['certification', 'policy', 'land_evidence'],
  rubber: ['certification', 'policy'],
  cotton: ['certification', 'policy', 'land_evidence'],
};

/**
 * Regulation-specific document requirements
 */
const REGULATION_REQUIREMENTS: Record<string, DocType[]> = {
  EUDR: ['certification', 'policy', 'land_evidence'],
  child_labor: ['policy', 'certification'],
};

/**
 * Get required document types for a cooperative
 * 
 * @param commodity - Primary commodity (optional)
 * @param regulationContext - Array of applicable regulations (optional)
 * @returns Array of required document types
 */
export function getRequiredDocTypes(
  commodity?: string,
  regulationContext?: string[]
): DocType[] {
  const docTypes = new Set<DocType>();

  // Start with default requirements
  DEFAULT_REQUIRED_DOC_TYPES.forEach(type => docTypes.add(type));

  // Add commodity-specific requirements
  if (commodity) {
    const commodityLower = commodity.toLowerCase();
    const commodityReqs = COMMODITY_REQUIREMENTS[commodityLower];
    if (commodityReqs) {
      commodityReqs.forEach(type => docTypes.add(type));
    }
  }

  // Add regulation-specific requirements
  if (regulationContext && regulationContext.length > 0) {
    regulationContext.forEach(regulation => {
      const regulationLower = regulation.toLowerCase();
      const regulationReqs = REGULATION_REQUIREMENTS[regulationLower];
      if (regulationReqs) {
        regulationReqs.forEach(type => docTypes.add(type));
      }
    });
  }

  return Array.from(docTypes);
}

/**
 * Get expected documents configuration for a cooperative
 */
export function getExpectedDocumentsConfig(
  commodity?: string,
  regulationContext?: string[]
): ExpectedDocumentsConfig {
  return {
    commodity,
    regulationContext,
    requiredDocTypes: getRequiredDocTypes(commodity, regulationContext),
  };
}

