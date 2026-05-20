=============================================================
             GUI TESTING TOOL (PLAYWRIGHT + TS)
=============================================================

Công cụ tự động hóa kiểm thử giao diện (GUI Testing) cho phép 
thực thi kịch bản kiểm thử (Test Cases) trực tiếp từ file Excel theo mô hình Data-Driven và Keyword-Driven.
Dự án được xây dựng với kiến trúc Multi-Tenant, cho phép quản lý và chạy test cho nhiều dự án khác nhau (Ví dụ: Vinmec, Lazada...) bằng cùng một lõi Framework.

1. CẤU TRÚC THƯ MỤC
-------------------
gui-testing-tool/
│
├── framework/                         # ĐÓNG GÓI CHUẨN (STANDARD LIBRARY)
│   ├── run.ts                         # Entry Point khởi chạy toàn bộ framework
│   │
│   ├── core/                          # TRÁI TIM CỦA FRAMEWORK (CORE LAYER)
│   │   ├── engine/                    # Trình điều khiển chính (Browser Manager, Core Runner)
│   │   │   ├── excel/                 # excel.reader.ts (đọc Excel), excel.validator.ts (kiểm tra lỗi cấu trúc)
│   │   │   └── report/                # report.manager.ts (tự động tạo báo cáo HTML & Screenshots)
│   │   │
│   │   ├── drivers/                   # playwright.wrapper.ts (Bọc lại API Playwright)
│   │   └── utils/                     # data.resolver.ts (đọc biến động), update_excel_template.py (định dạng Excel)
│   │
│   ├── config/                        # Cấu hình dự án (framework.config.ts)
│   │
│   ├── actions/                       # THƯ VIỆN HÀNH ĐỘNG (KEYWORD LIBRARY)
│   │   ├── action.dispatcher.ts       # Router: Điều phối hành động tương ứng ('click', 'input', ...)
│   │   ├── browser.action.ts          # Thao tác trình duyệt (navigate, refresh, switch_tab)
│   │   ├── interaction.action.ts      # Thao tác chuột/phím (click, input, hover)
│   │   └── validation.action.ts       # Thao tác kiểm tra (verify_visible, verify_text)
│   │
│   └── controls/                      # THƯ VIỆN PHẦN TỬ UI (UI CONTROLS LAYER)
│       ├── control.factory.ts         # Nhận diện phần tử phù hợp qua Prefix của Target
│       ├── base.control.ts            # Lớp Control cơ bản (click, hover, verify) cho buttons, labels
│       ├── input.control.ts           # Lớp TextBoxControl cho ô nhập liệu (txt_, inp_)
│       ├── dropdown.control.ts        # Lớp DropdownControl cho select box (ddl_, select_)
│       └── checkbox.control.ts        # Lớp CheckboxControl cho checkbox/radio (chk_, cb_)
│
├── test-data/                         # CHỈ THAY ĐỔI THƯ MỤC NÀY KHI SANG DỰ ÁN MỚI
│   └── Master_Test_Suite.xlsx         # Chứa kịch bản e-commerce, y tế, v.v.
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
