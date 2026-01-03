'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, BookOpen, GraduationCap } from 'lucide-react';
import type { MediaCategory } from '@/types';

interface CategorySelectorProps {
  value: MediaCategory;
  onChange: (category: MediaCategory) => void;
}

const categories: {
  value: MediaCategory;
  icon: typeof CheckCircle;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: 'approved',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  {
    value: 'rejected',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
  {
    value: 'reference',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  {
    value: 'training',
    icon: GraduationCap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
  },
];

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = value === category.value;

        return (
          <Card
            key={category.value}
            className={cn(
              'p-4 cursor-pointer transition-all border-2',
              isSelected
                ? `${category.bgColor} ${category.borderColor}`
                : 'border-transparent hover:bg-muted/50'
            )}
            onClick={() => onChange(category.value)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-full',
                  isSelected ? category.bgColor : 'bg-muted'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isSelected ? category.color : 'text-muted-foreground'
                  )}
                />
              </div>
              <span
                className={cn(
                  'font-medium',
                  isSelected ? category.color : 'text-foreground'
                )}
              >
                {t(`category.${category.value}`)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
