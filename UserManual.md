# Hướng dẫn Sử dụng — Phân hệ 13: Đào tạo Lâm sàng

**Phiên bản:** Cuối — V1.0 (đồng bộ với Tài liệu Yêu cầu Nghiệp vụ 20260506)
**Ngày phát hành:** 08/05/2026
**Hệ thống:** Smart Medical Hub — Vinmec
**Tài liệu liên quan:** BRD-final.md · SRS-final.md · UseCases-final.md

---

## 1. Giới thiệu

Phân hệ 13 — Đào tạo Lâm sàng quản lý toàn bộ chu trình đào tạo của Bác sĩ, Dược sĩ, Điều dưỡng tại các bệnh viện Vinmec: từ tiếp nhận Học viên, gán Khung Năng lực, theo dõi tiến độ Sổ tay Kỹ thuật, đánh giá Hiệu quả Công việc Năm, đến cấp Chứng chỉ và đóng lớp. Hướng dẫn này dành cho người dùng cuối — Học viên, Người hướng dẫn, Cán bộ Y tế, Cán bộ Quản lý, Phòng Nhân sự, Hội đồng Năng lực Lâm sàng, Quản trị viên.

Phân hệ có 5 nhóm chức năng với 24 màn hình:

| Nhóm | Tên nhóm | Số màn |
| --- | --- | --- |
| 13.1 | Quản lý Nhân sự Đào tạo | 3 |
| 13.2 | Tiêu chuẩn năng lực Lâm sàng | 2 |
| 13.3 | Khảo thí khối chuyên môn | 7 |
| 13.4 | Chương trình và Điều phối Đào tạo | 10 |
| 13.5 | Báo cáo Đào tạo | 2 |

So với phiên bản trước, phiên bản này bỏ Đánh giá 360 độ và Đánh giá Năng lực Tại nơi Làm việc độc lập (đã gộp vào Nhóm C — Sổ tay Kỹ thuật); bổ sung 4 nhóm tiêu chuẩn A, B, C, D ở mục 13.3.

---

## 2. Đăng nhập và Phân quyền

### 2.1 Đăng nhập

1. Mở trình duyệt và truy cập địa chỉ Smart Medical Hub do Phòng Công nghệ Thông tin cung cấp.
2. Nhập Mã nhân viên và mật khẩu.
3. Nếu được yêu cầu, nhập mã xác thực hai lớp.
4. Sau khi đăng nhập, chọn Bệnh viện cần làm việc (nếu có quyền nhiều cơ sở).
5. Bấm "13. Đào tạo Lâm sàng" trên thanh điều hướng ngang.

### 2.2 Phân quyền theo Vai trò

| Vai trò | Quyền truy cập |
| --- | --- |
| Học viên | Xem hồ sơ cá nhân (13.1.1), ghi Sổ tay Kỹ thuật (13.3.6), xem Kế hoạch Học tập Cá nhân (13.4.5), tham gia Đào tạo dựa trên ca bệnh (13.4.6), dự thi định kỳ (13.4.7), xem Tiến độ và Nhật ký Lâm sàng (13.5) |
| Người hướng dẫn / Giảng viên | Quản lý hồ sơ giảng viên (13.1.2), xác nhận ca trong Sổ tay (13.3.6), đánh giá năng lực tại nơi làm việc, tạo ca CBL (13.4.6), duyệt y lệnh học viên (13.4.9), trình Hội đồng nâng bậc |
| Cán bộ Y tế | Tự đánh giá APR (13.3.3), xem kết quả Nhóm A (13.3.4), B (13.3.5), C (13.3.6), D (13.3.7), Trang Tổng quan Khảo thí (13.3.1) |
| Cán bộ Quản lý Trực tiếp | Xem hồ sơ nhân viên thuộc quyền (13.1.3), chấm APR cấp 2, xét nâng bậc, xem báo cáo (13.5) |
| Phòng Nhân sự | Quản lý Cán bộ Y tế (13.1.3), nhập APR (13.3.3), quản lý Chứng chỉ (13.3.2), gán Khung Năng lực |
| Giám đốc Bệnh viện | Ký APR cấp 3, xem báo cáo tổng hợp |
| Phó Tổng Giám đốc Chuyên môn | Phê duyệt Khung Năng lực, Tiêu chuẩn phân bậc |
| Hội đồng Năng lực Lâm sàng | Tạo cuộc họp (13.4.8), quyết định nâng bậc và can thiệp |
| Điều phối Đào tạo | Tạo Chương trình, Lớp, Cohort (13.4.1, 13.4.2), ghép cặp người hướng dẫn (13.4.3), lên lịch luân chuyển (13.4.4), đóng lớp (13.4.10) |
| Quản trị Khung Năng lực | Tạo, ban hành Khung Năng lực (13.2.2), cấu hình Tiêu chuẩn phân bậc (13.2.1), cấu hình quyền y lệnh (13.4.9) |

---

## 3. Hướng dẫn Sử dụng từng Màn

### 3.1 Nhóm 13.1 — Quản lý Nhân sự Đào tạo

#### 13.1.1 Quản lý Học viên (TraineeManagement)

![13.1.1 Quản lý Học viên](../images/13.1.1-trainees.png)

**Đối tượng người dùng**: Điều phối Đào tạo, Người hướng dẫn, Học viên (chỉ xem hồ sơ cá nhân).

**Đường dẫn truy cập**: Đăng nhập → Phân hệ 13 → Nhóm 13.1 → 13.1.1 Quản lý Học viên.

**Mục đích**: Quản lý hồ sơ Học viên, theo dõi tiến độ, đánh dấu nguy cơ rủi ro, đăng ký vào Lớp.

##### Thao tác chính — Thêm Học viên mới

1. Vào màn 13.1.1.
2. Bấm "Thêm Học viên".
3. Điền thông tin: họ tên, vai trò (Bác sĩ Nội trú / Học viên Chứng chỉ / Sinh viên thực tập / Điều dưỡng học viên), khoa, người hướng dẫn dự kiến.
4. Hệ thống tự sinh Mã học viên.
5. Bấm "Lưu".
6. Học viên xuất hiện trong danh sách với thanh tiến độ 0%.

##### Thao tác chính — Đồng bộ hàng loạt từ Hệ thống Bệnh viện

1. Bấm "Đồng bộ Hệ thống Bệnh viện".
2. Tải tệp Excel chuẩn Vinmec lên hệ thống.
3. Hệ thống đối chiếu Mã nhân viên và hiển thị danh sách khớp / chưa khớp.
4. Xem trước, đối chiếu thủ công các bản ghi chưa khớp.
5. Bấm "Xác nhận".

