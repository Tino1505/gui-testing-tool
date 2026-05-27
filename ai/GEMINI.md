# CHỈ THỊ HỆ THỐNG DÀNH CHO AI AGENT (SYSTEM INSTRUCTIONS)

Tệp tin này đóng vai trò là "la bàn" chỉ dẫn cho mọi AI Agent (như Gemini, Claude...) khi tham gia vào quá trình phát triển kịch bản test hoặc bảo trì dự án này.

---

## 1. HIỂU VỀ KIẾN TRÚC FRAMEWORK (UNDERSTAND THE ARCHITECTURE)

Dự án này là một **Keyword & Data-Driven UI Testing Framework** viết bằng **TypeScript** và **Playwright**.
* **Đóng gói mã nguồn (Engine)**: Nằm hoàn toàn trong thư mục `framework/`. Thư mục này chứa core runner, browser manager, và các wrappers tương tác. **KHÔNG THAY ĐỔI** code tại đây trừ khi có yêu cầu đặc biệt về nâng cấp framework lõi.
* **Cấu hình kịch bản (Test Suite)**: Nằm hoàn toàn trong file Excel `test-data/Master_Test_Suite.xlsx`. Mọi dự án mới chỉ cần cập nhật file Excel này.

---

## 2. NHIỆM VỤ CHÍNH CỦA AI AGENT TRONG REPO NÀY

Khi QC yêu cầu hỗ trợ, AI Agent phải sẵn sàng thực hiện các kỹ năng chuyên biệt nằm trong thư mục `ai/skills/`:
1. **Trích xuất bộ định vị (Locator Mining)**:
   * Đọc HTML/DOM của website và trích xuất thành bảng element khớp với sheet `ELEMENT_<MODULE>`.
   * Tuân thủ nghiêm ngặt thứ tự ưu tiên locator và cách đặt tiền tố element ID quy định trong [locator_strategy.md](file:../unified-gui-testing-tool/ai/rules/locator_strategy.md).
2. **Thiết kế Kịch bản kiểm thử (Test Suite Design)**:
   * Phân tích tài liệu yêu cầu (Requirements) và element map để sinh ra kịch bản test (sheet `TEST_CASE_<MODULE>`) kết hợp dữ liệu đầu vào (sheet `DATA_<MODULE>`).
   * Sử dụng đúng các action keywords chuẩn hóa mà framework hỗ trợ và áp dụng kỹ thuật thiết kế test (BVA, EP, Decision Table...).

---

## 3. CÁC NGUYÊN TẮC RÀNG BUỘC PHẢI TUÂN THỦ (CONSTRAINTS)

* **Ngôn ngữ**: Sử dụng Tiếng Việt xen kẽ thuật ngữ Tiếng Anh kỹ thuật.
* **Không chế tạo cột mới**: Đầu ra cấu hình Excel phải đúng số cột và tên cột quy định tại [global_rules.md](file:///c:/Users/datbt20/Documents/projects/unified-gui-testing-tool/ai/rules/global_rules.md).
* **Kiểm tra tính hợp lệ của Action và Target**:
  * Action `input` hoặc `clear` chỉ đi với target có prefix `txt_` hoặc `inp_`.
  * Action `upload` chỉ đi với target có prefix `file_` hoặc `up_`.
  * URL luôn tham chiếu qua Page ID (ví dụ: `url_sit_login`) khai báo trong sheet `PAGE`.
