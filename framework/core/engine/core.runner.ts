import { BrowserManager } from './browser.manager';
import { ActionDispatcher } from '../../actions/action.dispatcher';
import { DataResolver } from '../utils/data.resolver';
import { ControlFactory } from '../../controls/control.factory';
import { PlaywrightDriver } from '../drivers/playwright.wrapper';
import * as path from 'path';
import * as fs from 'fs';

export class KeywordRunner {
    public static async runTests(data: any, targetSheetFilter: string | null = null): Promise<any> {
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

        const browserManager = new BrowserManager();
        const isHeadless = process.env.HEADLESS === 'true';
        let page = await browserManager.start(isHeadless);

        try {
            for (const tc of testCases) {
                const tcId = tc.tc_id;
                if (tc.run !== true && String(tc.run).toUpperCase() !== 'Y') {
                    console.log(`Skipping ${tcId} (run != Y)`);
                    continue;
                }

                if (targetSheetFilter) {
                    const upperFilter = targetSheetFilter.toUpperCase();
                    const upperSheetName = (tc.sheet_name || "").toUpperCase();
                    const isMatch = upperSheetName === upperFilter || 
                                    upperSheetName === `TEST_CASE_${upperFilter}` ||
                                    upperSheetName.endsWith(`_${upperFilter}`) ||
                                    upperSheetName.endsWith(upperFilter);
                    if (!isMatch) {
                        continue;
                    }
                }

                const datasetName = tc.dataset;
                let iterations: any[] = [{}];

                if (datasetName && data.test_data[datasetName]) {
                    const datasetRows = data.test_data[datasetName];
                    if (datasetRows && datasetRows.length > 0) {
                        iterations = datasetRows;
                    }
                }

                // Check if this test case has a precondition call
                const hasPrecondition = tc.steps && tc.steps.some((step: any) => {
                    const act = String(step.Action || step.action || "").toLowerCase().trim();
                    return act === 'call_tc' || act === 'run_tc';
                });

                for (let i = 0; i < iterations.length; i++) {
                    const dataRow = iterations[i];
                    const iterSuffix = iterations.length > 1 ? `_Iter${i + 1}` : "";
                    const currentTcId = `${tcId}${iterSuffix}`;

                    console.log(`--- Running ${currentTcId}: ${tc.summary} ---`);

                    // Reset browser context for independent test cases to isolate session state
                    if (!hasPrecondition) {
                        console.log("  [Session] Resetting browser context for independent/negative test case.");
                        page = await browserManager.resetContext(isHeadless);
                    }

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

                        await this.executeSteps(tc.steps, dataRow, data.elements, data.pages, testCases, tcResult);

                        const tcEndTime = Date.now();
                        tcResult.duration = `${((tcEndTime - tcStartTime) / 1000).toFixed(2)}s`;

                        // Take screenshot
                        try {
                            // Wait for page to settle (network idle) before taking screenshot
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
                    } catch (tcErr) {
                        console.error(`Error executing test case ${currentTcId}:`, tcErr);
                    }
                }
            }
        } catch (globalErr) {
            console.error("Global Test Execution Error:", globalErr);
        } finally {
            await browserManager.stop();
        }

        return { results, runDir };
    }

    private static async executeSteps(
        steps: any[],
        dataRow: any,
        elementsDict: any,
        pagesDict: any,
        allTestCases: any[],
        tcResult: any,
        parentStepNo: string = ""
    ): Promise<boolean> {
        for (let idx = 0; idx < steps.length; idx++) {
            const step = steps[idx];
            const originalStepNo = step.StepNo || step.step;
            const stepNo = parentStepNo ? `${parentStepNo}.${originalStepNo}` : `${originalStepNo}`;
            const action = String(step.Action || step.action || "").toLowerCase().trim();
            const target = step.TargetElement || step.target;
            const dataKey = step.DataColumn || step.TestDataKey || step.data || step.value;
            const resolvedData = DataResolver.resolveData(dataKey, dataRow);

            const expectedKey = step.Expected || step.expected || "";
            const resolvedExpected = DataResolver.resolveData(expectedKey, dataRow);

            let logData = dataKey ? ` -> '${resolvedData}'` : "";
            if (resolvedExpected) logData += ` (Expected: '${resolvedExpected}')`;

            const stepStartTime = Date.now();

            if (action === 'call_tc' || action === 'run_tc') {
                console.log(`  Step ${stepNo}: [CALL TEST CASE] ${target}`);
                const targetTc = allTestCases.find((x: any) => x.tc_id === target);
                if (!targetTc) {
                    const stepResult = {
                        step: stepNo,
                        action: action,
                        target: target,
                        data: resolvedData,
                        passed: false,
                        message: `Error: Precondition test case '${target}' not found.`,
                        duration: "0.00s"
                    };
                    tcResult.steps.push(stepResult);
                    tcResult.passed = false;
                    console.log(`    \x1b[31m✘ FAIL\x1b[0m: Precondition test case '${target}' not found.`);
                    return false;
                }

                // Check if this is a login precondition and if session is already active
                let shouldSkipPrecondition = false;

                // Find the first input step in the target test case (e.g. username field)
                const firstInputStep = targetTc.steps.find((s: any) => 
                    String(s.Action || s.action || "").toLowerCase().trim() === 'input'
                );

                if (firstInputStep) {
                    const inputTarget = firstInputStep.TargetElement || firstInputStep.target;
                    const elementInfo = elementsDict[inputTarget];
                    if (elementInfo) {
                        try {
                            const control = ControlFactory.getControl(inputTarget, elementInfo.locator_type, elementInfo.locator);
                            const isVisible = await control.isVisible().catch(() => false);
                            
                            const currentPage = PlaywrightDriver.getPage();
                            const url = currentPage ? currentPage.url() : "";

                            // If login field is not visible, and page is initialized and not on login page, skip
                            if (!isVisible && url && url !== 'about:blank' && !url.includes('/login')) {
                                shouldSkipPrecondition = true;
                            }
                        } catch (err) {
                            console.log(`    [Precondition Check] Failed to check visibility of ${inputTarget}:`, err);
                        }
                    }
                }

                if (shouldSkipPrecondition) {
                    console.log(`    ✔ Precondition '${target}' skipped (session active).`);
                    const callStepResult = {
                        step: stepNo,
                        action: action,
                        target: target,
                        data: resolvedData,
                        passed: true,
                        message: `Precondition '${target}' skipped (session active)`,
                        duration: "0.00s"
                    };
                    tcResult.steps.push(callStepResult);
                    continue;
                }

                // Log call step itself as passed as we begin executing it
                const callStepResult = {
                    step: stepNo,
                    action: action,
                    target: target,
                    data: resolvedData,
                    passed: true,
                    message: `Called: ${target}`,
                    duration: "0.00s"
                };
                tcResult.steps.push(callStepResult);

                const subPassed = await this.executeSteps(
                    targetTc.steps,
                    dataRow,
                    elementsDict,
                    pagesDict,
                    allTestCases,
                    tcResult,
                    stepNo
                );

                if (!subPassed) {
                    return false;
                }
            } else {
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
                    const msg = await ActionDispatcher.executeStep(step, dataRow, elementsDict, pagesDict);
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

                if (stepResult.passed) {
                    console.log(`    \x1b[32m✔ PASS\x1b[0m (${stepResult.duration})`);
                } else {
                    console.log(`    \x1b[31m✘ FAIL\x1b[0m: ${stepResult.message}`);
                }

                tcResult.steps.push(stepResult);

                if (!stepResult.passed) {
                    return false;
                }
            }
        }
        return true;
    }
}