##### Thao tác chính — Đánh dấu nguy cơ rủi ro

1. Mở Hộp thoại chi tiết Học viên.
2. Bấm "Đánh dấu nguy cơ rủi ro".
3. Chọn lý do (chậm tiến độ, vi phạm quy định, không đạt đánh giá định kỳ).
4. Ghi ghi chú và bấm "Xác nhận".
5. Học viên chuyển sang thẻ "Nguy cơ rủi ro"; Điều phối Đào tạo nhận thư điện tử.

##### Mẹo và lưu ý

- Bấm vào hàng Học viên để mở Hộp thoại chi tiết với 3 thẻ — Thông tin cá nhân, Lịch sử Luân chuyển, Tiến độ Đào tạo.
- Lọc nhanh theo Cohort, chuyên khoa, trạng thái ở thanh lọc trên cùng.
- Khi Học viên hoàn thành Cohort, không thể sửa thông tin lõi (vai trò, mã học viên).

##### Câu hỏi thường gặp

**Hỏi**: Tôi không tìm thấy Học viên mặc dù đã tạo. Tại sao?
**Đáp**: Kiểm tra bộ lọc trên đầu màn — có thể đang lọc theo "Nguy cơ rủi ro" hoặc "Chờ duyệt". Bấm "Xoá lọc" hoặc chọn "Tất cả".

**Hỏi**: Tôi muốn xoá Học viên đã tạo nhầm. Làm thế nào?
**Đáp**: Mở chi tiết Học viên → bấm "Đình chỉ" → ghi lý do. Hệ thống không cho xoá vĩnh viễn để bảo toàn lịch sử kiểm toán.

#### 13.1.2 Quản lý Giảng viên / Người hướng dẫn (FacultyManagement)

![13.1.2 Quản lý Giảng viên / Người hướng dẫn](../images/13.1.2-faculty.png)

**Đối tượng người dùng**: Trưởng phòng Đào tạo, Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.1 → 13.1.2.

**Mục đích**: Quản lý đội ngũ Giảng viên và Người hướng dẫn, theo dõi khối lượng phụ trách.

##### Thao tác chính — Thêm Giảng viên

1. Bấm "Thêm Giảng viên".
2. Điền họ tên, học hàm, chuyên khoa, khối lượng phụ trách (giờ/tuần), vai trò (Người hướng dẫn chính / Giảng viên / Trưởng Bộ môn).
3. Bấm "Lưu".

##### Thao tác chính — Điều chỉnh khối lượng

1. Mở chi tiết Giảng viên.
2. Bấm "Điều chỉnh khối lượng".
3. Sửa số học viên tối đa và số giờ/tuần.
4. Bấm "Lưu".

##### Mẹo và lưu ý

- 4 thẻ chỉ số ở đầu màn cho biết: Tổng Giảng viên, Người hướng dẫn khả dụng, Người quá tải, Người chưa được gán Khung Năng lực.
- Khi Giảng viên đạt 100% giới hạn, hệ thống tự đánh dấu "Quá tải" và không cho ghép thêm Học viên ở 13.4.3.

##### Câu hỏi thường gặp

**Hỏi**: Một Giảng viên đang quá tải. Tôi xử lý thế nào?
**Đáp**: Có 2 cách — (1) tăng giới hạn khối lượng nếu Giảng viên đồng ý, hoặc (2) chuyển bớt Học viên sang Người hướng dẫn khác qua màn 13.4.3.

#### 13.1.3 Quản lý Cán bộ Y tế và Năng lực (StaffCompetency)

![13.1.3 Quản lý Cán bộ Y tế và Năng lực](../images/13.1.3-staff-competency.png)

**Đối tượng người dùng**: Phòng Nhân sự, Cán bộ Quản lý Trực tiếp, Quản trị Khung Năng lực.

**Đường dẫn truy cập**: Phân hệ 13 → 13.1 → 13.1.3.

**Mục đích**: Quản lý hồ sơ năng lực Cán bộ Y tế, gán Khung Năng lực, theo dõi tiến độ ba nhóm kỹ thuật, xét nâng bậc, đề xuất thuyên chuyển khi trì trệ.

##### Thao tác chính — Gán Khung Năng lực

1. Mở chi tiết Cán bộ Y tế.
2. Bấm "Gán Khung Năng lực".
3. Hệ thống gợi ý Khung Năng lực phù hợp nghề × chuyên khoa.
4. Chọn Khung Năng lực và bấm "Xác nhận".

##### Thao tác chính — Trình Hội đồng nâng bậc

1. Mở chi tiết Cán bộ Y tế.
2. Bấm "Trình Hội đồng Năng lực".
3. Hệ thống hiển thị bằng chứng tự thu thập (Sổ tay Kỹ thuật, Nhóm A/B/D, kết quả APR năm trước).
4. Bổ sung dẫn chứng văn bản nếu cần.
5. Bấm "Gửi".

##### Thao tác chính — Xem APR năm

1. Mở chi tiết Cán bộ Y tế.
2. Bấm "Xem APR năm" — hệ thống điều hướng sang 13.3.3 và lọc theo Mã nhân viên hiện tại.

##### Mẹo và lưu ý

- Cảnh báo Chứng chỉ Hành nghề sắp hết hạn xuất hiện ở băng dán đỏ phía trên hồ sơ Cán bộ.
- 5 chỉ số tổng quan: Tổng Cán bộ, Đã gán Khung Năng lực, Chưa gán, Ứng viên nâng bậc, Cán bộ trì trệ.
- Cán bộ trì trệ trên 3 tháng được hệ thống đề xuất thuyên chuyển — Cán bộ Quản lý quyết định.

##### Câu hỏi thường gặp

**Hỏi**: Cán bộ Y tế bị trì trệ. Hệ thống cảnh báo nhưng tôi không muốn thuyên chuyển ngay. Làm thế nào?
**Đáp**: Vào chi tiết Cán bộ → bấm "Tạm dừng đề xuất thuyên chuyển" và ghi lý do. Cảnh báo sẽ tạm ẩn 30 ngày.

### 3.2 Nhóm 13.2 — Tiêu chuẩn năng lực Lâm sàng

#### 13.2.1 Tiêu chuẩn phân bậc (RankingStandard)

![13.2.1 Tiêu chuẩn phân bậc](../images/13.2.1-grading-standards.png)

**Đối tượng người dùng**: Phó Tổng Giám đốc Chuyên môn, Quản trị Khung Năng lực.

**Đường dẫn truy cập**: Phân hệ 13 → 13.2 → 13.2.1.

