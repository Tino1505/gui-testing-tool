# TÀI LIỆU KIẾN TRÚC & HƯỚNG DẪN VẬN HÀNH FRAMEWORK
*(Tài liệu báo cáo Kiến trúc & Hướng dẫn dành cho Team Lead và Quản lý dự án)*

Tài liệu này cung cấp cái nhìn chi tiết về cấu trúc thư mục, mô hình thiết kế (Design Patterns), cơ chế xử lý cốt lõi của Framework kiểm thử tự động GUI dựa trên **Playwright + TypeScript**, theo hướng **Keyword-Driven & Data-Driven**.

---

## 1. Triết lý Thiết kế Cốt lõi (Design Philosophy)

Framework được thiết kế tuân thủ nghiêm ngặt các nguyên tắc của Senior QA Automation nhằm tối ưu hiệu quả bảo trì và mở rộng:

1. **Code không đổi khi đổi dự án / nghiệp vụ**:
   - Nhân (core framework) được đóng gói tách biệt hoàn toàn với kịch bản kiểm thử. 
   - Mọi thay đổi về quy trình nghiệp vụ, thông tin phần tử định vị (locators), dữ liệu đầu vào hoặc URL môi trường đều được thực hiện **100% trên file cấu hình Excel (`test-data/Master_Test_Suite.xlsx`)** mà không cần sửa code TypeScript.
2. **Kiến trúc Multi-Tenant**:
   - Sử dụng cùng một lõi kiểm thử để chạy cho nhiều dự án khác nhau (Vinmec, Lazada, Shopee...). Khi cấu hình dự án mới, chỉ cần thay đổi file Excel nghiệp vụ tương ứng của tenant đó.
3. **Quản lý Session Thông minh (Smart Session Management)**:
   - Cách ly session sạch hoàn toàn giữa các ca kiểm thử độc lập/âm tính để tránh nhiễu dữ liệu.
   - Kế thừa và tái sử dụng session đăng nhập thông minh đối với chuỗi ca kiểm thử nghiệp vụ liên hoàn thông qua cơ chế `Call Test Case` (bỏ qua các bước đăng nhập nếu session vẫn còn hiệu lực).

---

## 2. Chi tiết Cấu trúc Thư mục Dự án

```text
gui-testing-tool/
│
├── framework/                         # THƯ VIỆN CHUẨN (STANDARD LIBRARY - KHÔNG THAY ĐỔI)
│   ├── run.ts                         # Entry Point khởi chạy toàn bộ framework (đọc Excel, chạy test, sinh báo cáo)
│   │
│   ├── core/                          # TRÁI TIM CỦA FRAMEWORK (CORE LAYER)
│   │   ├── engine/                    # Trình điều khiển chính (Browser, Execution, Excel & Report)
│   │   │   ├── browser.manager.ts     # Quản lý vòng đời trình duyệt (Browser, Context, Page), tự động bật Headless
│   │   │   ├── core.runner.ts         # Trình thông dịch kịch bản Excel, điều phối hành động, giải quyết dữ liệu động
│   │   │   ├── excel/                 # Các tiện ích excel.reader.ts (đọc dữ liệu) & excel.validator.ts (kiểm tra lỗi cấu trúc)
│   │   │   └── report/                # report.manager.ts (tự động tạo báo cáo HTML, chụp screenshot và ghi kết quả)
│   │   │
│   │   ├── drivers/                   # playwright.wrapper.ts (Bọc lại API Playwright để xử lý ngoại lệ, đợi động)
│   │   └── utils/                     # data.resolver.ts (đọc biến động), update_excel_template.py (định dạng Excel)
│   │
│   ├── config/                        # Cấu hình hệ thống (framework.config.ts - Timeout, Viewport, Paths)
│   │
│   ├── actions/                       # THƯ VIỆN HÀNH ĐỘNG (KEYWORD LIBRARY)
│   │   ├── action.dispatcher.ts       # Router điều phối hành động ('click', 'input', 'check_status', 'refresh'...)
│   │   ├── browser.action.ts          # Thao tác trình duyệt (navigate, refresh, switch_tab)
│   │   ├── interaction.action.ts      # Thao tác chuột/phím vật lý (click, input, hover, select)
│   │   └── validation.action.ts       # Thao tác xác thực kết quả (verify_visible, verify_text)
│   │
│   └── controls/                      # THƯ VIỆN PHẦN TỬ UI (UI CONTROLS LAYER - UI ELEMENTS PATTERN)
│       ├── control.factory.ts         # Nhận diện loại phần tử qua Tiền tố (Prefix) của Target Element
│       ├── base.control.ts            # Lớp Control cơ sở chứa hành vi chung (click, verify_status, hover)
│       ├── input.control.ts           # Đối tượng TextBoxControl xử lý nhập liệu (tiền tố: txt_, inp_)
│       ├── dropdown.control.ts        # Đối tượng DropdownControl xử lý hộp chọn (tiền tố: ddl_, select_)
│       └── checkbox.control.ts        # Đối tượng CheckboxControl xử lý checkbox/radio (tiền tố: chk_, cb_)
│
├── test-data/                         # THƯ MỤC CẤU HÌNH NGHIỆP VỤ (CHỈ THAY ĐỔI KHI THAY ĐỔI DỰ ÁN)
│   └── Master_Test_Suite.xlsx         # File chứa kịch bản, phần tử định vị, trang và dữ liệu kiểm thử
│
├── reports/                           # LỊCH SỬ CHẠY THỬ & BẰNG CHỨNG (TỰ ĐỘNG SINH)
│   └── run_YYYY-MM-DDTHH-MM-SS/       # Thư mục riêng của từng lượt chạy kiểm thử
│       ├── Execution_Report.html      # Báo cáo HTML trực quan và tự động mở sau khi chạy
│       ├── Master_Test_Suite_Backup.xlsx # File Excel kết quả kiểm thử dự phòng
│       └── screenshots/               # Ảnh chụp bằng chứng (evidence) kiểm thử
│
├── mock-server/                       # GIAO DIỆN GIẢ LẬP ĐỂ TEST FRAMEWORK
│   ├── server.js                      # Web server Express phục vụ SPA Routing
│   └── views/                         # Trang web giả lập (vaccination.html, home.html) tích hợp các phần tử test
│
├── package.json                       # Scripts NPM và các thư viện phụ thuộc (Playwright, xlsx-populate, ts-node)
└── tsconfig.json                      # Cấu hình biên dịch TypeScript
```

