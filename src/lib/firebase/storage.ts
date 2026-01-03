import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

// Storage paths
export const STORAGE_PATHS = {
  PRODUCT_IMAGES: 'product-images',
  PROCESS_VIDEOS: 'process-videos',
  THUMBNAILS: 'thumbnails',
} as const;

interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface UploadOptions {
  onProgress?: (progress: number) => void;
  generateThumbnail?: boolean;
}

// Generate unique file name
function generateFileName(originalName: string, peakCode: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  const sanitizedCode = peakCode.replace(/[^a-zA-Z0-9-]/g, '_');
  return `${sanitizedCode}_${timestamp}.${extension}`;
}

// Get storage path based on file type
function getStoragePath(
  peakCode: string,
  category: 'approved' | 'rejected' | 'reference' | 'training',
  type: 'image' | 'video' = 'image'
): string {
  const basePath = type === 'video' ? STORAGE_PATHS.PROCESS_VIDEOS : STORAGE_PATHS.PRODUCT_IMAGES;
  return `${basePath}/${peakCode}/${category}`;
}

// Upload file with progress tracking
export async function uploadFile(
  file: File,
  peakCode: string,
  category: 'approved' | 'rejected' | 'reference' | 'training',
  options?: UploadOptions
): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/');
  const storagePath = getStoragePath(peakCode, category, isVideo ? 'video' : 'image');
  const fileName = generateFileName(file.name, peakCode);
  const fullPath = `${storagePath}/${fileName}`;

  const storageRef = ref(storage, fullPath);

  if (options?.onProgress) {
    // Use resumable upload for progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          options.onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            path: fullPath,
            fileName,
            fileSize: file.size,
            mimeType: file.type,
          });
        }
      );
    });
  } else {
    // Simple upload without progress
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      path: fullPath,
      fileName,
      fileSize: file.size,
      mimeType: file.type,
    };
  }
}

// Upload multiple files
export async function uploadFiles(
  files: File[],
  peakCode: string,
  category: 'approved' | 'rejected' | 'reference' | 'training',
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadFile(files[i], peakCode, category, {
      onProgress: onProgress ? (progress) => onProgress(i, progress) : undefined,
    });
    results.push(result);
  }

  return results;
}

// Delete file from storage
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Get download URL for existing file
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

// Validate file type and size
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'] } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// Compress image before upload (client-side)
export async function compressImage(
  file: File,
  options: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  const { maxSizeMB = 2, maxWidthOrHeight = 1920, quality = 0.8 } = options;

  // Check if compression is needed
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB <= maxSizeMB && !file.type.includes('image')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width > height) {
          height = (height / width) * maxWidthOrHeight;
          width = maxWidthOrHeight;
        } else {
          width = (width / height) * maxWidthOrHeight;
          height = maxWidthOrHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