**Mục đích**: Cấu hình tiêu chuẩn phân bậc theo Khối Bác sĩ (4 bậc), Điều dưỡng (5 bậc), Dược sĩ (7 bậc).

##### Thao tác chính — Cấu hình bậc

1. Vào màn 13.2.1.
2. Chọn Khối (Bác sĩ / Điều dưỡng / Dược sĩ).
3. Sửa bảng học hàm — học vị — thâm niên cho từng bậc.
4. Sửa điều kiện chung: Đào tạo y khoa liên tục tối thiểu 72 giờ/3 năm, Điểm Tinh thần Thái độ APR từ 4 trở lên (tương đương 80%), Đánh giá Hệ thống Thực thi từ 80% trở lên, không có sự cố lâm sàng mức trung bình hoặc mức 3 trở lên trong 1 năm, trình độ tiếng Anh theo bậc.
5. Bấm "Lưu" — chuyển sang trạng thái Cập nhật.

##### Thao tác chính — Ban hành Tiêu chuẩn

1. Mở Tiêu chuẩn ở trạng thái Thẩm định.
2. Phó Tổng Giám đốc Chuyên môn bấm "Phê duyệt ban hành" và ký số.
3. Bấm "Kích hoạt sử dụng".
4. Hệ thống đặt ngày hiệu lực và áp dụng cho mọi Cán bộ Y tế thuộc Khối.

##### Mẹo và lưu ý

- Vòng đời 5 trạng thái: Nháp → Cập nhật → Thẩm định → Phê duyệt ban hành → Kích hoạt sử dụng.
- Khi phiên bản mới Kích hoạt, phiên bản cũ tự chuyển sang Lưu trữ; Cán bộ Y tế đang dùng phiên bản cũ tự chuyển sang phiên bản mới và giữ nguyên dữ liệu tích luỹ.

##### Câu hỏi thường gặp

**Hỏi**: Tập đoàn vừa quyết định đổi tiêu chuẩn Khối Điều dưỡng. Quy trình tôi làm thế nào?
**Đáp**: (1) Vào 13.2.1, chọn Khối Điều dưỡng, bấm "Tạo phiên bản mới"; (2) chỉnh bảng theo quyết định; (3) gửi thẩm định; (4) Phó Tổng Giám đốc Chuyên môn ký phê duyệt ban hành và kích hoạt.

#### 13.2.2 Khung Năng lực (CompetencyFramework)

![13.2.2 Khung Năng lực](../images/13.2.2-competency-framework.png)

**Đối tượng người dùng**: Quản trị Khung Năng lực, Phó Tổng Giám đốc Chuyên môn.

**Đường dẫn truy cập**: Phân hệ 13 → 13.2 → 13.2.2.

**Mục đích**: Quản lý Khung Năng lực theo nghề × chuyên khoa với 4 nhóm A, B, C, D.

##### Thao tác chính — Tạo Khung Năng lực mới

1. Bấm "Tạo Khung Năng lực".
2. Điền nghề (Bác sĩ / Dược sĩ / Điều dưỡng), tên, chuyên khoa, người phê duyệt, phiên bản, ngày hiệu lực.
3. Tuỳ chọn sao chép từ mẫu có sẵn.
4. Bấm "Lưu" — chuyển sang Trình chỉnh sửa.
5. Trong Trình chỉnh sửa, thêm tiêu chí cho 4 nhóm:
   - Nhóm A — Hiểu biết chung và Y khoa chung (đồng bộ từ Vin LMS).
   - Nhóm B — Kiến thức chuyên ngành (đồng bộ từ Vin LMS, ngưỡng theo Khối).
   - Nhóm C — Năng lực kỹ thuật chuyên môn (Sổ tay Kỹ thuật, đếm theo danh mục hoặc số ca).
   - Nhóm D — Đào tạo và Nghiên cứu khoa học (đồng bộ từ Tiêu chuẩn phân bậc).

##### Thao tác chính — Ban hành phiên bản mới

1. Khung Năng lực ở trạng thái Thẩm định.
2. Phó Tổng Giám đốc Chuyên môn bấm "Phê duyệt ban hành" và ký số.
3. Bấm "Kích hoạt sử dụng".
4. Hệ thống tự chuyển toàn bộ Cán bộ Y tế đang gán phiên bản cũ sang phiên bản mới và bảo toàn dữ liệu tích luỹ.

##### Thao tác chính — Xem lịch sử thay đổi

1. Mở Khung Năng lực.
2. Bấm "Lịch sử thay đổi".
3. Hệ thống hiển thị bảng so sánh giữa các phiên bản: ngày, người sửa, nội dung sửa.
4. Bấm vào một thay đổi để xem chi tiết.

##### Mẹo và lưu ý

- Phương pháp đánh giá hai tầng cho mỗi nhóm: tầng một là tiêu chí định lượng tự cộng từ Sổ tay Kỹ thuật và kết quả thi; tầng hai là đánh giá định tính do Người hướng dẫn xác nhận.
- Khi nâng phiên bản, mã có dạng `KNL-BS-TIMMACH-2026-v2026.1` (theo nghề × chuyên khoa × năm × phiên bản).

##### Câu hỏi thường gặp

**Hỏi**: Tôi có cần xoá Khung Năng lực cũ khi tạo phiên bản mới không?
**Đáp**: Không. Hệ thống tự chuyển sang Lưu trữ khi phiên bản mới Kích hoạt; phiên bản cũ vẫn tra cứu được để xem lịch sử.

### 3.3 Nhóm 13.3 — Khảo thí khối chuyên môn

#### 13.3.1 Trang Tổng quan Khảo thí (ExamDashboard)

![13.3.1 Trang Tổng quan Khảo thí](../images/13.3.1-exam-dashboard.png)

**Đối tượng người dùng**: Cán bộ Y tế, Cán bộ Quản lý Trực tiếp, Phòng Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.1.

**Mục đích**: Tổng hợp tiến độ khảo thí cá nhân và khoa theo 4 nhóm A/B/C/D.

##### Thao tác chính — Xem dashboard cá nhân

1. Vào 13.3.1.
2. Hệ thống hiển thị các thẻ chỉ số: Tổng số bài đã làm, Tỷ lệ đạt theo nhóm, Số bài đến hạn, Tỷ lệ chưa hoàn thành.
3. Xem biểu đồ tiến độ theo nhóm.
4. Bấm vào nhóm để khai triển.

##### Thao tác chính — Xem dashboard khoa

1. Cán bộ Quản lý vào 13.3.1.
2. Lọc theo khoa.
3. Hệ thống tổng hợp dữ liệu theo nhân viên.

##### Mẹo và lưu ý

