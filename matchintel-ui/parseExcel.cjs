const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = 'c:\\Users\\anikk\\OneDrive\\ドキュメント\\AI HR TECH\\Sales_Roles_Question_Bank_Template.xlsx';
const outputPath = 'c:\\Users\\anikk\\OneDrive\\ドキュメント\\AI HR TECH\\matchintel-ui\\src\\data\\questions.json';

try {
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log('Successfully extracted', data.length, 'questions to', outputPath);
} catch (error) {
  console.error('Error parsing Excel file:', error.message);
}