---

## 3. Bản Đồ Cấu Hình Excel (`test-data/Master_Test_Suite.xlsx`)

Kịch bản được viết hoàn toàn trên Excel bằng cách liên kết các thành phần chính:

1. **`TEST_CASE`**: Định nghĩa chuỗi hành động kiểm thử.
   - `tc_id`: Mã ca kiểm thử (VD: `TC_LOGIN_001`).
   - `summary`: Mô tả tóm tắt hành vi.
   - `run`: Cờ kích hoạt (`Y` để chạy, `N` để bỏ qua).
   - `dataset`: Tên sheet dữ liệu tương ứng (nếu cần chạy lặp Data-Driven).
   - Các bước kiểm thử bao gồm: `Action` (Hành động), `TargetElement` (Phần tử đích), `TestDataKey` (Khóa dữ liệu), và `Expected` (Trạng thái mong đợi).
2. **`ELEMENT`**: Bản đồ định vị phần tử tập trung (Object Repository).
   - `ElementName`: Tên định danh duy nhất (VD: `btn_login`, `txt_username`). Tên này sử dụng các tiền tố chuẩn (`btn_`, `txt_`, `lbl_`, `error_`) giúp `ControlFactory` nhận biết kiểu phần tử tương ứng.
   - `LocatorType`: Phương thức tìm kiếm (`id`, `xpath`, `css`).
   - `LocatorValue`: Chuỗi định vị cụ thể (VD: `//button[@id='login']`).
3. **`PAGE`**: Quản lý đường dẫn của dự án.
   - `PageName`: Tên trang (VD: `url_sit_login`).
   - `UrlValue`: URL thực tế (VD: `http://localhost:8000/login`).
4. **`DATA_*` (ví dụ `DATA_LOGIN`)**: Chứa dữ liệu đầu vào.
   - Cấu trúc dạng bảng, mỗi cột là một tham số (VD: `Username`, `Password`). Mỗi dòng là một lượt lặp kiểm thử (Iteration).

---

## 4. Các Cơ Chế Kỹ Thuật Độc Đáo (Technical Mechanisms)

