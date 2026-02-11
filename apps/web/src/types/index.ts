// Core types for AgroSoluce Cooperative Management Platform
// Aligned with database schema in database/migrations/001_initial_schema_setup.sql

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type TransactionStatus = 'initiated' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type UserType = 'buyer' | 'cooperative' | 'admin';
export type QualityGrade = 'premium' | 'standard' | 'basic';

// Database-aligned Cooperative type
export interface Cooperative {
  id: string; // UUID from database
  name: string;
  region?: string;
  department?: string; // Note: database uses 'department', not 'departement'
  commune?: string;
  sector?: string; // Note: database uses 'sector', not 'secteur'
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  products?: string[]; // Array of product names/descriptions
  certifications?: string[];
  is_verified?: boolean; // Database field
  user_profile_id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  
  // Legacy/JSON fields (for backward compatibility during migration)
  departement?: string; // Alias for department
  secteur?: string; // Alias for sector
  registrationNumber?: string;
  president?: string;
  contact?: string;
  natureActivite?: string;
  status?: VerificationStatus; // Legacy status field
  
  // Enriched/computed fields (not in database, added by frontend)
  regionSlug?: string;
  departementSlug?: string;
  secteurCanonical?: string;
  natureActiviteTags?: string[];
  phonesE164?: string[];
  primaryPhoneE164?: string | null;
  searchKeywords?: string[];
  
  // v1 Scope fields (AgroSoluce v1)
  country?: string;
  commodity?: string; // e.g. cocoa, coffee
  annualVolumeTons?: number;
  complianceFlags?: {
    eudrReady?: boolean;
    childLaborRisk?: 'unknown' | 'low' | 'medium' | 'high';
    otherRisks?: string[];
  };
  contactEmail?: string;
  contactPhone?: string;
  profileSource?: string;
  
  // Phase 1 Data Enrichment fields
  contextual_risks?: {
    deforestation_zone?: 'low' | 'medium' | 'high' | 'unknown';
    protected_area_overlap?: 'yes' | 'no' | 'unknown';
    climate_risk?: 'low' | 'medium' | 'high' | 'unknown';
  };
  regulatory_context?: {
    eudr_applicable?: boolean;
    child_labor_due_diligence_required?: boolean;
    other_requirements?: string[];
  };
  coverage_metrics?: {
    farmers_total?: number;
    farmers_with_declarations?: number;
    plots_total?: number;
    plots_with_geo?: number;
    required_docs_total?: number;
    required_docs_present?: number;
  };
  readiness_status?: 'not_ready' | 'in_progress' | 'buyer_ready';
}

// Database-aligned Product type
export interface Product {
  id: string; // UUID
  cooperative_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string; // Default: 'XOF'
  unit?: string; // kg, ton, bag, etc.
  quantity_available?: number;
  harvest_date?: string; // ISO date string
  organic?: boolean;
  certifications?: string[];
  images?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  
  // Legacy fields
  product_name?: string; // Alias for name
  price_per_unit?: number; // Alias for price
  quality_grade?: QualityGrade;
}

// Product Category
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_category_id?: string;
  created_at?: string;
}

// Document type (Phase 1 Data Enrichment)
export type DocType = 'certification' | 'policy' | 'land_evidence' | 'other';

