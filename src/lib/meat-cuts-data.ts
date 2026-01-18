// 육류 부위 명칭 사전 데이터
// Peak 코드와 한국어/영어/태국어/미얀마어/아랍어/미국식 명칭 매핑
// 소/닭은 할랄용 아랍어 포함

export interface MeatCut {
  peakCode?: string;           // Peak 부위코드 (있으면 연결)
  ko: string;                  // 한국어
  en: string;                  // 영어
  th: string;                  // 태국어
  my?: string;                 // 미얀마어
  ar?: string;                 // 아랍어 (할랄 - 소/닭만)
  us: string;                  // 미국식
  note?: string;               // 비고
  aliases?: string[];          // 별칭
}

export interface MeatCategory {
  name: {
    ko: string;
    en: string;
    th: string;
    my?: string;
    ar?: string;               // 아랍어
  };
  cuts: MeatCut[];
}

export type MeatType = 'pork' | 'beef' | 'chicken';

export interface MeatData {
  name: {
    ko: string;
    en: string;
    th: string;
    my?: string;
    ar?: string;               // 아랍어
  };
  color: string;
  icon: string;
  isHalal?: boolean;           // 할랄 여부
  categories: Record<string, MeatCategory>;
}

// 돼지 부위 데이터
export const porkData: MeatData = {
  name: { ko: '돼지', en: 'Pork', th: 'หมู', my: 'ဝက်သား' },
  color: '#E91E63',
  icon: '🐷',
  categories: {
    neck: {
      name: { ko: '목 (Neck/Collar)', en: 'Neck/Collar', th: 'คอ', my: 'လည်ပင်း' },
      cuts: [
        { peakCode: '0003', ko: '목살', en: 'Pork Collar / Boston Butt', th: 'คอหมู / สันคอ', my: 'ဝက်လည်ပင်းသား', us: 'Pork Butt', note: '구이 인기' },
        { peakCode: '0005', ko: '항정살', en: 'Pork Jowl / Cheek', th: 'คอแร่ / เนื้อติดแก้ม', my: 'ဝက်မေးရိုးသား', us: 'Jowl Bacon', note: '천겹살' },
        { peakCode: '0004', ko: '가브리살', en: 'Pork Top Blade', th: 'คอเทียม', my: 'ဝက်လည်ပင်းထိပ်သား', us: 'Neck Fillet', note: '등심덧살' },
        { ko: '목심', en: 'Pork Neck Heart', th: 'เนื้อหัวใจคอ', my: 'ဝက်လည်ပင်းအူ', us: 'Coppa', note: '이탈리아식' },
        { peakCode: '0022', ko: '목뼈', en: 'Pork Neck Bone', th: 'กระดูกคอหมู / เล้งหัว', my: 'ဝက်လည်ရိုး', us: 'Neck Bones', note: '국물용' },
        { ko: '목등뼈', en: 'Neck & Back Bone', th: 'กระดูกคอหลัง', my: 'ဝက်လည်ကျောရိုး', us: 'Neckbones' },
      ],
    },
    shoulder: {
      name: { ko: '어깨/앞다리 (Shoulder)', en: 'Shoulder', th: 'ไหล่', my: 'ပခုံး' },
      cuts: [
        { peakCode: '0006', ko: '앞다리살', en: 'Pork Shoulder', th: 'ไหล่หมู / สะโพกหน้า', my: 'ဝက်ပခုံးသား', us: 'Picnic Shoulder' },
        { ko: '앞사태', en: 'Fore Shank', th: 'น่องหน้า', my: 'ဝက်ရှေ့ခြေသလုံး', us: 'Front Hock' },
        { ko: '꾸리살', en: 'Arm Picnic', th: 'เนื้อไหล่ส่วนล่าง', my: 'ဝက်လက်သား', us: 'Arm Roast' },
        { ko: '부채살', en: 'Blade Steak', th: 'เนื้อใบพาย', my: 'ဝက်ယပ်သား', us: 'Blade Steak', note: '부채 모양' },
        { ko: '주걱살', en: 'Shoulder Tender', th: 'เนื้อไหล่นุ่ม', my: 'ဝက်ပခုံးနူးသား', us: 'Shoulder Tender' },
        { ko: '어깨등심', en: 'Shoulder Loin', th: 'สันไหล่', my: 'ဝက်ပခုံးကျောသား', us: 'Country Ribs' },
        { ko: '전지', en: 'Pork Picnic', th: 'ขาหน้า', my: 'ဝက်ရှေ့ခြေ', us: 'Picnic Ham', note: '앞다리 전체' },
        { ko: '앞무릎살', en: 'Front Knee', th: 'หัวเข่าหน้า', my: 'ဝက်ရှေ့ဒူး', us: 'Front Knee' },
      ],
    },
    loin: {
      name: { ko: '등/허리 (Loin)', en: 'Loin', th: 'สันหลัง', my: 'ကျောသား' },
      cuts: [
        { peakCode: '0008', ko: '등심', en: 'Pork Loin', th: 'สันนอก', my: 'ဝက်ကျောသား', us: 'Pork Loin', note: '돈가스용' },
        { peakCode: '0009', ko: '안심', en: 'Tenderloin', th: 'สันใน', my: 'ဝက်အတွင်းသား', us: 'Tenderloin', note: '가장 부드러움' },
        { ko: '등갈비', en: 'Baby Back Ribs', th: 'ซี่โครงหลัง', my: 'ဝက်ကျောနံရိုး', us: 'Baby Back Ribs', note: '폭립용' },
        { peakCode: '0029', ko: '폭찹', en: 'Pork Chop', th: 'พอร์คช็อป', my: 'ဝက်အကြေး', us: 'Pork Chop', note: '등심+뼈' },
        { ko: '돈마호크', en: 'Pork Tomahawk', th: 'พอร์คโทมาฮ็อค', my: 'ဝက်တိုမာဟော့ခ်', us: 'Tomahawk Chop' },
        { ko: '본인등심', en: 'Bone-in Loin', th: 'สันนอกติดกระดูก', my: 'ဝက်အရိုးပါကျောသား', us: 'Bone-in Loin' },
        { ko: '등심안심', en: 'Loin Eye', th: 'ไส้สันนอก', my: 'ဝက်ကျောသားအူ', us: 'Loin Eye' },
        { ko: '등지방', en: 'Back Fat', th: 'มันหลัง', my: 'ဝက်ကျောဆီ', us: 'Fatback', note: '라드용' },
        { ko: '티본', en: 'Pork T-Bone', th: 'ทีโบนหมู', my: 'ဝက်တီဘုန်း', us: 'Pork T-Bone', note: '등심+안심' },
      ],
    },
    belly: {
      name: { ko: '배/갈비 (Belly/Ribs)', en: 'Belly/Ribs', th: 'หน้าท้อง/ซี่โครง', my: 'ဗိုက်/နံရိုး' },
      cuts: [
        { peakCode: '0001', ko: '삼겹살(껍질O)', en: 'Belly Skin-on', th: 'สามชั้นหนัง', my: 'ဝက်ဗိုက်သား(အရေပါ)', us: 'Skin-on Belly', note: '인기 1위', aliases: ['오겹살'] },
        { peakCode: '0002', ko: '삼겹살(껍질X)', en: 'Belly Skinless', th: 'สามชั้นลอก', my: 'ဝက်ဗိုက်သား(အရေမပါ)', us: 'Skinless Belly', aliases: ['무피삼겹'] },
        { ko: '오겹살', en: 'Five Layer Belly', th: 'ห้าชั้น', my: 'ဝက်ဗိုက်သားငါးထပ်', us: '5-Layer Belly', note: '껍질 포함' },
        { ko: '대패삼겹', en: 'Shaved Belly', th: 'สามชั้นสไลซ์บาง', my: 'ဝက်ဗိုက်အပါးလွှာ', us: 'Shaved Belly' },
        { ko: '통삼겹', en: 'Whole Belly', th: 'สามชั้นทั้งชิ้น', my: 'ဝက်ဗိုက်တစ်ခုလုံး', us: 'Whole Belly' },
        { peakCode: '0011', ko: '갈비', en: 'Spare Ribs', th: 'ซี่โครงหมู', my: 'ဝက်နံရိုး', us: 'Spare Ribs' },
        { ko: '갈비살', en: 'Rib Meat', th: 'เนื้อซี่โครง', my: 'ဝက်နံရိုးသား', us: 'Rib Meat' },
        { ko: '갈매기살', en: 'Pork Skirt', th: 'เนื้อกะบังลม', my: 'ဝက်အဆုပ်သား', us: 'Diaphragm', note: '횡격막' },
        { ko: '늑간살', en: 'Rib Finger', th: 'เนื้อติดซี่โครง', my: 'ဝက်နံရိုးကြားသား', us: 'Rib Tips' },
        { ko: '세인트루이스', en: 'St. Louis Ribs', th: 'ซี่โครงเต็มชุด', my: 'စိန့်လူးဝစ်နံရိုး', us: 'St. Louis Style' },
        { ko: '립팁', en: 'Rib Tips', th: 'ปลายซี่โครง', my: 'နံရိုးထိပ်', us: 'Rib Tips' },
        { ko: '연골', en: 'Cartilage', th: 'กระดูกอ่อน', my: 'အရိုးပျော့', us: 'Soft Bone' },
      ],
    },
    ham: {
      name: { ko: '뒷다리/후지 (Ham/Leg)', en: 'Ham/Leg', th: 'ขาหลัง', my: 'နောက်ခြေ' },
      cuts: [
        { peakCode: '0007', ko: '뒷다리살', en: 'Pork Ham / Leg', th: 'ขาหลัง / สะโพก', my: 'ဝက်နောက်ခြေသား', us: 'Fresh Ham' },
        { ko: '볼기살', en: 'Pork Rump', th: 'เนื้อก้น', my: 'ဝက်တင်ပါးသား', us: 'Rump' },
        { ko: '설깃살', en: 'Sirloin Tip', th: 'เนื้อโคนขา', my: 'ဝက်ပေါင်ထိပ်သား', us: 'Sirloin Tip' },
        { ko: '도가니살', en: 'Knuckle Meat', th: 'เนื้อหัวเข่า', my: 'ဝက်ဒူးသား', us: 'Knuckle' },
        { ko: '홍두깨살', en: 'Eye Round', th: 'เนื้อตาขา', my: 'ဝက်ခြေလုံးသား', us: 'Eye Round' },
        { ko: '보섭살', en: 'Top Round', th: 'เนื้อพับใน', my: 'ဝက်အပေါ်ခြေသား', us: 'Inside Round' },
        { ko: '뒷사태', en: 'Hind Shank', th: 'น่องหลัง', my: 'ဝက်နောက်ခြေသလုံး', us: 'Hind Hock' },
        { ko: '후지', en: 'Whole Leg', th: 'ขาหลังทั้งชิ้น', my: 'ဝက်နောက်ခြေတစ်ခုလုံး', us: 'Whole Ham', note: '뒷다리 전체' },
        { peakCode: '0027', ko: '뒷다리(컷)', en: 'Hind Leg S/C', th: 'ขาหลังหั่น', my: 'ဝက်နောက်ခြေလှီးသား', us: 'Ham S/C' },
        { ko: '엉덩이살', en: 'Hip Meat', th: 'เนื้อสะโพก', my: 'ဝက်တင်ပါးသား', us: 'Hip Meat' },
      ],
    },
    offal: {
      name: { ko: '부산물/특수 (Offal)', en: 'Offal', th: 'เครื่องใน', my: 'အရေအသားအထွက်' },
      cuts: [
        { peakCode: '0020', ko: '껍데기', en: 'Pork Skin', th: 'หนังหมู', my: 'ဝက်အရေ', us: 'Pork Rind' },
        { peakCode: '0010', ko: '다짐육', en: 'Ground Pork', th: 'หมูบด', my: 'ဝက်ကြိတ်သား', us: 'Ground Pork' },
        { peakCode: '0023', ko: '앞족발', en: 'Front Feet', th: 'ขาหมูหน้า', my: 'ဝက်ရှေ့ခြေထောက်', us: 'Front Trotters', note: '콜라겐' },
        { ko: '뒷족발', en: 'Hind Feet', th: 'ขาหมูหลัง', my: 'ဝက်နောက်ခြေထောက်', us: 'Hind Trotters' },
        { peakCode: '0028', ko: '볼살', en: 'Cheek Meat', th: 'แก้มหมู', my: 'ဝက်ပါးသား', us: 'Cheek Meat' },
        { peakCode: '0021', ko: '가면/머리', en: 'Head/Mask', th: 'หน้ากาก / หัวหมู', my: 'ဝက်ခေါင်း', us: 'Head Meat' },
        { ko: '꼬리', en: 'Tail', th: 'หางหมู', my: 'ဝက်အမြီး', us: 'Pig Tail' },
        { ko: '귀', en: 'Ear', th: 'หูหมู', my: 'ဝက်နား', us: 'Pig Ear' },
        { ko: '혀', en: 'Tongue', th: 'ลิ้นหมู', my: 'ဝက်လျှာ', us: 'Tongue' },
        { ko: '간', en: 'Liver', th: 'ตับหมู', my: 'ဝက်အသည်း', us: 'Liver' },
        { ko: '심장', en: 'Heart', th: 'หัวใจหมู', my: 'ဝက်နှလုံး', us: 'Heart' },
        { ko: '콩팥', en: 'Kidney', th: 'ไตหมู', my: 'ဝက်ကျောက်ကပ်', us: 'Kidney' },
        { ko: '창자/곱창', en: 'Intestine', th: 'ไส้หมู', my: 'ဝက်အူ', us: 'Chitterlings' },
        { ko: '위/양', en: 'Stomach', th: 'กระเพาะหมู', my: 'ဝက်အစာအိမ်', us: 'Stomach' },
        { ko: '오소리감투', en: 'Uterus', th: 'มดลูกหมู', my: 'ဝက်သားအိမ်', us: 'Uterus' },
        { ko: '머릿고기', en: 'Head Meat', th: 'เนื้อหัว', my: 'ဝက်ခေါင်းသား', us: 'Head Cheese' },
        { ko: '두항정', en: 'Head Jowl', th: 'เนื้อติดหัว', my: 'ဝက်ခေါင်းမေးရိုးသား', us: 'Head Jowl' },
      ],
    },
  },
};

