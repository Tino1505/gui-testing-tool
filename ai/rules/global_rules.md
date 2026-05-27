# QUY TẮC TOÀN CỤC (GLOBAL RULES) CHO AI AGENT

Tài liệu này quy định các quy tắc hành vi bắt buộc mà mọi AI Agent phải tuân thủ khi hỗ trợ QC thiết lập kịch bản hoặc tương tác với repository `unified-gui-testing-tool`.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Không thay đổi Code lõi (No Core Changes)**:
   * Mã nguồn nằm trong thư mục `framework/` là đóng gói chuẩn (standard library). **Tuyệt đối không thay đổi bất kỳ dòng code nào** trong `framework/` khi chuyển đổi dự án hoặc tạo kịch bản mới.
   * Mọi sự thay đổi về kịch bản, locator, và dữ liệu kiểm thử chỉ được phép thực hiện trên file Excel cấu hình (`test-data/Master_Test_Suite.xlsx`).

2. **Ngôn ngữ phản hồi (Language of Communication)**:
   * Sử dụng **Tiếng Việt** làm ngôn ngữ giao tiếp chính.
   * Đối với các thuật ngữ chuyên ngành công nghệ hoặc kiểm thử (ví dụ: *locator, test case, data-driven, keyword-driven, xpath, css selector, DOM, inspect*...), sử dụng **Tiếng Anh xen kẽ** để đảm bảo tính tự nhiên, dễ hiểu và chuyên nghiệp.

3. **Tính chính xác về cấu trúc (Structure Integrity)**:
   * Các bảng dữ liệu test sinh ra từ AI phải khớp 100% về tên cột, kiểu dữ liệu, và định dạng với cấu trúc đã được định nghĩa trong `Master_Test_Suite.xlsx`.

---

## 2. QUY TẮC ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT RULES)

1. **Bảng Markdown ăn khớp Excel (Excel-ready Markdown Tables)**:
   * Mọi kịch bản test case hay bộ định vị locator do AI sinh ra phải được hiển thị dưới dạng **Markdown Table**.
   * Không được tự ý thêm bớt các cột so với cấu trúc sheet đích trong Excel. Điều này giúp QC chỉ cần copy bảng Markdown từ chatbox và paste thẳng vào Excel mà không gặp lỗi lệch cột.

2. **Xử lý các cột kết quả tự sinh (Output Columns)**:
   * Trong các sheet `TEST_CASE_<MODULE>`, các cột bắt đầu bằng tiền tố `[o]_` (ví dụ: `[o]_observed`, `[o]_test_result`, `[o]_screenshot`, `[o]_duration_(s)`) là các cột ghi nhận kết quả chạy tự động của framework.
   * AI khi sinh template hoặc kịch bản ban đầu **phải bỏ trống** hoặc không cần điền dữ liệu cho các cột này.

---

## 3. QUY TRÌNH HỖ TRỢ DỰ ÁN MỚI (BOOTSTRAPPING PROCESS)

Khi bắt đầu một dự án kiểm thử mới, AI Agent phối hợp cùng QC tuân theo quy trình 3 bước sau:
1. **Bước 1: Trích xuất Element Map**: Chạy prompt `locator_extractor.prompt` để lấy toàn bộ locators trên màn hình và paste vào sheet `ELEMENT_<MODULE>`.
2. **Bước 2: Thiết kế Test Cases**: Chạy prompt `test_case_generator.prompt` dựa theo tài liệu yêu cầu (specifications/requirements) để sinh ra kịch bản chạy test (sheet `TEST_CASE_<MODULE>`) và dữ liệu đầu vào tương ứng (sheet `DATA_<MODULE>`).
3. **Bước 3: Khai báo Page**: Cập nhật URL trang web vào sheet `PAGE`.
