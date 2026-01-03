'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Species } from '@/types';

interface SpeciesTabProps {
  value: Species | 'all';
  onChange: (value: Species | 'all') => void;
}

const speciesConfig: { value: Species | 'all'; icon: string; color: string }[] = [
  { value: 'all', icon: '📦', color: 'bg-gray-100' },
  { value: 'P', icon: '🐷', color: 'bg-pink-100' },
  { value: 'B', icon: '🐄', color: 'bg-red-100' },
  { value: 'C', icon: '🐔', color: 'bg-yellow-100' },
];

export default function SpeciesTab({ value, onChange }: SpeciesTabProps) {
  const t = useTranslations();

  const getLabel = (species: Species | 'all') => {
    switch (species) {
      case 'P':
        return t('species.pork');
      case 'B':
        return t('species.beef');
      case 'C':
        return t('species.chicken');
      default:
        return t('common.all');
    }
  };

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Species | 'all')}>
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        {speciesConfig.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              'flex flex-col gap-1 py-3 data-[state=active]:shadow-sm',
              value === item.value && item.color
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{getLabel(item.value)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
