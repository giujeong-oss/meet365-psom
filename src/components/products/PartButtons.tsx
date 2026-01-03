'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { Species, Locale } from '@/types';

// 부위 마스터 데이터 (Peak 코드 기준)
const PORK_PARTS = [
  { code: '0001', names: { ko: '삼겹살(피부O)', th: 'สามชั้นหนัง', en: 'Belly (Skin)', my: 'ဝက်ဗိုက်သား' } },
  { code: '0002', names: { ko: '삼겹살(피부X)', th: 'สามชั้นลอก', en: 'Belly (Skinless)', my: 'ဝက်ဗိုက်သား' } },
  { code: '0003', names: { ko: '목살', th: 'สันคอ', en: 'Collar', my: 'ဝက်လည်ပင်း' } },
  { code: '0004', names: { ko: '가브리살', th: 'คอเทียม', en: 'Gabrisal', my: 'ဝက်လည်ပင်း' } },
  { code: '0005', names: { ko: '항정살', th: 'คอแร่', en: 'Jowl', my: 'ဝက်မေးရိုး' } },
  { code: '0006', names: { ko: '앞다리', th: 'ไหล่', en: 'Shoulder', my: 'ဝက်ပခုံး' } },
  { code: '0007', names: { ko: '뒷다리', th: 'สะโพก', en: 'Hip', my: 'ဝက်တင်ပါး' } },
  { code: '0008', names: { ko: '등심', th: 'สันนอก', en: 'Loin', my: 'ဝက်ကျောသား' } },
  { code: '0009', names: { ko: '안심', th: 'สันใน', en: 'Tenderloin', my: 'ဝက်အတွင်းသား' } },
  { code: '0010', names: { ko: '다짐육', th: 'หมูบด', en: 'Minced', my: 'ကြိတ်သား' } },
  { code: '0011', names: { ko: '갈비', th: 'ซี่โครง', en: 'Ribs', my: 'ဝက်နံရိုး' } },
  { code: '0020', names: { ko: '껍데기', th: 'หนัง', en: 'Skin', my: 'ဝက်အရေ' } },
  { code: '0021', names: { ko: '볼살/가면', th: 'หน้ากาก', en: 'Mask', my: 'ဝက်မျက်နှာ' } },
  { code: '0022', names: { ko: '목뼈', th: 'เล้งหัว', en: 'Neck Bone', my: 'ဝက်လည်ရိုး' } },
  { code: '0023', names: { ko: '앞족발', th: 'ขาหน้า', en: 'Front Feet', my: 'ဝက်ခြေထောက်' } },
  { code: '0027', names: { ko: '뒷다리(컷)', th: 'ขาหลังหั่น', en: 'Hind Leg S/C', my: 'ဝက်နောက်ခြေ' } },
  { code: '0028', names: { ko: '볼살', th: 'แก้มหมู', en: 'Cheek', my: 'ဝက်ပါးသား' } },
  { code: '0029', names: { ko: '폭찹', th: 'พอร์คช็อป', en: 'Pork Chop', my: 'ဝက်အကြေး' } },
];

