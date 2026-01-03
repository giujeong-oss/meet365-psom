'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, AlertCircle, Video } from 'lucide-react';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

export default function ImageUploader({
  onFilesSelected,
  maxFiles = 10,
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
}: ImageUploaderProps) {
  const t = useTranslations();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Check type
        if (!acceptedTypes.includes(file.type)) {
          setError(t('upload.allowedTypes'));
          continue;
        }

        // Check size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          setError(t('upload.maxSize', { size: maxSizeMB }));
          continue;
        }

        validFiles.push(file);

        if (validFiles.length >= maxFiles) break;
      }

      return validFiles;
    },
    [acceptedTypes, maxSizeMB, maxFiles, t]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      if (disabled) return;

      const files = validateFiles(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [disabled, validateFiles, onFilesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);

      if (e.target.files && e.target.files.length > 0) {
        const files = validateFiles(e.target.files);
        if (files.length > 0) {
          onFilesSelected(files);
        }
      }

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [validateFiles, onFilesSelected]
  );

  return (
    <div className="space-y-2">
      <Card
        className={cn(
          'relative border-2 border-dashed transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <div
            className={cn(
              'p-4 rounded-full mb-4',
              isDragging ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-2">
            {t('upload.dragDrop')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('upload.maxSize', { size: maxSizeMB })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('upload.allowedTypes')}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}

// Image Preview Component
interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  progress?: number;
  error?: string;
}

export function ImagePreview({ file, onRemove, progress, error }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const isVideo = file.type.startsWith('video/');

  // Generate preview
  useState(() => {
    if (!isVideo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For videos, create object URL
      setPreview(URL.createObjectURL(file));
    }
  });

  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
            <Video className="h-10 w-10 text-white" />
            <span className="absolute bottom-1 left-1 text-xs text-white bg-black/60 px-1 rounded">
              VIDEO
            </span>
          </div>
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Progress Overlay */}
        {progress !== undefined && progress < 100 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-3/4">
              <Progress value={progress} className="h-2" />
              <p className="text-white text-xs text-center mt-1">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        )}

        {/* Remove Button */}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground truncate mt-1">{file.name}</p>
    </div>
  );
}

// Progress component (simple version since shadcn progress might need installation)
function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('w-full bg-gray-200 rounded-full', className)}>
      <div
        className="bg-primary h-full rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
