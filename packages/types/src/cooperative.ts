// Cooperative-related types

import type { EudrCommodity } from './commodity';
import type { CoverageBand } from './coverage';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type RecordStatus = 'active' | 'inactive' | 'archived' | 'pending';

export interface Cooperative {
  id: string;
  name: string;
  region?: string;
  department?: string;
  commune?: string;
  sector?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  products?: string[];
  certifications?: string[];
  is_verified?: boolean;
  user_profile_id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  
  // Legacy/JSON fields
  departement?: string;
  secteur?: string;
  registrationNumber?: string;
  president?: string;
  contact?: string;
  natureActivite?: string;
  status?: VerificationStatus;
  
  // Enriched/computed fields
  regionSlug?: string;
  departementSlug?: string;
  secteurCanonical?: string;
  natureActiviteTags?: string[];
  phonesE164?: string[];
  primaryPhoneE164?: string | null;
  searchKeywords?: string[];
  
  // v1 Scope fields
  country?: string;
  commodity?: string;
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

export interface CanonicalCooperativeDirectory {
  coop_id: string;
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
  pilot_id?: string | null;
  pilot_label?: string;
  coverageBand?: CoverageBand; // Overall coverage band (limited/partial/substantial)
  created_at?: string;
}

