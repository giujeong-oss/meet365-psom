'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Scale,
  Thermometer,
  Clock,
  Percent,
  Ruler,
  Award,
  Building2,
  ClipboardCheck,
  Scissors,
} from 'lucide-react';
import type { ProductSpec, Locale } from '@/types';

interface SpecSheetProps {
  product: ProductSpec;
}

export default function SpecSheet({ product }: SpecSheetProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRawMaterial = product.tradeType === '1';

  const specItems = [
    {
      icon: Scale,
      label: t('product.weight'),
      value: product.specs?.weightRange
        ? `${product.specs.weightRange.min}-${product.specs.weightRange.max} ${product.specs.weightRange.unit}`
        : null,
    },
    {
      icon: Percent,
      label: t('product.yield'),
      value: product.specs?.standardYield ? `${product.specs.standardYield}%` : null,
      highlight: true,
    },
    {
      icon: Percent,
      label: t('product.lossRate'),
      value: product.specs?.standardLossRate ? `${product.specs.standardLossRate}%` : null,
      negative: true,
    },
    {
      icon: Ruler,
      label: t('product.thickness'),
      value: product.specs?.thickness ? `${product.specs.thickness}mm` : null,
    },
    {
      icon: Clock,
      label: t('product.shelfLife'),
      value: product.specs?.shelfLife ? `${product.specs.shelfLife.days} days` : null,
    },
    {
      icon: Thermometer,
      label: t('product.temperature'),
      value: product.specs?.shelfLife?.temperature
        ? `${product.specs.shelfLife.temperature}°C`
        : null,
    },
  ].filter((item) => item.value !== null);

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            {t('product.specs')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {specItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p
                    className={`text-sm font-medium ${
                      item.highlight
                        ? 'text-green-600'
                        : item.negative
                        ? 'text-red-600'
                        : ''
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Unit */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('product.unit')}</span>
            <Badge variant="outline">{product.unit}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trade Type Specific Section */}
      <Card className={isRawMaterial ? 'border-orange-200 bg-orange-50/30' : 'border-blue-200 bg-blue-50/30'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            {isRawMaterial ? (
              <>
                <ClipboardCheck className="h-4 w-4 text-orange-600" />
                {t('tradeType.rawDesc')}
              </>
            ) : (
              <>
                <Scissors className="h-4 w-4 text-blue-600" />
                {t('tradeType.salesDesc')}
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {isRawMaterial ? (
            <p>입고 시 품질 검수 기준을 확인하세요. 적격/부적격 사진을 참고하여 검수합니다.</p>
          ) : (
            <p>정형 및 가공 시 품질 기준을 확인하세요. 정형 영상과 단면 사진을 참고합니다.</p>
          )}
        </CardContent>
      </Card>

      {/* Quality Standards */}
      {product.qualityStandards && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t('product.quality')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.qualityStandards.grade && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('product.grade')}</span>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  {product.qualityStandards.grade}
                </Badge>
              </div>
            )}
            {product.qualityStandards.marbling && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Marbling</span>
                <span className="text-sm font-medium">
                  {product.qualityStandards.marbling.min} - {product.qualityStandards.marbling.max}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Code Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('product.code')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak Code</span>
              <span className="font-mono">{product.peakCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Code</span>
              <span className="font-mono">{product.baseCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('product.supplier')}</span>
              <span>{product.supplierCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('product.part')}</span>
              <span>{product.partCode}</span>
            </div>
            {product.variant && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('product.variant')}</span>
                <span>{product.variant}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
