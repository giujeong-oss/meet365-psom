import { Timestamp } from 'firebase/firestore';

// ===== ProductSpec (제품 스펙 마스터) =====
export interface ProductSpec {
  // 식별 (Peak 코드 기준)
  id: string;
  peakCode: string;              // 2-FP180001-2CM
  baseCode: string;              // 2-FP180001

  // 분류 (Peak 코드에서 파싱)
  tradeType: '1' | '2';          // 1=구매, 2=판매
  storage: 'C' | 'F';            // Chilled/Frozen
  species: 'P' | 'B' | 'C';      // Pork/Beef/Chicken
  supplierCode: string;          // 18, 13, 05 등
  partCode: string;              // 0001, 0501 등
  variant?: string;              // 2CM, TI, T6 등

  // 다국어 이름
  names: LocalizedText;

  // 검색용
  searchTerms: string;
  aliases: string[];

  // 스펙 정보
  specs: ProductSpecs;

  // 품질 기준
  qualityStandards?: QualityStandards;

  // 미디어 참조
  referenceThumbnail?: string;
  mediaCount: MediaCount;

  // 연관 정보
  parentCode?: string;
  relatedCodes?: string[];
  linkedSuppliers?: string[];

  // 메타
  unit: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface LocalizedText {
  ko: string;
  th: string;
  my: string;
  en: string;
}

export interface ProductSpecs {
  weightRange?: {
    min: number;
    max: number;
    unit: 'kg' | 'g';
  };
  standardYield?: number;
  standardLossRate?: number;
  thickness?: number;
  shelfLife?: {
    days: number;
    temperature: number;
  };
}

export interface QualityStandards {
  grade?: string;
  acceptanceCriteria?: LocalizedText;
  marbling?: { min: number; max: number };
  fatThickness?: { min: number; max: number };
  color?: string;
}

export interface MediaCount {
  crossSection: number;
  defect: number;
  processVideo: number;
}

// ===== SpecMedia (제품 미디어) =====
export interface SpecMedia {
  id: string;
  peakCode: string;
  baseCode: string;

  // 분류
  type: MediaType;
  category: MediaCategory;

  // 파일 정보
  file: FileInfo;

  // 촬영 메타데이터
  metadata: MediaMetadata;

  // 품질 정보 (부적격 시)
  qualityInfo?: QualityInfo;

  // AI 학습용 태그
  tags: string[];
  aiLabels?: AILabels;

  // 메타
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
}

export type MediaType = 'cross_section' | 'appearance' | 'defect' | 'process_video' | 'reference';
export type MediaCategory = 'approved' | 'rejected' | 'reference' | 'training';

export interface FileInfo {
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number;
}

export interface MediaMetadata {
  capturedAt: Timestamp;
  capturedBy: string;
  lotNumber?: string;
  batchDate?: string;
  supplierBatch?: string;
}

export interface QualityInfo {
  defectType: string;
  defectDescription: LocalizedText;
  severity: 'minor' | 'major' | 'critical';
}

export interface AILabels {
  labels: string[];
  confidence: number[];
}

// ===== PartMaster (부위 마스터) =====
export interface PartMaster {
  id: string;
  species: 'P' | 'B' | 'C';

  names: LocalizedText;

  category: PartCategory;
  parentPart?: string;

  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export type PartCategory = 'primal' | 'subprimal' | 'variety' | 'bone' | 'offal';

// ===== SupplierMaster (공급처 마스터) =====
export interface SupplierMaster {
  id: string;

  names: Omit<LocalizedText, 'my'>;

  type: SupplierType;
  species: ('P' | 'B' | 'C')[];
  grades?: string[];

  isActive: boolean;
}

export type SupplierType = 'farm' | 'processor' | 'importer';

// ===== Form Input Types =====
export interface ProductSpecInput {
  peakCode: string;
  names: LocalizedText;
  specs?: Partial<ProductSpecs>;
  qualityStandards?: Partial<QualityStandards>;
  unit: string;
  aliases?: string[];
}

export interface SpecMediaInput {
  peakCode: string;
  type: MediaType;
  category: MediaCategory;
  file: File;
  tags?: string[];
  qualityInfo?: Partial<QualityInfo>;
  lotNumber?: string;
}

// ===== UI State Types =====
export type Species = 'P' | 'B' | 'C';
export type Storage = 'C' | 'F';
export type TradeType = '1' | '2';

export interface FilterState {
  species?: Species;
  storage?: Storage;
  partCode?: string;
  supplierCode?: string;
  searchQuery?: string;
}

// ===== Constants =====
export const SPECIES_NAMES: Record<Species, LocalizedText> = {
  P: { ko: '돼지', th: 'หมู', my: 'ဝက်', en: 'Pork' },
  B: { ko: '소', th: 'เนื้อ', my: 'အမဲ', en: 'Beef' },
  C: { ko: '닭', th: 'ไก่', my: 'ကြက်', en: 'Chicken' },
};

export const STORAGE_NAMES: Record<Storage, LocalizedText> = {
  C: { ko: '냉장', th: 'แช่เย็น', my: 'အအေး', en: 'Chilled' },
  F: { ko: '냉동', th: 'แช่แข็ง', my: 'အေးခဲ', en: 'Frozen' },
};

export const CATEGORY_COLORS: Record<MediaCategory, string> = {
  approved: '#22c55e',
  rejected: '#ef4444',
  reference: '#3b82f6',
  training: '#f59e0b',
};

export const SPECIES_COLORS: Record<Species, string> = {
  P: '#f472b6',
  B: '#dc2626',
  C: '#fbbf24',
};
