/**
 * Peak 제품 데이터 Import 스크립트
 *
 * 사용법:
 * 1. node scripts/importPeakProducts.js --preview  (JSON 미리보기)
 * 2. node scripts/importPeakProducts.js --import   (Firestore에 등록)
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel file path
const EXCEL_PATH = 'H:\\공유 드라이브\\1P_Projects_โครงการ_프로젝트\\02 미트365 제품 스펙 통합관리 시스템 구축\\product code 제품코드\\product_report_export_as_of_20260101_20261231_20260103_090242.xlsx';

// 부위 마스터 데이터 (CLAUDE.md 기준)
const PART_MASTER = {
  // 돼지 (0001-0099)
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

  // 소 (0501-0699)
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

/**
 * Peak 코드 파싱
 * 예: 2-FP180001-2CM -> { tradeType: '2', storage: 'F', species: 'P', supplierCode: '18', partCode: '0001', variant: '2CM' }
 */
function parsePeakCode(code) {
  if (!code || typeof code !== 'string') return null;

  // 정규식: [거래유형]-[보관][축종][공급처2자리][부위4자리][변형옵션]
  const match = code.match(/^(\d)-([CF])([PBC])(\d{2})(\d{4})(.*)$/);
  if (!match) {
    // 변형이 있는 경우 (예: 1-CB050501W3.5)
    const matchWithVariant = code.match(/^(\d)-([CF])([PBC])(\d{2})(\d{4})([A-Za-z0-9.\-\/]+)?$/);
    if (matchWithVariant) {
      return {
        tradeType: matchWithVariant[1],
        storage: matchWithVariant[2],
        species: matchWithVariant[3],
        supplierCode: matchWithVariant[4],
        partCode: matchWithVariant[5],
        variant: matchWithVariant[6] || null,
        baseCode: `${matchWithVariant[1]}-${matchWithVariant[2]}${matchWithVariant[3]}${matchWithVariant[4]}${matchWithVariant[5]}`,
      };
    }
    return null;
  }

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

/**
 * 제품명에서 한글/태국어/영어 추출
 */
function parseProductName(name) {
  if (!name) return { ko: '', th: '', my: '', en: '' };

  const nameStr = String(name);

  // 태국어 추출
  const thMatch = nameStr.match(/[\u0E00-\u0E7F]+[0-9.\s]*/g);
  const th = thMatch ? thMatch.join(' ').trim() : '';

  // 영어 추출
  const enMatch = nameStr.match(/[A-Za-z]+(?:\s+[A-Za-z]+)*/g);
  const en = enMatch ? enMatch.filter(e => e.length > 1).join(' ').trim() : '';

  // 한글은 부위 마스터에서 가져오기
  const ko = '';

  return { ko, th, my: '', en };
}

/**
 * Excel 데이터를 ProductSpec 형식으로 변환
 */
function convertToProductSpec(row, index) {
  const code = row[1]; // Product/Service Code
  const type = row[2]; // Type
  const name = row[3]; // Product/Service Name
  const unit = row[4]; // Unit
  const description = row[5]; // Description

  // Product 타입만 처리
  if (type !== 'Product') return null;

  // 코드 파싱
  const parsed = parsePeakCode(code);
  if (!parsed) {
    console.warn(`[SKIP] Invalid code format: ${code}`);
    return null;
  }

  // 부위명 가져오기
  const partNames = PART_MASTER[parsed.partCode] || { ko: '', th: '', my: '', en: '' };

  // 제품명 파싱
  const parsedName = parseProductName(name);

  // 변형 정보 추가
  const variantSuffix = parsed.variant ? ` ${parsed.variant}` : '';

  // 최종 이름 생성
  const names = {
    ko: partNames.ko + variantSuffix,
    th: parsedName.th || (partNames.th + variantSuffix),
    my: partNames.my + variantSuffix,
    en: parsedName.en || (partNames.en + variantSuffix),
  };

  // ProductSpec 생성
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
    unit: unit || 'Kg.',
    isActive: true,
    sortOrder: index,
    createdBy: 'import-script',
  };
}

/**
 * 메인 함수
 */
async function main() {
  const args = process.argv.slice(2);
  const isPreview = args.includes('--preview');
  const isImport = args.includes('--import');

  if (!isPreview && !isImport) {
    console.log('Usage:');
    console.log('  node scripts/importPeakProducts.js --preview  (Preview JSON output)');
    console.log('  node scripts/importPeakProducts.js --import   (Import to Firestore)');
    return;
  }

  console.log('Reading Excel file...');
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 헤더 스킵 (Row 9가 헤더, Row 10부터 데이터)
  const products = [];
  const skipped = [];

  for (let i = 10; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[1]) continue;

    const product = convertToProductSpec(row, i - 10);
    if (product) {
      products.push(product);
    } else {
      skipped.push(row[1]);
    }
  }

  console.log(`\n=== Import Summary ===`);
  console.log(`Total rows: ${data.length - 10}`);
  console.log(`Valid products: ${products.length}`);
  console.log(`Skipped: ${skipped.length}`);

  // 축종별 통계
  const stats = {
    P: products.filter(p => p.species === 'P').length,
    B: products.filter(p => p.species === 'B').length,
    C: products.filter(p => p.species === 'C').length,
  };
  console.log(`\n=== By Species ===`);
  console.log(`Pork (P): ${stats.P}`);
  console.log(`Beef (B): ${stats.B}`);
  console.log(`Chicken (C): ${stats.C}`);

  // 거래유형별 통계
  const trade1 = products.filter(p => p.tradeType === '1').length;
  const trade2 = products.filter(p => p.tradeType === '2').length;
  console.log(`\n=== By Trade Type ===`);
  console.log(`Purchase (1-): ${trade1}`);
  console.log(`Sales (2-): ${trade2}`);

  if (isPreview) {
    // JSON 파일로 저장
    const outputPath = path.join(__dirname, 'products_preview.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`\n✅ Preview saved to: ${outputPath}`);

    // 샘플 출력
    console.log('\n=== Sample Products (First 5) ===');
    products.slice(0, 5).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.peakCode}`);
      console.log(`   Names: ${JSON.stringify(p.names)}`);
      console.log(`   Species: ${p.species}, Storage: ${p.storage}`);
    });
  }

  if (isImport) {
    console.log('\n🔥 Starting Firestore import...');

    // Firebase 초기화 (Admin SDK 대신 Client SDK 사용)
    const { initializeApp } = require('firebase/app');
    const { getFirestore, doc, setDoc, Timestamp } = require('firebase/firestore');

    const firebaseConfig = {
      apiKey: 'AIzaSyA4onlsnYxd1rdlvTnt9Fdf242IbIKiMX0',
      authDomain: 'meet365-12ce8.firebaseapp.com',
      projectId: 'meet365-12ce8',
      storageBucket: 'meet365-12ce8.firebasestorage.app',
      messagingSenderId: '721446238060',
      appId: '1:721446238060:web:58f86e649c972f811de549',
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Batch import
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const docRef = doc(db, 'productSpecs', product.peakCode);
        await setDoc(docRef, {
          ...product,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        successCount++;

        if (successCount % 50 === 0) {
          console.log(`Progress: ${successCount}/${products.length}`);
        }
      } catch (error) {
        console.error(`Error importing ${product.peakCode}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✅ Import completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
  }
}

main().catch(console.error);