- Dashboard cập nhật theo thời gian thực khi có dữ liệu mới ở Nhóm C.
- Bấm vào tên Cán bộ trên dashboard để mở chi tiết khảo thí cá nhân.

#### 13.3.2 Quản lý Chứng chỉ (CertificationExam)

![13.3.2 Quản lý Chứng chỉ](../images/13.3.2-certification-exam.png)

**Đối tượng người dùng**: Phòng Nhân sự, Quản trị Đào tạo, Cán bộ Y tế.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.2.

**Mục đích**: Quản lý 7 nhóm Chứng chỉ — Bằng cấp, Chuyên môn, Đào tạo y khoa liên tục, Yêu cầu pháp lý, Ngoại ngữ, Khác, Nội bộ.

##### Thao tác chính — Thêm Chứng chỉ ngoài

1. Vào 13.3.2 → bấm "Thêm Chứng chỉ".
2. Chọn nhóm.
3. Điền tên, cơ quan cấp, ngày cấp, ngày hết hạn.
4. Tải tệp quét.
5. Bấm "Lưu" — trạng thái Chờ thẩm định.

##### Thao tác chính — Thẩm định Chứng chỉ

1. Quản trị viên mở thẻ "Chưa thẩm định".
2. Bấm vào Chứng chỉ.
3. Bấm "Duyệt" hoặc "Trả lại + lý do".

##### Mẹo và lưu ý

- Hệ thống tự cảnh báo khi Chứng chỉ sắp hết hạn 6 tháng — gửi thư điện tử cho Cán bộ Y tế và Phòng Nhân sự.
- Chứng chỉ nội bộ phát hành từ 13.4.10 Đóng lớp tự liên kết về 13.3.2 với nguồn "Nội bộ".

##### Câu hỏi thường gặp

**Hỏi**: Tôi vừa cập nhật Chứng chỉ Hành nghề mới nhưng cảnh báo cũ vẫn hiển thị. Tại sao?
**Đáp**: Cảnh báo cập nhật theo đợt hằng ngày. Sau 24 giờ, cảnh báo sẽ tự xoá nếu Chứng chỉ mới đã được thẩm định.

#### 13.3.3 Đánh giá Hiệu quả Công việc Năm — APR (APREvaluation)

![13.3.3 Đánh giá Hiệu quả Công việc Năm — APR](../images/13.3.3-apr-evaluation.png)

**Đối tượng người dùng**: Cán bộ Y tế (tự đánh giá), Cán bộ Quản lý (chấm cấp 2), Giám đốc Bệnh viện (ký cấp 3), Phòng Nhân sự (nhập APR).

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.3.

**Mục đích**: Đánh giá APR năm theo 6 tổ hợp Vai trò × Phân nhóm với 3 cấp ký số.

##### Thao tác chính — Phòng Nhân sự nhập APR Excel

1. Vào 13.3.3 → bấm "Nhập APR Excel".
2. Chọn Vai trò (Bác sĩ / Dược sĩ / Điều dưỡng) và Phân nhóm (Lâm sàng / Cận lâm sàng).
3. Chọn Kỳ.
4. Kéo thả tệp xlsx mẫu Vinmec.
5. Đánh dấu "Ghi đè khi trùng" nếu cần.
6. Bấm "Nhập".
7. Hệ thống đối chiếu Mã nhân viên (đồng bộ từ ILVG, dữ liệu lấy theo Quý) và hiển thị kết quả K khớp / U chưa khớp.
8. Bấm "Xác nhận" để lưu.
9. Hệ thống gửi thư điện tử cho Cán bộ Y tế "APR đã được nhập, vui lòng rà soát và ký".

##### Thao tác chính — Cán bộ Y tế tự đánh giá và ký cấp 1

1. Cán bộ Y tế nhận thư điện tử và mở 13.3.3.
2. Bấm vào hồ sơ APR của bản thân.
3. Vào thẻ con "Bảng chấm điểm" — đối chiếu điểm tự đánh giá đã nhập.
4. Bổ sung dẫn chứng cho từng tiêu chí (tệp đính kèm hoặc văn bản).
5. Vào thẻ "Nhận xét và Ký xác nhận".
6. Bấm "Ký số xác nhận" → nhập PIN.
7. Hệ thống cập nhật trạng thái và thông báo Cán bộ Quản lý.

##### Thao tác chính — Cán bộ Quản lý chấm và ký cấp 2

1. Cán bộ Quản lý mở thẻ "APR chờ duyệt".
2. Mở Hộp thoại chi tiết.
3. Nhập điểm Cán bộ Quản lý cho từng tiêu chí.
4. Nhập điểm thưởng (-3% đến +3%) kèm dẫn chứng.
5. Hệ thống tự tính điểm cuối: `Tổng = Σ(điểm cuối × trọng số) × (1 + điểm thưởng/100)` làm tròn 2 chữ số.
6. Ghi nhận xét.
7. Ký số.

##### Thao tác chính — Giám đốc Bệnh viện ký cấp 3

1. Giám đốc Bệnh viện mở thẻ "APR chờ duyệt cuối".
2. Xem tổng hợp.
3. Bấm "Phê duyệt và Ký số".
4. Hệ thống cập nhật xếp loại A/B/C/D/E vào hồ sơ Cán bộ Y tế ở 13.1.3.
5. Hệ thống gửi thư điện tử "APR đã được duyệt cuối".

##### Thao tác chính — Xuất báo cáo APR

1. Vào 13.3.3 → bấm "Xuất báo cáo".
2. Chọn Kỳ và Vai trò.
3. Hệ thống xuất tệp Excel có 2 sheet — tổng hợp và chi tiết.

##### Mẹo và lưu ý

- Trọng số: Tinh thần Thái độ 15% — Kết quả Công việc 60% — Phát triển Chuyên môn 25%.
- Xếp loại: A từ 4.5 trở lên / B từ 4.0 đến dưới 4.5 / C từ 3.5 đến dưới 4.0 / D từ 3.0 đến dưới 3.5 / E dưới 3.0.
- Hộp thoại chi tiết có 3 thẻ con: Thông tin và IDP / Bảng chấm điểm / Nhận xét và Ký xác nhận.
- Liên kết chéo trong Hộp thoại: Xem Năng lực, Xem Sổ tay Kỹ thuật, Xem Kế hoạch Học tập Cá nhân.

##### Câu hỏi thường gặp

**Hỏi**: Tôi không đồng ý điểm tự đánh giá của Cán bộ Y tế. Làm thế nào để chấm khác?
**Đáp**: Trong thẻ "Bảng chấm điểm", chọn "Điểm cuối = điểm Cán bộ Quản lý" và ghi lý do. Hệ thống sẽ dùng điểm của Cán bộ Quản lý.