// 소 부위 데이터
// 소 부위 데이터 (할랄 - 아랍어 포함)
export const beefData: MeatData = {
  name: { ko: '소', en: 'Beef', th: 'เนื้อวัว', my: 'အမဲသား', ar: 'لحم بقر' },
  color: '#D32F2F',
  icon: '🐄',
  isHalal: true,
  categories: {
    chuck: {
      name: { ko: '목/어깨 (Chuck)', en: 'Chuck', th: 'คอ/ไหล่', my: 'လည်ပင်း/ပခုံး', ar: 'الرقبة/الكتف' },
      cuts: [
        { ko: '목심', en: 'Chuck Roll', th: 'เนื้อคอ / ชัค', my: 'အမဲလည်ပင်းသား', ar: 'لفة الرقبة', us: 'Chuck Roll' },
        { ko: '목등심', en: 'Chuck Eye Roll', th: 'ชักอายโรล', my: 'အမဲလည်ကျောသား', ar: 'عين الرقبة', us: 'Chuck Eye' },
        { peakCode: '0504', ko: '살치살', en: 'Chuck Flap Tail', th: 'เนื้อสันไหล่', my: 'အမဲပခုံးအစွန်သား', ar: 'ذيل الكتف', us: 'Chuck Flap', note: '꽃등심 옆' },
        { peakCode: '0508', ko: '부채살', en: 'Top Blade/Flat Iron', th: 'เนื้อใบพาย', my: 'အမဲယပ်သား', ar: 'شفرة علوية', us: 'Flat Iron', note: '2번째 부드러움' },
        { ko: '꾸리살', en: 'Petite Tender', th: 'เนื้อชิ้นเล็ก', my: 'အမဲအသေးသား', ar: 'لحم طري صغير', us: 'Petite Tender' },
        { ko: '앞다리살', en: 'Beef Clod', th: 'ไหล่วัว', my: 'အမဲပခုံးသား', ar: 'كتف البقر', us: 'Clod' },
        { ko: '갈비덧살', en: 'Chuck Short Rib', th: 'เนื้อซี่โครงคอ', my: 'အမဲနံရိုးထပ်သား', ar: 'ضلع قصير', us: 'Boneless Short Rib' },
        { ko: '알목심', en: 'Chuck Tender', th: 'ชักเทนเดอร์', my: 'အမဲလည်ပင်းနူးသား', ar: 'رقبة طرية', us: 'Chuck Tender', note: '가짜 안심' },
        { ko: '목삼각', en: 'Chuck Triangle', th: 'สามเหลี่ยมคอ', my: 'အမဲလည်ပင်းသုံးထောင့်', ar: 'مثلث الرقبة', us: 'Shoulder Clod' },
        { ko: '정강살', en: 'Shin Meat', th: 'เนื้อหน้าแข้ง', my: 'အမဲခြေလုံးသား', ar: 'لحم الساق', us: 'Shin' },
      ],
    },
    rib: {
      name: { ko: '등심/채끝 (Rib/Loin)', en: 'Rib/Loin', th: 'สันหลัง', my: 'ကျောသား', ar: 'الضلع/الخاصرة' },
      cuts: [
        { ko: '등심', en: 'Sirloin Area', th: 'สันนอก', my: 'အမဲကျောသား', ar: 'منطقة الخاصرة', us: 'Rib Section' },
        { ko: '꽃등심', en: 'Ribeye Roll', th: 'ริบอายโรล', my: 'အမဲကျောသားအလှ', ar: 'لفة العين', us: 'Ribeye Roll', note: '마블링 최고' },
        { peakCode: '0501', ko: '립아이', en: 'Ribeye Steak', th: 'ริบอายสเต็ก', my: 'အမဲနံရိုးစပ်သား', ar: 'ستيك العين', us: 'Ribeye', note: '스테이크 왕', aliases: ['꽃등심'] },
        { ko: '립아이캡', en: 'Ribeye Cap', th: 'แคปริบอาย', my: 'အမဲနံရိုးစပ်ထိပ်သား', ar: 'غطاء العين', us: 'Spinalis', note: '가장 맛있는' },
        { peakCode: '0502', ko: '채끝등심', en: 'Striploin', th: 'สตริปลอยน์', my: 'အမဲချောင်းကျောသား', ar: 'ستريب لوين', us: 'Strip Loin', note: 'NY Strip' },
        { peakCode: '0503', ko: '안심', en: 'Tenderloin', th: 'สันใน', my: 'အမဲအတွင်းသား', ar: 'فيليه', us: 'Tenderloin', note: '가장 부드러움' },
        { ko: '샤토브리앙', en: 'Chateaubriand', th: 'ชาโตบริยอง', my: 'ရှာတိုဘရီယန်', ar: 'شاتوبريان', us: 'Chateaubriand', note: '안심 중앙' },
        { ko: '피레미뇽', en: 'Filet Mignon', th: 'ฟิเลมิยอง', my: 'ဖီလေးမီညွန်', ar: 'فيليه مينيون', us: 'Filet Mignon' },
        { ko: '티본', en: 'T-Bone Steak', th: 'ทีโบนสเต็ก', my: 'တီဘုန်းစတိ', ar: 'ستيك تي بون', us: 'T-Bone', note: '등심+안심' },
        { ko: '포터하우스', en: 'Porterhouse', th: 'พอร์ตเตอร์เฮาส์', my: 'ပို့တာဟောက်စ်', ar: 'بورترهاوس', us: 'Porterhouse', note: '큰 T-Bone' },
        { ko: '본인채끝', en: 'Bone-in Strip', th: 'สตริปลอยน์ติดกระดูก', my: 'အရိုးပါချောင်းသား', ar: 'ستريب بالعظم', us: 'Bone-in Strip' },
        { ko: '토마호크', en: 'Tomahawk', th: 'โทมาฮ็อค', my: 'တိုမာဟော့ခ်', ar: 'توماهوك', us: 'Tomahawk', note: '뼈붙은 립아이' },
        { ko: '카우보이', en: 'Cowboy Steak', th: 'คาวบอย', my: 'ကောက်ဘွိုင်', ar: 'ستيك كاوبوي', us: 'Cowboy Ribeye' },
      ],
    },
    ribs: {
      name: { ko: '갈비 (Ribs)', en: 'Ribs', th: 'ซี่โครง', my: 'နံရိုး', ar: 'الأضلاع' },
      cuts: [
        { ko: '갈비살', en: 'Short Rib Meat', th: 'เนื้อซี่โครง', my: 'အမဲနံရိုးသား', ar: 'لحم الضلع القصير', us: 'Boneless Short Rib' },
        { ko: '꽃갈비', en: 'Bone-in Short Rib', th: 'ซี่โครงดอกไม้', my: 'အမဲပန်းနံရိုး', ar: 'ضلع بالعظم', us: 'Flanken Style', note: '갈비찜' },
        { ko: 'LA갈비', en: 'LA Style Rib', th: 'แอลเอซี่โครง', my: 'အယ်လ်အေနံရိုး', ar: 'ضلع على طريقة لوس أنجلوس', us: 'LA Kalbi', note: '얇게 횡단' },
        { peakCode: '0511', ko: '찜갈비', en: 'Braising Rib', th: 'ซี่โครงตุ๋น', my: 'အမဲနံရိုးပေါင်း', ar: 'ضلع للطبخ', us: 'English Cut', aliases: ['갈비(찜용)'] },
        { ko: '본갈비', en: 'Bone-in Rib', th: 'ซี่โครงติดกระดูก', my: 'အရိုးပါနံရိုး', ar: 'ضلع بالعظم', us: 'Standing Rib' },
        { peakCode: '0513', ko: '토시살', en: 'Rib Finger', th: 'ร่องซี่โครง', my: 'အမဲနံရိုးကြားသား', ar: 'أصابع الضلع', us: 'Finger Meat', note: '갈비뼈 사이' },
        { peakCode: '0505', ko: '안창살', en: 'Outside Skirt', th: 'บังลมนอก', my: 'အမဲပြင်ပအဆုပ်သား', ar: 'الحجاب الحاجز', us: 'Outside Skirt', note: '횡격막' },
        { ko: '제비추리', en: 'Hanger Steak', th: 'เนื้อกลีบดอก', my: 'အမဲဆွဲသား', ar: 'ستيك معلق', us: 'Hanger Steak', note: '1마리 1개' },
        { ko: '본삼겹', en: 'Plate Short Rib', th: 'ซี่โครงยาว', my: 'အရိုးပါဗိုက်သား', ar: 'ضلع الصفيحة', us: 'Plate Short Rib' },
        { ko: '등갈비', en: 'Back Ribs', th: 'ซี่โครงหลัง', my: 'အမဲကျောနံရိုး', ar: 'أضلاع الظهر', us: 'Beef Back Ribs' },
        { ko: '프라임립', en: 'Prime Rib', th: 'ไพรม์ริบ', my: 'ပရိုင်းရစ်', ar: 'ضلع ممتاز', us: 'Prime Rib' },
      ],
    },
    brisket: {
      name: { ko: '양지 (Brisket/Plate)', en: 'Brisket/Plate', th: 'หน้าอก', my: 'ရင်ဘတ်', ar: 'الصدر' },
      cuts: [
        { peakCode: '0506', ko: '양지머리', en: 'Brisket Point', th: 'หัวเสือ', my: 'အမဲရင်ထိပ်သား', ar: 'رأس الصدر', us: 'Point Cut', note: '마블링 풍부', aliases: ['차돌박이'] },
        { ko: '차돌박이', en: 'Brisket Flat', th: 'ชาดลบากิ', my: 'အမဲရင်သား', ar: 'صدر مسطح', us: 'Flat Cut', note: '얇게 슬라이스' },
        { ko: '차돌양지', en: 'Deckle Off', th: 'เนื้อชาดลยังจี', my: 'အမဲရင်ဆီသား', ar: 'صدر بدون دهن', us: 'Deckle Off' },
        { peakCode: '0507', ko: '업진살', en: 'Short Plate', th: 'หางเสือ', my: 'အမဲဗိုက်ပြားသား', ar: 'الصفيحة القصيرة', us: 'Navel End', note: '파히타용' },
        { ko: '업진안살', en: 'Inside Skirt', th: 'บังลมใน', my: 'အမဲအတွင်းအဆုပ်သား', ar: 'الحجاب الداخلي', us: 'Inside Skirt' },
        { ko: '치마살', en: 'Flank Steak', th: 'ชิมาซัล', my: 'အမဲခါးသား', ar: 'ستيك الخاصرة', us: 'Flank Steak' },
        { ko: '치마양지', en: 'Bavette', th: 'เนื้อหางท้อง', my: 'အမဲခါးရင်သား', ar: 'بافيت', us: 'Bavette' },
        { ko: '앞양지', en: 'Fore Brisket', th: 'หน้าอกหน้า', my: 'အမဲရှေ့ရင်သား', ar: 'صدر أمامي', us: 'Brisket Nose' },
        { ko: '뒷양지', en: 'Navel Brisket', th: 'หน้าอกหลัง', my: 'အမဲနောက်ရင်သား', ar: 'صدر خلفي', us: 'Navel' },
      ],
    },
    round: {
      name: { ko: '설도/우둔 (Round)', en: 'Round', th: 'ขาหลัง', my: 'နောက်ခြေ', ar: 'الفخذ' },
      cuts: [
        { peakCode: '0514', ko: '우둔살', en: 'Top Round', th: 'ท็อปราวด์', my: 'အမဲတင်ပါးသား', ar: 'فخذ علوي', us: 'Top Round', note: '육포용' },
        { ko: '홍두깨살', en: 'Eye Round', th: 'อายราวด์', my: 'အမဲခြေလုံးသား', ar: 'عين الفخذ', us: 'Eye Round' },
        { ko: '보섭살', en: 'Bottom Round', th: 'บอททอมราวด์', my: 'အမဲအောက်ခြေသား', ar: 'فخذ سفلي', us: 'Bottom Round' },
        { ko: '설깃살', en: 'Sirloin Tip', th: 'เนื้อโคนขา', my: 'အမဲပေါင်ထိပ်သား', ar: 'طرف الخاصرة', us: 'Sirloin Tip' },
        { peakCode: '0522', ko: '도가니', en: 'Knuckle', th: 'ลูกมะพร้าว', my: 'အမဲဒူးသား', ar: 'المفصل', us: 'Knuckle', note: '둥근 모양' },
        { peakCode: '0516', ko: '설로인', en: 'Top Sirloin', th: 'เซอร์ลอยน์', my: 'အမဲခါးကျောသား', ar: 'خاصرة علوية', us: 'Top Sirloin' },
        { ko: '삼각살', en: 'Tri-Tip', th: 'ไตรทิป', my: 'အမဲသုံးထောင့်သား', ar: 'مثلث الفخذ', us: 'Tri-Tip', note: '캘리포니아' },
        { peakCode: '0538', ko: '피칸야', en: 'Picanha', th: 'พิคานย่า', my: 'အမဲတင်ပါးထိပ်သား', ar: 'بيكانيا', us: 'Coulotte', note: '브라질' },
        { ko: '볼기살', en: 'Rump', th: 'เนื้อก้น', my: 'အမဲနင်္ဂါးသား', ar: 'الردف', us: 'Rump Roast' },
        { ko: '아롱살', en: 'Round Tip', th: 'เนื้อโคนขาปลาย', my: 'အမဲခြေထိပ်သား', ar: 'طرف الفخذ', us: 'Round Tip' },
      ],
    },
    shank: {
      name: { ko: '사태 (Shank)', en: 'Shank', th: 'น่อง', my: 'ခြေသလုံး', ar: 'الساق' },
      cuts: [
        { ko: '앞사태', en: 'Fore Shank', th: 'น่องหน้า', my: 'အမဲရှေ့ခြေသလုံး', ar: 'ساق أمامية', us: 'Fore Shank' },
        { ko: '뒷사태', en: 'Hind Shank', th: 'น่องหลัง', my: 'အမဲနောက်ခြေသလုံး', ar: 'ساق خلفية', us: 'Hind Shank' },
        { peakCode: '0521', ko: '아롱사태', en: 'Osso Buco', th: 'น่องลาย', my: 'အမဲခြေသလုံးလှီးသား', ar: 'أوسو بوكو', us: 'Osso Buco', note: '이탈리아식' },
        { peakCode: '0520', ko: '사태살', en: 'Shank Meat', th: 'หลังดี', my: 'အမဲခြေသလုံးသား', ar: 'لحم الساق', us: 'Shank Meat' },
        { ko: '아킬레스', en: 'Achilles', th: 'เอ็นร้อยหวาย', my: 'အမဲခြေဖနောင့်အူ', ar: 'وتر أخيل', us: 'Tendon' },
      ],
    },
    offal: {
      name: { ko: '부산물/특수 (Offal)', en: 'Offal', th: 'เครื่องใน', my: 'အရေအသားအထွက်', ar: 'الأحشاء' },
      cuts: [
        { peakCode: '0535', ko: '꼬리', en: 'Oxtail', th: 'หางวัว', my: 'အမဲအမြီး', ar: 'ذيل الثور', us: 'Oxtail', note: '꼬리곰탕' },
        { peakCode: '0536', ko: '혀', en: 'Tongue', th: 'ลิ้นวัว', my: 'အမဲလျှာ', ar: 'لسان', us: 'Tongue' },
        { peakCode: '0530', ko: '사골', en: 'Marrow Bone', th: 'ขาตั้ง', my: 'အမဲခြေရိုး', ar: 'عظم النخاع', us: 'Marrow Bone', note: '사골국' },
        { peakCode: '0533', ko: '양지뼈', en: 'Brisket Bone', th: 'กระดูกเสือ', my: 'အမဲရင်ရိုး', ar: 'عظم الصدر', us: 'Brisket Bone' },
        { ko: '등뼈', en: 'Spine', th: 'กระดูกสันหลัง', my: 'အမဲကျောရိုး', ar: 'العمود الفقري', us: 'Spine Bone', note: '감자탕' },
        { ko: '우족', en: 'Beef Feet', th: 'เท้าวัว', my: 'အမဲခြေထောက်', ar: 'أرجل البقر', us: 'Beef Feet' },
        { ko: '간', en: 'Liver', th: 'ตับวัว', my: 'အမဲအသည်း', ar: 'كبد', us: 'Liver' },
        { ko: '심장', en: 'Heart', th: 'หัวใจวัว', my: 'အမဲနှလုံး', ar: 'قلب', us: 'Heart' },
        { ko: '콩팥', en: 'Kidney', th: 'ไตวัว', my: 'အမဲကျောက်ကပ်', ar: 'كلية', us: 'Kidney' },
        { ko: '양(위)', en: 'Tripe', th: 'กระเพาะ', my: 'အမဲအစာအိမ်', ar: 'كرشة', us: 'Tripe' },
        { ko: '천엽', en: 'Book Tripe', th: 'ผ้าขี้ริ้ว', my: 'အမဲစာအိမ်တတိယ', ar: 'كرشة الكتاب', us: 'Book Tripe', note: '제3위' },
        { ko: '곱창', en: 'Small Intestine', th: 'ไส้เล็ก', my: 'အမဲအူသေး', ar: 'أمعاء دقيقة', us: 'Small Intestine' },
        { ko: '대창', en: 'Large Intestine', th: 'ไส้ใหญ่', my: 'အမဲအူကြီး', ar: 'أمعاء غليظة', us: 'Large Intestine' },
        { ko: '막창', en: 'Abomasum', th: 'กระเพาะที่ 4', my: 'အမဲစာအိမ်စတုတ္ထ', ar: 'المنفحة', us: 'Reed Tripe', note: '제4위' },
        { ko: '볼살', en: 'Cheek', th: 'แก้มวัว', my: 'အမဲပါးသား', ar: 'خد', us: 'Cheek Meat' },
        { ko: '다짐육', en: 'Ground Beef', th: 'เนื้อบด', my: 'အမဲကြိတ်သား', ar: 'لحم مفروم', us: 'Ground Beef' },
      ],
    },
    thai: {
      name: { ko: '태국 고유명칭', en: 'Thai Names', th: 'ชื่อไทย', my: 'ထိုင်းအမည်များ', ar: 'أسماء تايلاندية' },
      cuts: [
        { ko: '수아롱하이', en: 'Crying Tiger', th: 'เสือร้องไห้', my: 'ကျား ငိုသံ', ar: 'النمر الباكي', us: 'Flank Steak', note: '치마살류' },
        { ko: '이분도체', en: 'Half Carcass', th: 'ซีกวัว', my: 'အမဲတစ်ခြမ်း', ar: 'نصف الذبيحة', us: 'Side' },
        { ko: '사분도체', en: 'Quarter', th: 'เสี้ยววัว', my: 'အမဲလေးပုံတစ်ပုံ', ar: 'ربع الذبيحة', us: 'Quarter' },
      ],
    },
  },
};

