import { ExcelReader } from './engine/excel/excel.reader';
import { KeywordRunner } from './engine/core.runner';
import { ExcelValidator } from './engine/excel/excel.validator';
import { ReportManager } from './engine/report/report.manager';
import * as path from 'path';

async function main() {
    const excelPath = path.resolve(__dirname, '..', 'test-data', 'Master_Test_Suite.xlsx');
    
    console.log(`[Framework] Reading test data from: ${excelPath}`);

    const data = await ExcelReader.readTestData(excelPath);
    
    console.log("[Framework] Validating Excel data...");
    const errors = ExcelValidator.validate(data);
    if (errors.length > 0) {
        console.error("❌ VALIDATION FAILED! Please fix the following errors in your Excel file before running:");
        errors.forEach(err => console.error(`  - ${err}`));
        process.exit(1);
    }

    console.log("[Framework] Validation Passed. Starting Execution...");
    const { results, runDir } = await KeywordRunner.runTests(data);

    if (results.length > 0) {
        console.log("[Framework] Generating reports...");
        const htmlReportPath = ReportManager.generateHtmlReport(results, runDir);
        console.log(`[Framework] HTML Report saved to ${htmlReportPath}`);

        const backupPath = path.join(runDir, 'Master_Test_Suite_Backup.xlsx');
        // Update the original file
        await ReportManager.updateInputExcelWithResults(excelPath, results, excelPath);
        // Also save a backup to the run directory
        await ReportManager.updateInputExcelWithResults(excelPath, results, backupPath);
        
        console.log("[Framework] Done! Results saved to original Excel file and backup created.");
    } else {
        console.log("[Framework] Execution finished. No results to report.");
    }
}

main().catch(e => {
    console.error("Execution failed:", e);
});
