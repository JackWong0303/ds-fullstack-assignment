'use client';

import type React from 'react';

import {useState, useRef} from 'react';
import {Upload} from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  children?: React.ReactNode;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export default function FileUpload({
  onFileUpload,
  onUploadStateChange,
  children,
  maxSizeMB = 10,
  acceptedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError('File type not supported');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (validateFile(file)) {
        if (onUploadStateChange) onUploadStateChange(true);

        // Simulate upload delay
        setTimeout(() => {
          onFileUpload(file);
          if (onUploadStateChange) onUploadStateChange(false);
        }, 1500);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (validateFile(file)) {
        if (onUploadStateChange) onUploadStateChange(true);

        // Simulate upload delay
        setTimeout(() => {
          onFileUpload(file);
          if (onUploadStateChange) onUploadStateChange(false);
        }, 1500);
      }
    }
  };

  if (children) {
    return (
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
        {error && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-red-100 text-red-600 text-sm rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-400'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileSelect}
        accept={acceptedFileTypes.join(',')}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="h-10 w-10 mx-auto text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">
          Drag and drop a file here, or click to select
        </p>
        <p className="mt-1 text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
      </label>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