export interface Document {
  id: string; // UUID
  entity_type: 'cooperative' | 'farmer' | 'plot' | 'lot' | 'certification' | 'other';
  entity_id: string;
  document_type: string; // Legacy field, maps to doc_type
  doc_type?: DocType; // Phase 1 enrichment field
  title: string;
  file_url: string;
  file_name?: string;
  file_size_bytes?: number;
  mime_type?: string;
  uploaded_by?: string;
  uploaded_at?: string;
  expiry_date?: string; // Legacy field
  expires_at?: string; // Phase 1 enrichment field
  issued_at?: string; // Phase 1 enrichment field
  issuer?: string; // Phase 1 enrichment field
  is_required_type?: boolean; // Phase 1 enrichment field
  is_internal_only?: boolean;
  is_buyer_visible?: boolean;
  description?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// User Profile (from database)
export interface UserProfile {
  id: string;
  user_id: string; // References auth.users
  email: string;
  full_name?: string;
  phone_number?: string;
  user_type: UserType;
  organization_name?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
  preferences?: Record<string, any>;
}

// Buyer (extends UserProfile or separate view)
export interface Buyer {
  id: string;
  user_profile_id: string;
  company_name?: string;
  country?: string;
  email: string;
  verification_status?: VerificationStatus;
  created_at?: string;
  updated_at?: string;
}

// Order (from database)
export interface Order {
  id: string;
  buyer_id: string;
  cooperative_id: string;
  status: OrderStatus;
  total_amount: number;
  currency?: string; // Default: 'XOF'
  shipping_address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

// Message
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  order_id?: string;
  subject?: string;
  content: string;
  is_read?: boolean;
  created_at?: string;
}

// Legacy Transaction type (for backward compatibility)
export interface Transaction {
  id: string;
  cooperative_id: string;
  buyer_id: string;
  product_id: string;
  transaction_ref?: string;
  total_amount: number;
  quantity: number;
  status: TransactionStatus;
  commission_amount?: number;
  created_at?: string;
  updated_at?: string;
}

// JSON data structure (for migration)
export interface CooperativeData {
  cooperatives: Cooperative[];
}

// Farmer (Producer Registry)
export interface Farmer {
  id: string; // UUID
  cooperative_id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  date_of_birth?: string; // ISO date string
  gender?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

// Batch (Traceability)
export interface Batch {
  id: string; // UUID
  product_id: string;
  cooperative_id: string;
  farmer_id?: string;
  harvest_date?: string; // ISO date string
  origin_gps_latitude?: number;
  origin_gps_longitude?: number;
  quantity: number;
  unit?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

// Batch Transaction (Traceability Chain)
export interface BatchTransaction {
  id: string;
  batch_id: string;
  from_entity_type: 'farmer' | 'cooperative' | 'buyer';
  from_entity_id: string;
  to_entity_type: 'farmer' | 'cooperative' | 'buyer';
  to_entity_id: string;
  transaction_type: 'harvest' | 'transfer' | 'sale' | 'processing';
  quantity: number;
  timestamp: string; // ISO timestamp
  notes?: string;
  created_at?: string;
}

// Certification (Compliance)
export interface Certification {
  id: string;
  cooperative_id?: string;
  farmer_id?: string;
  certification_type: string; // 'organic', 'fair_trade', 'rainforest_alliance', etc.
  issuer: string;
  issue_date: string; // ISO date string
  expiry_date?: string; // ISO date string
  status: 'active' | 'expired' | 'revoked' | 'pending';
  document_url?: string;
  created_at?: string;
  updated_at?: string;
}

// EUDR Verification (Compliance)
export interface EUDRVerification {
  id: string;
  batch_id: string;
  gps_coordinates?: { latitude: number; longitude: number };
  deforestation_check: 'passed' | 'failed' | 'pending';
  child_labor_check: 'passed' | 'failed' | 'pending';
  status: 'verified' | 'rejected' | 'pending';
  verified_at?: string; // ISO timestamp
  verified_by?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Compliance Requirement
export interface ComplianceRequirement {
  id: string;
  requirement_type: string; // 'eudr', 'child_labor', 'organic', etc.
  description: string;
  applicable_to: 'cooperative' | 'farmer' | 'product' | 'batch';
  created_at?: string;
}

// Field Declaration (Evidence)
export interface FieldDeclaration {
  id: string;
  cooperative_id: string;
  farmer_id?: string;
  field_location_latitude?: number;
  field_location_longitude?: number;
  crop_type: string;
  area: number; // in hectares
  declaration_date: string; // ISO date string
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Audit (Evidence)
export interface Audit {
  id: string;
  cooperative_id: string;
  audit_type: string; // 'third_party', 'internal', 'regulatory', etc.
  auditor_name: string;
  audit_date: string; // ISO date string
  findings?: string;
  document_url?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

// Attestation (Evidence)
export interface Attestation {
  id: string;
  entity_id: string; // Can be cooperative_id, farmer_id, batch_id, etc.
  entity_type: 'cooperative' | 'farmer' | 'batch' | 'product';
  attestation_type: string; // 'sustainability', 'labor', 'environmental', etc.
  content: string;
  signed_by: string;
  signed_at: string; // ISO timestamp
  document_url?: string;
  created_at?: string;
}

// Canonical Cooperative Directory
export type RecordStatus = 'active' | 'inactive' | 'archived' | 'pending';

// EUDR Commodity types
export type EudrCommodity =
  | 'cocoa'
  | 'coffee'
  | 'palm_oil'
  | 'rubber'
  | 'soy'
  | 'cattle'
  | 'wood';

export const EUDR_COMMODITIES_IN_SCOPE: { id: EudrCommodity; label: string }[] = [
  { id: 'cocoa', label: 'Cocoa' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'palm_oil', label: 'Palm oil' },
  { id: 'rubber', label: 'Natural rubber' },
  { id: 'soy', label: 'Soy' },
  { id: 'cattle', label: 'Cattle (beef/leather)' },
  { id: 'wood', label: 'Wood / timber' }
];

// Coverage band type
export type CoverageBand = 'limited' | 'partial' | 'substantial';

export interface CanonicalCooperativeDirectory {
  coop_id: string; // UUID
  name: string;
  country?: string; // Full country name (backward compatibility)
  countryCode?: string; // ISO country code (e.g. "CI")
  region?: string; // Full region name (backward compatibility)
  regionName?: string; // Region name for filtering (e.g. "Nawa", "Haut-Sassandra")
  department?: string;
  primary_crop?: string; // Legacy field - prefer using commodities array
  commodities?: EudrCommodity[]; // Array of EUDR commodities (e.g. ['cocoa', 'coffee'])
  source_registry?: string;
  record_status: RecordStatus;
  pilot_id?: string | null; // Pilot cohort identifier (nullable)
  pilot_label?: string; // Pilot cohort label (e.g., "Pilot A")
  coverageBand?: CoverageBand; // Overall coverage band (limited/partial/substantial)
  created_at?: string; // ISO timestamp
}

// Re-export all child labor monitoring types
export * from './child-labor-monitoring-types';

// Re-export assessment types
export * from './assessment.types';