// 닭 부위 데이터 (할랄 - 아랍어 포함)
export const chickenData: MeatData = {
  name: { ko: '닭', en: 'Chicken', th: 'ไก่', my: 'ကြက်သား', ar: 'دجاج' },
  color: '#FF9800',
  icon: '🐔',
  isHalal: true,
  categories: {
    whole: {
      name: { ko: '전체 (Whole)', en: 'Whole', th: 'ทั้งตัว', my: 'တစ်ကောင်လုံး', ar: 'كامل' },
      cuts: [
        { ko: '통닭', en: 'Whole Chicken', th: 'ไก่ทั้งตัว', my: 'ကြက်တစ်ကောင်လုံး', ar: 'دجاجة كاملة', us: 'Whole Chicken' },
        { ko: '반닭', en: 'Half Chicken', th: 'ไก่ครึ่งตัว', my: 'ကြက်တစ်ခြမ်း', ar: 'نصف دجاجة', us: 'Split Chicken' },
        { ko: '영계', en: 'Cornish Hen', th: 'ไก่อ่อน', my: 'ကြက်ပျို', ar: 'دجاج صغير', us: 'Cornish Game Hen', note: '어린 닭' },
        { ko: '노계', en: 'Stewing Hen', th: 'ไก่แก่', my: 'ကြက်အိုး', ar: 'دجاجة للطبخ', us: 'Stewing Chicken' },
        { ko: '삼계탕용', en: 'Samgyetang', th: 'ไก่ซัมเกทัง', my: 'ဆမ်ဂျစန်ကြက်', ar: 'دجاج سامجيتانج', us: 'Small Whole', note: '400-500g' },
      ],
    },
    breast: {
      name: { ko: '가슴 (Breast)', en: 'Breast', th: 'อก', my: 'ရင်ဘတ်', ar: 'صدر' },
      cuts: [
        { peakCode: '0701', ko: '가슴살', en: 'Breast', th: 'อกไก่', my: 'ကြက်ရင်သား', ar: 'صدر دجاج', us: 'Breast Meat', note: '백색육' },
        { ko: '안심(텐더)', en: 'Tender', th: 'สันในไก่', my: 'ကြက်အတွင်းသား', ar: 'فيليه دجاج', us: 'Tenderloin' },
        { ko: '가슴살(뼈O)', en: 'Bone-in Breast', th: 'อกไก่ติดกระดูก', my: 'အရိုးပါကြက်ရင်သား', ar: 'صدر بالعظم', us: 'Split Breast' },
        { ko: '가슴살(껍질O)', en: 'Skin-on Breast', th: 'อกไก่ติดหนัง', my: 'အရေပါကြက်ရင်သား', ar: 'صدر بالجلد', us: 'Skin-on Breast' },
        { ko: '가슴살(껍질X)', en: 'Skinless Breast', th: 'อกไก่ไม่ติดหนัง', my: 'အရေမပါကြက်ရင်သား', ar: 'صدر بدون جلد', us: 'BLSL Breast' },
        { ko: '슬라이스', en: 'Sliced Breast', th: 'อกไก่สไลซ์', my: 'ကြက်ရင်သားလွှာ', ar: 'صدر شرائح', us: 'Cutlet' },
        { ko: '수프렘', en: 'Supreme', th: 'ซูเปรม', my: 'ဆူပရင်', ar: 'سوبريم', us: 'Airline Breast', note: '날개뼈 부착' },
        { ko: '버터플라이', en: 'Butterfly', th: 'อกไก่ผีเสื้อ', my: 'လိပ်ပြာကြက်ရင်သား', ar: 'صدر فراشة', us: 'Butterfly Cut' },
      ],
    },
    leg: {
      name: { ko: '다리 (Leg)', en: 'Leg', th: 'ขา', my: 'ခြေ', ar: 'ساق' },
      cuts: [
        { peakCode: '0702', ko: '다리(전체)', en: 'Whole Leg', th: 'น่องไก่ทั้งชิ้น', my: 'ကြက်ခြေတစ်ခုလုံး', ar: 'ساق كاملة', us: 'Whole Leg' },
        { ko: '북채', en: 'Drumstick', th: 'น่องไก่', my: 'ကြက်ခြေသလုံး', ar: 'عصا الطبل', us: 'Drumstick', note: '정강이' },
        { ko: '허벅지살', en: 'Thigh', th: 'สะโพกไก่', my: 'ကြက်ပေါင်သား', ar: 'فخذ', us: 'Thigh', note: '적색육' },
        { ko: '허벅지(뼈X)', en: 'Boneless Thigh', th: 'สะโพกไก่ไม่ติดกระดูก', my: 'အရိုးမပါကြက်ပေါင်', ar: 'فخذ بدون عظم', us: 'BLSL Thigh' },
        { ko: '허벅지(껍질X)', en: 'Skinless Thigh', th: 'สะโพกไก่ไม่ติดหนัง', my: 'အရေမပါကြက်ပေါင်', ar: 'فخذ بدون جلد', us: 'Skinless Thigh' },
        { ko: '레그쿼터', en: 'Leg Quarter', th: 'ขาไก่แบ่งส่วน', my: 'ကြက်ခြေလေးပုံ', ar: 'ربع ساق', us: 'Leg Quarter' },
        { ko: '정육다리', en: 'Boneless Leg', th: 'ขาไก่ไม่ติดกระดูก', my: 'အရိုးမပါကြက်ခြေ', ar: 'ساق بدون عظم', us: 'Boneless Leg' },
        { ko: '오이스터', en: 'Oyster Meat', th: 'เนื้อหอยนางรม', my: 'ကမ္မသား', ar: 'لحم المحار', us: 'Oyster', note: '등뼈 옆' },
      ],
    },
    wing: {
      name: { ko: '날개 (Wing)', en: 'Wing', th: 'ปีก', my: 'တောင်ပံ', ar: 'جناح' },
      cuts: [
        { peakCode: '0703', ko: '날개(전체)', en: 'Whole Wing', th: 'ปีกไก่ทั้งชิ้น', my: 'ကြက်တောင်ပံတစ်ခုလုံး', ar: 'جناح كامل', us: 'Whole Wing', note: '3분절' },
        { ko: '윙봉', en: 'Drumette', th: 'ดรัมเมทต์', my: 'ကြက်တောင်ပံရင်း', ar: 'درومت', us: 'Drumette', note: '어깨쪽' },
        { ko: '윙플랫', en: 'Flat/Wingette', th: 'ปีกกลาง', my: 'ကြက်တောင်ပံလယ်', ar: 'جناح مسطح', us: 'Flat', note: '중간' },
        { ko: '윙팁', en: 'Wing Tip', th: 'ปลายปีก', my: 'ကြက်တောင်ပံထိပ်', ar: 'طرف الجناح', us: 'Wing Tip', note: '끝' },
        { ko: '2조인트', en: '2-Joint Wing', th: 'ปีก 2 ข้อ', my: 'ကြက်တောင်ပံ၂ဆစ်', ar: 'جناح مفصلين', us: 'Party Wing', note: '팁 제외' },
      ],
    },
    other: {
      name: { ko: '기타 (Other)', en: 'Other', th: 'อื่นๆ', my: 'အခြား', ar: 'أخرى' },
      cuts: [
        { ko: '등뼈/육수', en: 'Back/Carcass', th: 'กระดูกหลังไก่', my: 'ကြက်ကျောရိုး', ar: 'ظهر/هيكل', us: 'Back', note: '국물용' },
        { ko: '닭발', en: 'Feet', th: 'ตีนไก่', my: 'ကြက်ခြေထောက်', ar: 'أرجل', us: 'Paws', note: '콜라겐' },
        { ko: '닭목', en: 'Neck', th: 'คอไก่', my: 'ကြက်လည်ပင်း', ar: 'رقبة', us: 'Neck' },
        { ko: '닭껍질', en: 'Skin', th: 'หนังไก่', my: 'ကြက်အရေ', ar: 'جلد', us: 'Skin' },
        { ko: '닭꼬리', en: 'Tail', th: 'หางไก่', my: 'ကြက်အမြီး', ar: 'ذيل', us: 'Tail' },
        { ko: '무뼈닭발', en: 'Boneless Feet', th: 'ตีนไก่ไม่ติดกระดูก', my: 'အရိုးမပါကြက်ခြေထောက်', ar: 'أرجل بدون عظم', us: 'Deboned Paws' },
      ],
    },
    giblets: {
      name: { ko: '내장 (Giblets)', en: 'Giblets', th: 'เครื่องใน', my: 'အရေအသားအထွက်', ar: 'أحشاء' },
      cuts: [
        { ko: '닭똥집', en: 'Gizzard', th: 'กึ๋นไก่', my: 'ကြက်အူ', ar: 'قوانص', us: 'Gizzard' },
        { ko: '닭심장', en: 'Heart', th: 'หัวใจไก่', my: 'ကြက်နှလုံး', ar: 'قلب', us: 'Heart' },
        { ko: '닭간', en: 'Liver', th: 'ตับไก่', my: 'ကြက်အသည်း', ar: 'كبد', us: 'Liver' },
        { ko: '내장세트', en: 'Giblet Set', th: 'เครื่องในไก่', my: 'ကြက်အူအစုံ', ar: 'مجموعة الأحشاء', us: 'Giblets' },
      ],
    },
    processed: {
      name: { ko: '가공 (Processed)', en: 'Processed', th: 'แปรรูป', my: 'ပြုလုပ်ပြီးသား', ar: 'معالج' },
      cuts: [
        { ko: '다짐육', en: 'Ground Chicken', th: 'ไก่บด', my: 'ကြက်ကြိတ်သား', ar: 'دجاج مفروم', us: 'Ground Chicken' },
        { ko: '안심스트립', en: 'Tender Strip', th: 'สันในไก่แถบ', my: 'ကြက်အတွင်းသားချောင်း', ar: 'شرائح الفيليه', us: 'Tender Strip' },
        { ko: '커틀렛', en: 'Cutlet', th: 'ชิ้นไก่', my: 'ကြက်အကြော်', ar: 'كتلة', us: 'Cutlet' },
      ],
    },
  },
};

