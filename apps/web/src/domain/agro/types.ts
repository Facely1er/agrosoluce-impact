// TypeScript types for AgroSoluce v1 scope
// Based on v1 scope requirements

export interface Cooperative {
  id: string;
  name: string;
  country: string;
  region?: string;
  commodity: string;
  certifications: string[];
  annualVolumeTons?: number;
  complianceFlags: {
    eudrReady?: boolean;
    childLaborRisk?: 'unknown' | 'low' | 'medium' | 'high';
    otherRisks?: string[];
  };
  contactEmail?: string;
  contactPhone?: string;
  profileSource?: string;
  // Legacy fields for backward compatibility
  departement?: string;
  secteur?: string;
  phone?: string;
  email?: string;
  department?: string;
  sector?: string;
}

export interface BuyerRequest {
  id: string;
  buyerOrg: string;
  buyerContactEmail: string;
  targetCountry: string;
  commodity: string;
  minVolumeTons?: number;
  maxVolumeTons?: number;
  requirements: {
    certifications?: string[];
    eudrRequired?: boolean;
    childLaborZeroTolerance?: boolean;
  };
  status: 'draft' | 'open' | 'matched' | 'closed';
  createdAt?: string;
}

export interface RequestMatch {
  id: string;
  requestId: string;
  cooperativeId: string;
  matchScore: number;
  status: 'suggested' | 'shortlisted' | 'contacted' | 'rejected';
  createdAt?: string;
  // Joined data (optional, for display)
  cooperative?: Cooperative;
}

export interface MatchingResult {
  cooperative: Cooperative;
  matchScore: number;
  reasons?: string[]; // Reasons for the match
}

