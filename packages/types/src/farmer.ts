// Farmer-related types

export interface Farmer {
  id: string;
  cooperative_id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  date_of_birth?: string;
  gender?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface FarmerDeclaration {
  id: string;
  farmer_id: string;
  cooperative_id: string;
  declaration_date: string;
  content: Record<string, any>;
  status?: 'pending' | 'verified' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

