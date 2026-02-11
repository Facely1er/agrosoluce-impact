// Farmer Declarations Service
// Pure functions for farmer declaration business logic
// No React imports, no UI - business logic only

export interface FarmerDeclaration {
  declaration_id: string;
  coop_id: string;
  farmer_reference: string; // Internal/non-public reference, not a name
  declaration_type: string;
  declared_value: string; // Can be boolean, text, JSON, etc. stored as text
  declared_at: string; // ISO timestamp
  collected_by?: string; // UUID of coop user
  created_at?: string; // ISO timestamp
}

export interface FarmerDeclarationInput {
  coop_id: string;
  farmer_reference: string;
  declaration_type: string;
  declared_value: string;
  declared_at: string; // ISO timestamp
  collected_by?: string;
}

/**
 * Label for all farmer declarations
 * All records must be labeled as "Self-reported / Unverified"
 */
export const FARMER_DECLARATION_LABEL = 'Self-reported / Unverified';

/**
 * Validate farmer declaration input
 */
export function validateFarmerDeclaration(
  input: FarmerDeclarationInput
): { valid: boolean; error?: string } {
  if (!input.coop_id) {
    return { valid: false, error: 'coop_id is required' };
  }
  
  if (!input.farmer_reference || input.farmer_reference.trim() === '') {
    return { valid: false, error: 'farmer_reference is required' };
  }
  
  if (!input.declaration_type || input.declaration_type.trim() === '') {
    return { valid: false, error: 'declaration_type is required' };
  }
  
  if (!input.declared_value || input.declared_value.trim() === '') {
    return { valid: false, error: 'declared_value is required' };
  }
  
  if (!input.declared_at) {
    return { valid: false, error: 'declared_at is required' };
  }
  
  // Validate declared_at is a valid date
  const declaredDate = new Date(input.declared_at);
  if (isNaN(declaredDate.getTime())) {
    return { valid: false, error: 'declared_at must be a valid date' };
  }
  
  return { valid: true };
}

/**
 * Format farmer declaration for display
 * Ensures all records are labeled as "Self-reported / Unverified"
 */
export function formatFarmerDeclaration(
  declaration: FarmerDeclaration
): FarmerDeclaration & { label: string } {
  return {
    ...declaration,
    label: FARMER_DECLARATION_LABEL,
  };
}