// 전체 데이터 내보내기
export const meatDataMap: Record<MeatType, MeatData> = {
  pork: porkData,
  beef: beefData,
  chicken: chickenData,
};

// Peak 코드로 부위 찾기
export function findCutByPeakCode(peakCode: string): { meatType: MeatType; category: string; cut: MeatCut } | null {
  for (const [meatType, meatData] of Object.entries(meatDataMap)) {
    for (const [categoryKey, category] of Object.entries(meatData.categories)) {
      const cut = category.cuts.find((c) => c.peakCode === peakCode);
      if (cut) {
        return { meatType: meatType as MeatType, category: categoryKey, cut };
      }
    }
  }
  return null;
}

// 검색 기능
export function searchMeatCuts(
  query: string,
  meatType?: MeatType
): Array<{ meatType: MeatType; category: string; cut: MeatCut }> {
  const results: Array<{ meatType: MeatType; category: string; cut: MeatCut }> = [];
  const lowerQuery = query.toLowerCase();

  const dataToSearch = meatType ? { [meatType]: meatDataMap[meatType] } : meatDataMap;

  for (const [type, meatData] of Object.entries(dataToSearch)) {
    for (const [categoryKey, category] of Object.entries(meatData.categories)) {
      for (const cut of category.cuts) {
        const searchableText = [
          cut.ko,
          cut.en,
          cut.th,
          cut.my || '',
          cut.us,
          cut.peakCode || '',
          ...(cut.aliases || []),
        ]
          .join(' ')
          .toLowerCase();

        if (searchableText.includes(lowerQuery)) {
          results.push({ meatType: type as MeatType, category: categoryKey, cut });
        }
      }
    }
  }

  return results;
}

// 통계 계산
export function getMeatStats(): { pork: number; beef: number; chicken: number; total: number } {
  const countCuts = (data: MeatData) =>
    Object.values(data.categories).reduce((sum, cat) => sum + cat.cuts.length, 0);

  const pork = countCuts(porkData);
  const beef = countCuts(beefData);
  const chicken = countCuts(chickenData);

  return { pork, beef, chicken, total: pork + beef + chicken };
}

// Peak 코드로 부위명 가져오기 (로케일 지원)
export function getPartNameByPeakCode(
  peakCode: string,
  locale: 'ko' | 'en' | 'th' | 'my' = 'ko'
): string | null {
  const result = findCutByPeakCode(peakCode);
  if (!result) return null;

  switch (locale) {
    case 'ko':
      return result.cut.ko;
    case 'en':
      return result.cut.en;
    case 'th':
      return result.cut.th;
    case 'my':
      return result.cut.my || result.cut.en;
    default:
      return result.cut.ko;
  }
}
