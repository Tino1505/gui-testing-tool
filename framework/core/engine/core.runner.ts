import { BrowserManager } from './browser.manager';
import { ActionDispatcher } from '../../actions/action.dispatcher';
import { DataResolver } from '../utils/data.resolver';
import * as path from 'path';
import * as fs from 'fs';

export class KeywordRunner {
    public static async runTests(data: any): Promise<any> {
        const testCases = data.test_cases || [];
        if (testCases.length === 0) {
            console.log("No test cases found.");
            return { results: [], runDir: "" };
        }

        const results: any[] = [];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const runDir = path.resolve(__dirname, '..', '..', '..', 'reports', `run_${timestamp}`);
        const screenshotsDir = path.join(runDir, 'screenshots');

        fs.mkdirSync(screenshotsDir, { recursive: true });

        try {
            for (const tc of testCases) {
                const tcId = tc.tc_id;
                if (tc.run !== true && String(tc.run).toUpperCase() !== 'Y') {
                    console.log(`Skipping ${tcId} (run != Y)`);
                    continue;
                }

                const datasetName = tc.dataset;
                let iterations: any[] = [{}];

                if (datasetName && data.test_data[datasetName]) {
                    const datasetRows = data.test_data[datasetName];
                    if (datasetRows && datasetRows.length > 0) {
                        iterations = datasetRows;
                    }
                }

                for (let i = 0; i < iterations.length; i++) {
                    const dataRow = iterations[i];
                    const iterSuffix = iterations.length > 1 ? `_Iter${i + 1}` : "";
                    const currentTcId = `${tcId}${iterSuffix}`;

                    console.log(`--- Running ${currentTcId}: ${tc.summary} ---`);
                    
                    const browserManager = new BrowserManager();
                    const page = await browserManager.start(false);

                    try {
                        const tcResult = {
                        tc_id: currentTcId,
                        summary: tc.summary,
                        sheet_name: tc.sheet_name,
                        passed: true,
                        steps: [] as any[],
                        screenshot: null as string | null,
                        duration: ""
                    };

                    const tcStartTime = Date.now();

                    for (const step of tc.steps) {
                        const stepStartTime = Date.now();
                        const stepNo = step.StepNo || step.step;
                        const action = step.Action || step.actions || step.action;
                        const target = step.TargetElement || step.target;
                        const dataKey = step.DataColumn || step.TestDataKey || step.data || step.value;
                        const resolvedData = DataResolver.resolveData(dataKey, dataRow);

                        const expectedKey = step.Expected || step.expected || "";
                        const resolvedExpected = DataResolver.resolveData(expectedKey, dataRow);

                        let logData = dataKey ? ` -> '${resolvedData}'` : "";
                        if (resolvedExpected) logData += ` (Expected: '${resolvedExpected}')`;
                        console.log(`  Step ${stepNo}: ${action} ${target}${logData}`);

                        const stepResult = {
                            step: stepNo,
                            action: action,
                            target: target,
                            data: resolvedData,
                            passed: false,
                            message: "",
                            duration: ""
                        };

                        try {
                            const msg = await ActionDispatcher.executeStep(step, dataRow, data.elements, data.pages);
                            stepResult.passed = true;
                            stepResult.message = msg;
                        } catch (e: any) {
                            stepResult.passed = false;
                            const errorMsg = e.message ? e.message.split('\n')[0].substring(0, 100) : "Unknown Error";
                            if (errorMsg === "visible" || errorMsg === "invisible") {
                                stepResult.message = errorMsg;
                            } else {
                                stepResult.message = `Error: ${errorMsg}`;
                            }
                            tcResult.passed = false;
                        }

                        const stepEndTime = Date.now();
                        stepResult.duration = `${((stepEndTime - stepStartTime) / 1000).toFixed(2)}s`;
                        
                        // Log Pass/Fail result to console
                        if (stepResult.passed) {
                            console.log(`    \x1b[32m✔ PASS\x1b[0m (${stepResult.duration})`);
                        } else {
                            console.log(`    \x1b[31m✘ FAIL\x1b[0m: ${stepResult.message}`);
                        }
                        
                        tcResult.steps.push(stepResult);

                        if (!stepResult.passed) {
                            break;
                        }
                    }

                    const tcEndTime = Date.now();
                    tcResult.duration = `${((tcEndTime - tcStartTime) / 1000).toFixed(2)}s`;

                    // Take screenshot
                    try {
                        // Wait for page to settle (network idle) before taking screenshot
                        // Increased timeout to 15s to handle slow SIT APIs
                        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
                            console.log("    [Warning] Network is still busy after 15s, proceeding with screenshot...");
                        });
                        
                        // Buffer for fade-out animations to finish
                        await page.waitForTimeout(1000);
                        
                        const screenshotFile = `${currentTcId}.png`;
                        const screenshotPath = path.join(screenshotsDir, screenshotFile);
                        await page.screenshot({ path: screenshotPath, fullPage: true });
                        tcResult.screenshot = screenshotPath;
                    } catch (e) {
                        console.log("Failed to capture screenshot:", e);
                    }

                        results.push(tcResult);
                    } finally {
                        await browserManager.stop();
                    }
                }
            }
        } catch (globalErr) {
            console.error("Global Test Execution Error:", globalErr);
        }

        return { results, runDir };
    }
}
