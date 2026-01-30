import { FileType } from '@/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_DURATION = 10; // 10 seconds

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

/**
 * Validate file type
 */
export function isValidFileType(
  mimeType: string
): { valid: boolean; type: FileType } {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return { valid: true, type: 'image' };
  }

  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return { valid: true, type: 'video' };
  }

  if (ALLOWED_PDF_TYPES.includes(mimeType)) {
    return { valid: true, type: 'pdf' };
  }

  return { valid: false, type: 'other' };
}

/**
 * Get file type from MIME type
 */
export function getFileTypeFromMime(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'other';
}

/**
 * Format file size to readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is video and validate duration
 */
export async function validateVideoDuration(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration <= MAX_VIDEO_DURATION);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    video.src = url;
  });
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, file.type, quality);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