**Hỏi**: APR của tôi đã được duyệt cuối nhưng tôi muốn khiếu nại. Làm thế nào?
**Đáp**: Liên hệ Phòng Nhân sự để yêu cầu xét lại. Khung chỉ số hiển thị công khai dẫn chứng từng tiêu chí, giúp bạn đối chiếu trước khi khiếu nại.

#### 13.3.4 Nhóm A — Hiểu biết chung và Y khoa chung (GroupAExam)

![13.3.4 Nhóm A — Hiểu biết chung và Y khoa chung](../images/13.3.4-exam-group-a.png)

**Đối tượng người dùng**: Cán bộ Y tế, Học viên.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.4.

**Mục đích**: Xem kết quả khảo thí Hiểu biết chung và Y khoa chung — đồng bộ từ Vin LMS.

##### Thao tác chính — Xem kết quả

1. Vào 13.3.4.
2. Hệ thống hiển thị bảng kết quả theo cá nhân: Mã nhân viên, họ tên, kỳ, điểm, trạng thái Đạt/Chưa đạt, nguồn (Vin LMS hoặc nhập tay).
3. Lọc theo kỳ, khoa, Mã nhân viên.
4. Bấm vào hàng để xem chi tiết — đáp án, ngày thi.

##### Mẹo và lưu ý

- Dữ liệu đồng bộ tự động hằng ngày 06:00 từ Vin LMS.
- Nếu thiếu kết quả mặc dù đã thi trên Vin LMS, liên hệ Quản trị viên kiểm tra giao diện đồng bộ.

#### 13.3.5 Nhóm B — Kiến thức chuyên ngành (GroupBExam)

![13.3.5 Nhóm B — Kiến thức chuyên ngành](../images/13.3.5-exam-group-b.png)

**Đối tượng người dùng**: Cán bộ Y tế, Học viên, Người hướng dẫn.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.5.

**Mục đích**: Xem kết quả khảo thí Kiến thức chuyên ngành theo Khối — Bác sĩ phải đạt từ 70% trở lên; Điều dưỡng có 3 nhóm Cơ bản / Cốt lõi / Nâng cao với ngưỡng theo bậc 1 đến 5; Dược sĩ phải đạt từ 70% trở lên.

##### Thao tác chính — Xem ngưỡng đạt theo bậc

1. Vào 13.3.5.
2. Hệ thống hiển thị ngưỡng đạt cụ thể cho bậc và Khối hiện tại của bạn.
3. Xem chênh lệch giữa điểm thực tế và ngưỡng.

##### Mẹo và lưu ý

- Chức năng "Thi và Đánh giá Định kỳ" ở 13.4.7 KHÔNG áp dụng với Nhóm B (Nhóm B đồng bộ trực tiếp từ Vin LMS).

#### 13.3.6 Nhóm C — Năng lực kỹ thuật chuyên môn / Sổ tay Kỹ thuật (GroupCProcedure)

![13.3.6 Nhóm C — Năng lực kỹ thuật chuyên môn / Sổ tay Kỹ thuật](../images/13.3.6-exam-group-c.png)

**Đối tượng người dùng**: Cán bộ Y tế, Học viên, Người hướng dẫn.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.6.

**Mục đích**: Ghi nhận năng lực kỹ thuật chuyên môn — Sổ tay Kỹ thuật. Đồng bộ tự động từ Tờ điều trị, Phòng mổ, Cận lâm sàng.

##### Thao tác chính — Ghi kỹ thuật thủ công

1. Vào 13.3.6 → thẻ "Sổ tay".
2. Bấm "Ghi kỹ thuật thủ công".
3. Điền: ngày, Mã bệnh nhân (hệ thống tự tra Hồ sơ Bệnh án Điện tử), tên kỹ thuật, vai trò (Chính / Phụ), người giám sát, kết quả, biến chứng.
4. Hệ thống tự xác định cấp (Cơ bản / Nâng cao / Chuyên sâu) và xem trước điểm.
5. Bấm "Lưu".

##### Thao tác chính — Người hướng dẫn xác nhận ca

1. Người hướng dẫn nhận thông báo có ca chờ xác nhận.
2. Mở 13.3.6 và bấm vào ca.
3. Đối chiếu với Hồ sơ Bệnh án Điện tử.
4. Bấm "Xác nhận" hoặc "Yêu cầu chỉnh sửa".

##### Thao tác chính — Đánh giá năng lực tại nơi làm việc trên ca

1. Mở chi tiết ca trong Sổ tay.
2. Bấm "Đánh giá năng lực".
3. Chọn loại — Mini-CEX, DOPS hoặc CBD.
4. Chấm điểm theo nhóm A/B/C/D với thang 1-5 cộng điểm tổng 1-10.
5. Ghi phản hồi.
6. Bấm "Lưu".

##### Thao tác chính — Giải quyết lỗi đối chiếu đồng bộ

1. Vào thẻ "Nhật ký đồng bộ Hệ thống Bệnh viện".
2. Lọc các bản ghi có trạng thái "Lỗi đối chiếu".
3. Bấm vào bản ghi để xem chi tiết lỗi.
4. Bấm "Đối chiếu thủ công" — nhập mã kỹ thuật và Mã bệnh nhân đúng.
5. Bấm "Lưu".

##### Mẹo và lưu ý

- Ma trận điểm: Cơ bản – Chính 5đ / Phụ 3đ; Nâng cao – Chính 8đ / Phụ 5đ; Chuyên sâu – Chính 10đ / Phụ 7đ.
- Đồng bộ tự động chạy mỗi 15 phút từ Hệ thống Bệnh viện.
- Nút "Xem Hồ sơ Bệnh án" trong chi tiết ca mở Trình xem 7 thẻ.

##### Câu hỏi thường gặp

**Hỏi**: Tôi đã thực hiện kỹ thuật nhưng không thấy trong Sổ tay. Tại sao?
**Đáp**: (1) Đợi đợt đồng bộ tiếp theo (15 phút); (2) kiểm tra mã kỹ thuật trên Tờ điều trị có khớp Khung Năng lực không; (3) liên hệ Quản trị viên nếu vẫn không thấy.

**Hỏi**: Tôi muốn ghi kỹ thuật ở bệnh viện ngoài Vinmec. Làm thế nào?
**Đáp**: Bấm "Ghi kỹ thuật thủ công" và đánh dấu nguồn "Manual" — lưu ý phải có người giám sát xác nhận.

