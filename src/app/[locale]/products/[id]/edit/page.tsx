'use client';

import { use, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import ProductForm from '@/components/products/ProductForm';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getProductSpec } from '@/lib/firebase/firestore';
import { ArrowLeft, Home, Package, Upload, Settings, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductSpec } from '@/types';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const decodedId = decodeURIComponent(id);

  const [product, setProduct] = useState<ProductSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const firestoreProduct = await getProductSpec(decodedId);
        if (firestoreProduct) {
          setProduct(firestoreProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    if (decodedId) {
      fetchProduct();
    }
  }, [decodedId]);

  const handleSubmit = async (data: Partial<ProductSpec>) => {
    if (!data.peakCode) {
      setError('Peak 코드는 필수입니다.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const docRef = doc(db, 'productSpecs', data.peakCode);
      await setDoc(docRef, {
        ...data,
        id: data.peakCode,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown',
      }, { merge: true });

      router.push(`/products/${encodeURIComponent(data.peakCode)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AuthGuard>
    );
  }

  // Error state
  if (!product) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-bold mb-2">{t('common.noData')}</h1>
            <p className="text-muted-foreground mb-4">{error || 'Product not found'}</p>
            <Link href="/products">
              <Button>{t('common.back')}</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center gap-4 px-4">
            <Link href={`/products/${encodeURIComponent(decodedId)}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm truncate">{t('product.edit')}</h1>
              <p className="text-xs text-muted-foreground font-mono">
                {product.peakCode}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Main Content */}
        <main className="container px-4 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {saving && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.loading')}
            </div>
          )}
          <ProductForm initialData={product} onSubmit={handleSubmit} disabled={saving} />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
          <div className="grid grid-cols-4 h-16">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
              <Home className="h-5 w-5" />
              <span className="text-xs">{t('nav.home')}</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center justify-center gap-1 text-primary">
              <Package className="h-5 w-5" />
              <span className="text-xs">{t('nav.products')}</span>
            </Link>
            <Link href="/upload" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
              <Upload className="h-5 w-5" />
              <span className="text-xs">{t('nav.upload')}</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
              <Settings className="h-5 w-5" />
              <span className="text-xs">{t('nav.settings')}</span>
            </Link>
          </div>
        </nav>
      </div>
    </AuthGuard>
  );
}
