# CẨM NANG TỐI ƯU QUOTA & TIẾT KIỆM TOKENS (TIPS & TRICKS FOR TOKENS OPTIMIZATION)

Khi làm việc với các trang web hiện đại, mã nguồn HTML/DOM có thể rất lớn (hàng chục nghìn dòng), dễ dẫn đến việc vượt quá giới hạn token (context window) hoặc làm AI phản hồi chậm, tốn chi phí. Tài liệu này hướng dẫn QC các mẹo rút gọn DOM trước khi đưa vào prompt.

---

## 1. PHƯƠNG PHÁP RÚT GỌN DOM (DOM STRIPPING TECHNIQUES)

Trước khi copy-paste HTML gửi cho AI, hãy lọc bỏ các phần tử không đóng góp vào việc định vị hoặc kiểm thử:

1. **Lọc bỏ các thẻ không tương tác & Siêu dữ liệu (Metadata)**:
   * Xóa toàn bộ phần `<head>...</head>` (chứa thẻ meta, link css, script cấu hình...).
   * Xóa toàn bộ các thẻ `<script>...</script>` và `<style>...</style>`.
   * Lược bỏ hoặc thu gọn các icon SVG: Thay thế `<svg ...>...</svg>` thành `<svg>Icon</svg>` hoặc xóa hẳn thẻ SVG vì chúng thường chứa tọa độ path rất dài làm hao tốn token.

2. **Lọc bỏ các thuộc tính không cần thiết (Attributes Cleanup)**:
   * Giữ lại các thuộc tính quan trọng: `id`, `class`, `name`, `type`, `placeholder`, `value`, `data-testid`, `aria-label`, `role`.
   * Lọc bỏ các thuộc tính style nội dòng (inline style) như `style="color: red; margin-top: 10px; ..."` hoặc các thuộc tính class quá dài không dùng để định vị.

3. **Sử dụng lệnh Console để trích xuất nhanh DOM tinh gọn**:
   QC có thể mở F12 Console trên trình duyệt và chạy đoạn script ngắn dưới đây để tự động xuất ra HTML tối giản của trang hiện tại, chỉ giữ lại các tag cần tương tác:

```javascript
// Copy đoạn code này chạy ở Tab Console của Chrome/Firefox
(function() {
    const keepTags = ['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA', 'FORM', 'LABEL', 'H1', 'H2', 'H3', 'SPAN'];
    function cleanNode(node) {
        let cleanHTML = "";
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (keepTags.includes(node.tagName)) {
                let tag = node.tagName.toLowerCase();
                let attrs = "";
                // Chỉ giữ lại các attributes quan trọng
                const importantAttrs = ['id', 'class', 'name', 'type', 'placeholder', 'data-testid', 'aria-label', 'role'];
                importantAttrs.forEach(attr => {
                    if (node.hasAttribute(attr)) {
                        attrs += ` ${attr}="${node.getAttribute(attr)}"`;
                    }
                });
                
                let childrenHTML = "";
                node.childNodes.forEach(child => {
                    childrenHTML += cleanNode(child);
                });
                
                cleanHTML = `<${tag}${attrs}>${childrenHTML || node.innerText.trim()}</${tag}>`;
            } else {
                // Nếu thẻ không nằm trong list giữ lại, vẫn duyệt qua các con của nó
                node.childNodes.forEach(child => {
                    cleanHTML += cleanNode(child);
                });
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue.trim();
            if (text) cleanHTML = text;
        }
        return cleanHTML;
    }
    console.log(cleanNode(document.body));
})();
```

---

## 2. PHÂN CHIA PHÂN HỆ ĐỂ PHÂN TÍCH (PAGE SLICING)

Nếu một màn hình kiểm thử có quá nhiều form hoặc quá dài (ví dụ: Trang quản trị thông tin học viên gồm nhiều tab, nhiều bảng):
* **Giải pháp**: Không gửi toàn bộ trang một lúc. Hãy chia nhỏ màn hình thành các phân đoạn (sections) và gửi từng phần cho AI:
  * Lượt 1: Gửi HTML của phần bộ lọc tìm kiếm (Search Filters).
  * Lượt 2: Gửi HTML của bảng kết quả hiển thị (Result Grid).
  * Lượt 3: Gửi HTML của form thêm mới/chỉnh sửa (Creation/Editor Popup).
* Cách làm này giúp AI phân tích cực kỳ chính xác, không bị bỏ sót element và sinh ra Element Map chuẩn nhất.
