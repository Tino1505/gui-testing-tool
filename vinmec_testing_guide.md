# Hướng dẫn chi tiết: Viết Test Case cho trang Đặt lịch tiêm chủng Vinmec

Tài liệu này sẽ hướng dẫn bạn (một người mới) cách sử dụng file `Master_Test_Suite.xlsx` để tự động hóa kiểm thử (GUI Testing) cho trang web [Vinmec Vaccination](https://sit-smh.vinmec.com/vaccination) thông qua kiến trúc Keyword-Driven.

---

## Phần 1: Hiểu về Cấu trúc (Structure) và Mapping của Framework

Framework kiểm thử này hoạt động dựa trên cơ chế **Data/Keyword-Driven**. Nghĩa là bạn không cần viết code (TypeScript/Python), bạn chỉ cần "ra lệnh" cho hệ thống bằng cách điền vào file Excel. Hệ thống Code (engine) sẽ tự động đọc file Excel và mapping (khớp nối) các lệnh đó thành thao tác trên trình duyệt thực tế.

Cấu trúc file `Master_Test_Suite.xlsx` gồm các sheet chính và chúng liên kết chặt chẽ với nhau:

1. **`ACTION_LIST`**: Lưu trữ danh sách các hành động hợp lệ (navigate, click, input, select...). Đây là từ điển động từ của bạn.
2. **`PAGE`**: Lưu trữ danh sách các đường link (URL) của trang web để dễ dàng gọi ra khi cần điều hướng.
3. **`ELEMENT`** (Object Repository): Là nơi lưu trữ "tọa độ" của các nút bấm, ô nhập liệu trên web. Nó giúp framework biết *nút Đăng nhập nằm ở đâu*, *ô chọn Bệnh viện là ô nào*.
4. **`DATA_...`** (Ví dụ `DATA_LOGIN`): Lưu trữ dữ liệu test (Test Data) như tên, tuổi, số điện thoại để hệ thống gõ vào tự động.
5. **`Test_Case_{Tên_Module}`** (Ví dụ `Test_Case_Login`, `Test_Case_Vaccination`): Là bộ não của kịch bản test. Bạn có thể tạo vô số sheet bắt đầu bằng chữ `Test_Case_` để phân loại kịch bản cho từng trang web hoặc chức năng riêng biệt. Đây là nơi bạn ghép nối Action + Element + Data lại thành một kịch bản hoàn chỉnh.

---

## Phần 2: Cách tạo một Sheet Test Case Mới

Hệ thống hỗ trợ Đa-kịch bản (Multi-Sheet). Khi có một chức năng mới cần test (như Đặt lịch Tiêm chủng), bạn làm theo các bước sau để tạo sheet:

1. Nhấp chuột phải vào một sheet Test Case có sẵn (ví dụ: `Test_Case_Login`) ở dưới đáy file Excel.
2. Chọn **Move or Copy...** -> Đánh dấu vào ô **Create a copy** -> Nhấn **OK**.
3. Đổi tên sheet vừa copy thành tên tính năng mới, bắt buộc phải có tiền tố `Test_Case_`. Ví dụ: **`Test_Case_Vaccination`**.
4. Xóa các kịch bản cũ trong sheet đi và bắt đầu viết kịch bản mới. (Dropdown list ở cột action sẽ tự động được giữ nguyên).

---

## Phần 3: Hướng dẫn từng bước (Step-by-Step) Test trang Vinmec Vaccination

Giả sử chúng ta muốn viết một Test Case: **Truy cập trang Tiêm chủng Vinmec, chọn Bệnh viện Vinmec Times City, và điền Họ tên người tiêm.**

### Bước 1: Khai báo URL (Sheet `PAGE`)
1. Mở sheet `PAGE`.
2. Thêm một dòng mới:
   - **Page Name (Target)**: `url_vinmec_vaccine`
   - **URL (Value)**: `https://sit-smh.vinmec.com/vaccination`

### Bước 2: Khai báo Tọa độ Element (Sheet `ELEMENT`)
Bạn cần dùng công cụ Inspect (F12) trên trình duyệt để lấy XPath hoặc CSS Selector của các ô trên trang.
1. Mở sheet `ELEMENT`.
2. Thêm các dòng sau (ví dụ minh họa):
   - Element 1 (Ô chọn bệnh viện): 
     - **Element Name**: `dropdown_hospital`
     - **Locator Type**: `xpath` (hoặc `css`)
     - **Locator Value**: `//select[@id='hospital_id']` (Thay bằng locator thực tế)
   - Element 2 (Ô nhập họ tên):
     - **Element Name**: `txt_patient_name`
     - **Locator Type**: `id`
     - **Locator Value**: `patient_full_name`

### Bước 3: Chuẩn bị dữ liệu Test (Sheet Data mới hoặc gõ trực tiếp)
Nếu bạn có nhiều dữ liệu, hãy tạo một sheet tên là `DATA_VACCINE` và thêm các cột `hospital_name`, `patient_name`. Nhưng với người mới, ta có thể **truyền trực tiếp giá trị** vào sheet Test Case cho đơn giản.

### Bước 4: Viết kịch bản Test (Sheet `Test_Case_Vaccination`)
Mở sheet `Test_Case_Vaccination` và bắt đầu viết kịch bản của bạn từng dòng một. Mỗi dòng là 1 bước (step).

| tc-id | summary | type | step | action | target | value | expected |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_VAC_01** | Test đặt lịch tiêm | pos | 1 | `navigate` | `url_vinmec_vaccine` | *n.a* | *n.a* |
| | | | 2 | `wait` | *-* | `2000` | *n.a* |
| | | | 3 | `select` | `dropdown_hospital` | `Vinmec Times City` | *n.a* |
| | | | 4 | `input` | `txt_patient_name` | `Nguyen Van A` | *n.a* |
| | | | 5 | `click` | `btn_continue` | *n.a* | *n.a* |
| | | | 6 | `verify_visible` | `lbl_success_msg` | *n.a* | `visible` |

### Giải thích ý nghĩa các cột trong `Test_Case_...`:
- **action**: Mở dropdown và chọn hành động (Ví dụ: `select` là chọn dropdown, `input` là gõ phím). Dữ liệu này map với code `ActionDispatcher`.
- **target**: Nhập tên đối tượng bạn muốn thao tác (phải khớp chính xác 100% với tên bạn đã khai báo bên sheet `PAGE` hoặc `ELEMENT`). Khi code chạy, `ControlFactory` sẽ tìm target này trong sheet ELEMENT để lấy Locator.
- **value**: Dữ liệu bạn muốn truyền vào. Nếu gõ thẳng `Nguyen Van A` thì hệ thống sẽ nhập chữ đó. Nếu gõ dạng biến `$DATA_VACCINE.patient_name` thì hệ thống sẽ tìm trong sheet Data để lấy ra (Data Mapping).
- **expected**: Kết quả mong đợi dùng cho các action `verify`.

> [!IMPORTANT]
> **Quy tắc vàng:** Không bao giờ hardcode Locator (như XPath) thẳng vào sheet `Test_Case_...`. Mọi Locator phải nằm ở sheet `ELEMENT`, và sheet `Test_Case_...` chỉ gọi tên (target) của nó ra. Nhờ vậy, nếu UI trang web thay đổi, bạn chỉ cần sửa 1 chỗ ở sheet `ELEMENT`.
