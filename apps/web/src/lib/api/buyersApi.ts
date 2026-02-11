/**
 * Buyers API Service
 * Comprehensive API for buyer management
 */

import { supabase } from '@/lib/supabase/client';
import type { Buyer } from '@/types';
import { validateUserProfile } from '@/lib/validation/validators';

export interface CreateBuyerData {
  email: string;
  full_name: string;
  phone_number?: string;
  company_name: string;
  country?: string;
}

/**
 * Get all buyers
 */
export async function getBuyers(): Promise<{
  data: Buyer[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Buyers are user profiles with user_type = 'buyer'
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', 'buyer')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buyers:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Transform to Buyer format
    const buyers: Buyer[] = (data || []).map((profile: any) => ({
      id: profile.id,
      user_profile_id: profile.id,
      company_name: profile.organization_name || '',
      country: '', // Can be added to user_profiles if needed
      email: profile.email,
      verification_status: 'pending' as const, // Can be added to user_profiles if needed
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }));

    return { data: buyers, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get buyer by ID
 */
export async function getBuyerById(id: string): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .eq('user_type', 'buyer')
      .single();

    if (error) {
      console.error('Error fetching buyer:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Buyer not found') };
    }

    const buyer: Buyer = {
      id: data.id,
      user_profile_id: data.id,
      company_name: data.organization_name || '',
      country: '',
      email: data.email,
      verification_status: 'pending',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { data: buyer, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get buyer by user profile ID
 */
export async function getBuyerByProfileId(profileId: string): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  return getBuyerById(profileId);
}

/**
 * Update buyer information
 */
export async function updateBuyer(
  id: string,
  updates: Partial<CreateBuyerData>
): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate updates
  if (updates.email || updates.full_name) {
    const validation = validateUserProfile({
      email: updates.email,
      full_name: updates.full_name,
      user_type: 'buyer',
    });
    if (!validation.isValid) {
      return {
        data: null,
        error: new Error(`Validation failed: ${validation.errors.join(', ')}`),
      };
    }
  }

  try {
    const updateData: any = {};

    if (updates.email) updateData.email = updates.email;
    if (updates.full_name) updateData.full_name = updates.full_name;
    if (updates.phone_number) updateData.phone_number = updates.phone_number;
    if (updates.company_name) updateData.organization_name = updates.company_name;
    // Note: country would need to be added to user_profiles schema

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .eq('user_type', 'buyer')
      .select()
      .single();

    if (error) {
      console.error('Error updating buyer:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Buyer not found') };
    }

    const buyer: Buyer = {
      id: data.id,
      user_profile_id: data.id,
      company_name: data.organization_name || '',
      country: '',
      email: data.email,
      verification_status: 'pending',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { data: buyer, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

