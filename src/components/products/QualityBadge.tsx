'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Species, Storage } from '@/types';
import { SPECIES_COLORS } from '@/types';

interface QualityBadgeProps {
  species: Species;
  storage: Storage;
  grade?: string;
  className?: string;
}

export default function QualityBadge({
  species,
  storage,
  grade,
  className,
}: QualityBadgeProps) {
  const t = useTranslations();

  const speciesLabel = {
    P: t('species.pork'),
    B: t('species.beef'),
    C: t('species.chicken'),
  }[species];

  const storageLabel = storage === 'F' ? t('storage.frozen') : t('storage.chilled');

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {/* Species Badge */}
      <Badge
        style={{
          backgroundColor: `${SPECIES_COLORS[species]}20`,
          color: SPECIES_COLORS[species],
          borderColor: SPECIES_COLORS[species],
        }}
        variant="outline"
      >
        {speciesLabel}
      </Badge>

      {/* Storage Badge */}
      <Badge
        variant="outline"
        className={cn(
          storage === 'F'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-green-50 text-green-700 border-green-200'
        )}
      >
        {storageLabel}
      </Badge>

      {/* Grade Badge */}
      {grade && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {t('product.grade')}: {grade}
        </Badge>
      )}
    </div>
  );
}
