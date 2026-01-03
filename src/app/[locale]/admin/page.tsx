'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import {
  ArrowLeft,
  Upload,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

const ADMIN_EMAIL = 'giujeong@meet365.net';
const COLLECTIONS = {
  PRODUCT_SPECS: 'productSpecs',
};

// 부위 마스터 데이터
const PART_MASTER: Record<string, { ko: string; th: string; my: string; en: string }> = {
  // 돼지
  '0001': { ko: '삼겹살(피부O)', th: 'สามชั้นหนัง', my: 'ဝက်ဗိုက်သား', en: 'Pork Belly (Skin)' },
  '0002': { ko: '삼겹살(피부X)', th: 'สามชั้นลอก', my: 'ဝက်ဗိုက်သား', en: 'Pork Belly (Skinless)' },
  '0003': { ko: '목살', th: 'สันคอ', my: 'ဝက်လည်ပင်းသား', en: 'Pork Collar' },
  '0004': { ko: '가브리살', th: 'คอเทียม', my: 'ဂါဘရီဆယ်', en: 'Gabrisal' },
  '0005': { ko: '항정살', th: 'คอแร่', my: 'ဝက်မေးရိုးသား', en: 'Pork Jowl' },
  '0006': { ko: '앞다리', th: 'ไหล่', my: 'ရှေ့ခြေထောက်', en: 'Pork Shoulder' },
  '0007': { ko: '뒷다리', th: 'สะโพก', my: 'နောက်ခြေထောက်', en: 'Pork Hip' },
  '0008': { ko: '등심', th: 'สันนอก', my: 'ဝက်ကျောသား', en: 'Pork Loin' },
  '0009': { ko: '안심', th: 'สันใน', my: 'ဝက်အတွင်းသား', en: 'Pork Tenderloin' },
  '0010': { ko: '다짐육', th: 'หมูบด', my: 'ဝက်သားကြိတ်', en: 'Minced Pork' },
  '0011': { ko: '갈비', th: 'ซี่โครง', my: 'ဝက်နံရိုး', en: 'Pork Ribs' },
  '0020': { ko: '껍데기', th: 'หนัง', my: 'အရေပြား', en: 'Pork Skin' },
  '0021': { ko: '볼살/가면', th: 'หน้ากาก', my: 'မျက်နှာ', en: 'Pork Mask' },
  '0022': { ko: '목뼈', th: 'เล้งหัว', my: 'လည်ပင်းအရိုး', en: 'Pork Neck Bone' },
  '0023': { ko: '앞족발', th: 'ขาหน้า', my: 'ရှေ့ခြေထောက်', en: 'Pork Front Feet' },
  '0027': { ko: '뒷다리(컷)', th: 'ขาหลังหั่น', my: 'နောက်ခြေထောက်', en: 'Hind Leg S/C' },
  '0028': { ko: '볼살', th: 'แก้มหมู', my: 'ပါးသား', en: 'Pork Cheek' },
  '0029': { ko: '폭찹', th: 'พอร์คช็อป', my: 'ဝက်သားအပိုင်း', en: 'Pork Chop' },
  // 소
  '0501': { ko: '립아이', th: 'ริบอาย', my: 'နံရိုးစပ်အသား', en: 'Ribeye' },
  '0502': { ko: '채끝', th: 'สันนอก', my: 'ကျောသား', en: 'Striploin' },
  '0503': { ko: '안심', th: 'สันใน', my: 'အတွင်းသား', en: 'Tenderloin' },
  '0504': { ko: '살치살', th: 'สันไหล่', my: 'ပခုံးသား', en: 'Chuck' },
  '0505': { ko: '안창살', th: 'บังลม', my: 'အပြင်သား', en: 'Outside Skirt' },
  '0506': { ko: '양지머리', th: 'หัวเสือ', my: 'ရင်ဘတ်သား', en: 'Brisket' },
  '0507': { ko: '업진살', th: 'หางเสือ', my: 'နံရိုးအောက်သား', en: 'Short Plate' },
  '0508': { ko: '부채살', th: 'ใบพาย', my: 'ပခုံးအသား', en: 'Top Blade' },
  '0511': { ko: '갈비(찜용)', th: 'ซี่โครงตุ๋น', my: 'နံရိုး', en: 'Short Ribs' },
  '0512': { ko: '안창살', th: 'พับนอก', my: 'အပြင်သား', en: 'Outside Skirt' },
  '0513': { ko: '토시살', th: 'ร่องซี่โครง', my: 'နံရိုးကြား', en: 'Rib Finger' },
  '0514': { ko: '우둔', th: 'พับใน', my: 'နောက်ပေါင်', en: 'Topround' },
  '0516': { ko: '설로인', th: 'ซอลออิน', my: 'ကျောသား', en: 'Sirloin' },
  '0520': { ko: '사태', th: 'หลังดี', my: 'ချောင်းသား', en: 'Meat for Soup' },
  '0521': { ko: '아롱사태', th: 'น่องลาย', my: 'ခြေသလုံး', en: 'Shank' },
  '0522': { ko: '도가니', th: 'ลูกมะพร้าว', my: 'ဒူးခေါင်း', en: 'Knuckle' },
  '0530': { ko: '사골', th: 'ขาตั้ง', my: 'အရိုး', en: 'Leg Bone' },
  '0533': { ko: '양지뼈', th: 'กระดูกเสือ', my: 'ရင်ဘတ်အရိုး', en: 'Brisket Bone' },
  '0535': { ko: '꼬리', th: 'หางวัว', my: 'အမြီး', en: 'Oxtail' },
  '0536': { ko: '혀', th: 'ลิ้นวัว', my: 'လျှာ', en: 'Beef Tongue' },
  '0538': { ko: '피칸야', th: 'พิคานย่า', my: 'ပိကန်ညာ', en: 'Picanha' },
};

