const XLSX = require('xlsx');
const path = require('path');

// Excel file path
const excelPath = 'H:\\공유 드라이브\\1P_Projects_โครงการ_프로젝트\\02 미트365 제품 스펙 통합관리 시스템 구축\\product code 제품코드\\product_report_export_as_of_20260101_20261231_20260103_090242.xlsx';

try {
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile(excelPath);

  // Read first sheet
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

  console.log('\n=== Finding Column Headers ===');
  // Look for the row with actual column headers (usually contains "Code" or "Product")
  for (let i = 0; i < 15; i++) {
    console.log(`Row ${i}:`, data[i]);
  }

  console.log('\n=== Total Rows ===');
  console.log(data.length, 'rows total');

} catch (error) {
  console.error('Error:', error.message);
}
