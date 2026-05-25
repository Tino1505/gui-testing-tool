import { ExcelReader } from './core/engine/excel/excel.reader';
import { ExcelValidator } from './core/engine/excel/excel.validator';
import { KeywordRunner } from './core/engine/core.runner';
import { ReportManager } from './core/engine/report/report.manager';
import { FrameworkConfig } from './config/framework.config';
import * as path from 'path';
import { pathToFileURL } from 'url';

async function main() {
    const excelPath = FrameworkConfig.PATHS.TEST_DATA;
    console.log(`Starting Test Execution...`);
    const relativeExcel = path.relative(process.cwd(), excelPath).replace(/\\/g, '/');
    console.log(`Reading Excel data from: ${relativeExcel}...`);

    // Parse arguments for sheet filter
    let targetSheetFilter: string | null = null;
    process.argv.forEach(val => {
        if (val.startsWith('--sheet=')) {
            targetSheetFilter = val.split('=')[1];
        }
    });

    const data = await ExcelReader.readTestData(excelPath);

    // Validate
    const errors = ExcelValidator.validate(data);
    if (errors.length > 0) {
        console.error("\x1b[31m==================================================================\x1b[0m");
        console.error("\x1b[31m  ✘ LỖI CẤU TRÚC EXCEL / DỮ LIỆU KIỂM THỬ (ABORTING RUN)\x1b[0m");
        console.error("\x1b[31m==================================================================\x1b[0m");
        errors.forEach(err => {
            console.error(`\x1b[33m ⚠️  ${err}\x1b[0m\n`);
        });
        console.error("\x1b[31m==================================================================\x1b[0m\n");
        process.exit(1);
    }

    // Run tests
    console.log(`Validation passed. Executing tests...`);
    const { results, runDir } = await KeywordRunner.runTests(data, targetSheetFilter);

    if (results.length > 0) {
        // Generate Report
        const htmlReportPath = ReportManager.generateHtmlReport(results, runDir);
        const relativeHtml = path.relative(process.cwd(), htmlReportPath).replace(/\\/g, '/');
        console.log(`HTML Report: ${relativeHtml}`);

        // Update Excel Backup
        const backupPath = path.join(runDir, 'Master_Test_Suite_Backup.xlsx');
        await ReportManager.updateInputExcelWithResults(excelPath, results, backupPath);
        console.log(`Execution completed.`);

        // Auto-open HTML Report
        const { exec } = require('child_process');
        exec(`start "" "${htmlReportPath}"`, (err: any) => {
            if (err) {
                // Ignore silent startup errors
            }
        });
    } else {
        console.log(`No tests were executed.`);
    }
}

main().catch(console.error);
