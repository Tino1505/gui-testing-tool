=============================================================
             NO-CODE GUI TESTING TOOL ENGINE
=============================================================

Công cụ tự động hóa kiểm thử giao diện (GUI Testing) cho phép 
thực thi kịch bản kiểm thử (Test Cases) trực tiếp từ file Excel.

1. CẤU TRÚC THƯ MỤC
-------------------
gui-testing-tool/
├── core/
│   ├── engine/                # Core logic tự động hóa (Selenium)
│   │   ├── browser.py         # Quản lý khởi tạo trình duyệt
│   │   ├── excel_reader.py    # Đọc và phân tích file Excel
│   │   ├── report.py          # Xuất báo cáo HTML và Excel
│   │   ├── runner.py          # Thực thi thao tác (navigate, input, click...)
│   │   └── screenshot.py      # Chụp ảnh màn hình (Evidence)
│   │
│   ├── requirements.txt       # Danh sách thư viện Python cần thiết
│   └── run.py                 # File khởi chạy chương trình chính
│
├── reports/                   # Thư mục chứa các file báo cáo (tự động sinh)
├── screenshots/               # Thư mục chứa ảnh evidence (tự động sinh)
├── test-data/
│   └── demo_test_data.xlsx    # File Excel cấu hình kịch bản test (Dành cho QA)
├── venv/                      # Môi trường ảo Python (Virtual Environment)
└── README.txt                 # Tài liệu hướng dẫn sử dụng

2. CẤU TRÚC FILE EXCEL (test-data/demo_test_data.xlsx)
------------------------------------------------------
Gồm 4 Sheet liên kết với nhau theo cấu trúc Keyword-Driven:
- [PAGE]: Cấu hình URL cho các trang (page_id, url).
- [LOCATOR]: Định nghĩa phần tử giao diện (element_id, locator_value).
- [TEST_DATA]: Dữ liệu đầu vào (data_key, value).
- [TEST_CASE]: Viết kịch bản test (tc_id, step, action, target, data). 
  * Các Action hỗ trợ: navigate, input, click, click_first, check, verify_visible.

3. HƯỚNG DẪN CÀI ĐẶT
--------------------
Mở Terminal / CMD tại thư mục gốc `qc-demo/`:

B1. Tạo môi trường ảo (nếu chưa có):
    > python -m venv venv

B2. Cài đặt các thư viện cần thiết:
    > venv\Scripts\pip install -r core\requirements.txt

4. HƯỚNG DẪN THỰC THI TEST
--------------------------
Mở Terminal / CMD tại thư mục gốc `qc-demo/` và chạy lệnh sau:

    venv\Scripts\activate

    > python core/run.py

5. XEM KẾT QUẢ BÁO CÁO
----------------------
Sau khi chạy xong, kết quả được lưu tự động tại thư mục `reports/`:
- Report_YYYYMMDD_HHMMSS.html: Xem kết quả trực quan trên trình duyệt web.
- Report_YYYYMMDD_HHMMSS.xlsx: Báo cáo chi tiết định dạng Excel (kèm hình chụp).
