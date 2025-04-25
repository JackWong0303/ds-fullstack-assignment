export const MAX_FILE_SIZE_MB = 5;

export const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif', // Images
  '.pdf',
  '.doc',
  '.docx',
  '.txt', // Documents
  '.csv',
  '.json',
  '.xml', // Data files
];

export function validateFile(file: File): { isValid: boolean; errorMessage?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      isValid: false,
      errorMessage: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  // Check file extension
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      isValid: false,
      errorMessage: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { isValid: true };
}

export function getFileType(file: File): 'image' | 'file' {
  return file.type.startsWith('image/') ? 'image' : 'file';
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;

      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      resolve({ width, height });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
