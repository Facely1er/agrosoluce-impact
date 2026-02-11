/**
 * VRAC (Pharmacy Surveillance) types for workforce health analysis
 * Used for antimalarial sales as proxy for cocoa-region health monitoring
 */

export type PharmacyId = 'tanda' | 'prolife' | 'olympique' | 'attobrou';

export type RegionId = 'gontougo' | 'la_me' | 'abidjan';

export interface PharmacyProfile {
  id: PharmacyId;
  name: string;
  region: RegionId;
  location: string;
  regionLabel: string;
}

export interface ProductSale {
  code: string;
  designation: string;
  quantitySold: number;
  stock?: number;
  price?: number;
}

export interface PharmacyPeriodData {
  pharmacyId: PharmacyId;
  periodLabel: string;
  periodStart: string; // ISO date
  periodEnd: string;
  year: number;
  products: ProductSale[];
  totalQuantity?: number;
}

export type TherapeuticCategory = 'antimalarial' | 'antibiotic' | 'analgesic' | 'other';

export interface CategorySale {
  category: TherapeuticCategory;
  quantity: number;
  productCount: number;
}

export interface RegionalHealthIndex {
  pharmacyId: PharmacyId;
  periodLabel: string;
  year: number;
  antimalarialQuantity: number;
  totalQuantity: number;
  antimalarialShare: number; // 0-1
}
