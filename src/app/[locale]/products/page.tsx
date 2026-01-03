'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpeciesTab, ProductGrid } from '@/components/products';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { mockProducts, filterProducts } from '@/lib/mock-data';
import { getProductSpecs } from '@/lib/firebase/firestore';
import { Search, ArrowLeft, Home, Package, Upload, Settings, Loader2 } from 'lucide-react';
import type { Species, Storage, ProductSpec } from '@/types';

export default function ProductsPage() {
  const t = useTranslations();
  const [species, setSpecies] = useState<Species | 'all'>('all');
  const [storage, setStorage] = useState<Storage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFirestore, setUseFirestore] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const speciesFilter = species === 'all' ? undefined : species;
        const storageFilter = storage === 'all' ? undefined : storage;
        const firestoreProducts = await getProductSpecs(speciesFilter, storageFilter);

        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
          setUseFirestore(true);
        } else {
          // Fallback to mock data if Firestore is empty
          setProducts(mockProducts);
          setUseFirestore(false);
        }
      } catch (error) {
        // Fallback to mock data on error
        setProducts(mockProducts);
        setUseFirestore(false);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [species, storage]);

  // Client-side search filtering with tokenized search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    // Split query into tokens for multi-word search
    const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return products;

    return products.filter((product) => {
      const searchableText = [
        product.peakCode,
        product.names.ko,
        product.names.th,
        product.names.en,
        product.names.my,
        product.searchTerms,
        product.partCode,
        product.supplierCode,
        ...(product.aliases || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      // All tokens must match (AND logic)
      return tokens.every(token => searchableText.includes(token));
    });
  }, [products, searchQuery]);

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/" className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-bold text-lg flex-1">{t('product.title')}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Species Tabs */}
        <div className="mb-4">
          <SpeciesTab value={species} onChange={setSpecies} />
        </div>

        {/* Storage Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={storage === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStorage('all')}
          >
            {t('common.all')}
          </Button>
          <Button
            variant={storage === 'F' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStorage('F')}
            className={storage === 'F' ? 'bg-blue-600' : ''}
          >
            {t('storage.frozen')}
          </Button>
          <Button
            variant={storage === 'C' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStorage('C')}
            className={storage === 'C' ? 'bg-green-600' : ''}
          >
            {t('storage.chilled')}
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {filteredProducts.length} {t('nav.products')}
              {!useFirestore && (
                <span className="text-xs text-orange-500">(Mock)</span>
              )}
            </>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
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