// Peak 코드 파싱
function parsePeakCode(code: string) {
  if (!code || typeof code !== 'string') return null;
  const match = code.match(/^(\d)-([CF])([PBC])(\d{2})(\d{4})(.*)$/);
  if (!match) return null;
  return {
    tradeType: match[1],
    storage: match[2],
    species: match[3],
    supplierCode: match[4],
    partCode: match[5],
    variant: match[6]?.replace(/^-/, '') || null,
    baseCode: `${match[1]}-${match[2]}${match[3]}${match[4]}${match[5]}`,
  };
}

// Excel row를 ProductSpec으로 변환
function convertExcelRowToProduct(row: unknown[], index: number) {
  const code = String(row[1] || '');
  const type = String(row[2] || '');
  const unit = String(row[4] || 'Kg.');

  if (type !== 'Product') return null;

  const parsed = parsePeakCode(code);
  if (!parsed) return null;

  // Firestore 문서 ID로 사용 불가능한 문자 체크 (/, \, ., .., *, [ ])
  if (code.includes('/') || code.includes('\\')) return null;

  const partNames = PART_MASTER[parsed.partCode] || { ko: '', th: '', my: '', en: '' };
  const variantSuffix = parsed.variant ? ` ${parsed.variant}` : '';

  const names = {
    ko: partNames.ko + variantSuffix,
    th: partNames.th + variantSuffix,
    my: partNames.my + variantSuffix,
    en: partNames.en + variantSuffix,
  };

  return {
    id: code,
    peakCode: code,
    baseCode: parsed.baseCode,
    tradeType: parsed.tradeType,
    storage: parsed.storage,
    species: parsed.species,
    supplierCode: parsed.supplierCode,
    partCode: parsed.partCode,
    variant: parsed.variant,
    names,
    searchTerms: `${names.ko} ${names.th} ${names.en} ${code}`.toLowerCase(),
    aliases: [],
    specs: {},
    mediaCount: { crossSection: 0, defect: 0, processVideo: 0 },
    unit,
    isActive: true,
    sortOrder: index,
    createdBy: 'excel-import',
  };
}

interface ImportProgress {
  total: number;
  current: number;
  success: number;
  failed: number;
  status: 'idle' | 'loading' | 'importing' | 'done' | 'error';
  message: string;
}

