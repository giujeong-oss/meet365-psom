'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductSpec, Locale } from '@/types';
import { SPECIES_COLORS } from '@/types';

interface ProductCardProps {
  product: ProductSpec;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const speciesColor = SPECIES_COLORS[product.species];
  const productName = product.names[locale] || product.names.en || product.peakCode;

  const storageLabel = product.storage === 'F' ? t('storage.frozen') : t('storage.chilled');

  return (
    <Link href={`/products/${encodeURIComponent(product.peakCode)}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer">
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-muted">
          {product.referenceThumbnail ? (
            <Image
              src={product.referenceThumbnail}
              alt={productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Storage Badge */}
          <Badge
            variant="secondary"
            className={cn(
              'absolute top-2 right-2',
              product.storage === 'F' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            )}
          >
            {storageLabel}
          </Badge>

          {/* Species Indicator */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: speciesColor }}
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">
            {productName}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mb-2">
            {product.peakCode}
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {product.specs?.standardYield && (
              <span className="flex items-center gap-1">
                <span className="text-green-600">▲</span>
                {product.specs.standardYield}%
              </span>
            )}
            {product.specs?.thickness && (
              <span>{product.specs.thickness}mm</span>
            )}
            {product.unit && (
              <span className="ml-auto">{product.unit}</span>
            )}
          </div>

          {/* Media Count */}
          {(product.mediaCount?.crossSection > 0 || product.mediaCount?.defect > 0) && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              {product.mediaCount.crossSection > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {t('category.approved')} {product.mediaCount.crossSection}
                </Badge>
              )}
              {product.mediaCount.defect > 0 && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {t('category.rejected')} {product.mediaCount.defect}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
