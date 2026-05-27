import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { pathToFileURL } from 'url';

export class ReportManager {
    public static generateHtmlReport(results: any[], runDir: string): string {
        const total = results.length;
        const passed = results.filter(r => r.passed).length;
        const failed = total - passed;
        const htmlPath = path.join(runDir, 'Execution_Report.html');

        let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>GUI Testing Report</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa; color: #333; }
                h1 { text-align: center; color: #2c3e50; font-size: 28px; margin-bottom: 20px; font-weight: 700; }
                
                /* Summary Box */
                .summary { display: flex; justify-content: space-around; align-items: center; background: #e9ecef; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; font-size: 16px; }
                .summary .total { color: #333; }
                .summary .pass { color: #28a745; }
                .summary .fail { color: #dc3545; }
                .summary .time { color: #333; }
                
                /* Controls Row */
                .controls-row { display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 20px; }
                .btn-outline { background: transparent; color: #34495e; border: 2px solid #34495e; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
                .btn-outline:hover { background: #34495e; color: white; }
                
                /* Test Case Card */
                .tc-card { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 25px; overflow: hidden; border: 1px solid #e0e0e0; }
                
                /* TC Header */
                .tc-header { background: #34495e; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; cursor: pointer; transition: background-color 0.2s; user-select: none; }
                .tc-header:hover { background-color: #2c3e50; }
                .badge { padding: 5px 15px; border-radius: 4px; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
                .badge.pass { background-color: #2ecc71; color: white; }
                .badge.fail { background-color: #e74c3c; color: white; }
                .badge.sheet-badge { background-color: rgba(255, 255, 255, 0.15); color: #e9ecef; border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 500; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; margin-right: 8px; }
                
                /* Chevron Icon */
                .chevron-icon { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.2s ease; margin-right: 10px; flex-shrink: 0; }
                .tc-card.collapsed .chevron-icon { transform: rotate(-90deg); }
                
                /* TC Body */
                .tc-body { display: flex; padding: 15px; gap: 20px; transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.2s ease-in-out; max-height: 2000px; opacity: 1; overflow: hidden; }
                .tc-card.collapsed .tc-body { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; pointer-events: none; border-top: none; }
                
                /* Steps Table */
                .steps-container { flex: 1; overflow-x: auto; }
                table { width: 100%; border-collapse: collapse; font-size: 14px; }
                th, td { border: 1px solid #dee2e6; padding: 10px 12px; text-align: left; }
                th { background-color: #f8f9fa; color: #495057; font-weight: bold; }
                tr:nth-child(even) { background-color: #fcfcfc; }
                .text-pass { color: #28a745; font-weight: bold; }
                .text-fail { color: #dc3545; font-weight: bold; }
                
                /* Evidence Section */
                .evidence-container { width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; border-left: 1px dashed #ccc; padding-left: 20px; padding-top: 10px; }
                .evidence-title { font-size: 14px; color: #6c757d; margin-bottom: 10px; }
                .evidence-img { max-width: 100%; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; padding: 2px; cursor: pointer; transition: transform 0.2s; }
                .evidence-img:hover { transform: scale(1.05); }
            </style>
        </head>
        <body>
            <h1>GUI Testing Report</h1>
            <div class="summary">
                <span class="total">Total TC: ${total}</span>
                <span class="pass">Passed: ${passed}</span>
                <span class="fail">Failed: ${failed}</span>
                <span class="time">Time: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
            </div>
            
            <div class="controls-row">
                <button id="btn-toggle-all" class="btn-outline" onclick="toggleAll()">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="10" y1="14" x2="3" y2="21"></line></svg>
                    Expand All
                </button>
            </div>
        `;

        for (const tc of results) {
            const statusClass = tc.passed ? 'pass' : 'fail';
            const statusText = tc.passed ? 'PASS' : 'FAIL';

            let screenshotHtml = '<div style="color: #ccc; font-style: italic; margin-top: 20px;">No evidence</div>';
            if (tc.screenshot) {
                const relativePath = path.relative(runDir, tc.screenshot);
                screenshotHtml = `<a href="${relativePath}" target="_blank"><img class="evidence-img" src="${relativePath}" alt="Screenshot" /></a>`;
            }

            htmlContent += `
            <div class="tc-card collapsed">
                <div class="tc-header" onclick="toggleTestCase(this)">
                    <div style="display: flex; align-items: center;">
                        <svg class="chevron-icon" viewBox="0 0 24 24">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        <span>${tc.tc_id}: ${tc.summary}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="badge sheet-badge">${tc.sheet_name || 'TEST_CASE'}</span>
                        <span class="badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="tc-body">
                    <div class="steps-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Data</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            for (const step of tc.steps) {
                const stepStatusClass = step.passed ? 'text-pass' : 'text-fail';
                const stepStatusText = step.passed ? 'PASS' : 'FAIL';
                htmlContent += `
                                <tr>
                                    <td>${step.step}</td>
                                    <td><b>${step.action}</b></td>
                                    <td>${step.target || 'None'}</td>
                                    <td>${step.data || 'None'}</td>
                                    <td>${step.duration || '0.00s'}</td>
                                    <td class="${stepStatusClass}">${stepStatusText}</td>
                                    <td>${step.message || ''}</td>
                                </tr>
                `;
            }

            htmlContent += `
                            </tbody>
                        </table>
                    </div>
                    <div class="evidence-container">
                        <div class="evidence-title">Evidence</div>
                        ${screenshotHtml}
                    </div>
                </div>
            </div>
            `;
        }

        htmlContent += `
            <script>
                function toggleTestCase(header) {
                    header.closest('.tc-card').classList.toggle('collapsed');
                    updateToggleBtnState();
                }
                function toggleAll() {
                    const cards = document.querySelectorAll('.tc-card');
                    const anyExpanded = Array.from(cards).some(c => !c.classList.contains('collapsed'));
                    
                    if (anyExpanded) {
                        cards.forEach(c => c.classList.add('collapsed'));
                    } else {
                        cards.forEach(c => c.classList.remove('collapsed'));
                    }
                    updateToggleBtnState();
                }
                function updateToggleBtnState() {
                    const btn = document.getElementById('btn-toggle-all');
                    if (!btn) return;
                    const cards = document.querySelectorAll('.tc-card');
                    const anyExpanded = Array.from(cards).some(c => !c.classList.contains('collapsed'));
                    
                    if (anyExpanded) {
                        btn.innerHTML = \`
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 3 21 3 21 16"></polyline><line x1="21" y1="3" x2="3" y2="21"></line></svg>
                            Collapse All
                        \`;
                    } else {
                        btn.innerHTML = \`
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="10" y1="14" x2="3" y2="21"></line></svg>
                            Expand All
                        \`;
                    }
                }
                updateToggleBtnState();
            </script>
        </body>
        </html>
        `;

        fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
        return htmlPath;
    }

    public static async updateInputExcelWithResults(originalPath: string, results: any[], backupPath: string) {
        try {
            const XlsxPopulate = require('xlsx-populate');
            const workbook = await XlsxPopulate.fromFileAsync(originalPath);

            const resultsBySheet: { [key: string]: any[] } = {};
            for (const r of results) {
                const sName = r.sheet_name || 'TEST_CASE';
                if (!resultsBySheet[sName]) resultsBySheet[sName] = [];
                resultsBySheet[sName].push(r);
            }

            for (const sheetName of Object.keys(resultsBySheet)) {
                const sheetResults = resultsBySheet[sheetName];
                const tcSheet = workbook.sheet(sheetName);
                if (tcSheet) {
                    const headers: string[] = [];
                    const usedRange = tcSheet.usedRange();
                    let lastCol = 1;
                    if (usedRange) {
                        lastCol = usedRange.endCell().columnNumber();
                        for (let c = 1; c <= lastCol; c++) {
                            headers.push(String(tcSheet.cell(1, c).value() || "").trim());
                        }
                    }

                    const colIndices = {
                        testResult: headers.findIndex(h => h === '[o]_test_result' || h === 'Run Result') + 1,
                        observed: headers.findIndex(h => h === '[o]_observed' || h === 'Last Run Date' || h === 'LastRunDate') + 1,
                        duration: headers.findIndex(h => h === '[o]_duration_(s)') + 1,
                        screenshot: headers.findIndex(h => h === '[o]_screenshot') + 1
                    };

                    // Add columns if missing
                    if (colIndices.testResult === 0) {
                        lastCol++;
                        colIndices.testResult = lastCol;
                        tcSheet.cell(1, colIndices.testResult).value('[o]_test_result');
                    }
                    if (colIndices.observed === 0) {
                        lastCol++;
                        colIndices.observed = lastCol;
                        tcSheet.cell(1, colIndices.observed).value('[o]_observed');
                    }

                    const tcIdCellIndex = headers.findIndex(h => h === 'TC_ID' || h === 'tc-id') + 1;
                    const stepCellIndex = headers.findIndex(h => h === 'step') + 1;

                    if (tcIdCellIndex > 0 && stepCellIndex > 0) {
                        // First pass: Clear old results and map rows
                        const tcRowMap: { [key: string]: number } = {};
                        let currentTcId = "";

                        const lastRow = usedRange ? usedRange.endCell().rowNumber() : 1;
                        for (let r = 2; r <= lastRow; r++) {
                            // Clear previous outputs
                            if (colIndices.testResult > 0) tcSheet.cell(r, colIndices.testResult).value(null);
                            if (colIndices.observed > 0) tcSheet.cell(r, colIndices.observed).value(null);
                            if (colIndices.duration > 0) tcSheet.cell(r, colIndices.duration).value(null);
                            if (colIndices.screenshot > 0) tcSheet.cell(r, colIndices.screenshot).value(null);

                            const tcIdVal = String(tcSheet.cell(r, tcIdCellIndex).value() || "").trim();
                            if (tcIdVal) {
                                currentTcId = tcIdVal;
                            }

                            const stepVal = String(tcSheet.cell(r, stepCellIndex).value() || "").trim();
                            if (currentTcId && stepVal) {
                                tcRowMap[`${currentTcId}_${stepVal}`] = r;
                            }
                        }

                        // Second pass: Write step results directly to their rows
                        for (const r of sheetResults) {
                            let baseTcId = r.tc_id;
                            let prefix = "";
                            if (r.tc_id.includes('_Iter')) {
                                baseTcId = r.tc_id.split('_Iter')[0];
                                const iterNum = r.tc_id.split('_Iter')[1];
                                prefix = `[iter ${iterNum}] `;
                            }

                            for (const step of r.steps) {
                                const rowNum = tcRowMap[`${baseTcId}_${step.step}`];
                                if (rowNum) {
                                    const appendVal = (colIndex: number, val: string) => {
                                        if (colIndex > 0) {
                                            const cell = tcSheet.cell(rowNum, colIndex);
                                            const currentVal = cell.value() ? cell.value().toString() : "";
                                            cell.value(currentVal ? `${currentVal}\n${prefix}${val}` : `${prefix}${val}`);
                                            cell.style({ wrapText: true, verticalAlignment: 'top' });
                                        }
                                    };

                                    appendVal(colIndices.testResult, step.passed ? 'Passed' : 'Failed');
                                    appendVal(colIndices.observed, step.message || "Executed");
                                    appendVal(colIndices.duration, step.duration);
                                }
                            }

                            // Write screenshot ONLY to the last step of this TC run
                            if (r.screenshot && r.steps.length > 0) {
                                const lastStep = r.steps[r.steps.length - 1];
                                const rowNum = tcRowMap[`${baseTcId}_${lastStep.step}`];
                                if (rowNum && colIndices.screenshot > 0) {
                                    const cell = tcSheet.cell(rowNum, colIndices.screenshot);
                                    const currentVal = cell.value() ? cell.value().toString() : "";
                                    cell.value(currentVal ? `${currentVal}\n${prefix}${r.screenshot}` : `${prefix}${r.screenshot}`);
                                    cell.style({ wrapText: true, verticalAlignment: 'top' });
                                }
                            }
                        }
                    }
                }
            }

            await workbook.toFileAsync(backupPath);
            const relativeBackup = path.relative(process.cwd(), backupPath).replace(/\\/g, '/');
            console.log(`Excel Backup: ${relativeBackup}`);

            // Also try to overwrite the original Master_Test_Suite.xlsx
            try {
                await workbook.toFileAsync(originalPath);
                const relativeOriginal = path.relative(process.cwd(), originalPath).replace(/\\/g, '/');
                console.log(`Original Excel updated: ${relativeOriginal}`);
            } catch (err) {
                console.error(`[Warning] Could not update the original Excel file (it might be open). Results are safely saved in the backup path.`);
                console.error(err);
            }
        } catch (e) {
            console.error(`[Error] Failed to write Excel backup file:`, e);
        }
    }
}
