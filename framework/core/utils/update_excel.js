const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');
const path = require('path');

function getLastValuedRow(sheet, columnsToCheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
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

async function updateExcelFile(fileName, extraCustomSheets = {}) {
    const filePath = path.resolve(__dirname, '..', '..', '..', 'test-data', fileName);
    console.log(`Updating ${filePath} structure...`);

    const workbook = await XlsxPopulate.fromFileAsync(filePath);

    // 1. Read existing custom sheets to preserve
    const preservedSheets = { ...extraCustomSheets };
    const standardSheets = new Set([
        "PAGE", "ACTION_LIST",
        "TEST_CASE_LOGIN", "DATA_LOGIN", "ELEMENT_LOGIN",
        "TEST_CASE_VACXIN", "DATA_VACXIN", "ELEMENT_VACXIN",
        "TEST_CASE_QLHV", "DATA_QLHV", "ELEMENT_QLHV",
        // Old names so they are not treated as custom sheets
        "TEST_CASE_LS_HR", "DATA_LS_HR", "ELEMENT_LS_HR",
        "TEST_CASE_LS_COMP", "DATA_LS_COMP", "ELEMENT_LS_COMP",
        "TEST_CASE_LS_EXAM", "DATA_LS_EXAM", "ELEMENT_LS_EXAM",
        "TEST_CASE_LS_COORD", "DATA_LS_COORD", "ELEMENT_LS_COORD",
        "TEST_CASE_LS_REP", "DATA_LS_REP", "ELEMENT_LS_REP",
        "ELEMENT", "DATA_LAMSANG", "TEST_CASE_LAMSANG"
    ]);

    workbook.sheets().forEach(sheet => {
        const name = sheet.name();
        if (!standardSheets.has(name)) {
            const lastRow = getLastValuedRow(sheet, Array.from({ length: 20 }, (_, i) => i + 1));
            const range = sheet.usedRange();
            const lastCol = range ? range.endCell().columnNumber() : 1;
            const rows = [];
            for (let r = 1; r <= lastRow; r++) {
                const rowVals = [];
                for (let c = 1; c <= lastCol; c++) {
                    rowVals.push(sheet.cell(r, c).value());
                }
                rows.push(rowVals);
            }
            preservedSheets[name] = rows;
            console.log(`  Preserved custom sheet: ${name} with ${rows.length} rows`);
        }
    });

    // 2. Clear all worksheets using a temp sheet
    const tempSheet = workbook.addSheet("_TEMP_");
    workbook.sheets().forEach(sheet => {
        if (sheet.name() !== "_TEMP_") {
            workbook.deleteSheet(sheet.name());
        }
    });

    // Helper to write sheet data
    function writeSheetData(wb, name, headers, rows) {
        const ws = wb.addSheet(name);
        // Write headers
        for (let c = 0; c < headers.length; c++) {
            ws.cell(1, c + 1).value(headers[c]);
        }
        // Write rows
        for (let r = 0; r < rows.length; r++) {
            const rowData = rows[r];
            for (let c = 0; c < rowData.length; c++) {
                ws.cell(r + 2, c + 1).value(rowData[c]);
            }
        }
        console.log(`  Created and populated sheet: ${name}`);
        return ws;
    }

    // 3. Write PAGE sheet
    const PAGE_HEADERS = ['page', 'url'];
    const PAGE_ROWS = [
        ['url_sit_login', 'https://sit-smh.vinmec.com/login'],
        ['url_vinmec_vaccine', 'https://sit-smh.vinmec.com/vaccination'],
        ['url_ls_trainees', 'https://sit-smh.vinmec.com/training/trainees']
    ];
    writeSheetData(workbook, "PAGE", PAGE_HEADERS, PAGE_ROWS);

    // 4. Write ACTION_LIST sheet
    const ACTION_HEADERS = ['actions', 'description'];
    const ACTION_ROWS = [
        ["navigate", "Mở URL"],
        ["go_back", "Quay lại trang trước"],
        ["go_forward", "Tiến tới trang tiếp theo"],
        ["refresh", "Reload trang hiện tại"],
        ["check_status", "Kiểm tra trạng thái element theo expect (visible, exists, text, value, enabled, checked…)"],
        ["click", "Click vào element"],
        ["double_click", "Double click vào element"],
        ["right_click", "Click chuột phải vào element"],
        ["hover", "Di chuột lên element"],
        ["focus", "Focus vào element"],
        ["blur", "Rời focus khỏi element"],
        ["press_key", "Nhấn phím (Enter, Tab, Esc…)"],
        ["input", "Nhập text vào field"],
        ["clear", "Xóa text trong field"],
        ["upload_file", "Upload file qua input type=file"],
        ["drag_drop", "Kéo thả element tới target"],
        ["scroll_to", "Scroll tới element"],
        ["scroll_by", "Scroll theo tọa độ (x, y)"],
        ["select_by_text", "Chọn dropdown theo text hiển thị"],
        ["select_by_value", "Chọn dropdown theo value"],
        ["check", "Check checkbox"],
        ["uncheck", "Uncheck checkbox"],
        ["capture", "Chụp màn hình"]
    ];
    writeSheetData(workbook, "ACTION_LIST", ACTION_HEADERS, ACTION_ROWS);

    // 5. Define standard columns for test cases
    const TC_HEADERS = ["to_run", "tc-id", "summary", "type", "parameterized", "step", "action", "target", "value", "expected", "[o]_observed", "[o]_test_result", "[o]_screenshot", "[o]_duration_(s)"];

    // --- Module 1: LOGIN ---
    const loginTestCases = [
        ['Y', 'TC_LOGIN_001', 'Đăng nhập thành công với tài khoản SIT Vinmec', 'pos', 'N', '1', 'navigate', 'url_sit_login', null, null],
        [null, null, null, null, null, '2', 'click', 'btn_sit_login', null, null],
        [null, null, null, null, null, '3', 'input', 'txt_username', '$data_login.username', null],
        [null, null, null, null, null, '4', 'input', 'txt_password', '$data_login.password', null],
        [null, null, null, null, null, '5', 'click', 'btn_login', null, null],
        [null, null, null, null, null, '6', 'click', 'btn_dynamic_select', 'Bệnh viện Đa khoa Quốc tế Vinmec Times City', null],
        [null, null, null, null, null, '7', 'check_status', 'lbl_dashboard_data', null, 'visible'],

        ['Y', 'TC_LOGIN_002', 'Đăng nhập thất bại với tài khoản sai định dạng/mật khẩu', 'neg', 'Y', '1', 'navigate', 'url_sit_login', null, null],
        [null, null, null, null, null, '2', 'click', 'btn_sit_login', null, null],
        [null, null, null, null, null, '3', 'input', 'txt_username', '$data_login.username', null],
        [null, null, null, null, null, '4', 'input', 'txt_password', '$data_login.password', null],
        [null, null, null, null, null, '5', 'click', 'btn_login', null, null],
        [null, null, null, null, null, '6', 'check_status', 'error_msg', null, 'visible']
    ];
    writeSheetData(workbook, "TEST_CASE_LOGIN", TC_HEADERS, loginTestCases);

    const loginDataHeaders = ["test_case_type", "username", "password"];
    const loginDataRows = [
        ["pos", "admin@vinmec.com", "Test@1234"],
        ["neg", "admin@admin.com", "admin123"],
        ["neg", "admin@admin.com", "empty"],
        ["ds_ls_trainee_pos", "admin@vinmec.com", "Test@1234"],
        ["ds_ls_trainee_neg", "admin@admin.com", "admin123"],
        ["ds_ep_email_neg", "admin@vinmec.com", "Test@1234"],
        ["ds_bva_phone_neg", "admin@vinmec.com", "Test@1234"],
        ["ds_bva_cccd_neg", "admin@vinmec.com", "Test@1234"],
        ["ds_decision_table", "admin@vinmec.com", "Test@1234"]
    ];
    writeSheetData(workbook, "DATA_LOGIN", loginDataHeaders, loginDataRows);

    const loginElementHeaders = ["element_id", "locator_type", "locator_value"];
    const loginElementRows = [
        ['--- MÀN HÌNH ĐĂNG NHẬP ---', null, null],
        ['btn_sit_login', 'css', 'button.bg-primary'],
        ['txt_username', 'id', 'username'],
        ['txt_password', 'id', 'password'],
        ['btn_login', 'id', 'kc-login'],
        ['error_msg', 'id', 'input-error-username'],
        ['btn_dynamic_select', 'xpath', '(//div[.//h3[contains(text(), \'${select_hospital}\')]]//button[contains(text(), \'Chọn Bệnh Viện\')])[1]'],
        ['lbl_dashboard_data', 'xpath', '//span[text()=\'System Administrator\']']
    ];
    writeSheetData(workbook, "ELEMENT_LOGIN", loginElementHeaders, loginElementRows);

    // --- Module 2: VACXIN ---
    const vacTestCases = [
        ['Y', 'TC_VAC_001', 'Kiểm tra giao diện Dashboard Tiêm Chủng', 'pos', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, null, null, '3', 'check_status', 'lbl_card_cho_day_cdc', null, 'visible'],

        ['Y', 'TC_VAC_002', 'Kiểm tra chuyển hướng menu con 9.1.1 Điều phối tiêm chủng', 'pos', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'Refresh Precondition', null, null, null],
        [null, null, null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, null, null, '4', 'click', 'lnk_sidebar_dieupboi', null, null],
        [null, null, null, null, null, '5', 'check_status', 'lbl_dieu_phoi_title', null, 'visible'],

        ['Y', 'TC_VAC_003', 'Kiểm tra nút tương tác Xác nhận tiêm', 'pos', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'Refresh Precondition', null, null, null],
        [null, null, null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, null, null, '4', 'click', 'btn_xac_nhan_tiem', null, null],
        [null, null, null, null, null, '5', 'check_status', 'lbl_modal_xac_nhan', null, 'visible']
    ];
    writeSheetData(workbook, "TEST_CASE_VACXIN", TC_HEADERS, vacTestCases);

    const vacDataHeaders = ["test_case_type"];
    const vacDataRows = [
        ["pos"],
        ["neg"]
    ];
    writeSheetData(workbook, "DATA_VACXIN", vacDataHeaders, vacDataRows);

    const vacElementRows = [
        ['--- MÀN HÌNH TIÊM CHỦNG ---', null, null],
        ['lbl_card_cho_day_cdc', 'xpath', '//*[contains(text(), \'Chờ đẩy CDC\')]'],
        ['lnk_sidebar_dieupboi', 'xpath', '//span[text()=\'9.1.1 Điều phối tiêm chủng\']'],
        ['lbl_dieu_phoi_title', 'xpath', '//*[contains(text(), \'Chọn khách hàng ở cột trái\')]'],
        ['btn_xac_nhan_tiem', 'xpath', '//button[contains(., \'Xác nhận tiêm\')]'],
        ['lbl_modal_xac_nhan', 'xpath', '//h2[contains(text(), \'Xác nhận tiêm\') or contains(text(), \'Thông tin tiêm\')]']
    ];
    writeSheetData(workbook, "ELEMENT_VACXIN", loginElementHeaders, vacElementRows);

    // --- Module 3: QLHV (renamed from LS_HR) ---
    const hrTestCases = [
        ['Y', 'TC_QLHV_PRE', 'Precondition: Đăng nhập thành công và đi tới trang Quản lý học viên', 'pos', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],

        ['Y', 'TC_QLHV_001', 'Thêm học viên mới thành công (Đầy đủ thông tin)', 'ds_ls_trainee_pos', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_email', '$data_qlhv.trainee_email', null],
        [null, null, null, null, null, '14', 'input', 'txt_trainee_phone', '$data_qlhv.trainee_phone', null],
        [null, null, null, null, null, '15', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '16', 'check_status', 'lbl_toast_success', null, 'visible'],

        ['Y', 'TC_QLHV_002', 'Thêm học viên mới thất bại (Để trống trường bắt buộc)', 'ds_ls_trainee_neg', 'N', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '5', 'check_status', 'lbl_toast_error', null, 'visible'],

        ['Y', 'TC_QLHV_003', 'Equivalence Partitioning: Kiểm tra Email sai định dạng', 'ds_ep_email_neg', 'Y', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_email', '$data_qlhv.trainee_email', null],
        [null, null, null, null, null, '14', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '15', 'check_status', 'lbl_toast_error', null, 'visible'],

        ['Y', 'TC_QLHV_004', 'Boundary Value Analysis: Kiểm tra Số điện thoại sai độ dài', 'ds_bva_phone_neg', 'Y', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_phone', '$data_qlhv.trainee_phone', null],
        [null, null, null, null, null, '14', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '15', 'check_status', 'lbl_toast_error', null, 'visible'],

        ['Y', 'TC_QLHV_005', 'Boundary Value Analysis: Kiểm tra CCCD sai độ dài', 'ds_bva_cccd_neg', 'Y', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_cccd', '$data_qlhv.trainee_cccd', null],
        [null, null, null, null, null, '14', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '15', 'check_status', 'lbl_toast_error', null, 'visible'],

        ['Y', 'TC_QLHV_006', 'Decision Table Testing: Phân loại học viên vs Mã nhân viên bắt buộc (Positive)', 'dt_pos', 'Y', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_email', '$data_qlhv.trainee_email', null],
        [null, null, null, null, null, '14', 'input', 'txt_trainee_phone', '$data_qlhv.trainee_phone', null],
        [null, null, null, null, null, '15', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '16', 'check_status', 'lbl_toast_success', null, '$data_qlhv.expected_success'],

        ['Y', 'TC_QLHV_007', 'Decision Table Testing: Phân loại học viên vs Mã nhân viên bắt buộc (Negative)', 'dt_neg', 'Y', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, null, null, '4', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, null, null, '5', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, null, null, '7', 'click', 'ddl_trainee_role', null, null],
        [null, null, null, null, null, '8', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, null, null, '9', 'click', 'ddl_trainee_program', null, null],
        [null, null, null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, null, null, '11', 'click', 'ddl_trainee_class', null, null],
        [null, null, null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, null, null, '13', 'input', 'txt_trainee_email', '$data_qlhv.trainee_email', null],
        [null, null, null, null, null, '14', 'input', 'txt_trainee_phone', '$data_qlhv.trainee_phone', null],
        [null, null, null, null, null, '15', 'click', 'btn_trainee_save', null, null],
        [null, null, null, null, null, '16', 'check_status', 'lbl_toast_error', null, '$data_qlhv.expected_error']
    ];
    writeSheetData(workbook, "TEST_CASE_QLHV", TC_HEADERS, hrTestCases);

    const hrDataHeaders = [
        'test_case_type', 'trainee_code', 'trainee_name', 'trainee_dob', 'trainee_cccd',
        'trainee_gender', 'trainee_job_group', 'trainee_title', 'trainee_title_other',
        'trainee_degree', 'trainee_specialty', 'trainee_workplace', 'trainee_department',
        'trainee_email', 'trainee_phone', 'trainee_type', 'trainee_tax_code', 'trainee_account',
        'trainee_bank', 'trainee_program', 'trainee_class', 'trainee_mentor', 'trainee_school',
        'trainee_start_date', 'expected_error', 'expected_success'
    ];
    const hrDataRows = [
        [
            'ds_ls_trainee_pos', '', 'Nguyễn Văn A', '1995-05-15', '001095012345',
            'Nam', 'Bác sĩ', 'Bác sĩ', '',
            'Thạc sĩ', 'Nội khoa', 'Vinmec Times City', 'Khoa Cấp cứu',
            'test.student@vinmec.com', '0987654321', 'Bên ngoài', '8091234567', '19033333333333',
            'Techcombank', 'An Toàn người bệnh', 'Học mổ', 'Trần Thị B', 'Đại học Y Hà Nội',
            '2026-06-01', '', ''
        ],
        [
            'ds_ls_trainee_neg', '', 'Lỗi Tên', '1990-01-01', '000000000000',
            'Nữ', 'Bác sĩ', 'Bác sĩ', '',
            'Đại học', 'Nội khoa', 'Vinmec Times City', 'Khoa Cấp cứu',
            'error.email', '0000000000', 'Bên ngoài', '', '',
            '', '', '', '', '',
            '', '', '', ''
        ],
        [
            'ds_ep_email_neg', '', 'Nguyễn Văn EP', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_ep_email_neg', '', 'Nguyễn Văn EP', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_ep_email_neg', '', 'Nguyễn Văn EP', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            '@vinmec.com', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_bva_phone_neg', '', 'Nguyễn Văn BVA', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '098765432', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_bva_phone_neg', '', 'Nguyễn Văn BVA', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '09876543210', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_bva_phone_neg', '', 'Nguyễn Văn BVA', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '09876543ab', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_bva_cccd_neg', '', 'Nguyễn Văn CCCD', '1995-05-15', '00109501234',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'ds_bva_cccd_neg', '', 'Nguyễn Văn CCCD', '1995-05-15', '0010950123456',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Lớp học xóa mù SMH', '', '',
            '', '', ''
        ],
        [
            'dt_pos', '', 'Nguyễn Văn DT', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '0987654321', 'Nội bộ', '', '',
            '', 'An Toàn người bệnh', 'Học mổ', '', '',
            '', 'visible', 'hidden'
        ],
        [
            'dt_neg', '', 'Nguyễn Văn DT', '1995-05-15', '',
            '', 'Bác sĩ', '', '',
            '', '', '', '',
            'test.student@vinmec.com', '0987654321', 'Bên ngoài', '', '',
            '', 'An Toàn người bệnh', 'Học mổ', '', '',
            '', 'hidden', 'visible'
        ]
    ];
    writeSheetData(workbook, "DATA_QLHV", hrDataHeaders, hrDataRows);

    const hrElementRows = [
        ['--- MÀN HÌNH ĐẠO TẠO LÂM SÀNG - ĐIỀU HƯỚNG ---', null, null],
        ['lnk_menu_coordination', 'css', 'span:has-text("13.4 Điều phối")'],
        ['lnk_mentor_matching', 'css', 'a[href*="mentor-matching"]'],
        ['lnk_clinical_logbook', 'css', 'a[href*="clinical-logbook"]'],
        ['--- MÀN HÌNH QUẢN LÝ HỌC VIÊN ---', null, null],
        ['btn_trainee_add', 'data-testid', 'training-trainees-add-button'],
        ['txt_trainee_code', 'data-testid', 'training-trainees-upsert-employee-id-input'],
        ['txt_trainee_name', 'data-testid', 'training-trainees-upsert-name-input'],
        ['txt_trainee_dob', 'data-testid', 'training-trainees-upsert-dob-input'],
        ['txt_trainee_cccd', 'data-testid', 'training-trainees-upsert-cccd-input'],
        ['ddl_trainee_gender', 'data-testid', 'training-trainees-upsert-gender-select'],
        ['ddl_trainee_role', 'data-testid', 'training-trainees-upsert-profession-select'],
        ['ddl_trainee_title', 'data-testid', 'training-trainees-upsert-position-select'],
        ['txt_trainee_title_other', 'data-testid', 'training-trainees-upsert-job-title-other-input'],
        ['ddl_trainee_degree', 'data-testid', 'training-trainees-upsert-degree-select'],
        ['ddl_trainee_specialty', 'data-testid', 'training-trainees-upsert-specialty-select'],
        ['ddl_trainee_workplace', 'data-testid', 'training-trainees-upsert-hospital-select'],
        ['ddl_trainee_department', 'data-testid', 'training-trainees-upsert-department-select'],
        ['txt_trainee_email', 'data-testid', 'training-trainees-upsert-email-input'],
        ['txt_trainee_phone', 'data-testid', 'training-trainees-upsert-phone-input'],
        ['rad_trainee_type', 'css', 'label:has-text("${data}")'],
        ['txt_trainee_tax_code', 'data-testid', 'training-trainees-upsert-tax-code-input'],
        ['txt_trainee_account', 'data-testid', 'training-trainees-upsert-bank-account-input'],
        ['ddl_trainee_bank', 'data-testid', 'training-trainees-upsert-bank-select'],
        ['ddl_trainee_program', 'data-testid', 'training-trainees-upsert-program-select'],
        ['ddl_trainee_class', 'data-testid', 'training-trainees-upsert-class-select'],
        ['ddl_trainee_mentor', 'data-testid', 'training-trainees-upsert-mentor-select'],
        ['txt_trainee_school', 'data-testid', 'training-trainees-upsert-university-input'],
        ['txt_trainee_start_date', 'data-testid', 'training-trainees-upsert-start-date-input'],
        ['btn_trainee_save', 'data-testid', 'training-trainees-upsert-submit-button'],
        ['btn_trainee_cancel', 'data-testid', 'training-trainees-upsert-cancel-button'],
        ['opt_dropdown_item', 'css', '[role="option"]:has-text("${data}")'],
        ['lbl_toast_success', 'css', '[data-sonner-toast][data-type=\'success\']'],
        ['lbl_toast_error', 'css', '[data-sonner-toast][data-type=\'error\']'],
        ['lbl_validation_error', 'css', '.text-destructive'],

        ['--- MÀN HÌNH GHÉP CẶP MENTOR ---', null, null],
        ['btn_matching_confirm', 'role', 'button[name="Xác nhận ghép cặp"]'],
        ['lbl_matching_success', 'text', 'Ghép cặp thành công']
    ];
    writeSheetData(workbook, "ELEMENT_QLHV", loginElementHeaders, hrElementRows);

    // 6. Write back custom preserved sheets at the end
    for (const [name, rows] of Object.entries(preservedSheets)) {
        const ws = workbook.addSheet(name);
        for (let r = 0; r < rows.length; r++) {
            const rowData = rows[r];
            for (let c = 0; c < rowData.length; c++) {
                ws.cell(r + 1, c + 1).value(rowData[c]);
            }
        }
        console.log(`  Restored preserved custom sheet: ${name}`);
    }

    // 7. Remove the temporary sheet
    workbook.deleteSheet("_TEMP_");

    // 8. Style headers and freeze first row for all sheets
    workbook.sheets().forEach(sheet => {
        sheet.freezePanes('A2');

        const range = sheet.usedRange();
        if (range) {
            const endCol = range.endCell().columnNumber();
            for (let c = 1; c <= endCol; c++) {
                const cell = sheet.cell(1, c);
                const val = cell.value();
                if (val !== null && val !== undefined && String(val).trim() !== "") {
                    cell.style("bold", true)
                        .style("fontColor", "ffffff")
                        .style("fill", {
                            type: "pattern",
                            pattern: "solid",
                            foreground: "1A3A4A"
                        })
                        .style("horizontalAlignment", "center");
                }
            }
        }
    });
    console.log("  Applied styling and froze row 1 on all worksheets.");

    await workbook.toFileAsync(filePath);
    console.log(`Saved ${filePath} successfully!\n`);
}

async function main() {
    const srcPath = path.resolve(__dirname, "..", "..", "..", "test-data", "Template_Master_Test_Suite.xlsx");
    const destPath = path.resolve(__dirname, "..", "..", "..", "test-data", "Master_Test_Suite.xlsx");

    // Read custom sheets from Master_Test_Suite.xlsx before copying
    const masterCustomSheets = {};
    if (fs.existsSync(destPath)) {
        console.log("Reading custom sheets from Master_Test_Suite.xlsx before copying...");
        try {
            const workbook = await XlsxPopulate.fromFileAsync(destPath);
            const standardSheets = new Set([
                "PAGE", "ACTION_LIST",
                "TEST_CASE_LOGIN", "DATA_LOGIN", "ELEMENT_LOGIN",
                "TEST_CASE_VACXIN", "DATA_VACXIN", "ELEMENT_VACXIN",
                "TEST_CASE_QLHV", "DATA_QLHV", "ELEMENT_QLHV",
                // Old names so they are not treated as custom sheets
                "TEST_CASE_LS_HR", "DATA_LS_HR", "ELEMENT_LS_HR",
                "TEST_CASE_LS_COMP", "DATA_LS_COMP", "ELEMENT_LS_COMP",
                "TEST_CASE_LS_EXAM", "DATA_LS_EXAM", "ELEMENT_LS_EXAM",
                "TEST_CASE_LS_COORD", "DATA_LS_COORD", "ELEMENT_LS_COORD",
                "TEST_CASE_LS_REP", "DATA_LS_REP", "ELEMENT_LS_REP",
                "ELEMENT", "DATA_LAMSANG", "TEST_CASE_LAMSANG"
            ]);
            workbook.sheets().forEach(sheet => {
                const name = sheet.name();
                if (!standardSheets.has(name)) {
                    const lastRow = getLastValuedRow(sheet, Array.from({ length: 20 }, (_, i) => i + 1));
                    const range = sheet.usedRange();
                    const lastCol = range ? range.endCell().columnNumber() : 1;
                    const rows = [];
                    for (let r = 1; r <= lastRow; r++) {
                        const rowVals = [];
                        for (let c = 1; c <= lastCol; c++) {
                            rowVals.push(sheet.cell(r, c).value());
                        }
                        rows.push(rowVals);
                    }
                    masterCustomSheets[name] = rows;
                }
            });
            console.log(`Successfully read custom sheets from existing Master_Test_Suite.xlsx`);
        } catch (e) {
            console.warn("Could not read existing Master_Test_Suite.xlsx (it might not exist or be empty). Skipping master custom sheets retention.", e);
        }
    }

    console.log("Copying template to master file...");
    fs.copyFileSync(srcPath, destPath);
    console.log("Copied successfully.");

    await updateExcelFile("Master_Test_Suite.xlsx", masterCustomSheets);
    await updateExcelFile("Template_Master_Test_Suite.xlsx", {});
}

main().catch(console.error);
