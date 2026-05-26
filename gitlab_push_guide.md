# Hướng dẫn chi tiết: Đẩy mã nguồn lên GitLab công ty & Clone thư mục tùy chỉnh

Tài liệu này hướng dẫn từng bước để đưa mã nguồn `unified-gui-testing-tool` hiện tại của bạn lên thư mục gốc của kho chứa (repository) GitLab công ty tại:
`https://gitlab.vinsmartfuture.tech/vsf-qtvhyt/qc/ai.git`

> [!NOTE]
> **Giải thích về cấu trúc dự án:**
> Tên hiển thị trên GitLab của dự án là **unified-gui-testing-tool**, nhưng đường dẫn URL (slug) của nó được cấu hình là `ai`. Do đó, repository URL là `.../qc/ai.git`.
> Khi đẩy mã nguồn hiện tại lên, toàn bộ cấu trúc thư mục (như `framework/`, `test-data/`, `package.json`...) sẽ nằm ở **thư mục gốc** của GitLab, giống hệt cấu trúc thư mục cục bộ của bạn.

---

## 🔐 Phần 1: Chuẩn bị Token / Xác thực (Chỉ cần nếu dùng HTTPS)

Nếu bạn dùng SSH và đã thêm SSH Key vào GitLab, bạn có thể bỏ qua phần này. Nếu dùng HTTPS, bạn phải tạo **Personal Access Token (PAT)** vì GitLab công ty không cho dùng mật khẩu thông thường:

1. Đăng nhập GitLab công ty: [gitlab.vinsmartfuture.tech](https://gitlab.vinsmartfuture.tech)
2. Nhấp vào ảnh đại diện (avatar) ở góc trên bên trái -> Chọn **Settings** (hoặc **Preferences**).
3. Chọn **Personal Access Tokens** ở menu bên trái.
4. Chọn **Add new token**:
   - **Token name**: Điền `vscode-gitlab-access` hoặc bất kỳ tên nào.
   - **Scopes**: Tích chọn `read_repository` và `write_repository`.
5. Nhấp **Create personal access token** và sao chép (copy) token hiển thị trên màn hình. Lưu token này lại để dùng làm mật khẩu đăng nhập Git.

---

## 🧹 Phần 2: Dọn dẹp thư mục con `ai` dư thừa
Trong dự án của bạn hiện tại đang có thư mục con `c:\Users\datbt20\Documents\projects\unified-gui-testing-tool\ai` (đây là bản clone cũ bị lồng vào trong). Để tránh lỗi Git, hãy xóa thư mục này trước khi đẩy code chính.

- **Thao tác:** Xóa hoàn toàn thư mục `ai/` nằm bên trong thư mục `unified-gui-testing-tool`.

---

## 🚀 Phần 3: Đẩy mã nguồn hiện tại lên GitLab

Hãy chọn một trong hai phương án dưới đây dựa trên cấu hình bạn muốn:

### Phương án A: Dùng SSH (Khuyên dùng - Đã có sẵn cấu hình `gitlab` remote trong máy của bạn)
Mở Terminal tại thư mục gốc `unified-gui-testing-tool` và chạy các lệnh:

```bash
# 1. Thêm toàn bộ các thay đổi cục bộ vào git
git add .

# 2. Tạo commit đầu tiên cho GitLab
git commit -m "Initial commit to GitLab"

# 3. Đẩy code lên nhánh main của remote gitlab (dùng cờ --force để ghi đè tệp README.md mặc định ban đầu)
git push -u gitlab main --force
```

### Phương án B: Dùng HTTPS (Nếu SSH bị lỗi hoặc chưa thiết lập SSH Key)
Mở Terminal tại thư mục gốc `unified-gui-testing-tool` và chạy các lệnh:

```bash
# 1. Chuyển URL của remote gitlab từ SSH sang HTTPS
git remote set-url gitlab https://gitlab.vinsmartfuture.tech/vsf-qtvhyt/qc/ai.git

# 2. Thêm và commit code
git add .
git commit -m "Initial commit to GitLab"

# 3. Đẩy code lên GitLab
git push -u gitlab main --force
```
*Lưu ý khi Git hỏi tài khoản:*
* **Username**: Nhập email hoặc username GitLab của bạn.
* **Password**: Dán mã **Personal Access Token (PAT)** đã tạo ở Phần 1 vào.

---

## 🔄 Phần 4: Cách Clone về thư mục tùy chỉnh trong tương lai

Khi bạn hoặc đồng nghiệp muốn clone dự án này từ GitLab về máy nhưng muốn thư mục lưu trữ cục bộ tự động đặt tên là `unified-gui-testing-tool` thay vì tên mặc định `ai`, chỉ cần chạy lệnh clone kèm tên thư mục mong muốn ở cuối:

```bash
# Clone bằng HTTPS và đổi tên thư mục thành unified-gui-testing-tool
git clone https://gitlab.vinsmartfuture.tech/vsf-qtvhyt/qc/ai.git unified-gui-testing-tool

# Hoặc Clone bằng SSH:
git clone git@gitlab.vinsmartfuture.tech:vsf-qtvhyt/qc/ai.git unified-gui-testing-tool
```
Sau lệnh này, thư mục dự án được tạo ra trên máy của bạn sẽ tên là `unified-gui-testing-tool`, khớp hoàn toàn với tên dự án thực tế.
