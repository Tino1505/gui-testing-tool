=============================================================
             NO-CODE GUI TESTING TOOL ENGINE (PLAYWRIGHT + TS)
=============================================================

Công cụ tự động hóa kiểm thử giao diện (GUI Testing) cho phép 
thực thi kịch bản kiểm thử (Test Cases) trực tiếp từ file Excel theo mô hình Data-Driven và Keyword-Driven.
Dự án được xây dựng với kiến trúc Multi-Tenant, cho phép quản lý và chạy test cho nhiều dự án khác nhau (Ví dụ: Vinmec, Lazada...) bằng cùng một lõi Framework.

1. CẤU TRÚC THƯ MỤC
-------------------
gui-testing-tool/
│
├── framework/                         # LÕI FRAMEWORK – DÙNG CHUNG CHO MỌI DỰ ÁN
│   ├── engine/                        # Core Flow
│   │   ├── browser.manager.ts         # Quản lý Browser (Playwright)
│   │   ├── excel/                     # Đọc/Ghi dữ liệu Excel
│   │   ├── keyword/                   # Dispatch keyword -> Action
│   │   └── report/                    # Quản lý Report & Screenshot
│   │
│   ├── actions/                       # Tầng Action (Keywords)
│   │   └── common/                    # Các thao tác chung (navigation, keyboard, mouse, wait, validation, toggle, upload)
│   │
│   ├── controls/                      # UI Element Abstraction
│   │   ├── base/                      # Base Control
│   │   ├── input/                     # Textbox
│   │   ├── selection/                 # Dropdown, Combobox, Radio
│   │   ├── toggle/                    # Checkbox
│   │   ├── table/                     # Table, Pagination
│   │   └── overlay/                   # Modal, Toast, Tooltip
│   │
│   ├── drivers/                       # Tầng Low-level
│   │   └── playwright.driver.ts       # Wrapper an toàn cho Playwright
│   │
│   ├── utils/                         # Các hàm tiện ích
│   │   ├── data.resolver.ts           # Phân tích biến từ Excel ($sheet.col)
│   │   └── sleep.util.ts              # Hàm delay
│   │
│   ├── config/                        # Cấu hình chung (Timeout, Viewport)
│   └── run.ts                         # Entry point của Framework
│
├── test-data/                           # THƯ MỤC LƯU KỊCH BẢN TEST
│   └── Master_Test_Suite.xlsx         # File kịch bản Test
├── reports/                           # Thư mục chứa các file báo cáo và evidence (tự động sinh)
├── package.json                       # Cấu hình NPM và scripts
├── tsconfig.json                      # Cấu hình TypeScript
└── README.txt                         # Tài liệu hướng dẫn sử dụng

2. CẤU TRÚC FILE EXCEL (test-data/Master_Test_Suite.xlsx)
---------------------------------------------------------
Kiến trúc Automation Data theo mô hình Keyword-Driven và Data-Driven:
- [TEST_CASE]: Danh sách Test Case và các bước kịch bản chi tiết.
- [DATA_*]: Dữ liệu đầu vào cho từng Test Case (Hỗ trợ loop data).
- [ELEMENT]: Lưu trữ định vị (Locator) của các phần tử trên trang.
- [PAGE]: Lưu trữ đường dẫn URL các trang web.

3. HƯỚNG DẪN CÀI ĐẶT
-----------------------------
Mở Terminal / CMD / PowerShell tại thư mục gốc của dự án `gui-testing-tool`:

B1. Cài đặt các thư viện Node.js:
    > npm install

B2. Cài đặt trình duyệt cho Playwright (Bắt buộc chạy lần đầu):
    > npx playwright install

4. HƯỚNG DẪN THỰC THI TEST
--------------------------
Mở Terminal tại thư mục gốc `gui-testing-tool/` và chạy lệnh:

    > npm run test

*(Hệ thống sẽ tự động tìm vào thư mục `test-data/Master_Test_Suite.xlsx` để đọc kịch bản và chạy)*

5. XEM KẾT QUẢ BÁO CÁO
----------------------
Sau khi chạy xong, kết quả được lưu tự động tại thư mục `reports/run_YYYY-MM-DDTHH-MM-SS/`:
- Execution_Report.html: Báo cáo HTML trực quan, liệt kê chi tiết từng Test Case và dữ liệu tương ứng.
- Master_Test_Suite_Backup.xlsx: File backup có ghi lại kết quả Pass/Fail.
- screenshots/: Chứa ảnh chụp màn hình khi có lỗi hoặc khi kết thúc Test Case.
