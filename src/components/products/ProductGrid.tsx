'use client';

import { useTranslations } from 'next-intl';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';
import type { ProductSpec } from '@/types';

interface ProductGridProps {
  products: ProductSpec[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const t = useTranslations();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mb-4" />
        <p>{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
