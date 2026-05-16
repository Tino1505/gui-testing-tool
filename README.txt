=============================================================
             NO-CODE GUI TESTING TOOL ENGINE
=============================================================

Công cụ tự động hóa kiểm thử giao diện (GUI Testing) cho phép 
thực thi kịch bản kiểm thử (Test Cases) trực tiếp từ file Excel theo mô hình Data-Driven.

1. CẤU TRÚC THƯ MỤC
-------------------
gui-testing-tool/
├── core/
│   ├── engine/                # Core logic tự động hóa (Selenium)
│   │   ├── browser.py         # Quản lý khởi tạo trình duyệt
│   │   ├── excel_reader.py    # Đọc và phân tích file Excel
│   │   ├── report.py          # Xuất báo cáo HTML
│   │   └── runner.py          # Thực thi thao tác (navigate, input, click...)
│   │
│   ├── requirements.txt       # Danh sách thư viện Python cần thiết
│   └── run.py                 # File khởi chạy chương trình chính
│
├── demo-app/                  # Ứng dụng Web tĩnh để chạy demo automation
├── drivers/                   # WebDrivers dùng để điều khiển trình duyệt
├── reports/                   # Thư mục chứa các file báo cáo và evidence (tự động sinh)
├── test-data/
│   └── Master_Test_Suite.xlsx # File Excel cấu hình kịch bản test (Dành cho QA)
└── README.txt                 # Tài liệu hướng dẫn sử dụng

2. CẤU TRÚC FILE EXCEL (test-data/Master_Test_Suite.xlsx)
---------------------------------------------------------
Kiến trúc Automation Data theo mô hình Keyword-Driven và Data-Driven:
- [Test_Cases]: Danh sách Test Case. Chỉ những Test Case đánh cờ 'Yes' ở cột Execute mới chạy.
- [Test_Steps]: Kịch bản chi tiết của từng Test Case (Action, Target, Value).
- [Test_Data]: Dữ liệu đầu vào cho từng bộ dữ liệu. Hỗ trợ chạy 1 Test Case với nhiều Data_ID.
- [Object_Repository]: Lưu trữ định vị (Locator/XPath) của các phần tử trên trang.

3. HƯỚNG DẪN CLONE VÀ CÀI ĐẶT
-----------------------------
Mở Terminal / CMD / Git Bash tại thư mục bạn muốn lưu code:

B1. Clone source code từ GitHub:
    > git clone https://github.com/Tino1505/gui-testing-tool.git
    > cd gui-testing-tool

B2. Tạo môi trường ảo (Virtual Environment):
    > python -m venv venv

B3. Kích hoạt môi trường ảo (Bắt buộc mỗi lần mở Terminal mới):
    - Trên Windows (CMD): 
      > venv\Scripts\activate
    - Trên Windows (PowerShell):
      > venv\Scripts\Activate.ps1
    - Trên Mac/Linux: 
      > source venv/bin/activate

B4. Cài đặt các thư viện cần thiết:
    > pip install -r core/requirements.txt

4. HƯỚNG DẪN THỰC THI TEST
--------------------------
Mở Terminal / CMD tại thư mục gốc `gui-testing-tool/` (đảm bảo môi trường ảo venv đang kích hoạt bằng lệnh ở B3):

    > python core/run.py

5. XEM KẾT QUẢ BÁO CÁO
----------------------
Sau khi chạy xong, kết quả được lưu tự động tại thư mục `reports/run_YYYYMMDD_HHMMSS/`:
- Report_YYYYMMDD_HHMMSS.html: Báo cáo HTML trực quan, liệt kê chi tiết từng Test Case và dữ liệu tương ứng.
- Các ảnh chụp màn hình (screenshots) khi có lỗi hoặc verify (tự động đính kèm vào báo cáo HTML).
