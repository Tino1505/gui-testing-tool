import * as ExcelJS from 'exceljs';
import * as path from 'path';

async function main() {
    const excelPath = path.resolve(__dirname, '..', 'test-data', 'Master_Test_Suite.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const elementSheet = workbook.getWorksheet('ELEMENT');
    if (elementSheet) {
        const headers = elementSheet.getRow(1).values as string[];
        console.log("Headers of ELEMENT sheet:", headers);
        
        // Print first 5 rows to see sample data
        console.log("Sample Data:");
        for(let i = 2; i <= 6; i++) {
            const row = elementSheet.getRow(i).values as string[];
            console.log(row);
        }
    } else {
        console.log("No ELEMENT sheet");
    }
}
main();
