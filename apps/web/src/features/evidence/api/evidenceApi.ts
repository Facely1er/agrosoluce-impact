// API functions for evidence and attestations
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { FieldDeclaration, Audit, Attestation } from '@/types';

/**
 * Create a field declaration
 */
export async function createFieldDeclaration(
  declaration: Omit<FieldDeclaration, 'id' | 'created_at' | 'updated_at'>
): Promise<{
  data: FieldDeclaration | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('field_declarations')
      .insert([declaration])
      .select()
      .single();

    if (error) {
      console.error('Error creating field declaration:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as FieldDeclaration;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get field declarations for a cooperative
 */
export async function getFieldDeclarations(cooperativeId: string): Promise<{
  data: FieldDeclaration[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('field_declarations')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('declaration_date', { ascending: false });

    if (error) {
      console.error('Error fetching field declarations:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((decl: any) => ({
      ...decl,
      id: decl.id.toString(),
    })) as FieldDeclaration[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get audits for a cooperative
 */
export async function getAudits(cooperativeId: string): Promise<{
  data: Audit[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('audit_date', { ascending: false });

    if (error) {
      console.error('Error fetching audits:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((audit: any) => ({
      ...audit,
      id: audit.id.toString(),
    })) as Audit[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create an attestation
 */
export async function createAttestation(
  attestation: Omit<Attestation, 'id' | 'created_at'>
): Promise<{
  data: Attestation | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('attestations')
      .insert([attestation])
      .select()
      .single();

    if (error) {
      console.error('Error creating attestation:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Attestation;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get attestations for an entity
 */
export async function getAttestations(
  entityType: 'cooperative' | 'farmer' | 'batch' | 'product',
  entityId: string
): Promise<{
  data: Attestation[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('attestations')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('signed_at', { ascending: false });

    if (error) {
      console.error('Error fetching attestations:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((att: any) => ({
      ...att,
      id: att.id.toString(),
    })) as Attestation[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Upload evidence document
 */
export async function uploadEvidenceDocument(
  file: File,
  category: 'certification' | 'audit' | 'attestation' | 'field_declaration'
): Promise<{
  data: { path: string; url: string } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { uploadDocument } = await import('../../../lib/supabase/storage');
    const result = await uploadDocument(file, `evidence/${category}`);

    if (result.error) {
      return { data: null, error: result.error };
    }

    return {
      data: {
        path: result.data!.path,
        url: result.data!.fullPath,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

