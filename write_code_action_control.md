# Cấu trúc Source Code Framework & Hướng dẫn Mở rộng

Tài liệu này giải thích chi tiết cấu trúc source code của `framework/` để bạn dễ dàng nắm bắt, và hướng dẫn từng bước cách thêm mới tính năng (Action, Control) mà không làm vỡ kiến trúc hiện tại. Source code hiện tại đã hoàn chỉnh và hoạt động tốt nếu người dùng tuân thủ đúng định dạng của template `Master_Test_Suite.xlsx`.

## 1. Kiến trúc tổng quan (Mô hình Keyword-Driven phẳng / Domain-Driven)

Dưới góc độ của một QA Automation, khi xây dựng một Data/Keyword-Driven Framework với tiêu chí "Code không đổi khi đổi dự án", framework này được xem như một thư viện (Standard Library) hoặc một sản phẩm đóng gói. Toàn bộ kịch bản test (Test Case) và dữ liệu (Data) được tách hoàn toàn vào file Excel (ví dụ `Master_Test_Suite.xlsx`). 

Thư mục `framework/` được chia thành các thành phần với tư duy: **Đâu là lõi bất biến** và **Đâu là không gian từ khóa có thể mở rộng**.

* **`core/` (LÕI BẤT BIẾN - KHÔNG ĐƯỢC CHẠM VÀO)**:
  * `engine/`: Chứa `core.runner.ts` (trình chạy test chính), `browser.manager.ts`, và logic đọc/ghi Excel, xuất báo cáo.
  * `drivers/`: Chứa `playwright.wrapper.ts` (đóng gói API Playwright).
  * `utils/`: Chứa `data.resolver.ts` (mapping dữ liệu) và `update_excel_template.py`.
* **`config/` (CẤU HÌNH DỰ ÁN)**:
  * `framework.config.ts`: Chứa các cấu hình chung (timeout, đường dẫn mặc định,...). Được phép sửa khi đổi dự án (đổi môi trường UAT/PROD).
* **`actions/` (TỪ KHÓA MỞ RỘNG - KEYWORD LIBRARY)**:
  * Được phép thêm mới nếu dự án yêu cầu một thao tác đặc thù chưa có sẵn.
  * `action.dispatcher.ts`: Nơi phân luồng lệnh từ Excel (`click`, `input`).
  * Các file `*.action.ts` (`browser`, `interaction`, `validation`): Chứa logic thực thi từng keyword.
* **`controls/` (UI ELEMENT MỞ RỘNG - COMPONENT LIBRARY)**:
  * Được phép thêm mới nếu UI có phần tử phức tạp chưa được support.
  * `control.factory.ts`: Sinh control dựa trên tiền tố ID (ví dụ: `txt_`, `btn_`).
  * Các file `*.control.ts` (`input`, `button`, `text`): Định nghĩa logic tương tác với từng loại UI.

> [!NOTE]
> **Nguyên tắc "Bất biến"**: Nếu bạn chỉ thêm Test Case, sửa Test Data hoặc Object Repository trong `Master_Test_Suite.xlsx`, bạn **KHÔNG CẦN CHẠM VÀO SOURCE CODE**. Framework sẽ tự động đọc và thực thi.

---

## 2. Hướng dẫn từng bước thêm mới tính năng

Khi có một yêu cầu update (ví dụ: thêm một Keyword mới hoặc hỗ trợ một UI Control mới), bạn chỉ cần làm theo các bước sau.

### Kịch bản A: Thêm một Action (Keyword) mới
*Ví dụ: Thêm action `double_click`.*

1. **Bước 1: Khai báo ở Excel (Tùy chọn nhưng khuyến khích)**
   * Chạy script `update_excel_template.py` (hoặc mở file Excel cấu hình lại Data Validation) để bổ sung `double_click` vào danh sách thả xuống ở cột **Action**.
