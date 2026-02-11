/**
 * File Upload Component
 * Reusable component for file uploads with drag & drop
 */

import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { FileUploadService } from '@/services/fileUploadService';

interface FileUploadProps {
  acceptedFileTypes: string[];
  maxSizeMB: number;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  label: string;
  uploadPath: string; // e.g., assessmentId for organizing files
  uploadType?: 'document' | 'photo';
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFileTypes,
  maxSizeMB,
  multiple = false,
  onUploadComplete,
  label,
  uploadPath,
  uploadType = 'document',
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newFiles: UploadingFile[] = fileArray.map((file) => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);

    // Upload files
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i].file;
      try {
        const result =
          uploadType === 'photo'
            ? await FileUploadService.uploadPhoto(file, uploadPath)
            : await FileUploadService.uploadEvidence(file, uploadPath);

        setUploadingFiles((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((f) => f.file === file);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: 'success',
              url: result.url,
              progress: 100,
            };
          }
          return updated;
        });

        // Notify parent component
        const successfulUrls = uploadingFiles
          .filter((f) => f.status === 'success' && f.url)
          .map((f) => f.url!)
          .concat([result.url]);
        onUploadComplete(successfulUrls);
      } catch (error) {
        setUploadingFiles((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((f) => f.file === file);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed',
            };
          }
          return updated;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    setUploadingFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const successfulUrls = updated
        .filter((f) => f.status === 'success' && f.url)
        .map((f) => f.url!);
      onUploadComplete(successfulUrls);
      return updated;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Accepted types: {acceptedFileTypes.join(', ')} (max {maxSizeMB}MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(uploadingFile.file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {uploadingFile.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-xs text-gray-600">{uploadingFile.progress}%</span>
                  </div>
                )}

                {uploadingFile.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}

                {uploadingFile.status === 'error' && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-xs text-red-600">{uploadingFile.error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

