// API functions for farmers
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Farmer } from '@/types';

/**
 * Fetch all farmers from database
 */
export async function getFarmers(): Promise<{
  data: Farmer[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching farmers:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((farmer: any) => ({
      ...farmer,
      id: farmer.id.toString(),
    })) as Farmer[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Exception fetching farmers:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single farmer by ID
 */
export async function getFarmerById(id: string): Promise<{
  data: Farmer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching farmer:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Farmer not found') };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Farmer;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch farmers by cooperative ID
 */
export async function getFarmersByCooperative(cooperativeId: string): Promise<{
  data: Farmer[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching farmers by cooperative:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((farmer: any) => ({
      ...farmer,
      id: farmer.id.toString(),
    })) as Farmer[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get farmer count for a cooperative
 */
export async function getFarmerCountByCooperative(cooperativeId: string): Promise<{
  data: number | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { count, error } = await supabase
      .from('farmers')
      .select('*', { count: 'exact', head: true })
      .eq('cooperative_id', cooperativeId)
      .eq('is_active', true);

    if (error) {
      console.error('Error counting farmers:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: count || 0, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new farmer
 */
export async function createFarmer(farmer: Omit<Farmer, 'id' | 'created_at' | 'updated_at'>): Promise<{
  data: Farmer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmers')
      .insert([farmer])
      .select()
      .single();

    if (error) {
      console.error('Error creating farmer:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Farmer;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update an existing farmer
 */
export async function updateFarmer(id: string, updates: Partial<Farmer>): Promise<{
  data: Farmer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Remove id, created_at, updated_at from updates (handled by DB)
    const { id: _, created_at: __, updated_at: ___, ...updateData } = updates;

    const { data, error } = await supabase
      .from('farmers')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating farmer:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Farmer;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Delete a farmer (soft delete by setting is_active to false)
 */
export async function deleteFarmer(id: string): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase
      .from('farmers')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting farmer:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

/**
 * Search farmers by name or registration number
 */
export async function searchFarmers(query: string): Promise<{
  data: Farmer[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const searchTerm = query.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,registration_number.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching farmers:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((farmer: any) => ({
      ...farmer,
      id: farmer.id.toString(),
    })) as Farmer[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

