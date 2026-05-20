const XlsxPopulate = require('c:/Users/datbt20/Documents/projects/gui-testing-tool/node_modules/xlsx-populate');
const fs = require('fs');
const path = require('path');

function getLastValuedRow(sheet, columnsToCheck = [1, 2, 3, 4, 5, 6]) {
    const range = sheet.usedRange();
    if (!range) return 1;
    const endRow = range.endCell().rowNumber();
    for (let r = endRow; r >= 1; r--) {
        for (const col of columnsToCheck) {
            const val = sheet.cell(r, col).value();
            if (val !== null && val !== undefined && String(val).trim() !== "") {
                return r;
            }
        }
    }
    return 1;
}

async function updateExcelFile(fileName) {
    const filePath = path.resolve(__dirname, '..', '..', '..', 'test-data', fileName);
    console.log(`Updating ${filePath} using xlsx-populate...`);

    const workbook = await XlsxPopulate.fromFileAsync(filePath);

    // 1. Update PAGE sheet
    const wsPage = workbook.sheet("PAGE");
    if (!wsPage) throw new Error(`Sheet PAGE not found in ${fileName}`);
    
    let endRowPage = getLastValuedRow(wsPage, [1, 2]);

    const existingPages = new Set();
    for (let r = 2; r <= endRowPage; r++) {
        const val = wsPage.cell(r, 1).value();
        if (val) existingPages.add(String(val).trim());
    }

    if (!existingPages.has("url_vinmec_vaccine")) {
        let nextRow = endRowPage + 1;
        wsPage.cell(nextRow, 1).value("url_vinmec_vaccine");
        wsPage.cell(nextRow, 2).value("https://sit-smh.vinmec.com/vaccination");
        console.log("  Added url_vinmec_vaccine to PAGE sheet.");
    } else {
        console.log("  url_vinmec_vaccine already exists in PAGE sheet.");
    }

    // 2. Update ELEMENT sheet
    const wsElement = workbook.sheet("ELEMENT");
    if (!wsElement) throw new Error(`Sheet ELEMENT not found in ${fileName}`);

    let endRowElement = getLastValuedRow(wsElement, [1, 2, 3]);

    const existingElements = new Map();
    for (let r = 2; r <= endRowElement; r++) {
        const val = wsElement.cell(r, 1).value();
        if (val) existingElements.set(String(val).trim(), r);
    }

    const newElements = [
        ['menu_vaccination', 'xpath', '//span[contains(text(), \'9. Tiêm chủng\')]'],
        ['lbl_vaccination_dashboard_title', 'xpath', '//*[contains(text(), \'Module 9\')]'],
        ['lbl_card_lich_tiem', 'xpath', '(//*[contains(text(), \'Lịch tiêm hôm nay\')])[1]'],
        ['lbl_card_cho_day_cdc', 'xpath', '//*[contains(text(), \'Chờ đẩy CDC\')]'],
        ['lnk_sidebar_dieupboi', 'xpath', '//span[text()=\'9.1.1 Điều phối tiêm chủng\']'],
        ['lbl_dieu_phoi_title', 'xpath', '//*[contains(text(), \'Chọn khách hàng ở cột trái\')]'],
        ['btn_xac_nhan_tiem', 'xpath', '//button[contains(., \'Xác nhận tiêm\')]'],
        ['lbl_modal_xac_nhan', 'xpath', '//h2[contains(text(), \'Xác nhận tiêm\') or contains(text(), \'Thông tin tiêm\')]']
    ];

    for (const [elId, locType, locVal] of newElements) {
        if (!existingElements.has(elId)) {
            endRowElement++;
            wsElement.cell(endRowElement, 1).value(elId);
            wsElement.cell(endRowElement, 2).value(locType);
            wsElement.cell(endRowElement, 3).value(locVal);
            console.log(`  Added element ${elId} to ELEMENT sheet.`);
        } else {
            const existingRow = existingElements.get(elId);
            wsElement.cell(existingRow, 2).value(locType);
            wsElement.cell(existingRow, 3).value(locVal);
            console.log(`  Updated element ${elId} to: ${locType} | ${locVal}`);
        }
    }

    // 3. Update TEST_CASE sheet
    const wsTc = workbook.sheet("TEST_CASE");
    if (!wsTc) throw new Error(`Sheet TEST_CASE not found in ${fileName}`);

    let endRowTc = getLastValuedRow(wsTc, [1, 2, 3, 4, 5, 6]);

    const existingTcs = new Set();
    for (let r = 2; r <= endRowTc; r++) {
        const val = wsTc.cell(r, 1).value();
        if (val) existingTcs.add(String(val).trim());
    }

    if (!existingTcs.has("TC_VAC_001")) {
        const testCasesRows = [
            ['TC_VAC_001', 'Kiểm tra giao diện Dashboard Tiêm Chủng', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
            [null, null, null, '2', 'navigate', 'url_vinmec_vaccine', null, null],
            [null, null, null, '3', 'check_status', 'lbl_card_cho_day_cdc', null, 'visible'],
            
            ['TC_VAC_002', 'Kiểm tra chuyển hướng menu con 9.1.1 Điều phối tiêm chủng', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
            [null, null, null, '2', 'Refresh Precondition', null, null, null, null],
            [null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
            [null, null, null, '4', 'click', 'lnk_sidebar_dieupboi', null, null],
            [null, null, null, '5', 'check_status', 'lbl_dieu_phoi_title', null, 'visible'],
            
            ['TC_VAC_003', 'Kiểm tra nút tương tác Xác nhận tiêm', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
            [null, null, null, '2', 'Refresh Precondition', null, null, null, null],
            [null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
            [null, null, null, '4', 'click', 'btn_xac_nhan_tiem', null, null],
            [null, null, null, '5', 'check_status', 'lbl_modal_xac_nhan', null, 'visible']
        ];

        for (const rowData of testCasesRows) {
            endRowTc++;
            for (let c = 1; c <= rowData.length; c++) {
                wsTc.cell(endRowTc, c).value(rowData[c - 1]);
            }
        }
        console.log("  Added test cases TC_VAC_001, TC_VAC_002, TC_VAC_003 to TEST_CASE sheet.");
    } else {
        console.log("  Test cases already exist in TEST_CASE sheet.");
    }

    await workbook.toFileAsync(filePath);
    console.log(`Saved ${filePath} successfully!\n`);
}

async function main() {
    // Step 1: Copy Template_Master_Test_Suite.xlsx to restore original formatting
    console.log("Copying template to master file...");
    const srcPath = path.resolve(__dirname, "..", "..", "..", "test-data", "Template_Master_Test_Suite.xlsx");
    const destPath = path.resolve(__dirname, "..", "..", "..", "test-data", "Master_Test_Suite.xlsx");
    
    fs.copyFileSync(srcPath, destPath);
    console.log("Copied successfully.");

    // Step 2: Update both files using xlsx-populate to keep formatting, freeze panes, warning styles and dropdowns
    await updateExcelFile("Master_Test_Suite.xlsx");
    await updateExcelFile("Template_Master_Test_Suite.xlsx");
}

main().catch(console.error);
