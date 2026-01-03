'use client';

import { use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import SpecSheet from '@/components/products/SpecSheet';
import MediaGallery from '@/components/products/MediaGallery';
import QualityBadge from '@/components/products/QualityBadge';
import { getMockProduct, getMockMedia } from '@/lib/mock-data';
import {
  ArrowLeft,
  Home,
  Package,
  Upload,
  Settings,
  Camera,
  FileText,
  AlertCircle,
} from 'lucide-react';
import type { Locale } from '@/types';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const decodedId = decodeURIComponent(id);
  const product = getMockProduct(decodedId);
  const media = getMockMedia(decodedId);

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
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4">
        {/* Quality Badges */}
        <div className="mb-4">
          <QualityBadge
            species={product.species}
            storage={product.storage}
            grade={product.qualityStandards?.grade}
          />
        </div>

        {/* Product Name in all languages */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{productName}</h2>
          {locale !== 'ko' && product.names.ko && (
            <p className="text-sm text-muted-foreground">{product.names.ko}</p>
          )}
          {locale !== 'th' && product.names.th && (
            <p className="text-sm text-muted-foreground">{product.names.th}</p>
          )}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="specs" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('product.specs')}
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <Camera className="h-4 w-4" />
              {t('product.media')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specs">
            <SpecSheet product={product} />
          </TabsContent>

          <TabsContent value="media">
            <MediaGallery media={media} peakCode={product.peakCode} />

            {/* Upload Button */}
            <div className="mt-6">
              <Link href={`/upload?code=${encodeURIComponent(product.peakCode)}`}>
                <Button className="w-full gap-2">
                  <Camera className="h-4 w-4" />
                  {t('upload.title')}
                </Button>
              </Link>
            </div>
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
    </div>
    </AuthGuard>
  );
}