export default function AdminPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [progress, setProgress] = useState<ImportProgress>({
    total: 0,
    current: 0,
    success: 0,
    failed: 0,
    status: 'idle',
    message: '',
  });
  const [existingCount, setExistingCount] = useState<number | null>(null);
  const [excelProducts, setExcelProducts] = useState<ReturnType<typeof convertExcelRowToProduct>[]>([]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const checkExistingProducts = async () => {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCT_SPECS), limit(1000));
      const snapshot = await getDocs(q);
      setExistingCount(snapshot.size);
    } catch (error) {
      console.error('Error checking existing products:', error);
    }
  };

  const handleImport = async () => {
    if (!isAdmin) return;

    setProgress({
      total: 0,
      current: 0,
      success: 0,
      failed: 0,
      status: 'loading',
      message: 'Loading products data...',
    });

    try {
      // Fetch products JSON
      const response = await fetch('/data/products.json');
      if (!response.ok) throw new Error('Failed to load products.json');

      const products = await response.json();

      setProgress(prev => ({
        ...prev,
        total: products.length,
        status: 'importing',
        message: `Importing ${products.length} products...`,
      }));

      let success = 0;
      let failed = 0;

      // Import in batches
      const batchSize = 50;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, Math.min(i + batchSize, products.length));

        await Promise.all(
          batch.map(async (product: Record<string, unknown>) => {
            try {
              const docRef = doc(db, COLLECTIONS.PRODUCT_SPECS, product.id as string);
              await setDoc(docRef, {
                ...product,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              success++;
            } catch (error) {
              console.error(`Failed to import ${product.peakCode}:`, error);
              failed++;
            }
          })
        );

        setProgress(prev => ({
          ...prev,
          current: Math.min(i + batchSize, products.length),
          success,
          failed,
          message: `Imported ${Math.min(i + batchSize, products.length)} / ${products.length}...`,
        }));
      }

      setProgress(prev => ({
        ...prev,
        status: 'done',
        message: `Import complete! Success: ${success}, Failed: ${failed}`,
      }));

      // Refresh count
      await checkExistingProducts();
    } catch (error) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Import failed',
      }));
    }
  };

  // Excel 파일 업로드 핸들러
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProgress({
      total: 0,
      current: 0,
      success: 0,
      failed: 0,
      status: 'loading',
      message: 'Reading Excel file...',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        // Row 10부터 데이터 시작 (0-indexed이므로 9)
        const products = [];
        for (let i = 9; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[1]) continue;
          const product = convertExcelRowToProduct(row, i - 9);
          if (product) products.push(product);
        }

        setExcelProducts(products);
        setProgress({
          total: products.length,
          current: 0,
          success: 0,
          failed: 0,
          status: 'idle',
          message: `${products.length}개 제품 파싱 완료. Import 버튼을 눌러주세요.`,
        });
      } catch (error) {
        setProgress(prev => ({
          ...prev,
          status: 'error',
          message: error instanceof Error ? error.message : 'Excel 파싱 실패',
        }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Excel 파싱된 데이터 Import
  const handleExcelImport = async () => {
    if (!isAdmin || excelProducts.length === 0) return;

    setProgress(prev => ({
      ...prev,
      status: 'importing',
      message: `Importing ${excelProducts.length} products...`,
    }));

    let success = 0;
    let failed = 0;

    const batchSize = 50;
    for (let i = 0; i < excelProducts.length; i += batchSize) {
      const batch = excelProducts.slice(i, Math.min(i + batchSize, excelProducts.length));

      await Promise.all(
        batch.map(async (product) => {
          if (!product) return;
          try {
            const docRef = doc(db, COLLECTIONS.PRODUCT_SPECS, product.id);
            await setDoc(docRef, {
              ...product,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            success++;
          } catch (error) {
            failed++;
          }
        })
      );

      setProgress(prev => ({
        ...prev,
        current: Math.min(i + batchSize, excelProducts.length),
        success,
        failed,
        message: `Imported ${Math.min(i + batchSize, excelProducts.length)} / ${excelProducts.length}...`,
      }));
    }

    setProgress(prev => ({
      ...prev,
      status: 'done',
      message: `Import 완료! 성공: ${success}, 실패: ${failed}`,
    }));

    setExcelProducts([]);
    await checkExistingProducts();
  };

  if (!isAdmin) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Admin only page</p>
            <Link href="/">
              <Button>{t('common.back')}</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center gap-4 px-4">
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-bold text-lg flex-1">Admin Panel</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container px-4 py-6 space-y-6">
          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Existing Products</span>
                <span className="font-mono">
                  {existingCount === null ? (
                    <Button variant="outline" size="sm" onClick={checkExistingProducts}>
                      Check
                    </Button>
                  ) : (
                    `${existingCount} products`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Import Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Peak Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import 896 products from Peak Excel to Firestore
              </p>

              {/* Progress */}
              {progress.status !== 'idle' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {progress.status === 'loading' || progress.status === 'importing' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : progress.status === 'done' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{progress.message}</span>
                  </div>

                  {progress.total > 0 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                  )}

                  {progress.status === 'done' && (
                    <div className="text-sm">
                      <span className="text-green-600">Success: {progress.success}</span>
                      {progress.failed > 0 && (
                        <span className="text-red-600 ml-4">Failed: {progress.failed}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={progress.status === 'loading' || progress.status === 'importing'}
                className="w-full"
              >
                {progress.status === 'loading' || progress.status === 'importing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Excel File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                새 Excel 파일 Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Peak 형식의 Excel 파일을 업로드하여 제품 데이터를 Import합니다.
              </p>

              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                disabled={progress.status === 'loading' || progress.status === 'importing'}
              />

              {excelProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    파싱된 제품: <span className="font-mono font-bold">{excelProducts.length}개</span>
                  </p>
                  <Button
                    onClick={handleExcelImport}
                    disabled={progress.status === 'loading' || progress.status === 'importing'}
                    className="w-full"
                  >
                    {progress.status === 'importing' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {excelProducts.length}개 제품 Import
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  View Products
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}
