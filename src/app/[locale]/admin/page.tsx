'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import {
  ArrowLeft,
  Upload,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const ADMIN_EMAIL = 'giujeong@meet365.net';
const COLLECTIONS = {
  PRODUCT_SPECS: 'productSpecs',
};

interface ImportProgress {
  total: number;
  current: number;
  success: number;
  failed: number;
  status: 'idle' | 'loading' | 'importing' | 'done' | 'error';
  message: string;
}

export default function AdminPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [progress, setProgress] = useState<ImportProgress>({
    total: 0,
    current: 0,
    success: 0,
    failed: 0,
    status: 'idle',
    message: '',
  });
  const [existingCount, setExistingCount] = useState<number | null>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const checkExistingProducts = async () => {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCT_SPECS), limit(1000));
      const snapshot = await getDocs(q);
      setExistingCount(snapshot.size);
    } catch (error) {
      console.error('Error checking existing products:', error);
    }
  };

  const handleImport = async () => {
    if (!isAdmin) return;

    setProgress({
      total: 0,
      current: 0,
      success: 0,
      failed: 0,
      status: 'loading',
      message: 'Loading products data...',
    });

    try {
      // Fetch products JSON
      const response = await fetch('/data/products.json');
      if (!response.ok) throw new Error('Failed to load products.json');

      const products = await response.json();

      setProgress(prev => ({
        ...prev,
        total: products.length,
        status: 'importing',
        message: `Importing ${products.length} products...`,
      }));

      let success = 0;
      let failed = 0;

      // Import in batches
      const batchSize = 50;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, Math.min(i + batchSize, products.length));

        await Promise.all(
          batch.map(async (product: Record<string, unknown>) => {
            try {
              const docRef = doc(db, COLLECTIONS.PRODUCT_SPECS, product.id as string);
              await setDoc(docRef, {
                ...product,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              success++;
            } catch (error) {
              console.error(`Failed to import ${product.peakCode}:`, error);
              failed++;
            }
          })
        );

        setProgress(prev => ({
          ...prev,
          current: Math.min(i + batchSize, products.length),
          success,
          failed,
          message: `Imported ${Math.min(i + batchSize, products.length)} / ${products.length}...`,
        }));
      }

      setProgress(prev => ({
        ...prev,
        status: 'done',
        message: `Import complete! Success: ${success}, Failed: ${failed}`,
      }));

      // Refresh count
      await checkExistingProducts();
    } catch (error) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Import failed',
      }));
    }
  };

  if (!isAdmin) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Admin only page</p>
            <Link href="/">
              <Button>{t('common.back')}</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center gap-4 px-4">
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-bold text-lg flex-1">Admin Panel</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container px-4 py-6 space-y-6">
          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Existing Products</span>
                <span className="font-mono">
                  {existingCount === null ? (
                    <Button variant="outline" size="sm" onClick={checkExistingProducts}>
                      Check
                    </Button>
                  ) : (
                    `${existingCount} products`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Import Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Peak Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import 896 products from Peak Excel to Firestore
              </p>

              {/* Progress */}
              {progress.status !== 'idle' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {progress.status === 'loading' || progress.status === 'importing' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : progress.status === 'done' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{progress.message}</span>
                  </div>

                  {progress.total > 0 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                  )}

                  {progress.status === 'done' && (
                    <div className="text-sm">
                      <span className="text-green-600">Success: {progress.success}</span>
                      {progress.failed > 0 && (
                        <span className="text-red-600 ml-4">Failed: {progress.failed}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={progress.status === 'loading' || progress.status === 'importing'}
                className="w-full"
              >
                {progress.status === 'loading' || progress.status === 'importing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  View Products
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}
