import * as ExcelJS from 'exceljs';
import { FrameworkConfig } from '../../../config/framework.config';

export class ExcelReader {
    private static getCleanStringValue(val: any): any {
        if (val && typeof val === 'object') {
            if ('text' in val) val = (val as any).text;
            else if ('richText' in val) val = (val as any).richText.map((rt: any) => rt.text).join('');
            else if ('result' in val) val = (val as any).result; // for formulas
        }
        if (typeof val === 'string') {
            return val.replace(/_x000d_/g, '').trim();
        }
        return val?.toString() || val;
    }

    public static async readTestData(filePath: string): Promise<any> {
        const data: any = {
            elements: {},
            pages: {},
            scenarios: [],
            test_cases: [],
            test_data: {}
        };

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            // 1. Read ELEMENT (ELEMENT and ELEMENT_ prefix)
            workbook.eachSheet((sheet) => {
                const sheetName = sheet.name.toUpperCase();
                if (sheetName === 'ELEMENT' || sheetName.startsWith('ELEMENT_')) {
                    const headers = sheet.getRow(1).values as string[];
                    sheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        const rowData: any = {};
                        for (let colNumber = 1; colNumber < headers.length; colNumber++) {
                            const cellValue = row.getCell(colNumber).value;
                            rowData[headers[colNumber]] = ExcelReader.getCleanStringValue(cellValue);
                        }
                        const elementKey = rowData['ElementKey'] || rowData['element_id'];
                        const locatorType = rowData['LocatorType'] || rowData['locator_type'];
                        const locatorValue = rowData['LocatorValue'] || rowData['locator_value'];
                        if (elementKey) {
                            data.elements[elementKey] = {
                                locator: locatorValue,
                                locator_type: locatorType
                            };
                        }
                    });
                }
            });

            // 2. Read PAGE
            const pageSheet = workbook.getWorksheet('PAGE');
            if (pageSheet) {
                const headers = pageSheet.getRow(1).values as string[];
                pageSheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const rowData: any = {};
                    for (let colNumber = 1; colNumber < headers.length; colNumber++) {
                        const cellValue = row.getCell(colNumber).value;
                        rowData[headers[colNumber]] = ExcelReader.getCleanStringValue(cellValue);
                    }
                    const pageKey = rowData['PageKey'] || rowData['page'];
                    const url = rowData['URL'] || rowData['url'];
                    const pageName = rowData['Page Name'] || pageKey;
                    if (pageKey) {
                        data.pages[pageKey] = { url: url, name: pageName };
                    }
                });
            }

            // 3. Read DATA (DATA and DATA_ prefix)
            workbook.eachSheet((sheet, id) => {
                const sheetName = sheet.name;
                if (sheetName === 'DATA' || sheetName.startsWith('DATA_')) {
                    const sheetKey = sheetName.toLowerCase();
                    const headers = sheet.getRow(1).values as string[];
                    const localIndices: any = {};

                    sheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        
                        // Check if row has any non-empty cell
                        let isEmpty = true;
                        for (let colNumber = 1; colNumber < headers.length; colNumber++) {
                            const val = row.getCell(colNumber).value;
                            if (val !== null && val !== undefined && val !== '') {
                                isEmpty = false;
                                break;
                            }
                        }
                        if (isEmpty) return;

                        const rowData: any = {};
                        for (let colNumber = 1; colNumber < headers.length; colNumber++) {
                            const cellValue = row.getCell(colNumber).value;
                            rowData[headers[colNumber]] = ExcelReader.getCleanStringValue(cellValue);
                        }

                        const dataset = rowData['DataType'] || rowData['DataSet'] || rowData['test_case_type'];
                        if (dataset) {
                            if (!data.test_data[dataset]) {
                                data.test_data[dataset] = [];
                            }
                            if (localIndices[dataset] === undefined) {
                                localIndices[dataset] = 0;
                            }
                            const idx = localIndices[dataset];
                            if (idx >= data.test_data[dataset].length) {
                                data.test_data[dataset].push({ "_flat": {} });
                            }

                            data.test_data[dataset][idx][sheetKey] = rowData;
                            Object.assign(data.test_data[dataset][idx]["_flat"], rowData);

                            localIndices[dataset]++;
                        }
                    });
                }
            });

            // 4. Read all TEST_CASE sheets
            const groupedScenarios: any = {};

            workbook.eachSheet((tcSheet, id) => {
                if (!tcSheet.name.toUpperCase().startsWith('TEST_CASE')) {
                    return;
                }

                let currentTcId: string | null = null;
                let currentDataset: string | null = null;
                const headers = tcSheet.getRow(1).values as string[];

                tcSheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const rowData: any = {};
                    let isEmpty = true;
                    for (let colNumber = 1; colNumber < headers.length; colNumber++) {
                        const cellValue = row.getCell(colNumber).value;
                        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
                            isEmpty = false;
                        }
                        rowData[headers[colNumber]] = ExcelReader.getCleanStringValue(cellValue);
                    }

                    if (isEmpty) return;

                    const tcId = rowData['TC_ID'] || rowData['tc-id'];
                    if (tcId && String(tcId).trim()) {
                        currentTcId = String(tcId).trim();
                        const datasetVal = rowData['Data'] || rowData['DataType'] || rowData['DataSet'] || rowData['type'];
                        currentDataset = (datasetVal && String(datasetVal).trim()) ? String(datasetVal).trim() : null;

                        const toRunVal = rowData['to_run'] || rowData['to-run'] || rowData['Run'] || rowData['run'];
                        const toRun = (toRunVal === undefined || toRunVal === null || String(toRunVal).trim() === '') ? false : (String(toRunVal).trim().toUpperCase() === 'Y');

                        const parameterizedVal = rowData['parameterized'] || rowData['parameterize'] || rowData['loop_from_step_1'] || rowData['loop'];
                        const isParameterized = (parameterizedVal && String(parameterizedVal).trim().toUpperCase() === 'Y');

                        if (!groupedScenarios[currentTcId]) {
                            groupedScenarios[currentTcId] = {
                                tc_id: currentTcId,
                                summary: rowData['Summary'] || rowData['summary'] || "",
                                run: toRun,
                                parameterized: isParameterized,
                                dataset: currentDataset,
                                sheet_name: tcSheet.name,
                                steps: []
                            };
                        }
                    }

                    if (currentTcId) {
                        const stepNo = rowData['Step'] || rowData['step'];
                        if (stepNo && String(stepNo).trim()) {
                            groupedScenarios[currentTcId].steps.push({
                                TestCaseID: currentTcId,
                                StepNo: stepNo,
                                Action: rowData['Action'] || rowData['action'],
                                TargetElement: rowData['Target'] || rowData['target'],
                                DataColumn: rowData['Data'] || rowData['value'],
                                Expected: rowData['Expected'] || rowData['expected']
                            });
                        }
                    }
                });
            });

            // Resolve custom validations lookup datasets from configuration dynamically
            data.custom_lookups = {};
            const customRules = FrameworkConfig.CUSTOM_VALIDATIONS || {};
            for (const [targetKey, rule] of Object.entries(customRules)) {
                if (rule && (rule as any).type === 'lookup') {
                    const sourceSheetName = (rule as any).sourceSheet;
                    const sourceColName = (rule as any).sourceColumn;
                    const values: string[] = [];

                    workbook.eachSheet((sheet) => {
                        const sheetNameUpper = sheet.name.toUpperCase();
                        const sourceSheetUpper = sourceSheetName.toUpperCase();
                        const isMatch = sheetNameUpper === sourceSheetUpper ||
                                        sheetNameUpper.startsWith(sourceSheetUpper + '_') ||
                                        sheetNameUpper.endsWith('_' + sourceSheetUpper) ||
                                        (sourceSheetUpper === 'DATA' && sheetNameUpper.startsWith('DATA'));

                        if (isMatch) {
                            const headers = sheet.getRow(1).values as string[];
                            let colIndex = -1;
                            for (let i = 1; i < headers.length; i++) {
                                if (headers[i] === sourceColName) {
                                    colIndex = i;
                                    break;
                                }
                            }
                            if (colIndex !== -1) {
                                sheet.eachRow((row, rowNumber) => {
                                    if (rowNumber === 1) return;
                                    const cell = row.getCell(colIndex);
                                    const strVal = ExcelReader.getCleanStringValue(cell.value);
                                    if (strVal && typeof strVal === 'string') {
                                        values.push(strVal);
                                    }
                                });
                            }
                        }
                    });
                    
                    data.custom_lookups[targetKey] = Array.from(new Set(values));
                }
            }
            data.valid_hospitals = data.custom_lookups['btn_dynamic_select'] || [];

            // Propagate sheet data from the first row to subsequent rows of the same dataset if missing
            for (const dataset of Object.keys(data.test_data)) {
                const rows = data.test_data[dataset];
                if (rows.length > 1) {
                    const allSheetKeys = new Set<string>();
                    rows.forEach((r: any) => {
                        Object.keys(r).forEach(k => {
                            if (k !== '_flat') allSheetKeys.add(k);
                        });
                    });
                    for (const sheetKey of allSheetKeys) {
                        let lastValidVal: any = null;
                        for (let i = 0; i < rows.length; i++) {
                            if (rows[i][sheetKey]) {
                                lastValidVal = rows[i][sheetKey];
                            } else if (lastValidVal) {
                                rows[i][sheetKey] = lastValidVal;
                                Object.assign(rows[i]["_flat"], lastValidVal);
                            }
                        }
                    }
                }
            }

            data.test_cases = Object.values(groupedScenarios);
            return data;

        } catch (e) {
            console.error(`[Error] Failed to read Excel file '${filePath}':`, e);
            return data;
        }
    }
}
