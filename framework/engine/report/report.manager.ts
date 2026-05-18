import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

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
                
                /* Buttons Row */
                .buttons-row { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; }
                .btn { padding: 10px 20px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .btn-excel { background-color: #2ecc71; }
                .btn-html { background-color: #3498db; }
                .btn-pdf { background-color: #9b59b6; }
                
                /* Test Case Card */
                .tc-card { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 25px; overflow: hidden; border: 1px solid #e0e0e0; }
                
                /* TC Header */
                .tc-header { background: #34495e; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 16px; }
                .badge { padding: 5px 15px; border-radius: 4px; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
                .badge.pass { background-color: #2ecc71; color: white; }
                .badge.fail { background-color: #e74c3c; color: white; }
                
                /* TC Body */
                .tc-body { display: flex; padding: 15px; gap: 20px; }
                
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
            <div class="tc-card">
                <div class="tc-header">
                    <span>${tc.tc_id}: ${tc.summary}</span>
                    <span class="badge ${statusClass}">${statusText}</span>
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
        </body>
        </html>
        `;

        fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
        return htmlPath;
    }

    public static async updateInputExcelWithResults(originalPath: string, results: any[], backupPath: string) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(originalPath);

            const tcSheet = workbook.getWorksheet('TEST_CASE');
            if (tcSheet) {
                const headers = tcSheet.getRow(1).values as string[];
                const colIndices = {
                    testResult: headers.findIndex(h => h === '[o]_test_result' || h === 'Run Result'),
                    observed: headers.findIndex(h => h === '[o]_observed' || h === 'Last Run Date' || h === 'LastRunDate'),
                    duration: headers.findIndex(h => h === '[o]_duration_(s)'),
                    screenshot: headers.findIndex(h => h === '[o]_screenshot')
                };

                // Add columns if missing
                if (colIndices.testResult === -1) {
                    colIndices.testResult = headers.length;
                    tcSheet.getCell(1, colIndices.testResult).value = '[o]_test_result';
                }
                if (colIndices.observed === -1) {
                    colIndices.observed = headers.length + 1; // offset by 1 because we just added testResult
                    tcSheet.getCell(1, colIndices.observed).value = '[o]_observed';
                }

                const tcStatusMap: any = {};
                for (const r of results) {
                    let baseTcId = r.tc_id;
                    let prefix = "";
                    if (r.tc_id.includes('_Iter')) {
                        baseTcId = r.tc_id.split('_Iter')[0];
                        const iterNum = r.tc_id.split('_Iter')[1];
                        prefix = `[iter ${iterNum}] `;
                    }
                    
                    if (!tcStatusMap[baseTcId]) tcStatusMap[baseTcId] = { passes: [], duration: [], screenshot: [], observed: [] };
                    
                    tcStatusMap[baseTcId].passes.push(`${prefix}${r.passed ? 'PASS' : 'FAIL'}`);
                    tcStatusMap[baseTcId].duration.push(`${prefix}${r.duration}`);
                    
                    if (r.screenshot) {
                        tcStatusMap[baseTcId].screenshot.push(`${prefix}${r.screenshot}`);
                    }
                    
                    const lastStep = r.steps.length > 0 ? r.steps[r.steps.length - 1] : null;
                    const observedMsg = lastStep ? lastStep.message : "Executed";
                    tcStatusMap[baseTcId].observed.push(`${prefix}${observedMsg}`);
                }

                const today = new Date().toISOString().split('T')[0];

                const tcIdCellIndex = headers.findIndex(h => h === 'TC_ID' || h === 'tc-id');
                if (tcIdCellIndex !== -1) {
                    // First pass: find the last row for each TC
                    const tcEndRowMap: { [tcId: string]: number } = {};
                    let currentTcId = "";
                    tcSheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        
                        // Clear previous outputs to ensure clean report
                        if (colIndices.testResult > -1) row.getCell(colIndices.testResult).value = null;
                        if (colIndices.observed > -1) row.getCell(colIndices.observed).value = null;
                        if (colIndices.duration > -1) row.getCell(colIndices.duration).value = null;
                        if (colIndices.screenshot > -1) row.getCell(colIndices.screenshot).value = null;

                        const tcIdVal = row.getCell(tcIdCellIndex).value?.toString().trim();
                        if (tcIdVal) {
                            currentTcId = tcIdVal;
                        }
                        if (currentTcId) {
                            tcEndRowMap[currentTcId] = rowNumber;
                        }
                    });

                    // Second pass: write results to the last row of each TC
                    tcSheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        const endTcId = Object.keys(tcEndRowMap).find(id => tcEndRowMap[id] === rowNumber);
                        
                        if (endTcId && tcStatusMap[endTcId]) {
                            
                            if (colIndices.testResult > -1) {
                                const cell = row.getCell(colIndices.testResult);
                                cell.value = tcStatusMap[endTcId].passes.join('\n');
                                cell.alignment = { wrapText: true, vertical: 'top' };
                            }
                            if (colIndices.observed > -1) {
                                const cell = row.getCell(colIndices.observed);
                                cell.value = tcStatusMap[endTcId].observed.join('\n');
                                cell.alignment = { wrapText: true, vertical: 'top' };
                            }
                            if (colIndices.duration > -1) {
                                const cell = row.getCell(colIndices.duration);
                                cell.value = tcStatusMap[endTcId].duration.join('\n');
                                cell.alignment = { wrapText: true, vertical: 'top' };
                            }
                            if (colIndices.screenshot > -1) {
                                const cell = row.getCell(colIndices.screenshot);
                                cell.value = tcStatusMap[endTcId].screenshot.join('\n');
                                cell.alignment = { wrapText: true, vertical: 'top' };
                            }
                        }
                    });
                }
            }

            await workbook.xlsx.writeFile(backupPath);
            console.log(`Excel Backup saved to ${backupPath}`);
        } catch (e) {
            console.error(`[Error] Failed to write Excel backup file:`, e);
        }
    }
}