const BEEF_PARTS = [
  { code: '0501', names: { ko: '립아이', th: 'ริบอาย', en: 'Ribeye', my: 'အမဲနံရိုးသား' } },
  { code: '0502', names: { ko: '채끝', th: 'สันนอก', en: 'Striploin', my: 'အမဲကျောသား' } },
  { code: '0503', names: { ko: '안심', th: 'สันใน', en: 'Tenderloin', my: 'အမဲအတွင်းသား' } },
  { code: '0504', names: { ko: '살치살', th: 'สันไหล่', en: 'Chuck', my: 'အမဲပခုံးသား' } },
  { code: '0505', names: { ko: '안창살', th: 'บังลม', en: 'Outside Skirt', my: 'အမဲဗိုက်သား' } },
  { code: '0506', names: { ko: '양지머리', th: 'หัวเสือ', en: 'Brisket', my: 'အမဲရင်သား' } },
  { code: '0507', names: { ko: '업진살', th: 'หางเสือ', en: 'Short Plate', my: 'အမဲဗိုက်သား' } },
  { code: '0508', names: { ko: '부채살', th: 'ใบพาย', en: 'Top Blade', my: 'အမဲပခုံးသား' } },
  { code: '0511', names: { ko: '갈비(찜용)', th: 'ซี่โครงตุ๋น', en: 'Short Ribs', my: 'အမဲနံရိုး' } },
  { code: '0513', names: { ko: '토시살', th: 'ร่องซี่โครง', en: 'Rib Finger', my: 'အမဲနံရိုးကြား' } },
  { code: '0514', names: { ko: '우둔', th: 'พับใน', en: 'Topround', my: 'အမဲတင်ပါးသား' } },
  { code: '0516', names: { ko: '설로인', th: 'ซอลออิน', en: 'Sirloin', my: 'အမဲကျောသား' } },
  { code: '0520', names: { ko: '사태', th: 'หลังดี', en: 'Soup Meat', my: 'အမဲခြေသလုံး' } },
  { code: '0521', names: { ko: '아롱사태', th: 'น่องลาย', en: 'Shank', my: 'အမဲခြေသလုံး' } },
  { code: '0522', names: { ko: '도가니', th: 'ลูกมะพร้าว', en: 'Knuckle', my: 'အမဲဒူးခေါင်း' } },
  { code: '0530', names: { ko: '사골', th: 'ขาตั้ง', en: 'Leg Bone', my: 'အမဲအရိုး' } },
  { code: '0533', names: { ko: '양지뼈', th: 'กระดูกเสือ', en: 'Brisket Bone', my: 'အမဲရင်ရိုး' } },
  { code: '0535', names: { ko: '꼬리', th: 'หางวัว', en: 'Oxtail', my: 'အမဲအမြီး' } },
  { code: '0536', names: { ko: '혀', th: 'ลิ้นวัว', en: 'Tongue', my: 'အမဲလျှာ' } },
  { code: '0538', names: { ko: '피칸야', th: 'พิคานย่า', en: 'Picanha', my: 'အမဲတင်ပါး' } },
];

const CHICKEN_PARTS = [
  { code: '0701', names: { ko: '닭가슴살', th: 'อกไก่', en: 'Breast', my: 'ကြက်ရင်သား' } },
  { code: '0702', names: { ko: '닭다리', th: 'น่องไก่', en: 'Leg', my: 'ကြက်ခြေ' } },
  { code: '0703', names: { ko: '닭날개', th: 'ปีกไก่', en: 'Wing', my: 'ကြက်တောင်ပံ' } },
  { code: '0704', names: { ko: '통닭', th: 'ไก่ทั้งตัว', en: 'Whole', my: 'ကြက်တစ်ကောင်လုံး' } },
];

interface PartButtonsProps {
  species: Species | 'all';
  selectedPart: string | null;
  onPartSelect: (partCode: string | null) => void;
}

export default function PartButtons({ species, selectedPart, onPartSelect }: PartButtonsProps) {
  const locale = useLocale() as Locale;

  const getParts = () => {
    switch (species) {
      case 'P':
        return PORK_PARTS;
      case 'B':
        return BEEF_PARTS;
      case 'C':
        return CHICKEN_PARTS;
      default:
        return [...PORK_PARTS, ...BEEF_PARTS, ...CHICKEN_PARTS];
    }
  };

  const parts = getParts();

  return (
    <div className="space-y-2">
      {/* All 버튼 */}
      <Button
        variant={selectedPart === null ? 'default' : 'outline'}
        className="w-full justify-start h-10 text-sm"
        onClick={() => onPartSelect(null)}
      >
        All
      </Button>

      {/* 부위 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        {parts.map((part) => (
          <Button
            key={part.code}
            variant={selectedPart === part.code ? 'default' : 'outline'}
            className="justify-start text-left h-10 py-2 px-2"
            onClick={() => onPartSelect(part.code)}
          >
            <span className="truncate text-sm">
              {part.names[locale] || part.names.en}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// Export part data for use in other components
export { PORK_PARTS, BEEF_PARTS, CHICKEN_PARTS };
