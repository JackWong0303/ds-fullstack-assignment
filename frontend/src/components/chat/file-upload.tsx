'use client';

import React, { useState, useRef, forwardRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { validateFile, MAX_FILE_SIZE_MB } from '@/utils/file-utils';

// Map extensions to MIME types for the accept attribute
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  // Data files
  'text/csv',
  'application/json',
  'application/xml',
  'text/xml',
];

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
      maxSizeMB = MAX_FILE_SIZE_MB,
      acceptedFileTypes = ALLOWED_FILE_TYPES,
    },
    ref,
  ) => {
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const internalRef = useRef<HTMLDivElement>(null);

    // Use the forwarded ref if provided, otherwise use our internal ref
    const dropZoneRef = ref || internalRef;

    const handleFileValidation = (file: File): boolean => {
      const validation = validateFile(file);

      if (!validation.isValid) {
        setError(validation.errorMessage ?? 'Invalid file');
        return false;
      }

      if (!acceptedFileTypes.includes(file.type)) {
        setError('File type not supported');
        return false;
      }

      setError(null);
      return true;
    };

    const simulateUpload = (file: File) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFileUpload(file);
            if (onUploadStateChange) onUploadStateChange(false);
          }, 500);
        }
      }, 200);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        if (handleFileValidation(file)) {
          if (onUploadStateChange) onUploadStateChange(true);
          setUploadProgress(0);
          simulateUpload(file);
        }
      }
    };

    // Show a more user-friendly list of accepted file types
    const getFileTypesDisplay = () => {
      return 'Images, PDFs, Word documents, text files, and data files';
    };

    if (children) {
      return (
        <div ref={dropZoneRef}>
          {children}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Alert variant="destructive" className="absolute bottom-full left-0 mb-2 w-64">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-6">
          <motion.div ref={dropZoneRef} className="flex flex-col items-center">
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept={acceptedFileTypes.join(',')}
              data-testid="file-input-for-test"
            />
            <label htmlFor="file-upload" className="cursor-pointer text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <AlertTitle>Click to select a file</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Max size: {maxSizeMB}MB
              </AlertDescription>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Accepted types: {getFileTypesDisplay()}
              </AlertDescription>
            </label>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mt-4"
                >
                  <Alert variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-4 space-y-2"
                >
                  <Progress value={uploadProgress} className="h-2 w-full" />
                  <p className="text-xs text-muted-foreground text-center">{uploadProgress}% uploaded</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {uploadProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 mt-4 text-primary"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Upload complete!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
