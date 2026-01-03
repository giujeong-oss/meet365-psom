'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales, type Locale } from '@/i18n/routing';

const localeLabels: Record<Locale, { flag: string; name: string }> = {
  ko: { flag: '🇰🇷', name: '한국어' },
  th: { flag: '🇹🇭', name: 'ไทย' },
  my: { flag: '🇲🇲', name: 'မြန်မာ' },
  en: { flag: '🇺🇸', name: 'English' },
};

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as Locale });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{localeLabels[locale as Locale]?.flag}</span>
            <span>{localeLabels[locale as Locale]?.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="flex items-center gap-2">
              <span>{localeLabels[loc].flag}</span>
              <span>{localeLabels[loc].name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