#### 13.3.7 Nhóm D — Đào tạo và Nghiên cứu khoa học (GroupDActivity)

![13.3.7 Nhóm D — Đào tạo và Nghiên cứu khoa học](../images/13.3.7-exam-group-d.png)

**Đối tượng người dùng**: Cán bộ Y tế, Phòng Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.3 → 13.3.7.

**Mục đích**: Ghi nhận hoạt động đào tạo và nghiên cứu khoa học — giảng dạy, nghiên cứu, hội thảo, công bố.

##### Thao tác chính — Thêm hoạt động

1. Vào 13.3.7.
2. Bấm "Thêm hoạt động".
3. Chọn loại: giảng dạy / nghiên cứu / hội thảo / công bố.
4. Điền tiêu đề, ngày, vai trò, đối tác, tác động (chỉ số h-Index, số trích dẫn).
5. Bấm "Lưu".

##### Mẹo và lưu ý

- Hệ thống đồng bộ với Tiêu chuẩn phân bậc hằng quý — flag thiếu hoặc đạt theo yêu cầu Bậc.

### 3.4 Nhóm 13.4 — Chương trình và Điều phối Đào tạo

#### 13.4.1 Chương trình và Lộ trình Đào tạo (ProgramCatalog)

![13.4.1 Chương trình và Lộ trình Đào tạo](../images/13.4.1-career-pathway.png)

**Đối tượng người dùng**: Phòng Đào tạo, Quản trị Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.1.

**Mục đích**: Quản lý Chương trình Đào tạo và Lộ trình Nghề nghiệp.

##### Thao tác chính — Tạo Chương trình

1. Vào 13.4.1 → thẻ "Chương trình".
2. Bấm "Tạo Chương trình".
3. Điền tên, danh mục, phân loại (Theo Khung Năng lực / Độc lập / Đào tạo y khoa liên tục / Đào tạo nội bộ / Học bổng), vai trò đích, mục tiêu, liên kết Khung Năng lực, chuyên khoa, phương pháp đánh giá.
4. Bấm "Lưu" — trạng thái Nháp.

##### Thao tác chính — Tạo Lớp từ Chương trình

1. Mở Chương trình ở trạng thái Kích hoạt.
2. Bấm "Tạo Lớp" — điều hướng sang 13.4.2.

##### Mẹo và lưu ý

- Vòng đời Chương trình: Nháp → Cập nhật → Thẩm định → Phê duyệt → Kích hoạt → Lưu trữ.
- Có thể sao chép Chương trình từ mẫu để giảm thao tác.

#### 13.4.2 Lớp Đào tạo và Nhóm học viên (ClassManagement)

![13.4.2 Lớp Đào tạo và Nhóm học viên](../images/13.4.2-cohorts.png)

**Đối tượng người dùng**: Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.2.

**Mục đích**: Quản lý Lớp (đợt cụ thể của Chương trình) và Nhóm học viên Khung Năng lực.

##### Thao tác chính — Tạo Lớp

1. Vào 13.4.2 → thẻ "Lớp".
2. Bấm "Tạo Lớp từ Chương trình".
3. Điền mã, tên, cơ sở, ngày bắt đầu, ngày kết thúc, số học viên dự kiến, Điều phối viên.
4. Bấm "Lưu".

##### Thao tác chính — Tạo Nhóm học viên

1. Vào thẻ "Nhóm học viên".
2. Bấm "Tạo Nhóm".
3. Chọn Khung Năng lực, bậc mục tiêu, chuyên khoa.
4. Đăng ký Học viên (chọn từ 13.1.1).
5. Đặt mốc tiến độ.
6. Bấm "Lưu".

#### 13.4.3 Ghép cặp Người hướng dẫn–Học viên (MentorTraineeMatching)

![13.4.3 Ghép cặp Người hướng dẫn–Học viên](../images/13.4.3-mentor-matching.png)

**Đối tượng người dùng**: Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.3.

**Mục đích**: Ghép cặp Người hướng dẫn và Học viên dựa trên gợi ý tự động.

##### Thao tác chính — Ghép cặp

1. Vào 13.4.3 → chọn Nhóm học viên.
2. Hệ thống hiển thị danh sách Học viên chưa ghép cùng top 3 gợi ý Người hướng dẫn.
3. Bấm vào Học viên → mở Hộp thoại gán.
4. Chọn Người hướng dẫn (gợi ý hoặc danh sách đầy đủ).
5. Ghi lý do ghép.
6. Bấm "Xác nhận".
7. Hệ thống kiểm tra khối lượng còn lại và gửi thư điện tử cả 2 bên.

##### Mẹo và lưu ý

- Gợi ý dựa trên match chuyên khoa và cân bằng khối lượng.
- Khi Người hướng dẫn đã đầy slot, hệ thống cảnh báo và yêu cầu chọn người khác.

#### 13.4.4 Phân khoa Luân chuyển (RotationAssignment)

![13.4.4 Phân khoa Luân chuyển](../images/13.4.4-rotation.png)

**Đối tượng người dùng**: Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.4.

**Mục đích**: Lên lịch đợt luân chuyển và phát hiện xung đột tự động.

##### Thao tác chính — Lên lịch đợt luân chuyển

1. Vào 13.4.4 → chọn Nhóm học viên.
2. Bấm "Thêm đợt luân chuyển".
3. Điền Học viên, khoa, ngày bắt đầu, ngày kết thúc, số tuần, người giám sát.
4. Hệ thống tự kiểm tra xung đột.
5. Nếu có xung đột, mở Hộp thoại giải quyết với gợi ý.
6. Bấm "Lưu".

##### Mẹo và lưu ý

- Sơ đồ Gantt hiển thị lịch theo Học viên.
- Nhập đợt luân chuyển hàng loạt qua Excel khi có nhiều đợt.

#### 13.4.5 Kế hoạch Học tập Cá nhân (IndividualLearningPlan)

![13.4.5 Kế hoạch Học tập Cá nhân](../images/13.4.5-individual-learning-plan.png)

**Đối tượng người dùng**: Học viên, Người hướng dẫn.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.5.

**Mục đích**: Quản lý Kế hoạch Học tập Cá nhân với Trợ thủ tự sinh từ khoảng cách năng lực.

##### Thao tác chính — Tự sinh ILP

1. Vào 13.4.5 → bấm "Tự sinh ILP".
2. Trong Trợ thủ:
   - Bước 1: Chọn Học viên, kỳ, người hướng dẫn.
   - Bước 2: Hệ thống phân tích khoảng cách (Bậc hiện tại đến Bậc kế tiếp).
   - Bước 3: Hệ thống sinh mục tiêu có ưu tiên (có thể lấy IDP từ APR năm trước).
   - Bước 4: Xem trước, chỉnh hạn, thêm mục tiêu.
