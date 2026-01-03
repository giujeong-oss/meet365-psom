import type { ProductSpec, SpecMedia } from '@/types';
import { Timestamp } from 'firebase/firestore';

// Mock timestamp for demo purposes
const mockTimestamp = {
  toDate: () => new Date(),
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
} as Timestamp;

export const mockProducts: ProductSpec[] = [
  {
    id: '2-FP180001-2CM',
    peakCode: '2-FP180001-2CM',
    baseCode: '2-FP180001',
    tradeType: '2',
    storage: 'F',
    species: 'P',
    supplierCode: '18',
    partCode: '0001',
    variant: '2CM',
    names: {
      ko: '삼겹살(피부O) 2CM',
      th: 'สามชั้นหนัง 2CM',
      my: 'ဝက်ဗိုက်သား 2CM',
      en: 'Pork Belly (Skin) 2CM',
    },
    searchTerms: '삼겹 오겹 belly สามชั้น',
    aliases: ['생삼겹', '오겹살'],
    specs: {
      weightRange: { min: 4, max: 6, unit: 'kg' },
      standardYield: 72,
      standardLossRate: 5,
      thickness: 20,
      shelfLife: { days: 180, temperature: -18 },
    },
    qualityStandards: {
      grade: 'A',
      acceptanceCriteria: {
        ko: '지방층 균일, 변색 없음',
        th: 'ชั้นไขมันสม่ำเสมอ ไม่มีสีผิดปกติ',
        my: 'အဆီလွှာ ညီညာခြင်း',
        en: 'Even fat layer, no discoloration',
      },
    },
    referenceThumbnail: undefined,
    mediaCount: { crossSection: 5, defect: 2, processVideo: 1 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 1,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FP180002',
    peakCode: '2-FP180002',
    baseCode: '2-FP180002',
    tradeType: '2',
    storage: 'F',
    species: 'P',
    supplierCode: '18',
    partCode: '0002',
    names: {
      ko: '삼겹살(피부X)',
      th: 'สามชั้นลอก',
      my: 'ဝက်ဗိုက်သား (အရေပြားမပါ)',
      en: 'Pork Belly (Skinless)',
    },
    searchTerms: '삼겹 belly สามชั้น',
    aliases: ['무피삼겹'],
    specs: {
      weightRange: { min: 3.5, max: 5.5, unit: 'kg' },
      standardYield: 75,
      standardLossRate: 4,
    },
    mediaCount: { crossSection: 8, defect: 3, processVideo: 2 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 2,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FP130003',
    peakCode: '2-FP130003',
    baseCode: '2-FP130003',
    tradeType: '2',
    storage: 'F',
    species: 'P',
    supplierCode: '13',
    partCode: '0003',
    names: {
      ko: '목살',
      th: 'สันคอ',
      my: 'ဝက်လည်ပင်းသား',
      en: 'Pork Collar',
    },
    searchTerms: '목살 collar สันคอ',
    aliases: ['목심'],
    specs: {
      weightRange: { min: 2, max: 3, unit: 'kg' },
      standardYield: 80,
      standardLossRate: 3,
    },
    mediaCount: { crossSection: 4, defect: 1, processVideo: 1 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 3,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FB050501',
    peakCode: '2-FB050501',
    baseCode: '2-FB050501',
    tradeType: '2',
    storage: 'F',
    species: 'B',
    supplierCode: '05',
    partCode: '0501',
    names: {
      ko: '립아이',
      th: 'ริบอาย',
      my: 'နံရိုးစပ်အသား',
      en: 'Ribeye',
    },
    searchTerms: '립아이 ribeye ริบอาย',
    aliases: ['꽃등심'],
    specs: {
      weightRange: { min: 3, max: 5, unit: 'kg' },
      standardYield: 85,
      standardLossRate: 2,
    },
    qualityStandards: {
      grade: 'W',
      marbling: { min: 3, max: 5 },
    },
    mediaCount: { crossSection: 10, defect: 4, processVideo: 2 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 10,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FB090506',
    peakCode: '2-FB090506',
    baseCode: '2-FB090506',
    tradeType: '2',
    storage: 'F',
    species: 'B',
    supplierCode: '09',
    partCode: '0506',
    names: {
      ko: '양지머리',
      th: 'หัวเสือ',
      my: 'ရင်ဘတ်သား',
      en: 'Brisket',
    },
    searchTerms: '양지 brisket หัวเสือ',
    aliases: ['차돌박이'],
    specs: {
      weightRange: { min: 4, max: 7, unit: 'kg' },
      standardYield: 70,
      standardLossRate: 6,
    },
    mediaCount: { crossSection: 6, defect: 2, processVideo: 1 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 11,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FB220511-T6',
    peakCode: '2-FB220511-T6',
    baseCode: '2-FB220511',
    tradeType: '2',
    storage: 'F',
    species: 'B',
    supplierCode: '22',
    partCode: '0511',
    variant: 'T6',
    names: {
      ko: '갈비(찜용) 6등분',
      th: 'ซี่โครงตุ๋น 6 ชิ้น',
      my: 'နံရိုး ၆ပိုင်း',
      en: 'Short Ribs 6-cut',
    },
    searchTerms: '갈비 ribs ซี่โครง',
    aliases: ['LA갈비', '찜갈비'],
    specs: {
      weightRange: { min: 1, max: 1.5, unit: 'kg' },
      standardYield: 65,
      standardLossRate: 8,
    },
    mediaCount: { crossSection: 3, defect: 1, processVideo: 1 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 12,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-CP180003-1CM',
    peakCode: '2-CP180003-1CM',
    baseCode: '2-CP180003',
    tradeType: '2',
    storage: 'C',
    species: 'P',
    supplierCode: '18',
    partCode: '0003',
    variant: '1CM',
    names: {
      ko: '목살 1CM (냉장)',
      th: 'สันคอ 1CM (แช่เย็น)',
      my: 'ဝက်လည်ပင်းသား 1CM',
      en: 'Pork Collar 1CM (Chilled)',
    },
    searchTerms: '목살 냉장 chilled',
    aliases: [],
    specs: {
      standardYield: 82,
      thickness: 10,
      shelfLife: { days: 14, temperature: 2 },
    },
    mediaCount: { crossSection: 2, defect: 0, processVideo: 0 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 20,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
  {
    id: '2-FC180001',
    peakCode: '2-FC180001',
    baseCode: '2-FC180001',
    tradeType: '2',
    storage: 'F',
    species: 'C',
    supplierCode: '18',
    partCode: '0001',
    names: {
      ko: '닭다리',
      th: 'น่องไก่',
      my: 'ကြက်ပေါင်',
      en: 'Chicken Leg',
    },
    searchTerms: '닭다리 leg น่อง',
    aliases: ['통다리'],
    specs: {
      weightRange: { min: 0.2, max: 0.3, unit: 'kg' },
      standardYield: 90,
    },
    mediaCount: { crossSection: 2, defect: 1, processVideo: 0 },
    unit: 'Kg.',
    isActive: true,
    sortOrder: 30,
    createdAt: mockTimestamp,
    updatedAt: mockTimestamp,
    createdBy: 'system',
  },
];

// Mock media data
export const mockMedia: Record<string, SpecMedia[]> = {
  '2-FP180001-2CM': [
    {
      id: 'media-1',
      peakCode: '2-FP180001-2CM',
      baseCode: '2-FP180001',
      type: 'cross_section',
      category: 'approved',
      file: {
        url: '',
        fileName: 'belly_approved_1.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
      },
      metadata: {
        capturedAt: mockTimestamp,
        capturedBy: 'user1',
        lotNumber: 'LOT-2024-001',
      },
      tags: ['marbling_3', 'fat_normal', 'color_good'],
      isApproved: true,
      createdAt: mockTimestamp,
      createdBy: 'user1',
    },
    {
      id: 'media-2',
      peakCode: '2-FP180001-2CM',
      baseCode: '2-FP180001',
      type: 'cross_section',
      category: 'approved',
      file: {
        url: '',
        fileName: 'belly_approved_2.jpg',
        fileSize: 980000,
        mimeType: 'image/jpeg',
      },
      metadata: {
        capturedAt: mockTimestamp,
        capturedBy: 'user1',
      },
      tags: ['marbling_4'],
      isApproved: true,
      createdAt: mockTimestamp,
      createdBy: 'user1',
    },
    {
      id: 'media-3',
      peakCode: '2-FP180001-2CM',
      baseCode: '2-FP180001',
      type: 'defect',
      category: 'rejected',
      file: {
        url: '',
        fileName: 'belly_defect_1.jpg',
        fileSize: 890000,
        mimeType: 'image/jpeg',
      },
      metadata: {
        capturedAt: mockTimestamp,
        capturedBy: 'user2',
        lotNumber: 'LOT-2024-002',
      },
      qualityInfo: {
        defectType: 'discoloration',
        defectDescription: {
          ko: '변색 발견',
          th: 'พบสีผิดปกติ',
          my: 'အရောင်ပြောင်းလဲမှု',
          en: 'Discoloration found',
        },
        severity: 'major',
      },
      tags: ['defect_color', 'reject'],
      isApproved: false,
      createdAt: mockTimestamp,
      createdBy: 'user2',
    },
    {
      id: 'media-4',
      peakCode: '2-FP180001-2CM',
      baseCode: '2-FP180001',
      type: 'reference',
      category: 'reference',
      file: {
        url: '',
        fileName: 'belly_reference.jpg',
        fileSize: 1200000,
        mimeType: 'image/jpeg',
      },
      metadata: {
        capturedAt: mockTimestamp,
        capturedBy: 'admin',
      },
      tags: ['standard', 'reference'],
      isApproved: true,
      createdAt: mockTimestamp,
      createdBy: 'admin',
    },
  ],
};

// Get mock media for a product
export function getMockMedia(peakCode: string): SpecMedia[] {
  return mockMedia[peakCode] || [];
}

// Get mock product by ID
export function getMockProduct(peakCode: string): ProductSpec | undefined {
  return mockProducts.find((p) => p.peakCode === peakCode);
}

// Filter function
export function filterProducts(
  products: ProductSpec[],
  species?: 'P' | 'B' | 'C' | 'all',
  storage?: 'C' | 'F' | 'all',
  searchQuery?: string
): ProductSpec[] {
  return products.filter((product) => {
    // Species filter
    if (species && species !== 'all' && product.species !== species) {
      return false;
    }

    // Storage filter
    if (storage && storage !== 'all' && product.storage !== storage) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        product.peakCode,
        product.names.ko,
        product.names.th,
        product.names.en,
        product.searchTerms,
        ...product.aliases,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}
