'use client';

import React, { useState, useRef, forwardRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  children?: React.ReactNode;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
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
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const internalRef = useRef<HTMLDivElement>(null);

    // Use the forwarded ref if provided, otherwise use our internal ref
    const dropZoneRef = ref || internalRef;

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

    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onUploadStateChange) onUploadStateChange(false);
          }, 500);
        }
      }, 200);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];

        if (validateFile(file)) {
          if (onUploadStateChange) onUploadStateChange(true);
          setUploadProgress(0);
          simulateUpload();
          onFileUpload(file);
        }
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        if (validateFile(file)) {
          if (onUploadStateChange) onUploadStateChange(true);
          setUploadProgress(0);
          simulateUpload();
          onFileUpload(file);
        }
      }
    };

    if (children) {
      return (
        <div ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          {children}
          {error && (
            <Alert variant="destructive" className="absolute bottom-full left-0 mb-2 w-64">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    return (
      <Card className={cn('transition-all', isDragging && 'ring-2 ring-primary')}>
        <CardContent className="p-6">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="flex flex-col items-center"
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept={acceptedFileTypes.join(',')}
            />
            <label htmlFor="file-upload" className="cursor-pointer text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <AlertTitle>Drag and drop a file here, or click to select</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Max size: {maxSizeMB}MB
              </AlertDescription>
            </label>

            {error && (
              <Alert variant="destructive" className="mt-4 w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full mt-4 space-y-2">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-xs text-muted-foreground text-center">{uploadProgress}% uploaded</p>
              </div>
            )}

            {uploadProgress === 100 && (
              <div className="flex items-center gap-2 mt-4 text-primary">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Upload complete!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

export default FileUpload;
