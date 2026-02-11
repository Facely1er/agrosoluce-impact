/**
 * File Upload Service
 * Handles file uploads to Supabase Storage for child labor evidence
 */

import { supabase } from '@/lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export class FileUploadService {
  private static readonly BUCKET_NAME = 'child-labor-evidence';
  private static readonly MAX_FILE_SIZE_MB = 10;
  private static readonly MAX_FILE_SIZE_BYTES = FileUploadService.MAX_FILE_SIZE_MB * 1024 * 1024;

  // Allowed file types
  private static readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  /**
   * Validate file before upload
   */
  private static validateFile(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE_MB}MB limit`,
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Upload evidence document
   */
  static async uploadEvidence(
    file: File,
    assessmentId: string
  ): Promise<UploadResult> {
    const validation = this.validateFile(file, this.ALLOWED_DOCUMENT_TYPES);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `assessments/${assessmentId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  }

  /**
   * Upload photo
   */
  static async uploadPhoto(file: File, assessmentId: string): Promise<UploadResult> {
    const validation = this.validateFile(file, this.ALLOWED_IMAGE_TYPES);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `assessments/${assessmentId}/photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(url: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Extract path from URL
    const urlParts = url.split('/');
    const pathIndex = urlParts.findIndex((part) => part === this.BUCKET_NAME);
    if (pathIndex === -1) {
      throw new Error('Invalid file URL');
    }

    const filePath = urlParts.slice(pathIndex + 1).join('/');

    const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Get upload progress (for future implementation with progress tracking)
   */
  static getUploadProgress(file: File, uploadedBytes: number): number {
    return Math.round((uploadedBytes / file.size) * 100);
  }
}

