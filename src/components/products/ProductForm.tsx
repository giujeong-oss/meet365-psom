'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parsePeakCode } from '@/lib/firebase';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import type { ProductSpec, Species, Storage } from '@/types';

interface ProductFormProps {
  initialData?: ProductSpec;
  onSubmit?: (data: Partial<ProductSpec>) => Promise<void>;
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [peakCode, setPeakCode] = useState(initialData?.peakCode || '');
  const [parsedCode, setParsedCode] = useState<ReturnType<typeof parsePeakCode>>(
    initialData?.peakCode ? parsePeakCode(initialData.peakCode) : null
  );

  const [names, setNames] = useState({
    ko: initialData?.names?.ko || '',
    th: initialData?.names?.th || '',
    my: initialData?.names?.my || '',
    en: initialData?.names?.en || '',
  });

  const [specs, setSpecs] = useState({
    weightMin: initialData?.specs?.weightRange?.min?.toString() || '',
    weightMax: initialData?.specs?.weightRange?.max?.toString() || '',
    weightUnit: initialData?.specs?.weightRange?.unit || 'kg',
    standardYield: initialData?.specs?.standardYield?.toString() || '',
    standardLossRate: initialData?.specs?.standardLossRate?.toString() || '',
    thickness: initialData?.specs?.thickness?.toString() || '',
    shelfLifeDays: initialData?.specs?.shelfLife?.days?.toString() || '',
    shelfLifeTemp: initialData?.specs?.shelfLife?.temperature?.toString() || '',
  });

  const [unit, setUnit] = useState(initialData?.unit || 'Kg.');
  const [aliases, setAliases] = useState(initialData?.aliases?.join(', ') || '');

  const handlePeakCodeChange = (value: string) => {
    setPeakCode(value);
    const parsed = parsePeakCode(value);
    setParsedCode(parsed);
    if (!parsed) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!parsedCode) {
      setError('Invalid Peak code format');
      return;
    }

    setLoading(true);

    try {
      const data: Partial<ProductSpec> = {
        peakCode,
        baseCode: peakCode.replace(/-[^-]*$/, ''),
        tradeType: parsedCode.tradeType as '1' | '2',
        storage: parsedCode.storage as Storage,
        species: parsedCode.species as Species,
        supplierCode: parsedCode.supplierCode,
        partCode: parsedCode.partCode,
        variant: parsedCode.variant || undefined,
        names,
        searchTerms: Object.values(names).filter(Boolean).join(' '),
        aliases: aliases
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        specs: {
          weightRange:
            specs.weightMin && specs.weightMax
              ? {
                  min: parseFloat(specs.weightMin),
                  max: parseFloat(specs.weightMax),
                  unit: specs.weightUnit as 'kg' | 'g',
                }
              : undefined,
          standardYield: specs.standardYield
            ? parseFloat(specs.standardYield)
            : undefined,
          standardLossRate: specs.standardLossRate
            ? parseFloat(specs.standardLossRate)
            : undefined,
          thickness: specs.thickness ? parseFloat(specs.thickness) : undefined,
          shelfLife:
            specs.shelfLifeDays && specs.shelfLifeTemp
              ? {
                  days: parseInt(specs.shelfLifeDays),
                  temperature: parseInt(specs.shelfLifeTemp),
                }
              : undefined,
        },
        unit,
        isActive: true,
        mediaCount: { crossSection: 0, defect: 0, processVideo: 0 },
      };

      if (onSubmit) {
        await onSubmit(data);
      }

      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Peak Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('product.code')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="peakCode">Peak Code *</Label>
            <Input
              id="peakCode"
              value={peakCode}
              onChange={(e) => handlePeakCodeChange(e.target.value.toUpperCase())}
              placeholder="2-FP180001-2CM"
              className="font-mono"
              required
            />
            {parsedCode && (
              <div className="mt-2 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                <span>
                  Type: {parsedCode.tradeType === '2' ? 'Sale' : 'Purchase'}
                </span>
                <span>
                  Storage: {parsedCode.storage === 'F' ? 'Frozen' : 'Chilled'}
                </span>
                <span>
                  Species:{' '}
                  {parsedCode.species === 'P'
                    ? 'Pork'
                    : parsedCode.species === 'B'
                    ? 'Beef'
                    : 'Chicken'}
                </span>
                <span>Supplier: {parsedCode.supplierCode}</span>
                <span>Part: {parsedCode.partCode}</span>
                {parsedCode.variant && <span>Variant: {parsedCode.variant}</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Names */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('product.name')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ko">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="ko">한국어</TabsTrigger>
              <TabsTrigger value="th">ไทย</TabsTrigger>
              <TabsTrigger value="my">မြန်မာ</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            {(['ko', 'th', 'my', 'en'] as const).map((lang) => (
              <TabsContent key={lang} value={lang}>
                <Input
                  value={names[lang]}
                  onChange={(e) =>
                    setNames((prev) => ({ ...prev, [lang]: e.target.value }))
                  }
                  placeholder={`${t('product.name')} (${lang.toUpperCase()})`}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('product.specs')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weight Range */}
          <div>
            <Label>{t('product.weight')}</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                step="0.1"
                value={specs.weightMin}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, weightMin: e.target.value }))
                }
                placeholder="Min"
                className="w-24"
              />
              <span>-</span>
              <Input
                type="number"
                step="0.1"
                value={specs.weightMax}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, weightMax: e.target.value }))
                }
                placeholder="Max"
                className="w-24"
              />
              <Select
                value={specs.weightUnit}
                onValueChange={(v: 'kg' | 'g') =>
                  setSpecs((prev) => ({ ...prev, weightUnit: v }))
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Yield & Loss Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('product.yield')} (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={specs.standardYield}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, standardYield: e.target.value }))
                }
                placeholder="72"
              />
            </div>
            <div>
              <Label>{t('product.lossRate')} (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={specs.standardLossRate}
                onChange={(e) =>
                  setSpecs((prev) => ({
                    ...prev,
                    standardLossRate: e.target.value,
                  }))
                }
                placeholder="5"
              />
            </div>
          </div>

          {/* Thickness */}
          <div>
            <Label>{t('product.thickness')} (mm)</Label>
            <Input
              type="number"
              step="0.1"
              value={specs.thickness}
              onChange={(e) =>
                setSpecs((prev) => ({ ...prev, thickness: e.target.value }))
              }
              placeholder="20"
            />
          </div>

          {/* Shelf Life */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('product.shelfLife')} (days)</Label>
              <Input
                type="number"
                value={specs.shelfLifeDays}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, shelfLifeDays: e.target.value }))
                }
                placeholder="180"
              />
            </div>
            <div>
              <Label>{t('product.temperature')} (°C)</Label>
              <Input
                type="number"
                value={specs.shelfLifeTemp}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, shelfLifeTemp: e.target.value }))
                }
                placeholder="-18"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('product.unit')}</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kg.">Kg.</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="box">box</SelectItem>
                <SelectItem value="ea">ea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Aliases (comma separated)</Label>
            <Textarea
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="오겹살, 생삼겹"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={loading || !parsedCode}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('common.loading')}
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {t('common.save')}
          </>
        )}
      </Button>
    </form>
  );
}
