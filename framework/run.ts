import { ExcelReader } from './core/engine/excel/excel.reader';
import { ExcelValidator } from './core/engine/excel/excel.validator';
import { KeywordRunner } from './core/engine/core.runner';
import { ReportManager } from './core/engine/report/report.manager';
import * as path from 'path';

async function main() {
    const excelPath = path.join(__dirname, '..', 'test-data', 'Master_Test_Suite.xlsx');
    console.log(`Starting Test Execution...`);
    console.log(`Reading Excel data from ${excelPath}...`);
    
    const data = await ExcelReader.readTestData(excelPath);
    
    // Validate
    const errors = ExcelValidator.validate(data);
    if (errors.length > 0) {
        console.error("Validation Errors found in Excel. Aborting execution:");
        errors.forEach(err => console.error(err));
        process.exit(1);
    }
    
    // Run tests
    console.log(`Validation passed. Executing tests...`);
    const { results, runDir } = await KeywordRunner.runTests(data);
    
    if (results.length > 0) {
        // Generate Report
        const htmlReportPath = ReportManager.generateHtmlReport(results, runDir);
        console.log(`HTML Report generated at: ${htmlReportPath}`);
        
        // Update Excel Backup
        const backupPath = path.join(runDir, 'Master_Test_Suite_Backup.xlsx');
        await ReportManager.updateInputExcelWithResults(excelPath, results, backupPath);
        console.log(`Execution completed.`);
    } else {
        console.log(`No tests were executed.`);
    }
}

main().catch(console.error);
