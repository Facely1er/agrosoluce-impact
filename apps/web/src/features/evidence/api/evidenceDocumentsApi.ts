// API functions for evidence documents
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import { uploadDocument } from '@/lib/supabase/storage';
import type { EvidenceType } from '../types/evidenceType';
import { EVIDENCE_TYPE_DEFAULT } from '../types/evidenceType';

export interface EvidenceDocument {
  id: string;
  cooperative_id: string;
  doc_type: string;
  title: string;
  issuer?: string;
  issue_date?: string; // ISO date string
  expiration_date?: string; // ISO date string
  uploaded_by?: string;
  uploaded_at?: string; // ISO timestamp
  file_url: string;
  file_name?: string;
  file_size_bytes?: number;
  mime_type?: string;
  evidence_type?: EvidenceType; // Optional evidence typology
  created_at?: string;
  updated_at?: string;
}

export interface EvidenceDocumentInput {
  cooperative_id: string;
  doc_type: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  expiration_date?: string;
  uploaded_by?: string;
  evidence_type?: EvidenceType; // Optional evidence typology
  file: File;
}

/**
 * Upload evidence document with metadata
 */
export async function uploadEvidenceDocument(
  input: EvidenceDocumentInput
): Promise<{
  data: EvidenceDocument | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // 1. Upload file to storage
    const uploadResult = await uploadDocument(input.file, `evidence/cooperative/${input.cooperative_id}`);
    
    if (uploadResult.error) {
      return { data: null, error: uploadResult.error };
    }

    // 2. Save metadata to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        entity_type: 'cooperative',
        entity_id: input.cooperative_id,
        document_type: input.doc_type,
        doc_type: input.doc_type,
        title: input.title,
        file_url: uploadResult.data!.fullPath,
        file_name: input.file.name,
        file_size_bytes: input.file.size,
        mime_type: input.file.type,
        uploaded_by: input.uploaded_by || null,
        uploaded_at: new Date().toISOString(),
        issuer: input.issuer || null,
        issued_at: input.issue_date ? new Date(input.issue_date).toISOString() : null,
        expires_at: input.expiration_date ? new Date(input.expiration_date).toISOString() : null,
        expiry_date: input.expiration_date || null,
        evidence_type: input.evidence_type || EVIDENCE_TYPE_DEFAULT,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving document metadata:', error);
      // Note: File is already uploaded, but metadata save failed
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformDocument(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get all evidence documents for a cooperative
 */
export async function getEvidenceDocuments(
  cooperativeId: string
): Promise<{
  data: EvidenceDocument[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('entity_type', 'cooperative')
      .eq('entity_id', cooperativeId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching evidence documents:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformDocument);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Delete an evidence document
 */
export async function deleteEvidenceDocument(
  documentId: string
): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    // Get document to find file path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', documentId)
      .single();

    if (fetchError || !doc) {
      return { error: new Error('Document not found') };
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      console.error('Error deleting document:', deleteError);
      return { error: new Error(deleteError.message) };
    }

    // Note: File deletion from storage could be added here if needed
    // For now, we only delete the metadata record

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

// Helper function to transform database records to TypeScript types
function transformDocument(data: any): EvidenceDocument {
  // Handle date conversion - issued_at/expires_at are timestamps, we need date strings
  let issueDate: string | undefined;
  if (data.issued_at) {
    issueDate = new Date(data.issued_at).toISOString().split('T')[0];
  }
  
  let expirationDate: string | undefined;
  if (data.expires_at) {
    expirationDate = new Date(data.expires_at).toISOString().split('T')[0];
  } else if (data.expiry_date) {
    expirationDate = typeof data.expiry_date === 'string' 
      ? data.expiry_date 
      : new Date(data.expiry_date).toISOString().split('T')[0];
  }

  return {
    id: data.id.toString(),
    cooperative_id: data.entity_id.toString(),
    doc_type: data.doc_type || data.document_type || 'other',
    title: data.title,
    issuer: data.issuer,
    issue_date: issueDate,
    expiration_date: expirationDate,
    uploaded_by: data.uploaded_by,
    uploaded_at: data.uploaded_at,
    file_url: data.file_url,
    file_name: data.file_name,
    file_size_bytes: data.file_size_bytes,
    mime_type: data.mime_type,
    evidence_type: data.evidence_type || EVIDENCE_TYPE_DEFAULT,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
