'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import SpecSheet from '@/components/products/SpecSheet';
import MediaGallery from '@/components/products/MediaGallery';
import QualityBadge from '@/components/products/QualityBadge';
import { getMockProduct } from '@/lib/mock-data';
import { getSpecMedia, getProductSpec } from '@/lib/firebase/firestore';
import type { ProductSpec } from '@/types';
import {
  ArrowLeft,
  Home,
  Package,
  Upload,
  Settings,
  Camera,
  FileText,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Loader2,
  Play,
  X,
  Edit,
  BoxIcon,
  ShoppingCart,
} from 'lucide-react';
import type { Locale, SpecMedia } from '@/types';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const decodedId = decodeURIComponent(id);
  const [product, setProduct] = useState<ProductSpec | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [media, setMedia] = useState<SpecMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<SpecMedia | null>(null);

  // Filter media by category
  const approvedMedia = media.filter((m) => m.category === 'approved' && !m.file.mimeType.startsWith('video/'));
  const rejectedMedia = media.filter((m) => m.category === 'rejected' && !m.file.mimeType.startsWith('video/'));
  const processVideos = media.filter((m) => m.type === 'process_video' || m.file.mimeType.startsWith('video/'));

  // Fetch product from Firestore
  useEffect(() => {
    async function fetchProduct() {
      if (!decodedId) return;
      try {
        setLoadingProduct(true);
        const firestoreProduct = await getProductSpec(decodedId);
        if (firestoreProduct) {
          setProduct(firestoreProduct);
        } else {
          // Fallback to mock data
          const mockProduct = getMockProduct(decodedId);
          setProduct(mockProduct || null);
        }
      } catch (error) {
        // Fallback to mock data
        const mockProduct = getMockProduct(decodedId);
        setProduct(mockProduct || null);
      } finally {
        setLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [decodedId]);

  // Fetch media
  useEffect(() => {
    async function fetchMedia() {
      if (!decodedId) return;
      try {
        setLoadingMedia(true);
        const fetchedMedia = await getSpecMedia(decodedId);
        setMedia(fetchedMedia);
      } catch (error) {
        // Silently fail - just show no media
      } finally {
        setLoadingMedia(false);
      }
    }
    fetchMedia();
  }, [decodedId]);

  const handleMediaDeleted = useCallback((mediaId: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  }, []);

  // Loading state
  if (loadingProduct) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AuthGuard>
    );
  }

  if (!product) {
    return (
      <AuthGuard>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-xl font-bold mb-2">{t('common.noData')}</h1>
          <p className="text-muted-foreground mb-4">
            Product not found: {decodedId}
          </p>
          <Link href="/products">
            <Button>{t('common.back')}</Button>
          </Link>
        </div>
      </div>
      </AuthGuard>
    );
  }

  const productName = product.names[locale] || product.names.en;

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm truncate">{productName}</h1>
            <p className="text-xs text-muted-foreground font-mono">
              {product.peakCode}
            </p>
          </div>
          <Link href={`/products/${encodeURIComponent(product.peakCode)}/edit`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">{t('product.edit')}</span>
            </Button>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4">
        {/* Trade Type + Quality Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Trade Type Badge */}
          {product.tradeType === '1' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <BoxIcon className="h-3 w-3" />
              {t('tradeType.raw')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ShoppingCart className="h-3 w-3" />
              {t('tradeType.sales')}
            </span>
          )}
          <QualityBadge
            species={product.species}
            storage={product.storage}
            grade={product.qualityStandards?.grade}
          />
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">{productName}</h2>
          {locale !== 'ko' && product.names.ko && (
            <p className="text-sm text-muted-foreground">{product.names.ko}</p>
          )}
        </div>

        {/* Top Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('product.specs')}
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              {t('product.photos')}
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              {t('product.videos')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab: Split Layout */}
          <TabsContent value="overview">
            <div className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-6">
              {/* Left: Specs (auto width) */}
              <div className="text-left sm:max-w-[260px]">
                <SpecSheet product={product} />
              </div>

              {/* Right: Approved/Rejected Photos + Video Button (wide) */}
              <div className="space-y-4">
                {/* Photos: Approved on top, Rejected below */}
                <div className="space-y-4">
                  {/* Approved Photos Preview */}
                  <div className="border rounded-lg p-4 border-green-200 bg-green-50/30">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-green-600" />
                      {t('category.approved')} ({approvedMedia.length})
                    </h3>
                    {loadingMedia ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : approvedMedia.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('common.noData')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {approvedMedia.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(item)}
                          >
                            {item.file.url && (
                              <img
                                src={item.file.url}
                                alt={product.peakCode}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {approvedMedia.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        +{approvedMedia.length - 2} more
                      </p>
                    )}
                  </div>

                  {/* Rejected Photos Preview */}
                  <div className="border rounded-lg p-4 border-red-200 bg-red-50/30">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      {t('category.rejected')} ({rejectedMedia.length})
                    </h3>
                    {loadingMedia ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : rejectedMedia.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('common.noData')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {rejectedMedia.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(item)}
                          >
                            {item.file.url && (
                              <img
                                src={item.file.url}
                                alt={product.peakCode}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {rejectedMedia.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        +{rejectedMedia.length - 2} more
                      </p>
                    )}
                  </div>
                </div>

                {/* Process Video Button */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    {t('product.videoCount')} ({processVideos.length})
                  </h3>
                  {processVideos.length > 0 ? (
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={() => {
                        setSelectedVideoUrl(processVideos[0].file.url);
                        setShowVideo(true);
                      }}
                    >
                      <Play className="h-4 w-4" />
                      {t('product.videoCount')}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {t('common.noData')}
                    </p>
                  )}
                </div>

                {/* Inline Video Player */}
                {showVideo && selectedVideoUrl && (
                  <div className="border rounded-lg overflow-hidden bg-black">
                    <div className="flex items-center justify-between p-2 bg-muted">
                      <span className="text-sm font-medium">{t('product.videoCount')}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowVideo(false);
                          setSelectedVideoUrl(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <video
                      src={selectedVideoUrl}
                      controls
                      autoPlay
                      className="w-full max-h-[70vh] object-contain"
                    />
                  </div>
                )}

                {/* Upload Button */}
                <Link href={`/upload?code=${encodeURIComponent(product.peakCode)}`}>
                  <Button className="w-full gap-2" variant="outline">
                    <Camera className="h-4 w-4" />
                    {t('upload.title')}
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab: Full Gallery */}
          <TabsContent value="photos">
            {loadingMedia ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <MediaGallery
                media={media}
                peakCode={product.peakCode}
                onMediaDeleted={handleMediaDeleted}
              />
            )}
            <div className="mt-6">
              <Link href={`/upload?code=${encodeURIComponent(product.peakCode)}`}>
                <Button className="w-full gap-2">
                  <Camera className="h-4 w-4" />
                  {t('upload.title')}
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            {processVideos.length > 0 ? (
              <div className="space-y-4">
                {processVideos.map((video) => (
                  <div key={video.id} className="border rounded-lg overflow-hidden">
                    <video
                      src={video.file.url}
                      controls
                      className="w-full max-h-[80vh] object-contain"
                    />
                    <div className="p-2 bg-muted text-sm">
                      {video.file.fileName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-2">{t('common.noData')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Aliases */}
        {product.aliases.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Aliases</p>
            <div className="flex flex-wrap gap-2">
              {product.aliases.map((alias) => (
                <span
                  key={alias}
                  className="text-sm bg-background px-2 py-1 rounded"
                >
                  {alias}
                </span>
              ))}
            </div>
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
            className="flex flex-col items-center justify-center gap-1 text-primary"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">{t('nav.products')}</span>
          </Link>
          <Link
            href="/upload"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
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

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {previewImage?.category === 'approved' ? t('category.approved') : t('category.rejected')}
          </DialogTitle>
          {previewImage && (
            <div className="relative bg-black">
              <img
                src={previewImage.file.url}
                alt={product?.peakCode || ''}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  previewImage.category === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {previewImage.category === 'approved' ? t('category.approved') : t('category.rejected')}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </AuthGuard>
  );
}
