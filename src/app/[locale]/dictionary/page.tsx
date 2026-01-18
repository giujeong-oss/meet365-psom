'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, Home, Package, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import MeatCutEditModal from '@/components/dictionary/MeatCutEditModal';
import {
  meatDataMap,
  searchMeatCuts,
  getMeatStats,
  type MeatType,
  type MeatCut,
  type MeatCategory,
  type MeatData,
} from '@/lib/meat-cuts-data';
import { getMeatCutOverrides, type MeatCutDocument } from '@/lib/firebase/firestore';

type Locale = 'ko' | 'en' | 'th' | 'my';

// 원본 데이터와 오버라이드를 병합
function mergeWithOverrides(
  meatData: MeatData,
  overrides: MeatCutDocument[],
  meatType: MeatType
): MeatData {
  const merged = JSON.parse(JSON.stringify(meatData)) as MeatData;

  for (const override of overrides) {
    if (override.meatType !== meatType) continue;

    const category = merged.categories[override.categoryKey];
    if (!category) continue;

    // Find the cut index from the override id (format: meatType_categoryKey_index)
    const parts = override.id.split('_');
    const cutIndex = parseInt(parts[parts.length - 1], 10);

    if (!isNaN(cutIndex) && cutIndex < category.cuts.length) {
      // Merge override with existing cut data
      category.cuts[cutIndex] = {
        ...category.cuts[cutIndex],
        ...override,
      };
    }
  }

  return merged;
}