3. Bấm "Xác nhận" — ILP tạo ở trạng thái Nháp.

##### Thao tác chính — Trình Người hướng dẫn duyệt

1. Học viên mở ILP của mình.
2. Bấm "Trình Người hướng dẫn".
3. Người hướng dẫn nhận thông báo, mở ILP và xem.
4. Bấm "Duyệt" — ILP chuyển sang Đang học.

##### Mẹo và lưu ý

- 6 chỉ số tổng quan: Tổng ILP / Đang học / Quá hạn / Tổng mục tiêu / Đã đạt / Đang làm.
- Băng dán liên kết APR ở đầu màn cho phép lấy mục tiêu từ IDP năm trước.
- Trạng thái ILP: Nháp / Đang học / Đang đánh giá / Hoàn thành / Quá hạn.

#### 13.4.6 Đào tạo Lâm sàng dựa trên ca bệnh (ClinicalTraining)

![13.4.6 Đào tạo Lâm sàng dựa trên ca bệnh](../images/13.4.6-clinical-training.png)

**Đối tượng người dùng**: Người hướng dẫn, Học viên.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.6.

**Mục đích**: Quản lý ca CBL — Người hướng dẫn tạo ca, Học viên thảo luận.

##### Thao tác chính — Tạo ca CBL

1. Bấm "Tạo ca CBL".
2. Chọn Học viên + Mã bệnh nhân.
3. Nhập hướng dẫn lâm sàng và câu hỏi thảo luận.
4. Gắn năng lực Khung Năng lực.
5. Bấm "Lưu".

##### Thao tác chính — Thảo luận

1. Học viên mở ca và đọc câu hỏi.
2. Trả lời trong luồng thảo luận.
3. Người hướng dẫn phản hồi và chấm.

##### Mẹo và lưu ý

- Hệ thống tự sinh "Điểm học tập" từ luồng thảo luận.
- Liên kết với Hồ sơ Bệnh án Điện tử qua Mã bệnh nhân.

#### 13.4.7 Thi và Đánh giá Định kỳ (PeriodicExam)

![13.4.7 Thi và Đánh giá Định kỳ](../images/13.4.7-periodic-exam.png)

**Đối tượng người dùng**: Phòng Đào tạo, Học viên.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.7.

**Mục đích**: Tổ chức kỳ thi định kỳ phục vụ phản hồi liên tục — không cấp Chứng chỉ.

##### Thao tác chính — Tạo kỳ thi

1. Bấm "Tạo kỳ thi" → mở Trợ thủ.
2. Chọn Khung Năng lực và bậc.
3. Đặt lịch.
4. Tự chọn câu hỏi từ ngân hàng theo bậc.
5. Xem trước đề.
6. Bấm "Lưu".

##### Mẹo và lưu ý

- Loại đánh giá: Trắc nghiệm tự sinh từ Khung Năng lực Nhóm A, C, D theo bậc; Mini-CEX, DOPS, OSCE, CBD.
- **Không áp dụng với Nhóm B** (Nhóm B đồng bộ trực tiếp từ Vin LMS).

#### 13.4.8 Hội đồng Năng lực Lâm sàng (ClinicalCompetencyCommittee)

![13.4.8 Hội đồng Năng lực Lâm sàng](../images/13.4.8-competency-committee.png)

**Đối tượng người dùng**: Hội đồng Năng lực Lâm sàng (Thư ký, thành viên).

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.8.

**Mục đích**: Quản lý họp Hội đồng — tổng hợp bằng chứng, ghi nhận xếp loại, lập kế hoạch can thiệp.

##### Thao tác chính — Tạo cuộc họp

1. Bấm "Tạo cuộc họp".
2. Điền ngày, thành viên, danh sách Học viên cần xét.
3. Bấm "Lưu".

##### Thao tác chính — Tổng hợp bằng chứng

1. Hệ thống tự lấy Mini-CEX, DOPS từ 13.3.6.
2. Lấy số ca và biến chứng từ Sổ tay.
3. Lấy ca CBL hoàn thành và outcomes từ 13.4.6.
4. Lấy điểm thi định kỳ từ 13.4.7.
5. Hiển thị bằng chứng và xếp loại đề xuất.

##### Thao tác chính — Ghi nhận xếp loại

1. Hội đồng thảo luận.
2. Trong giao diện hệ thống, ghi nhận xếp loại cho từng Học viên (Tiến bộ / Cần can thiệp / Đủ điều kiện nâng bậc / Dừng đào tạo).
3. Ký quyết định.
4. Hệ thống đồng bộ kết quả về 13.1.3 và kích hoạt cấp Chứng chỉ nội bộ qua 13.3.2.

##### Thao tác chính — Lập kế hoạch can thiệp

1. Khi quyết định "Cần can thiệp".
2. Lập kế hoạch — tăng cường người hướng dẫn, đợt luân chuyển bổ sung, ca CBL thêm.
3. Đặt hạn chót và người chịu trách nhiệm.
4. Hệ thống tự cập nhật ILP với mục tiêu can thiệp.

#### 13.4.9 Giám sát Y lệnh Học viên (TraineeOrderConfig)

![13.4.9 Giám sát Y lệnh Học viên](../images/13.4.9-trainee-order-config.png)

**Đối tượng người dùng**: Quản trị Khung Năng lực (cấu hình), Học viên (tạo y lệnh), Người hướng dẫn (duyệt).

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.9.

**Mục đích**: Cấu hình quyền y lệnh theo (nghề × bậc × loại module); duyệt và đồng ký y lệnh.

##### Thao tác chính — Cấu hình quyền

1. Vào 13.4.9 → thẻ "Cấu hình".
2. Mở ma trận (nghề × bậc × loại module).
3. Chỉnh từng ô: Cho phép có/không, Cần duyệt có/không, Cần đồng ký có/không.
4. Bấm "Lưu".

##### Thao tác chính — Học viên tạo y lệnh

1. Học viên tạo y lệnh trong phân hệ Lâm sàng.
2. Hệ thống tự lấy chính sách (nghề × bậc × loại).
3. Nếu cần duyệt — chuyển trạng thái Chờ duyệt và thông báo Người hướng dẫn.

##### Thao tác chính — Người hướng dẫn duyệt y lệnh

1. Mở Hộp thoại xem xét.
2. Xem ghi chú lâm sàng và lý do của Học viên.
3. Bấm "Duyệt" — ký số bằng PIN.
4. Hệ thống đẩy y lệnh vào Hồ sơ Bệnh án Điện tử và ghi vào Sổ tay Kỹ thuật.

