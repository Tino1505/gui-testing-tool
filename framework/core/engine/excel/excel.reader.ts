import * as ExcelJS from 'exceljs';

export class ExcelReader {
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

            // 1. Read ELEMENT
            const elementSheet = workbook.getWorksheet('ELEMENT');
            if (elementSheet) {
                const headers = elementSheet.getRow(1).values as string[];
                elementSheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const rowData: any = {};
                    row.eachCell((cell, colNumber) => {
                        let val = cell.value;
                        if (val && typeof val === 'object') {
                            if ('text' in val) val = (val as any).text;
                            else if ('richText' in val) val = (val as any).richText.map((rt: any) => rt.text).join('');
                            else if ('result' in val) val = (val as any).result; // for formulas
                        }
                        rowData[headers[colNumber]] = val?.toString() || val;
                    });
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

            // 2. Read PAGE
            const pageSheet = workbook.getWorksheet('PAGE');
            if (pageSheet) {
                const headers = pageSheet.getRow(1).values as string[];
                pageSheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const rowData: any = {};
                    row.eachCell((cell, colNumber) => {
                        let val = cell.value;
                        if (val && typeof val === 'object') {
                            if ('text' in val) val = (val as any).text;
                            else if ('richText' in val) val = (val as any).richText.map((rt: any) => rt.text).join('');
                            else if ('result' in val) val = (val as any).result; // for formulas
                        }
                        rowData[headers[colNumber]] = val?.toString() || val;
                    });
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
                        if (!row.getCell(1).value) return; // Empty dataset

                        const rowData: any = {};
                        row.eachCell((cell, colNumber) => {
                            let val = cell.value;
                            if (val && typeof val === 'object') {
                                if ('text' in val) val = (val as any).text;
                                else if ('richText' in val) val = (val as any).richText.map((rt: any) => rt.text).join('');
                                else if ('result' in val) val = (val as any).result; // for formulas
                            }
                            rowData[headers[colNumber]] = val?.toString() || val;
                        });

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
                    row.eachCell((cell, colNumber) => {
                        let val = cell.value;
                        if (val && typeof val === 'object') {
                            if ('text' in val) val = (val as any).text;
                            else if ('richText' in val) val = (val as any).richText.map((rt: any) => rt.text).join('');
                            else if ('result' in val) val = (val as any).result; // for formulas
                        }
                        rowData[headers[colNumber]] = val?.toString() || val;
                        isEmpty = false;
                    });

                    if (isEmpty) return;

                    const tcId = rowData['TC_ID'] || rowData['tc-id'];
                    if (tcId && String(tcId).trim()) {
                        currentTcId = String(tcId).trim();
                        const datasetVal = rowData['Data'] || rowData['DataType'] || rowData['DataSet'] || rowData['type'];
                        currentDataset = (datasetVal && String(datasetVal).trim()) ? String(datasetVal).trim() : null;

                        if (!groupedScenarios[currentTcId]) {
                            groupedScenarios[currentTcId] = {
                                tc_id: currentTcId,
                                summary: rowData['Summary'] || rowData['summary'] || "",
                                run: true,
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

            data.test_cases = Object.values(groupedScenarios);
            return data;

        } catch (e) {
            console.error(`[Error] Failed to read Excel file '${filePath}':`, e);
            return data;
        }
    }
}