### A. Tự động kiểm tra lỗi cấu trúc trước khi chạy (Excel Validator)
Trước khi khởi động trình duyệt, `ExcelValidator` sẽ tự động phân tích file Excel để tìm các lỗi phổ biến như:
- Bước kiểm thử gọi `TargetElement` hoặc `Page` không tồn tại trong sheet `ELEMENT`/`PAGE`.
- Hành động `Action` nằm ngoài danh sách hỗ trợ của `ActionDispatcher`.
- Kịch bản chỉ định sheet `dataset` nhưng sheet đó không tồn tại.
- Kịch bản cấu hình sai cấu trúc hoặc trống thông tin quan trọng.
Điều này giúp QA phát hiện lỗi cấu hình Excel ngay lập tức mà không mất thời gian chạy trình duyệt.

### B. Giải quyết xung đột ghi đè tệp (`EBUSY` Safe Mode)
Trong quá trình chạy kiểm thử, nếu QA quên chưa đóng file Excel (`Master_Test_Suite.xlsx`), hệ thống ghi kết quả của `ReportManager` sẽ bị lỗi khóa file từ hệ điều hành (`EBUSY`).
- **Giải pháp**: Framework bắt ngoại lệ này một cách an toàn, in cảnh báo ra màn hình và chuyển hướng lưu kết quả vào tệp `Master_Test_Suite_Backup.xlsx` tại thư mục báo cáo thời gian thực. Quy trình kiểm thử vẫn tiếp tục chạy hoàn tất và không bị crash nửa chừng.

### C. Quản lý Context và Chế độ Chạy nền (Headless Mode)
- Framework tự động phân tích biến môi trường `HEADLESS`.
- Khi chạy trong môi trường CI/CD hoặc các terminal sandbox (không có giao diện màn hình), hệ thống tự động bật chế độ `headless: true`.
- Khi chạy trên máy cá nhân để debug, QA có thể đặt `HEADLESS=false` để hiển thị cửa sổ trình duyệt thực tế.

---

## 5. Hướng dẫn sử dụng cho QA và Bảo trì Kịch bản

### A. Quy trình chạy kiểm thử:
1. Chạy mock server để thử nghiệm:
   ```bash
   npm run serve
   ```
2. Khởi chạy bộ kiểm thử tự động:
   ```bash
   npm run test
   ```
3. Sau khi kết thúc, báo cáo HTML trực quan sẽ tự động hiển thị trên trình duyệt.

### B. Hướng dẫn viết ca kiểm thử chuẩn hóa:
- **Nguyên tắc 1 Test Case = 1 check_status**: Để kịch bản rõ ràng, mỗi Test Case chỉ nên chứa **đúng 1 bước `check_status` ở dòng cuối cùng** của Test Case đó để xác nhận kết quả.
- **Tách biệt Đăng nhập thành Precondition**: Đăng nhập (`TC_LOGIN_001`) được viết thành một kịch bản riêng độc lập. Các Test Case nghiệp vụ tiếp theo chỉ cần gọi bước đầu tiên là `call_tc` với Target là `TC_LOGIN_001` làm Precondition.
- **Làm mới giao diện khi chuyển tiếp**: Sử dụng hành động `Refresh Precondition` (`refresh` trong Excel) ở đầu kịch bản để đảm bảo giao diện luôn được đưa về trạng thái sạch trước khi thực hiện bước nghiệp vụ mới, giúp ngăn chặn lỗi do tàn dư giao diện cũ.

---

## 6. Đề xuất Quy trình Phối hợp cho Team (Báo cáo cho Lead)

Việc áp dụng kiến trúc Keyword/Data-Driven mang lại mô hình phối hợp lý tưởng cho dự án:

1. **Manual QA / Business Analyst (BA)**:
   - Có thể trực tiếp thiết kế, sửa đổi bước kiểm thử, thêm bộ dữ liệu kiểm thử (accounts mới, vắc xin mới) trực tiếp trên file Excel mà không cần biết lập trình TypeScript hay Playwright.
2. **Automation QA Engineer**:
   - Tập trung phát triển các Keywords mới (nếu phát sinh hành động phức tạp), tối ưu hóa tốc độ chạy của core framework, cấu hình hạ tầng CI/CD, và hỗ trợ Manual QA xử lý các locators khó (như xpath động).
3. **Tiết kiệm chi phí**:
   - Khi dự án thay đổi thiết kế giao diện (đổi ID/Xpath), chỉ cần cập nhật 1 dòng duy nhất trong sheet `ELEMENT` của file Excel. Không phát sinh chi phí refactor code.