##### Mẹo và lưu ý

- Đồng ký y lệnh học viên KHÁC với "ký 2 điều dưỡng" khi thực thi thuốc nguy cơ cao theo Thông tư 31/2021/TT-BYT.

#### 13.4.10 Tổng kết và Đóng lớp (CohortClosure)

![13.4.10 Tổng kết và Đóng lớp](../images/13.4.10-cohort-closure.png)

**Đối tượng người dùng**: Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.4 → 13.4.10.

**Mục đích**: Trợ thủ Đóng lớp 4 bước.

##### Thao tác chính — Đóng lớp

1. Mở Cohort → bấm "Đóng lớp".
2. **Bước 1 — Xét kết quả**: Hệ thống lấy danh sách Học viên và điểm. Bạn đánh dấu Đạt/Chưa đạt theo ngưỡng từ 80%.
3. **Bước 2 — Cấp Chứng chỉ**: Bấm "Cấp Chứng chỉ hàng loạt" cho Học viên Đạt. Hệ thống tạo Chứng chỉ nội bộ ở 13.3.2.
4. **Bước 3 — Xuất hồ sơ**: Chọn tệp (transcript / sổ tay / đánh giá / ILP / báo cáo cuối). Bấm "Tải tệp nén".
5. **Bước 4 — Lưu trữ**: Hệ thống đóng gói và lưu kho. Cohort chuyển sang trạng thái Đóng (chỉ đọc).

##### Mẹo và lưu ý

- Đồng bộ kết quả học tập từ Vin LMS được thực hiện tự động trong quá trình đóng lớp.
- Sau khi Đóng, không thể chỉnh sửa Cohort.

### 3.5 Nhóm 13.5 — Báo cáo Đào tạo

#### 13.5.1 Tiến độ Đào tạo (ProgressTracking)

![13.5.1 Tiến độ Đào tạo](../images/13.5.1-progress-tracking.png)

**Đối tượng người dùng**: Cán bộ Quản lý Trực tiếp, Điều phối Đào tạo.

**Đường dẫn truy cập**: Phân hệ 13 → 13.5 → 13.5.1.

**Mục đích**: Dashboard Tiến độ Đào tạo theo Học viên hoặc Cohort.

##### Thao tác chính — Xem dashboard

1. Vào 13.5.1.
2. Chọn Học viên hoặc Cohort.
3. Hệ thống hiển thị thẻ thông tin: Tỷ lệ tiến độ, Bậc, Mốc đạt, Hoạt động gần đây, Mốc sắp tới và hạn.
4. Trạng thái Đúng tiến độ / Sắp hoàn thành / Chậm — tô đỏ và cảnh báo nếu Chậm.

##### Thao tác chính — Xuất báo cáo

1. Bấm "Xuất báo cáo".
2. Chọn phạm vi (Cohort / Khoa / Toàn cơ sở).
3. Hệ thống xuất Excel hoặc PDF.

##### Mẹo và lưu ý

- Khai triển chi tiết: kỹ thuật cơ bản, nâng cao, chuyên sâu, công bố, giờ giảng, giờ đào tạo.

#### 13.5.2 Nhật ký Lâm sàng (ClinicalLogbook)

![13.5.2 Nhật ký Lâm sàng](../images/13.5.2-clinical-logbook.png)

**Đối tượng người dùng**: Học viên, Người hướng dẫn, Cán bộ Quản lý.

**Đường dẫn truy cập**: Phân hệ 13 → 13.5 → 13.5.2.

**Mục đích**: Trang xem hợp nhất mọi hoạt động lâm sàng của Học viên.

##### Thao tác chính — Xem Nhật ký

1. Vào 13.5.2.
2. Hệ thống hiển thị bảng hợp nhất: ngày, loại (ca bệnh / Mini-CEX / DOPS / Đào tạo y khoa liên tục / CBL), chi tiết, vai trò, người hướng dẫn xác nhận, Mã bệnh nhân, nguồn, liên kết ILP.
3. Lọc theo Học viên, loại, nguồn, kỳ.

##### Thao tác chính — Xuất PDF

1. Bấm "Xuất nhật ký".
2. Chọn dải thời gian.
3. Hệ thống xuất tệp PDF có chữ ký số xác nhận của người hướng dẫn (nếu có).

##### Mẹo và lưu ý

- Đầu vào cho Trợ thủ Đóng lớp ở 13.4.10.
- Có thể tìm theo Học viên hoặc chẩn đoán.

---

## 4. Câu hỏi thường gặp tổng quát

**Hỏi**: Tôi quên mật khẩu. Làm thế nào?
**Đáp**: Bấm "Quên mật khẩu" trên trang đăng nhập, hệ thống gửi liên kết đặt lại đến thư điện tử Vinmec đăng ký.

**Hỏi**: Tôi đăng nhập được nhưng không thấy Phân hệ 13 trên menu. Tại sao?
**Đáp**: Vai trò của bạn chưa được cấp quyền vào Phân hệ 13. Liên hệ Quản trị Hệ thống để bổ sung quyền.

**Hỏi**: Đường dẫn nào để báo lỗi hoặc đề xuất cải tiến?
**Đáp**: Liên hệ Phòng Công nghệ Thông tin Vinmec qua thư điện tử `it-support@vinmec.com` hoặc tổng đài nội bộ.

**Hỏi**: Tôi muốn tải mẫu Excel APR. Lấy ở đâu?
**Đáp**: Vào 13.3.3 → bấm "Tải mẫu" trên đầu trang.

**Hỏi**: Tôi có quyền xem dữ liệu của Cán bộ Y tế nào?
**Đáp**: Tuỳ vai trò — Cán bộ Y tế chỉ xem của bản thân; Cán bộ Quản lý xem của nhân viên thuộc quyền; Phòng Nhân sự xem toàn bộ trong cơ sở.

---

## 5. Liên hệ Hỗ trợ

- **Hỗ trợ kỹ thuật**: Phòng Công nghệ Thông tin Vinmec — `it-support@vinmec.com`
- **Hỗ trợ nghiệp vụ Đào tạo**: Phòng Đào tạo Tập đoàn — `training@vinmec.com`
- **Hỗ trợ Khung Năng lực**: Quản trị Khung Năng lực — `competency@vinmec.com`
- **Tài liệu chi tiết**: BRD-final.md · SRS-final.md · UseCases-final.md trong thư mục `docs/features/training/vi/final/`
- **Báo lỗi khẩn cấp**: Tổng đài nội bộ Vinmec.

---

*Hết Hướng dẫn Sử dụng.*
