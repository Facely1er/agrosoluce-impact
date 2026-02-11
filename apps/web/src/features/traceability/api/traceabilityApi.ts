// API functions for traceability
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Batch, BatchTransaction } from '@/types';

/**
 * Create a new batch
 */
export async function createBatch(batch: Omit<Batch, 'id' | 'created_at' | 'updated_at'>): Promise<{
  data: Batch | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batches')
      .insert([batch])
      .select()
      .single();

    if (error) {
      console.error('Error creating batch:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Batch;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get batch by ID
 */
export async function getBatchById(id: string): Promise<{
  data: Batch | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching batch:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Batch not found') };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Batch;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get batches by product ID
 */
export async function getBatchesByProduct(productId: string): Promise<{
  data: Batch[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('product_id', productId)
      .order('harvest_date', { ascending: false });

    if (error) {
      console.error('Error fetching batches by product:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((batch: any) => ({
      ...batch,
      id: batch.id.toString(),
    })) as Batch[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get batches by cooperative ID
 */
export async function getBatchesByCooperative(cooperativeId: string): Promise<{
  data: Batch[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .order('harvest_date', { ascending: false });

    if (error) {
      console.error('Error fetching batches by cooperative:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((batch: any) => ({
      ...batch,
      id: batch.id.toString(),
    })) as Batch[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get traceability chain for a batch
 */
export async function getBatchChain(batchId: string): Promise<{
  data: BatchTransaction[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batch_transactions')
      .select('*')
      .eq('batch_id', batchId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching batch chain:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map((transaction: any) => ({
      ...transaction,
      id: transaction.id.toString(),
    })) as BatchTransaction[];

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Verify origin of a batch (check GPS coordinates)
 */
export async function verifyOrigin(batchId: string): Promise<{
  data: { verified: boolean; location?: { latitude: number; longitude: number } } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data: batch, error } = await getBatchById(batchId);

    if (error || !batch) {
      return { data: null, error: error || new Error('Batch not found') };
    }

    const hasLocation = batch.origin_gps_latitude && batch.origin_gps_longitude;

    return {
      data: {
        verified: hasLocation || false,
        location: hasLocation
          ? { latitude: batch.origin_gps_latitude!, longitude: batch.origin_gps_longitude! }
          : undefined,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Add a transaction to the batch chain
 */
export async function addBatchTransaction(
  transaction: Omit<BatchTransaction, 'id' | 'created_at'>
): Promise<{
  data: BatchTransaction | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('batch_transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error('Error adding batch transaction:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as BatchTransaction;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update a batch
 */
export async function updateBatch(id: string, updates: Partial<Batch>): Promise<{
  data: Batch | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Remove id, created_at, updated_at from updates
    const { id: _, created_at: __, updated_at: ___, ...updateData } = updates;

    const { data, error } = await supabase
      .from('batches')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating batch:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = {
      ...data,
      id: data.id.toString(),
    } as Batch;

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

