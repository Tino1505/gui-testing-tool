# CHIẾN LƯỢC ĐỊNH VỊ ELEMENT & QUY CHUẨN ĐẶT TÊN (LOCATOR STRATEGY & PREFIX RULES)

Tài liệu này quy định các chuẩn bắt buộc khi thực hiện inspect DOM và cấu hình Sheet `ELEMENT_<MODULE>` nhằm đảm bảo bộ định vị (locator) ổn định, dễ bảo trì, phục vụ mô hình framework hướng cấu hình (Data/Keyword Driven).

---

## 1. THỨ TỰ ƯU TIÊN KHI LỰA CHỌN LOCATOR (LOCATOR STRATEGY PRIORITY)

Khi phân tích HTML DOM để viết locator, AI Agent bắt buộc phải lựa chọn chiến lược định vị theo thứ tự ưu tiên giảm dần dưới đây (từ trên xuống dưới):

1. **`data-testid`**:
   * *Ưu tiên số 1*: Luôn sử dụng nếu phần tử HTML có thuộc tính này (ví dụ: `data-testid="login-submit"`). Đây là thuộc tính sinh ra phục vụ riêng cho testing, cực kỳ ổn định.
2. **`id` ổn định**:
   * *Ưu tiên số 2*: Sử dụng ID tĩnh của phần tử (ví dụ: `id="username"`). Tránh các ID tự động sinh động (dynamic IDs) thường chứa số ngẫu nhiên hoặc hash (ví dụ: `id="button-128734"`).
3. **`role`, `aria-label`, `name`**:
   * *Ưu tiên số 3*: Các thuộc tính chuẩn hóa của HTML Form hoặc Accessibility (ví dụ: `name="email"`, `aria-label="Close dialog"`, `role="checkbox"`).
4. **`text` (Khi phù hợp)**:
   * *Ưu tiên số 4*: Định vị bằng nội dung text hiển thị (ví dụ: tìm button "Đăng ký" qua text). Chỉ dùng khi text là tĩnh, duy nhất trên màn hình và ít có khả năng thay đổi đa ngôn ngữ.
5. **`CSS selector đơn giản`**:
   * *Ưu tiên số 5*: Các selector CSS ngắn gọn (ví dụ: `form.login-form input[type="password"]`, `.dashboard-sidebar .active`).
6. **`XPath tương đối`**:
   * *Ưu tiên số 6*: Biểu thức XPath tương đối đi từ một mốc cố định hoặc thẻ bao bọc gần nhất (ví dụ: `//div[@class="card-body"]//button`).
7. **`CSS/XPath phức tạp phụ thuộc cấu trúc DOM`**:
   * *Ưu tiên số 7*: Hạn chế tối đa việc sử dụng. Chỉ dùng khi cấu trúc HTML quá sâu và không có class/id/attributes tĩnh nào khác để neo đậu. Rất dễ bị lỗi khi Dev thay đổi giao diện nhỏ.
8. **`XPath tuyệt đối`**:
   * *Ưu tiên số 8 (Tránh dùng / Hạn chế tối đa)*: Tránh tuyệt đối việc định vị đi từ thẻ `html/body` (ví dụ: `/html/body/div[1]/div[2]/form/input[1]`). Cực kỳ dễ gãy khi DOM thay đổi.

---

## 2. QUY TẮC ĐẶT TÊN ELEMENT ID (PREFIX CONVENTIONS)

Để phục vụ cơ chế tự động nhận diện và binding đối tượng qua `ControlFactory` của framework, mọi `element_id` khai báo bắt buộc phải sử dụng các tiền tố tương ứng với loại control dưới đây:

| Loại UI Control                                | Tiền tố bắt buộc (Prefix)                       | Ví dụ minh hoạ                               |
| :--------------------------------------------- | :--------------------------------------------- | :------------------------------------------- |
| **Hộp nhập liệu** (TextBox / Input / Textarea) | `txt_` hoặc `inp_`                             | `txt_username`, `inp_email`                  |
| **Nút bấm hoặc phần tử click** (Button)        | `btn_`                                         | `btn_submit`, `btn_login`                    |
| **Hộp kiểm** (Checkbox)                        | `chk_` hoặc `cb_`                              | `chk_remember_me`, `cb_accept_terms`         |
| **Nút chọn một** (Radio Button)                | `rdo_`, `rad_` hoặc `radio_`                   | `rdo_gender_male`, `rad_agree`               |
| **Danh sách chọn** (Dropdown / Select)         | `ddl_`, `cbo_`, `select_` hoặc `dropdown_`     | `ddl_hospital`, `select_language`            |
| **Nhãn hiển thị / Text tĩnh** để assert (Label)| `lbl_`                                         | `lbl_dashboard_title`, `lbl_error_message`   |
| **Đường dẫn** (Link)                           | `lnk_`                                         | `lnk_forgot_password`, `lnk_register`        |
| **File Upload Control**                        | `file_` hoặc `up_`                             | `file_avatar_uploader`                       |

---

## 3. CÁC LOẠI LOCATOR ĐƯỢC HỖ TRỢ TRONG FILE EXCEL

QC và AI khi điền vào cột `locator_type` trong sheet `ELEMENT_<MODULE>` chỉ được phép điền các giá trị chuẩn sau:

* `data-testid` (Playwright test-id)
* `id` (Thuộc tính ID)
* `name` (Thuộc tính name)
* `css` (CSS Selector)
* `xpath` (XPath Selector)
* `class` (Class name)
* `tag` (Tên thẻ HTML)

---

## 4. CẤU TRÚC OUTPUT CHUẨN KHI LƯU VÀO SHEET ELEMENT

Output trích xuất element của AI chỉ được chứa đúng 3 cột tương ứng với sheet `ELEMENT_<MODULE>` của file Excel:

| element_id | locator_type | locator_value |
| :--- | :--- | :--- |
| *txt_username* | *id* | *username-input* |
| *btn_login* | *data-testid* | *btn-submit* |