export default function DictionaryPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [activeTab, setActiveTab] = useState<MeatType>('pork');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCut, setEditingCut] = useState<{
    cut: MeatCut;
    categoryKey: string;
    cutIndex: number;
  } | null>(null);

  // Firestore overrides
  const [overrides, setOverrides] = useState<MeatCutDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load overrides from Firestore
  const loadOverrides = useCallback(async () => {
    try {
      const data = await getMeatCutOverrides();
      setOverrides(data);
    } catch (error) {
      console.error('Failed to load overrides:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  // Check if current meat type is Halal (has Arabic names)
  const isHalal = activeTab === 'beef' || activeTab === 'chicken';

  const stats = getMeatStats();

  // Merge original data with overrides
  const currentMeat = useMemo(() => {
    const originalMeat = meatDataMap[activeTab];
    return mergeWithOverrides(originalMeat, overrides, activeTab);
  }, [activeTab, overrides]);

  // 검색 결과 필터링
  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return currentMeat.categories;
    }

    const searchResults = searchMeatCuts(searchTerm, activeTab);
    const filtered: Record<string, MeatCategory> = {};

    for (const result of searchResults) {
      const categoryKey = result.category;
      if (!filtered[categoryKey]) {
        filtered[categoryKey] = {
          name: currentMeat.categories[categoryKey].name,
          cuts: [],
        };
      }
      // Find the merged cut data
      const mergedCut = currentMeat.categories[categoryKey]?.cuts.find(
        c => c.ko === result.cut.ko && c.en === result.cut.en
      );
      filtered[categoryKey].cuts.push(mergedCut || result.cut);
    }

    return filtered;
  }, [searchTerm, activeTab, currentMeat.categories]);

  const totalFiltered = Object.values(filteredCategories).reduce(
    (sum, cat) => sum + cat.cuts.length,
    0
  );
  const totalCurrent = Object.values(currentMeat.categories).reduce(
    (sum, cat) => sum + cat.cuts.length,
    0
  );

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  // 카테고리명 표시
  const getCategoryName = (category: MeatCategory): string => {
    switch (locale) {
      case 'th':
        return category.name.th;
      case 'my':
        return category.name.my || category.name.en;
      case 'en':
        return category.name.en;
      default:
        return category.name.ko;
    }
  };

  // Edit handlers
  const handleEditClick = (cut: MeatCut, categoryKey: string, cutIndex: number) => {
    setEditingCut({ cut, categoryKey, cutIndex });
    setEditModalOpen(true);
  };

  const handleSave = (updatedCut: MeatCut) => {
    // Reload overrides to get the latest data
    loadOverrides();
  };

  // Find original cut index (considering search filtering might change order)
  const getOriginalCutIndex = (categoryKey: string, cut: MeatCut): number => {
    const originalCategory = meatDataMap[activeTab].categories[categoryKey];
    if (!originalCategory) return -1;
    return originalCategory.cuts.findIndex(c => c.ko === cut.ko && c.en === cut.en);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🥩</span>
                {t('dictionary.title')}
              </h1>
              <p className="text-sm opacity-90 mt-1">
                {t('dictionary.subtitle', { count: stats.total })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Package className="h-5 w-5" />
                </Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex">
          {(Object.entries(meatDataMap) as [MeatType, typeof meatDataMap.pork][]).map(
            ([key, meat]) => {
              const count = Object.values(meat.categories).reduce(
                (sum, cat) => sum + cat.cuts.length,
                0
              );
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setSearchTerm('');
                  }}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                    activeTab === key
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    borderBottom: activeTab === key ? '3px solid #dc2626' : 'none',
                  }}
                >
                  <span className="text-xl mr-1">{meat.icon}</span>
                  <span className="text-sm">
                    {locale === 'ko'
                      ? meat.name.ko
                      : locale === 'th'
                      ? meat.name.th
                      : locale === 'my'
                      ? meat.name.my || meat.name.en
                      : meat.name.en}
                  </span>
                  {meat.isHalal && (
                    <span className="ml-1 text-green-600 text-xs" title="Halal">☪</span>
                  )}
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('dictionary.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-20"
          />
          {searchTerm && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {totalFiltered}/{totalCurrent}
            </span>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4 text-gray-500">
            Loading...
          </div>
        )}

        {/* Categories */}
        <div className="space-y-3">
          {Object.entries(filteredCategories).map(([categoryKey, category]) => (
            <Card key={categoryKey} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(categoryKey)}
                className="w-full p-3 flex justify-between items-center text-left hover:bg-gray-50"
                style={{ backgroundColor: `${currentMeat.color}15` }}
              >
                <span className="font-semibold text-gray-800">{getCategoryName(category)}</span>
                <span className="flex items-center gap-2">
                  <Badge variant="secondary">{category.cuts.length}</Badge>
                  {expandedCategories[categoryKey] ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </span>
              </button>

              {!expandedCategories[categoryKey] && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left font-medium text-gray-700 w-10"></th>
                        <th className="p-2 text-left font-medium text-gray-700 min-w-20">
                          {t('dictionary.korean')}
                        </th>
                        <th className="p-2 text-left font-medium text-gray-700 min-w-32">
                          {t('dictionary.english')}
                        </th>
                        <th className="p-2 text-left font-medium text-gray-700 min-w-28">
                          {t('dictionary.thai')}
                        </th>
                        {isHalal && (
                          <th className="p-2 text-left font-medium text-gray-700 min-w-28">
                            <span className="flex items-center gap-1">
                              {t('dictionary.arabic')}
                              <span className="text-green-600 text-xs">☪</span>
                            </span>
                          </th>
                        )}
                        <th className="p-2 text-left font-medium text-gray-700 min-w-24">
                          {t('dictionary.us')}
                        </th>
                        <th className="p-2 text-left font-medium text-gray-700 min-w-16">
                          {t('dictionary.peakCode')}
                        </th>
                        <th className="p-2 text-left font-medium text-gray-700 min-w-16">
                          {t('dictionary.note')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.cuts.map((cut, idx) => {
                        const originalIndex = getOriginalCutIndex(categoryKey, cut);
                        return (
                          <tr key={idx} className="border-t border-gray-100 hover:bg-yellow-50 group">
                            <td className="p-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleEditClick(cut, categoryKey, originalIndex)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                              </Button>
                            </td>
                            <td className="p-2 font-medium text-gray-900">{cut.ko}</td>
                            <td className="p-2 text-gray-700">{cut.en}</td>
                            <td className="p-2 text-gray-700">{cut.th}</td>
                            {isHalal && (
                              <td className="p-2 text-gray-700">
                                <div className="text-right" dir="rtl">{cut.ar || '-'}</div>
                                {cut.arKo && <div className="text-xs text-gray-500 mt-0.5">{cut.arKo}</div>}
                              </td>
                            )}
                            <td className="p-2 text-blue-600 text-xs">{cut.us}</td>
                            <td className="p-2">
                              {cut.peakCode && (
                                <Link href={`/products?search=${cut.peakCode}`}>
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-blue-50"
                                  >
                                    {cut.peakCode}
                                  </Badge>
                                </Link>
                              )}
                            </td>
                            <td className="p-2 text-orange-600 text-xs">{cut.note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {totalFiltered === 0 && searchTerm && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>{t('dictionary.noResults', { term: searchTerm })}</p>
          </div>
        )}

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span> {t('dictionary.statistics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {(Object.entries(meatDataMap) as [MeatType, typeof meatDataMap.pork][]).map(
                ([key, meat]) => {
                  const count = Object.values(meat.categories).reduce(
                    (sum, cat) => sum + cat.cuts.length,
                    0
                  );
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${meat.color}15` }}
                    >
                      <div className="text-3xl mb-1">{meat.icon}</div>
                      <div className="text-2xl font-bold" style={{ color: meat.color }}>
                        {count}
                      </div>
                      <div className="text-xs text-gray-600">
                        {locale === 'ko'
                          ? meat.name.ko
                          : locale === 'th'
                          ? meat.name.th
                          : locale === 'my'
                          ? meat.name.my || meat.name.en
                          : meat.name.en}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="mt-4 text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
              <span className="text-sm text-gray-600">{t('dictionary.total')}: </span>
              <span className="text-3xl font-bold text-red-600">{stats.total}</span>
              <span className="text-sm text-gray-600 ml-1">{t('dictionary.cuts')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500 pb-4">
          Meet365 {t('dictionary.title')} v1.1 | {t('dictionary.integrated')}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCut && (
        <MeatCutEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingCut(null);
          }}
          cut={editingCut.cut}
          meatType={activeTab}
          categoryKey={editingCut.categoryKey}
          cutIndex={editingCut.cutIndex}
          isHalal={isHalal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
