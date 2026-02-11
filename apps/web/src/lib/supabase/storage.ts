// Supabase Storage utilities for document uploads
// Used for evidence documents, certifications, audits, etc.

import { supabase } from './client';

const BUCKET_NAME = 'agrosoluce-documents';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadDocument(
  file: File,
  path: string,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
): Promise<{
  data: { path: string; fullPath: string } | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      data: {
        path: filePath,
        fullPath: urlData.publicUrl,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get public URL for a document
 */
export function getDocumentUrl(path: string): string {
  if (!supabase) {
    return '';
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a document from storage
 */
export async function deleteDocument(path: string): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

/**
 * List documents in a path
 */
export async function listDocuments(path: string): Promise<{
  data: { name: string; id: string; updated_at: string }[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(path);

    if (error) {
      console.error('Error listing files:', error);
      return { data: null, error: new Error(error.message) };
    }

    return {
      data: (data || []).map((file) => ({
        name: file.name,
        id: file.id,
        updated_at: file.updated_at,
      })),
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

