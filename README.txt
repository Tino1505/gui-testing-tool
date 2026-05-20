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
│   │
│   ├── core/                          # TRÁI TIM CỦA FRAMEWORK
│   │   ├── engine/                    # Runner, Execution Context, Excel Reader/Writer, Report
│   │   ├── drivers/                   # Playwright Wrapper (Bọc lại API Playwright)
│   │   └── utils/                     # Locator Resolver, Data Resolver, String Util
│   │
│   ├── config/                        # [CẤU HÌNH DỰ ÁN] (Được phép sửa khi đổi môi trường)
│   │   └── framework.config.ts
│   │
│   ├── actions/                       # [THƯ VIỆN KEYWORD] (Mở rộng khi cần action mới)
│   │   ├── action.dispatcher.ts       # Router: 'input' -> gọi InteractionAction.input()
│   │   ├── browser.action.ts          # navigate, refresh, switch_tab
│   │   ├── interaction.action.ts      # click, input, hover
│   │   └── validation.action.ts       # verify_visible, verify_text
│   │
│   └── controls/                      # [THƯ VIỆN COMPONENT] (Mở rộng khi có element mới)
│       ├── control.factory.ts         # Quyết định dùng Control nào dựa vào Prefix của Target
│       ├── input.control.ts           # textboxes
│       ├── button.control.ts          # buttons
│       └── text.control.ts            # labels, spans, error messages
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