2. **Bước 2: Viết logic thực thi**
   * Mở file `framework/actions/interaction.action.ts`.
   * Thêm một hàm mới:
     ```typescript
     public static async doubleClick(control: BaseControl, targetId: string): Promise<string> {
         await control.doubleClick(); // Giả sử hàm này đã có trong BaseControl
         return `Double clicked on '${targetId}'`;
     }
     ```
3. **Bước 3: Đăng ký với Action Dispatcher**
   * Mở file `framework/actions/action.dispatcher.ts`.
   * Tìm dòng if chứa các action interaction: `if (["click", "input", ...].includes(action)) {`
   * Thêm `double_click` vào mảng đó.
   * Cập nhật khối xử lý bên dưới:
     ```typescript
     if (action === "double_click") return await InteractionAction.doubleClick(control, targetId);
     ```

### Kịch bản B: Thêm một UI Control mới
*Ví dụ: Thêm control cho Modal với tiền tố ID là `mdl_`.*

1. **Bước 1: Tạo Control Class**
   * Tạo file mới `framework/controls/modal.control.ts`.
   * Viết class kế thừa `BaseControl` và bổ sung các hàm đặc thù (nếu có):
     ```typescript
     import { BaseControl } from './base.control';
     export class ModalControl extends BaseControl {
         // Override hoặc viết thêm logic riêng
     }
     ```
2. **Bước 2: Cập nhật Control Factory**
   * Mở `framework/controls/control.factory.ts`.
   * Import class mới: `import { ModalControl } from './modal.control';`
   * Thêm logic nhận diện tiền tố:
     ```typescript
     else if (id.startsWith('mdl_')) {
         return new ModalControl(locatorType, locatorValue);
     }
     ```

## 3. Danh sách Action và Control mặc định đã hỗ trợ (Data/Keyword Mapping)

Để tuân thủ "Framework hướng cấu hình - Code không đổi khi đổi dự án", framework đã tích hợp sẵn hầu hết các thao tác cơ bản và ánh xạ với file Excel (`ACTION_LIST`).

**Các Action Keyword đã được map:**
* **Điều hướng:** `navigate`, `go_back`, `go_forward`, `refresh`
* **Tương tác:** `click`, `double_click`, `right_click`, `hover`, `focus`, `blur`
* **Nhập liệu:** `input`, `clear`, `press_key`
* **Dropdown/Select:** `select_by_text`, `select_by_value`
* **Checkbox/Radio:** `check`, `uncheck`
* **Nâng cao:** `upload_file`, `drag_drop`, `scroll_to`, `scroll_by`, `screenshot`
* **Kiểm tra/Verify:** `check_status` (có thể kiểm tra trạng thái bằng `enabled`, `disabled`, `visible`, `hidden`, v.v. thông qua cột Expected).
* **Khác:** `log`, `fail`, `skip`

**Các UI Control Prefix đã được map (ở `control.factory.ts`):**
* **TextBox:** `txt_`, `inp_`
* **Button:** `btn_`
* **Label/Text:** `lbl_`, `txtv_`
* **Checkbox/Radio:** `chk_`, `cb_`, `rdo_`, `radio_`
* **Dropdown/Select:** `ddl_`, `cbo_`, `select_`, `dropdown_`

Khi viết kịch bản ở Test Case, chỉ cần sử dụng tên Element Name chứa các Prefix trên, Factory sẽ tự động khởi tạo Control tương ứng.

## 4. Tổng kết

Cách thiết kế này giúp hệ thống:
* **Dễ bảo trì**: Mọi logic tương tác đều ở `actions/`, mọi UI element đều quản lý ở `controls/`.
* **Mở rộng an toàn**: Không cần sửa vào Core Engine (`core.runner.ts`), chỉ cần "cắm" (plug) thêm tính năng mới ở Dispatcher và Factory.

Bạn xem qua giải thích này có chỗ nào cần làm rõ thêm không, nếu ổn thì chúng ta sẽ duy trì convention này khi làm việc nhé!
