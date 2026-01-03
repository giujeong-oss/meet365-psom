'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { ImageUploader, ImagePreview, CategorySelector } from '@/components/media';
import { mockProducts } from '@/lib/mock-data';
import { uploadFile } from '@/lib/firebase/storage';
import { addDocument, COLLECTIONS, getBaseCode, serverTimestamp } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Home,
  Package,
  Upload,
  Settings,
  Loader2,
  Check,
  Search,
} from 'lucide-react';
import type { MediaCategory } from '@/types';

interface SelectedFile {
  file: File;
  id: string;
  progress: number;
  error?: string;
  uploaded: boolean;
}

export default function UploadPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const { user } = useAuth();

  const [peakCode, setPeakCode] = useState(initialCode);
  const [category, setCategory] = useState<MediaCategory>('approved');
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(!initialCode);
  const [searchQuery, setSearchQuery] = useState('');

  // Get product info if code is provided
  const selectedProduct = mockProducts.find((p) => p.peakCode === peakCode);

  // Filter products for search
  const filteredProducts = searchQuery
    ? mockProducts.filter(
        (p) =>
          p.peakCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.names.ko.includes(searchQuery) ||
          p.names.en.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleFilesSelected = (newFiles: File[]) => {
    const selectedFiles: SelectedFile[] = newFiles.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      uploaded: false,
    }));
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (!peakCode || files.length === 0 || !user) return;

    setUploading(true);

    for (const selectedFile of files) {
      if (selectedFile.uploaded) continue;

      try {
        // Upload to Firebase Storage with progress tracking
        const uploadResult = await uploadFile(
          selectedFile.file,
          peakCode,
          category,
          {
            onProgress: (progress) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === selectedFile.id ? { ...f, progress } : f
                )
              );
            },
          }
        );

        // Save metadata to Firestore specMedia collection
        const baseCode = getBaseCode(peakCode);
        const isVideo = selectedFile.file.type.startsWith('video/');

        await addDocument(COLLECTIONS.SPEC_MEDIA, {
          peakCode,
          baseCode,
          type: isVideo ? 'process_video' : 'appearance',
          category,
          file: {
            url: uploadResult.url,
            fileName: uploadResult.fileName,
            fileSize: uploadResult.fileSize,
            mimeType: uploadResult.mimeType,
          },
          metadata: {
            capturedAt: serverTimestamp(),
            capturedBy: user.uid,
          },
          tags: [],
          isApproved: category === 'approved',
          createdBy: user.uid,
        });

        // Mark as uploaded
        setFiles((prev) =>
          prev.map((f) =>
            f.id === selectedFile.id ? { ...f, uploaded: true, progress: 100 } : f
          )
        );
      } catch (error) {
        // Mark as error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === selectedFile.id
              ? { ...f, error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          )
        );
      }
    }

    setUploading(false);
  };

  const allUploaded = files.length > 0 && files.every((f) => f.uploaded);
  const canUpload = peakCode && files.length > 0 && !uploading && !allUploaded;

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-lg flex-1">{t('upload.title')}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4 space-y-4">
        {/* Product Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('product.code')}</CardTitle>
          </CardHeader>
          <CardContent>
            {showProductSearch ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredProducts.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.peakCode}
                        className="p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setPeakCode(product.peakCode);
                          setShowProductSearch(false);
                          setSearchQuery('');
                        }}
                      >
                        <p className="font-mono text-sm">{product.peakCode}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.names.ko}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <span className="text-xs text-muted-foreground">or</span>
                </div>

                <Input
                  placeholder="Enter Peak Code directly"
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPeakCode((e.target as HTMLInputElement).value);
                      setShowProductSearch(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-medium">{peakCode}</p>
                  {selectedProduct && (
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.names.ko}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProductSearch(true)}
                >
                  Change
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('upload.selectCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySelector value={category} onChange={setCategory} />
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('upload.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploader
              onFilesSelected={handleFilesSelected}
              disabled={uploading}
            />

            {/* Preview Grid */}
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {files.map((selectedFile) => (
                  <ImagePreview
                    key={selectedFile.id}
                    file={selectedFile.file}
                    onRemove={() => handleRemoveFile(selectedFile.id)}
                    progress={
                      selectedFile.uploaded ? 100 : selectedFile.progress
                    }
                    error={selectedFile.error}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleUpload}
          disabled={!canUpload}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('upload.uploading')}
            </>
          ) : allUploaded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {t('upload.success')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('upload.title')} ({files.length})
            </>
          )}
        </Button>

        {allUploaded && (
          <div className="text-center">
            <Link href={`/products/${encodeURIComponent(peakCode)}`}>
              <Button variant="outline">{t('product.detail')}</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">{t('nav.home')}</span>
          </Link>
          <Link
            href="/products"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">{t('nav.products')}</span>
          </Link>
          <Link
            href="/upload"
            className="flex flex-col items-center justify-center gap-1 text-primary"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">{t('nav.upload')}</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t('nav.settings')}</span>
          </Link>
        </div>
      </nav>
    </div>
    </AuthGuard>
  );
}
