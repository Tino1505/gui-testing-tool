# Implementation Plan: Keyword Dictionary & Excel Validator

## 1. Action / Control / Keyword Matrix

Dưới đây là bảng tổng hợp tất cả các Actions (Keywords) và sự tương thích với các Control (dựa theo Tiền tố / Prefix của Element).

| Category | Action/Keyword | Description | Supported Controls (Prefixes) | Requires Target | Requires Data/Expect |
|---|---|---|---|:---:|:---:|
| **1. Interaction** | `click` | Click vào element | Mọi Control (`*`) | Có | Không |
| | `input` | Nhập text vào field | `txt_`, `inp_` (TextBox) | Có | Có (Text) |
| | `clear` | Xóa text trong field | `txt_`, `inp_` (TextBox) | Có | Không |
| | `hover` | Di chuột lên element | Mọi Control (`*`) | Có | Không |
| | `drag_drop` | Kéo thả element | Mọi Control (`*`) | Có | Có (Target ID) |
| | `upload` | Tải file lên | `file_`, `up_` (Upload) | Có | Có (File Path) |
| | `press_key` | Nhấn phím (Enter, Tab...) | Mọi Control (`*`) | Có | Có (Key Name) |
| **2. Validation (Functional)**| `verify_visible` | Kiểm tra element hiển thị | Mọi Control (`*`) | Có | Không |
| | `verify_hidden` | Kiểm tra element bị ẩn | Mọi Control (`*`) | Có | Không |
| | `verify_text` | Kiểm tra text (innerText) | Mọi Control (`*`) | Có | Có (Expected Text) |
| | `verify_value` | Kiểm tra giá trị (value attr) | `txt_`, `inp_`, `ddl_`, `rdo_`, `chk_` | Có | Có (Expected Value)|
| | `verify_enabled` | Kiểm tra element enabled | Mọi Control (`*`) | Có | Không |
| | `verify_disabled`| Kiểm tra element disabled | Mọi Control (`*`) | Có | Không |
| **3. Validation (UI/UX)** | `verify_css` | Kiểm tra thuộc tính CSS | Mọi Control (`*`) | Có | Có (Property:Value) |
| | `verify_attribute` | Kiểm tra thuộc tính HTML | Mọi Control (`*`) | Có | Có (Attr:Value) |
| | `verify_class` | Kiểm tra class tồn tại | Mọi Control (`*`) | Có | Có (Class Name) |
| | `verify_style_contains`| Kiểm tra style nội tuyến | Mọi Control (`*`) | Có | Có (Style string) |
| **4. State / Context** | `store_text` | Lưu text vào runtime context | Mọi Control (`*`) | Có | Có (Variable name) |
| | `store_value` | Lưu value vào runtime context | `txt_`, `inp_`, `ddl_` | Có | Có (Variable name) |
| | `use_runtime` | Điền giá trị từ runtime context | `txt_`, `inp_` | Có | Có (Variable name) |
| | `wait_api_response`| Đợi API trả về response | N/A | Không | Có (Endpoint / URL)|

---

## 2. Implementation Design: `excel.validator.ts`

**Location**: `framework/engine/excel/excel.validator.ts`

**Mục tiêu**: Module này được kích hoạt ở đầu quy trình (trước khi khởi chạy Browser). Vai trò của nó là "Pre-flight Check" - kiểm tra tính hợp lệ của toàn bộ kịch bản Excel. Phát hiện sớm lỗi đánh máy, lỗi logic.

**Logic Kiểm tra (Validation Rules)**:
1. **Action hợp lệ?**: Tra cứu `action` có tồn tại trong bộ `VALID_ACTIONS` dictionary hay không. Nếu gõ sai chính tả (vd: `clik`), báo lỗi ngay.
2. **Action có support Control?**: Bóc tách Prefix từ chuỗi `TargetElement` (vd: `txt_username` -> `txt_`). Đối chiếu mảng `allowedPrefixes` của action đó. Nếu cố tình dùng `upload` cho một `btn_submit`, hệ thống báo lỗi không tương thích.
3. **Expect đúng type?**: Kiểm tra xem Action đó có bắt buộc truyền Target hoặc Data không. Nếu action bắt buộc truyền Data (vd: `verify_text`) mà người dùng để trống cột Data, báo lỗi. Nếu action là `wait`, kiểm tra xem Data có phải là số (number) không.

### Pseudo-code / Structure:

```typescript
export class ExcelValidator {
    // 1. Dictionary quy định luật cho từng Action
    private static readonly VALID_ACTIONS = {
        'navigate': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] },
        'input': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_'] },
        'click': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'upload': { requiresTarget: true, requiresData: true, allowedPrefixes: ['file_', 'up_'] },
        'verify_visible': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'verify_css': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        // ... All 20+ actions will be mapped here
    };

    public static validate(data: any): string[] {
        const errors: string[] = [];
        const testCases = data.test_cases || [];

        testCases.forEach((tc: any) => {
            tc.steps.forEach((step: any) => {
                const action = String(step.Action || step.action || "").toLowerCase().trim();
                const target = String(step.TargetElement || step.target || "");
                const dataVal = String(step.DataColumn || step.data || "");
                
                // Prefix logic extraction (e.g. "txt_username" -> "txt_")
                let targetPrefix = "*";
                if (target && target.includes('_')) {
                    targetPrefix = target.split('_')[0] + "_"; 
                }

                // Rule 1: Check Valid Action
                if (!this.VALID_ACTIONS[action]) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${step.step}] Invalid Action: '${action}'`);
                    return; // Skip further checks for invalid actions
                }

                const rule = this.VALID_ACTIONS[action];

                // Rule 2: Check Required Target & Data
                if (rule.requiresTarget && !target) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${step.step}] Action '${action}' requires a TargetElement`);
                }
                if (rule.requiresData && !dataVal) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${step.step}] Action '${action}' requires Data/Expect value`);
                }

                // Rule 3: Check Supported Control Prefix
                if (rule.requiresTarget && target && target !== '-') {
                    if (!rule.allowedPrefixes.includes('*') && !rule.allowedPrefixes.includes(targetPrefix)) {
                        errors.push(`[TC: ${tc.tc_id} - Step: ${step.step}] Action '${action}' is not supported for control prefix '${targetPrefix}'`);
                    }
                }
                
                // Rule 4: Type checks (Example for wait)
                if (action === 'wait' && isNaN(Number(dataVal))) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${step.step}] Action 'wait' expects a numeric duration, got '${dataVal}'`);
                }
            });
        });

        return errors;
    }
}
```

## 3. Integration Plan
1. **Create File**: Hiện thực hóa file `excel.validator.ts` trong `framework/engine/excel/`.
2. **Hook vào Runtime**: Mở `framework/engine/core.runner.ts` và gọi hàm `ExcelValidator.validate(data)` ngay trước khi cấp phát Browser (`new BrowserManager().start()`).
3. **Graceful Exit**: Nếu trả về mảng `errors` độ dài > 0, hệ thống in danh sách lỗi đỏ ra Terminal và dùng `process.exit(1)` để ngắt luồng. Mọi sai phạm ở kịch bản Excel không được phép chạy lọt xuống code Playwright.
