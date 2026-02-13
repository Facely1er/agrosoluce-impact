/**
 * VRAC Service - API layer for pharmacy surveillance data
 * 
 * Provides type-safe access to VRAC data stored in Supabase
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { PharmacyProfile, RegionalHealthIndex } from '@agrosoluce/types';

export interface ProductSaleRecord {
  id: string;
  pharmacy_id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  year: number;
  code: string;
  designation: string;
  quantity_sold: number;
  stock: number | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export interface PeriodAggregate {
  id: string;
  pharmacy_id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  year: number;
  total_quantity: number;
  antimalarial_quantity: number;
  antibiotic_quantity: number;
  analgesic_quantity: number;
  antimalarial_share: number;
  created_at: string;
  updated_at: string;
}

export interface RegionalHealthIndexRecord {
  id: string;
  pharmacy_id: string;
  period_label: string;
  year: number;
  antimalarial_quantity: number;
  total_quantity: number;
  antimalarial_share: number;
  created_at: string;
}

/**
 * VRAC Service for accessing pharmacy surveillance data
 */
export const vracService = {
  /**
   * Fetch all pharmacy profiles
   */
  async getPharmacyProfiles(): Promise<PharmacyProfile[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('pharmacy_profiles')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching pharmacy profiles:', error);
      throw new Error(`Failed to fetch pharmacy profiles: ${error.message}`);
    }

    // Transform database response to match PharmacyProfile type
    return (data || []).map(profile => ({
      id: profile.id as any, // pharmacyId type
      name: profile.name,
      region: profile.region as any, // regionId type
      location: profile.location,
      regionLabel: profile.region_label,
    }));
  },

  /**
   * Fetch regional health index with optional filters
   */
  async getRegionalHealthIndex(filters?: {
    pharmacyId?: string;
    year?: number;
  }): Promise<RegionalHealthIndex[]> {
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('vrac_regional_health_index')
      .select('*');

    if (filters?.pharmacyId) {
      query = query.eq('pharmacy_id', filters.pharmacyId);
    }
    if (filters?.year) {
      query = query.eq('year', filters.year);
    }

    const { data, error } = await query
      .order('year', { ascending: false })
      .order('pharmacy_id');

    if (error) {
      console.error('Error fetching regional health index:', error);
      throw new Error(`Failed to fetch regional health index: ${error.message}`);
    }

    // Transform database response to match RegionalHealthIndex type
    return (data || []).map(record => ({
      pharmacyId: record.pharmacy_id as any,
      periodLabel: record.period_label,
      year: record.year,
      antimalarialQuantity: record.antimalarial_quantity,
      totalQuantity: record.total_quantity,
      antimalarialShare: record.antimalarial_share,
    }));
  },

  /**
   * Fetch period aggregates with optional filters
   */
  async getPeriodAggregates(pharmacyId?: string, year?: number): Promise<PeriodAggregate[]> {
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('vrac_period_aggregates')
      .select('*');

    if (pharmacyId) {
      query = query.eq('pharmacy_id', pharmacyId);
    }
    if (year) {
      query = query.eq('year', year);
    }

    const { data, error } = await query
      .order('year', { ascending: false })
      .order('pharmacy_id');

    if (error) {
      console.error('Error fetching period aggregates:', error);
      throw new Error(`Failed to fetch period aggregates: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch detailed product sales for a specific pharmacy and year
   */
  async getProductSales(pharmacyId: string, year: number): Promise<ProductSaleRecord[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('vrac_product_sales')
      .select('*')
      .eq('pharmacy_id', pharmacyId)
      .eq('year', year)
      .order('quantity_sold', { ascending: false });

    if (error) {
      console.error('Error fetching product sales:', error);
      throw new Error(`Failed to fetch product sales: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch product sales for all pharmacies in a specific year
   */
  async getProductSalesByYear(year: number): Promise<ProductSaleRecord[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('vrac_product_sales')
      .select('*')
      .eq('year', year)
      .order('pharmacy_id')
      .order('quantity_sold', { ascending: false });

    if (error) {
      console.error('Error fetching product sales by year:', error);
      throw new Error(`Failed to fetch product sales by year: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get available years from the health index
   */
  async getAvailableYears(): Promise<number[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('vrac_regional_health_index')
      .select('year')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching available years:', error);
      throw new Error(`Failed to fetch available years: ${error.message}`);
    }

    // Get unique years
    const uniqueYears = Array.from(new Set((data || []).map(record => record.year)));
    return uniqueYears.sort((a, b) => a - b);
  },
};
