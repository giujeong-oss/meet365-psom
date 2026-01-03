'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { AuthGuard } from '@/components/auth';
import { PartButtons } from '@/components/products';
import { mockProducts } from '@/lib/mock-data';
import { getProductSpecs } from '@/lib/firebase/firestore';
import { Home, Package, Loader2, BoxIcon, ShoppingCart, Snowflake, Thermometer } from 'lucide-react';
import type { Species, Storage, ProductSpec, TradeType, Locale } from '@/types';

export default function TabletProductsPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  // Filters
  const [tradeType, setTradeType] = useState<TradeType | 'all'>('2');
  const [species, setSpecies] = useState<Species | 'all'>('P');
  const [storage, setStorage] = useState<Storage | 'all'>('all');
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Data
  const [allProducts, setAllProducts] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFirestore, setUseFirestore] = useState(true);

  // Load all data once
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        setLoading(true);
        const firestoreProducts = await getProductSpecs();

        if (firestoreProducts.length > 0) {
          setAllProducts(firestoreProducts);
          setUseFirestore(true);
        } else {
          setAllProducts(mockProducts);
          setUseFirestore(false);
        }
      } catch {
        setAllProducts(mockProducts);
        setUseFirestore(false);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProducts();
  }, []);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (tradeType !== 'all' && product.tradeType !== tradeType) return false;
      if (species !== 'all' && product.species !== species) return false;
      if (storage !== 'all' && product.storage !== storage) return false;
      if (selectedPart && product.partCode !== selectedPart) return false;
      return true;
    });
  }, [allProducts, tradeType, species, storage, selectedPart]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center gap-4 px-4">
            <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              <Home className="h-5 w-5" />
            </Link>
            <Link href="/products" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              <Package className="h-5 w-5" />
            </Link>
            <h1 className="font-bold text-lg flex-1">{t('product.title')} (Tablet)</h1>
            {!useFirestore && (
              <span className="text-xs text-orange-500">(Mock)</span>
            )}
            <LanguageSwitcher />
          </div>
        </header>

        {/* Main Content - Split View */}
        <main className="flex h-[calc(100vh-56px)]">
          {/* Left Panel: Filters */}
          <div className="w-72 border-r bg-muted/30 p-3 overflow-y-auto">
            {/* Trade Type - 2x2 Grid */}
            <div className="mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Trade Type</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={tradeType === '2' ? 'default' : 'outline'}
                  onClick={() => setTradeType('2')}
                  className={`h-16 flex-col gap-1 ${tradeType === '2' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm">{t('tradeType.sales')}</span>
                </Button>
                <Button
                  variant={tradeType === '1' ? 'default' : 'outline'}
                  onClick={() => setTradeType('1')}
                  className={`h-16 flex-col gap-1 ${tradeType === '1' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                >
                  <BoxIcon className="h-6 w-6" />
                  <span className="text-sm">{t('tradeType.raw')}</span>
                </Button>
              </div>
            </div>

            {/* Species - 2x2 Grid */}
            <div className="mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Species</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={species === 'P' ? 'default' : 'outline'}
                  onClick={() => { setSpecies('P'); setSelectedPart(null); }}
                  className={`h-14 text-base ${species === 'P' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                >
                  {t('species.pork')}
                </Button>
                <Button
                  variant={species === 'B' ? 'default' : 'outline'}
                  onClick={() => { setSpecies('B'); setSelectedPart(null); }}
                  className={`h-14 text-base ${species === 'B' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                >
                  {t('species.beef')}
                </Button>
                <Button
                  variant={species === 'C' ? 'default' : 'outline'}
                  onClick={() => { setSpecies('C'); setSelectedPart(null); }}
                  className={`h-14 text-base ${species === 'C' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                >
                  {t('species.chicken')}
                </Button>
                <Button
                  variant={species === 'all' ? 'default' : 'outline'}
                  onClick={() => { setSpecies('all'); setSelectedPart(null); }}
                  className="h-14 text-base"
                >
                  {t('common.all')}
                </Button>
              </div>
            </div>

            {/* Storage - 2x2 Grid */}
            <div className="mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Storage</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={storage === 'F' ? 'default' : 'outline'}
                  onClick={() => setStorage('F')}
                  className={`h-14 flex-col gap-1 ${storage === 'F' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <Snowflake className="h-5 w-5" />
                  <span className="text-sm">{t('storage.frozen')}</span>
                </Button>
                <Button
                  variant={storage === 'C' ? 'default' : 'outline'}
                  onClick={() => setStorage('C')}
                  className={`h-14 flex-col gap-1 ${storage === 'C' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <Thermometer className="h-5 w-5" />
                  <span className="text-sm">{t('storage.chilled')}</span>
                </Button>
              </div>
            </div>

            {/* Part Buttons */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('product.part')}</p>
              <PartButtons
                species={species}
                selectedPart={selectedPart}
                onPartSelect={setSelectedPart}
              />
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span>{filteredProducts.length} {t('nav.products')}</span>
                )}
              </h2>
            </div>

            {/* Results List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('common.noData')}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.peakCode}
                    href={`/products/${encodeURIComponent(product.peakCode)}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {/* Trade Type Icon */}
                    {product.tradeType === '1' ? (
                      <BoxIcon className="h-5 w-5 text-orange-600 shrink-0" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 text-blue-600 shrink-0" />
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate">
                        {product.peakCode}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.names[locale] || product.names.en}
                      </p>
                    </div>

                    {/* Storage Badge */}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      product.storage === 'F'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.storage === 'F' ? t('storage.frozen') : t('storage.chilled')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
