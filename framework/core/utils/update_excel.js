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
            const lastRow = getLastValuedRow(sheet, Array.from({length: 20}, (_, i) => i + 1));
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
        ["navigate","Mở URL"],
        ["go_back","Quay lại trang trước"],
        ["go_forward","Tiến tới trang tiếp theo"],
        ["refresh","Reload trang hiện tại"],
        ["check_status","Kiểm tra trạng thái element theo expect (visible, exists, text, value, enabled, checked…)"],
        ["click","Click vào element"],
        ["double_click","Double click vào element"],
        ["right_click","Click chuột phải vào element"],
        ["hover","Di chuột lên element"],
        ["focus","Focus vào element"],
        ["blur","Rời focus khỏi element"],
        ["press_key","Nhấn phím (Enter, Tab, Esc…)"],
        ["input","Nhập text vào field"],
        ["clear","Xóa text trong field"],
        ["upload_file","Upload file qua input type=file"],
        ["drag_drop","Kéo thả element tới target"],
        ["scroll_to","Scroll tới element"],
        ["scroll_by","Scroll theo tọa độ (x, y)"],
        ["select_by_text","Chọn dropdown theo text hiển thị"],
        ["select_by_value","Chọn dropdown theo value"],
        ["check","Check checkbox"],
        ["uncheck","Uncheck checkbox"],
        ["capture","Chụp màn hình"]
    ];
    writeSheetData(workbook, "ACTION_LIST", ACTION_HEADERS, ACTION_ROWS);

    // 5. Define standard columns for test cases
    const TC_HEADERS = ["tc-id","summary","type","step","action","target","value","expected","[o]_observed","[o]_test_result","[o]_screenshot","[o]_duration_(s)"];

    // --- Module 1: LOGIN ---
    const loginTestCases = [
        ['TC_LOGIN_001', 'Đăng nhập thành công với tài khoản SIT Vinmec', 'pos', '1', 'navigate', 'url_sit_login', null, null],
        [null, null, null, '2', 'click', 'btn_sit_login', null, null],
        [null, null, null, '3', 'input', 'txt_username', '$data_login.username', null],
        [null, null, null, '4', 'input', 'txt_password', '$data_login.password', null],
        [null, null, null, '5', 'click', 'btn_login', null, null],
        [null, null, null, '6', 'click', 'btn_dynamic_select', null, null],
        [null, null, null, '7', 'check_status', 'lbl_dashboard_data', null, 'visible'],

        ['TC_LOGIN_002', 'Đăng nhập thất bại với tài khoản sai định dạng/mật khẩu', 'neg', '1', 'navigate', 'url_sit_login', null, null],
        [null, null, null, '2', 'click', 'btn_sit_login', null, null],
        [null, null, null, '3', 'input', 'txt_username', '$data_login.username', null],
        [null, null, null, '4', 'input', 'txt_password', '$data_login.password', null],
        [null, null, null, '5', 'click', 'btn_login', null, null],
        [null, null, null, '6', 'check_status', 'error_msg', null, 'visible']
    ];
    writeSheetData(workbook, "TEST_CASE_LOGIN", TC_HEADERS, loginTestCases);

    const loginDataHeaders = ["test_case_type","username","password","select_hospital"];
    const loginDataRows = [
        ["pos", "admin@vinmec.com", "Test@1234", "Bệnh viện Đa khoa Quốc tế Vinmec Hải Phòng"],
        ["neg", "admin@admin.com", "admin123", "Bệnh viện Đa khoa Quốc tế Vinmec Central Park"],
        ["neg", "admin@admin.com", "empty", "Bệnh viện Đa khoa Quốc tế Vinmec Đà Nẵng"],
        [null, null, null, "Bệnh viện Đa khoa Quốc tế Vinmec Nha Trang"],
        [null, null, null, "Bệnh viện Đa khoa Quốc tế Vinmec Times City"],
        [null, null, null, "Phòng khám Đa khoa Quốc tế Vinmec Royal City"],
        ["ds_ls_trainee_pos", "admin@vinmec.com", "Test@1234", "Bệnh viện Đa khoa Quốc tế Vinmec Times City"],
        ["ds_ls_trainee_neg", "admin@admin.com", "admin123", "Bệnh viện Đa khoa Quốc tế Vinmec Times City"]
    ];
    writeSheetData(workbook, "DATA_LOGIN", loginDataHeaders, loginDataRows);

    const loginElementHeaders = ["element_id","locator_type","locator_value"];
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
        ['TC_VAC_001', 'Kiểm tra giao diện Dashboard Tiêm Chủng', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, '2', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, '3', 'check_status', 'lbl_card_cho_day_cdc', null, 'visible'],

        ['TC_VAC_002', 'Kiểm tra chuyển hướng menu con 9.1.1 Điều phối tiêm chủng', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, '2', 'Refresh Precondition', null, null, null],
        [null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, '4', 'click', 'lnk_sidebar_dieupboi', null, null],
        [null, null, null, '5', 'check_status', 'lbl_dieu_phoi_title', null, 'visible'],

        ['TC_VAC_003', 'Kiểm tra nút tương tác Xác nhận tiêm', 'pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, '2', 'Refresh Precondition', null, null, null],
        [null, null, null, '3', 'navigate', 'url_vinmec_vaccine', null, null],
        [null, null, null, '4', 'click', 'btn_xac_nhan_tiem', null, null],
        [null, null, null, '5', 'check_status', 'lbl_modal_xac_nhan', null, 'visible']
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
        ['TC_QLHV_001', 'Thêm học viên mới và ghép cặp mentor', 'ds_ls_trainee_pos', '1', 'call_tc', 'TC_LOGIN_001', null, null],
        [null, null, null, '2', 'navigate', 'url_ls_trainees', null, null],
        [null, null, null, '3', 'click', 'btn_trainee_add', null, null],
        [null, null, null, '4', 'input', 'txt_trainee_code', '$data_qlhv.trainee_code', null],
        [null, null, null, '5', 'click', 'rad_trainee_type', '$data_qlhv.trainee_type', null],
        [null, null, null, '6', 'input', 'txt_trainee_name', '$data_qlhv.trainee_name', null],
        [null, null, null, '7', 'input', 'txt_trainee_dob', '$data_qlhv.trainee_dob', null],
        [null, null, null, '8', 'input', 'txt_trainee_cccd', '$data_qlhv.trainee_cccd', null],
        [null, null, null, '9', 'click', 'btn_trainee_gender', null, null],
        [null, null, null, '10', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_gender', null],
        [null, null, null, '11', 'click', 'btn_trainee_job_group', null, null],
        [null, null, null, '12', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_job_group', null],
        [null, null, null, '13', 'click', 'btn_trainee_title', null, null],
        [null, null, null, '14', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_title', null],
        [null, null, null, '15', 'input', 'txt_trainee_title_other', '$data_qlhv.trainee_title_other', null],
        [null, null, null, '16', 'click', 'btn_trainee_degree', null, null],
        [null, null, null, '17', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_degree', null],
        [null, null, null, '18', 'click', 'btn_trainee_specialty', null, null],
        [null, null, null, '19', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_specialty', null],
        [null, null, null, '20', 'click', 'btn_trainee_workplace', null, null],
        [null, null, null, '21', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_workplace', null],
        [null, null, null, '22', 'click', 'btn_trainee_department', null, null],
        [null, null, null, '23', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_department', null],
        [null, null, null, '24', 'input', 'txt_trainee_email', '$data_qlhv.trainee_email', null],
        [null, null, null, '25', 'input', 'txt_trainee_phone', '$data_qlhv.trainee_phone', null],
        [null, null, null, '26', 'input', 'txt_trainee_tax_code', '$data_qlhv.trainee_tax_code', null],
        [null, null, null, '27', 'input', 'txt_trainee_account', '$data_qlhv.trainee_account', null],
        [null, null, null, '28', 'click', 'btn_trainee_bank', null, null],
        [null, null, null, '29', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_bank', null],
        [null, null, null, '30', 'click', 'btn_trainee_program', null, null],
        [null, null, null, '31', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_program', null],
        [null, null, null, '32', 'click', 'btn_trainee_class', null, null],
        [null, null, null, '33', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_class', null],
        [null, null, null, '34', 'click', 'btn_trainee_mentor', null, null],
        [null, null, null, '35', 'click', 'opt_dropdown_item', '$data_qlhv.trainee_mentor', null],
        [null, null, null, '36', 'input', 'txt_trainee_school', '$data_qlhv.trainee_school', null],
        [null, null, null, '37', 'input', 'txt_trainee_start_date', '$data_qlhv.trainee_start_date', null],
        [null, null, null, '38', 'click', 'btn_trainee_save', null, null],
        [null, null, null, '39', 'click', 'lnk_menu_coordination', null, null],
        [null, null, null, '40', 'click', 'lnk_mentor_matching', null, null],
        [null, null, null, '41', 'click', 'btn_matching_confirm', null, null],
        [null, null, null, '42', 'check_status', 'lbl_matching_success', null, 'visible']
    ];
    writeSheetData(workbook, "TEST_CASE_QLHV", TC_HEADERS, hrTestCases);

    const hrDataHeaders = [
        'test_case_type', 'trainee_code', 'trainee_name', 'trainee_dob', 'trainee_cccd',
        'trainee_gender', 'trainee_job_group', 'trainee_title', 'trainee_title_other',
        'trainee_degree', 'trainee_specialty', 'trainee_workplace', 'trainee_department',
        'trainee_email', 'trainee_phone', 'trainee_type', 'trainee_tax_code', 'trainee_account',
        'trainee_bank', 'trainee_program', 'trainee_class', 'trainee_mentor', 'trainee_school',
        'trainee_start_date'
    ];
    const hrDataRows = [
        [
            'ds_ls_trainee_pos', 'NV-12345', 'Nguyễn Văn A', '1995-05-15', '001095012345',
            'Nam', 'Bác sĩ', 'Bác sĩ', '',
            'Thạc sĩ', 'Nội khoa', 'Vinmec Times City', 'Khoa Cấp cứu',
            'test.student@vinmec.com', '0987654321', 'Bên ngoài', '8091234567', '19033333333333',
            'Techcombank', 'Đào tạo Cấp cứu Cơ bản', 'Lớp Cấp cứu 2026-A', 'Trần Thị B', 'Đại học Y Hà Nội',
            '2026-06-01'
        ],
        [
            'ds_ls_trainee_neg', 'NV-ERROR', 'Lỗi Tên', '1990-01-01', '000000000000',
            'Nữ', 'Bác sĩ', 'Bác sĩ', '',
            'Đại học', 'Nội khoa', 'Vinmec Times City', 'Khoa Cấp cứu',
            'error.email', '0000000000', 'Bên ngoài', '', '',
            '', '', '', '', '',
            '', ''
        ]
    ];
    writeSheetData(workbook, "DATA_QLHV", hrDataHeaders, hrDataRows);

    const hrElementRows = [
        ['--- MÀN HÌNH ĐÀO TẠO LÂM SÀNG - ĐIỀU HƯỚNG ---', null, null],
        ['lnk_menu_coordination', 'xpath', '//span[contains(text(), \'13.4 Điều phối\')]'],
        ['lnk_mentor_matching', 'xpath', '//*[contains(text(), \'13.4.3\')]'],
        ['lnk_clinical_logbook', 'xpath', '//*[contains(text(), \'13.5.2\')]'],
        ['--- MÀN HÌNH QUẢN LÝ HỌC VIÊN ---', null, null],
        ['btn_trainee_add', 'xpath', '//button[contains(., \'Thêm học viên\') or contains(., \'Thêm Học viên\')]'],
        ['txt_trainee_code', 'xpath', '//div[label[contains(., \'Mã nhân viên\')]]//input'],
        ['txt_trainee_name', 'css', '[data-testid="training-trainees-upsert-name-input"]'],
        ['txt_trainee_dob', 'xpath', '//div[label[contains(., \'Ngày sinh\')]]//input'],
        ['txt_trainee_cccd', 'xpath', '//div[label[contains(., \'CCCD\')]]//input'],
        ['btn_trainee_gender', 'xpath', '//div[label[contains(., \'Giới tính\')]]//button'],
        ['btn_trainee_job_group', 'xpath', '//div[label[contains(., \'Nhóm nghề\')]]//button'],
        ['btn_trainee_title', 'xpath', '//div[label[contains(., \'Chức danh\')]]//button'],
        ['txt_trainee_title_other', 'xpath', '//div[label[contains(., \'Chức danh khác\')]]//input'],
        ['btn_trainee_degree', 'xpath', '//div[label[contains(., \'Bằng cấp\')]]//button'],
        ['btn_trainee_specialty', 'xpath', '//div[label[contains(., \'Chuyên ngành\')]]//button'],
        ['btn_trainee_workplace', 'xpath', '//div[label[contains(., \'Đơn vị công tác\')]]//button'],
        ['btn_trainee_department', 'xpath', '//div[label[contains(., \'Khoa / phòng\')]]//button'],
        ['txt_trainee_email', 'xpath', '//div[label[contains(., \'Thư điện tử\')]]//input'],
        ['txt_trainee_phone', 'xpath', '//div[label[contains(., \'Số điện thoại\')]]//input'],
        ['rad_trainee_type', 'xpath', '//label[contains(., \'${data}\')]'],
        ['txt_trainee_tax_code', 'xpath', '//div[label[contains(., \'Mã số thuế\')]]//input'],
        ['txt_trainee_account', 'xpath', '//div[label[contains(., \'Số tài khoản\')]]//input'],
        ['btn_trainee_bank', 'xpath', '//div[label[contains(., \'Ngân hàng\')]]//button'],
        ['btn_trainee_program', 'xpath', '//div[label[contains(., \'Chương trình đào tạo\')]]//button'],
        ['btn_trainee_class', 'xpath', '//div[label[contains(., \'Lớp đào tạo\')]]//button'],
        ['btn_trainee_mentor', 'xpath', '//div[label[contains(., \'Người hướng dẫn\')]]//button'],
        ['txt_trainee_school', 'xpath', '//div[label[contains(., \'Trường đào tạo\')]]//input'],
        ['txt_trainee_start_date', 'xpath', '//div[label[contains(., \'Ngày bắt đầu\')]]//input'],
        ['btn_trainee_save', 'xpath', '//button[text()=\'Lưu Học viên\']'],
        ['opt_dropdown_item', 'xpath', '//div[@role=\'option\' and contains(., \'${data}\')]'],
        ['--- MÀN HÌNH GHÉP CẶP MENTOR ---', null, null],
        ['btn_matching_confirm', 'xpath', '//button[contains(., \'Xác nhận ghép cặp\')]'],
        ['lbl_matching_success', 'xpath', '//*[contains(text(), \'Ghép cặp thành công\') or contains(text(), \'Thành công\')]']
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
        sheet.freezePanes(0, 1);
        
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
                    const lastRow = getLastValuedRow(sheet, Array.from({length: 20}, (_, i) => i + 1));
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
