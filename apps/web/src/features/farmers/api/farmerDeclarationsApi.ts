// API functions for farmer declarations
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { FarmerDeclaration, FarmerDeclarationInput } from '@/services/farmerDeclarationsService';
import { validateFarmerDeclaration } from '@/services/farmerDeclarationsService';

/**
 * Get all farmer declarations for a cooperative
 */
export async function getFarmerDeclarations(
  coopId: string
): Promise<{
  data: FarmerDeclaration[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmer_declarations')
      .select('*')
      .eq('coop_id', coopId)
      .order('declared_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as FarmerDeclaration[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get farmer declarations by farmer reference
 */
export async function getFarmerDeclarationsByReference(
  coopId: string,
  farmerReference: string
): Promise<{
  data: FarmerDeclaration[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmer_declarations')
      .select('*')
      .eq('coop_id', coopId)
      .eq('farmer_reference', farmerReference)
      .order('declared_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as FarmerDeclaration[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get farmer declarations by declaration type
 */
export async function getFarmerDeclarationsByType(
  coopId: string,
  declarationType: string
): Promise<{
  data: FarmerDeclaration[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmer_declarations')
      .select('*')
      .eq('coop_id', coopId)
      .eq('declaration_type', declarationType)
      .order('declared_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as FarmerDeclaration[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Create a new farmer declaration
 */
export async function createFarmerDeclaration(
  input: FarmerDeclarationInput
): Promise<{
  data: FarmerDeclaration | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate input
  const validation = validateFarmerDeclaration(input);
  if (!validation.valid) {
    return { data: null, error: new Error(validation.error || 'Validation failed') };
  }

  try {
    const { data, error } = await supabase
      .from('farmer_declarations')
      .insert({
        coop_id: input.coop_id,
        farmer_reference: input.farmer_reference,
        declaration_type: input.declaration_type,
        declared_value: input.declared_value,
        declared_at: input.declared_at,
        collected_by: input.collected_by || null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as FarmerDeclaration, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Update a farmer declaration
 */
export async function updateFarmerDeclaration(
  declarationId: string,
  updates: Partial<Omit<FarmerDeclarationInput, 'coop_id' | 'farmer_reference'>>
): Promise<{
  data: FarmerDeclaration | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('farmer_declarations')
      .update(updates)
      .eq('declaration_id', declarationId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as FarmerDeclaration, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Delete a farmer declaration
 */
export async function deleteFarmerDeclaration(
  declarationId: string
): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase
      .from('farmer_declarations')
      .delete()
      .eq('declaration_id', declarationId);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

