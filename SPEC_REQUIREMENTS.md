# TÀI LIỆU YÊU CẦU NGHIỆP VỤ & KỊCH BẢN DEMO (PRD & SPEC)
## HỆ THỐNG PHÊ DUYỆT MUA HÀNG DOANH NGHIỆP (PURCHASE APPROVAL WORKFLOW)

---

### PHẦN 1: MỤC TIÊU & TỔNG QUAN HỆ THỐNG
Hệ thống **Purchase Approval Workflow (PAW)** được xây dựng nhằm chuẩn hóa, số hóa và minh bạch hóa toàn bộ quy trình đề xuất, thẩm định ngân sách và phê duyệt các khoản chi mua sắm tài sản, vật tư, trang thiết bị và dịch vụ trong doanh nghiệp.

#### 1. Ma trận vai trò (Roles & Permissions Matrix)
| Vai trò (Role) | Ký hiệu | Trách nhiệm chính | Thẩm quyền duyệt |
| :--- | :--- | :--- | :--- |
| **Nhân viên đề xuất** (Requester) | `REQUESTER` | Tạo phiếu PR, đính kèm báo giá, theo dõi tiến độ, giải trình khi được hỏi. | Không có quyền duyệt. Chỉ xem và chỉnh sửa phiếu nháp/bổ sung của mình. |
| **Trưởng bộ phận** (Manager) | `MANAGER` | Thẩm định nhu cầu sử dụng thực tế của nhân sự trong team. | Duyệt bước 1 với các yêu cầu thuộc phòng ban mình (< 50,000,000 VNĐ). |
| **Kế toán / Kiểm soát ngân sách** (Finance) | `FINANCE` | Kiểm tra hạn mức ngân sách phòng ban, tính hợp lệ của báo giá & nhà cung cấp. | Thẩm định ngân sách. Duyệt các khoản chi từ 50,000,000 - 200,000,000 VNĐ. |
| **Giám đốc / Ban điều hành** (Director/Approver) | `DIRECTOR` | Phê duyệt cấp cao nhất, các khoản đầu tư chiến lược hoặc vượt ngân sách. | Phê duyệt chung cuộc, đặc biệt các khoản chi > 200,000,000 VNĐ hoặc ưu tiên Khẩn cấp. |

#### 2. Vòng đời phiếu yêu cầu mua hàng (State Machine)
- `DRAFT` (Bản nháp): Phiếu mới khởi tạo, chưa gửi đi duyệt.
- `PENDING` (Chờ phê duyệt): Đang trong quy trình chờ Manager/Finance/Director duyệt.
- `NEEDS_INFO` (Cần bổ sung thông tin): Cấp duyệt yêu cầu giải trình thêm báo giá hoặc lý do.
- `APPROVED` (Đã phê duyệt): Đã hoàn tất các cấp phê duyệt, sẵn sàng mua sắm.
- `REJECTED` (Bị từ chối): Bị từ chối (bắt buộc có lý do từ chối).
- `ORDERED` (Đã đặt hàng / Hoàn tất): Phòng mua hàng đã hoàn tất PO và thanh toán.

---

### PHẦN 2: 10 YÊU CẦU CHỨC NĂNG & NGHIỆP VỤ HỆ THỐNG (FUNCTIONAL REQUIREMENTS)

1. **[FR-01] Khởi tạo Phiếu Mua Hàng (New Purchase Request):**
   - Cho phép nhập đầy đủ: Tên hàng hóa/dịch vụ, Phòng ban, Danh mục (Hardware, Software, Facilities, Marketing, Operations...), Mức độ ưu tiên, Số lượng, Đơn giá dự kiến, Nhà cung cấp dự kiến, Link sản phẩm/báo giá, và Lý do mua sắm.
   - Tự động sinh mã PR định dạng chuẩn `PR-2026-XXXX`.

2. **[FR-02] Tự động Kiểm tra Hạn mức Ngân sách (Real-time Budget Checking):**
   - Khi chọn phòng ban và nhập số tiền, hệ thống tự động so khớp với số dư ngân sách khả dụng của phòng ban đó trong quý.
   - Hiển thị thanh tiến độ sử dụng ngân sách (%) và gắn cờ cảnh báo (Warning Badge) nếu vượt ngân sách hoặc chiếm trên 80% ngân sách còn lại.

3. **[FR-03] Đính kèm Báo giá & Tham chiếu Nhà Cung Cấp (Vendor & Quotation Attachment):**
   - Hỗ trợ lưu trữ đường dẫn báo giá/website nhà cung cấp, ghi chú so sánh giá giữa các đơn vị để cấp duyệt dễ dàng thẩm định.

4. **[FR-04] Phê duyệt Đa cấp linh hoạt (Multi-tier Approval):**
   - Hỗ trợ phê duyệt trực tiếp trên giao diện danh sách hoặc trong Drawer xem chi tiết.
   - Tự động ghi nhận danh tính người duyệt, thời gian duyệt chuẩn xác và cập nhật trạng thái phiếu tức thời.

5. **[FR-05] Từ chối & Bắt buộc Nhập Lý do (Rejection with Mandatory Reason):**
   - Khi từ chối phiếu, hệ thống hiển thị Dialog yêu cầu nhập lý do từ chối rõ ràng để nhân viên đề xuất nắm được thông tin và không gây tắc nghẽn giao tiếp.

6. **[FR-06] Quy trình Cần Bổ sung Thông tin (Request for Information / Needs Info):**
   - Cấp duyệt có thể gửi phản hồi yêu cầu Requester gửi thêm 2 báo giá so sánh hoặc chứng minh tính cấp thiết, chuyển trạng thái về `Cần bổ sung thông tin`.

7. **[FR-07] Tìm kiếm & Lọc Đa tiêu chí (Advanced Search & Filtering):**
   - Tìm kiếm tức thì (live search) theo Mã PR, Tên hàng hóa, Người tạo.
   - Lọc nhanh theo Trạng thái (Tất cả, Chờ duyệt, Cần bổ sung, Đã duyệt, Từ chối, Hoàn tất).
   - Lọc theo Phòng ban (IT, Marketing, Vận hành, Hành chính...) và Mức độ ưu tiên (Thấp, Trung bình, Cao, Khẩn cấp).

8. **[FR-08] Xử lý Hàng loạt (Bulk Actions):**
   - Checkbox từng dòng và Checkbox chọn tất cả.
   - Thanh tác vụ nổi (Floating Action Bar) xuất hiện khi chọn từ 1 phiếu trở lên: Duyệt hàng loạt, Từ chối hàng loạt, Xuất dữ liệu đã chọn hoặc Hủy chọn nhanh.

9. **[FR-09] Chi tiết Phiếu & Timeline Lịch sử Duyệt (Audit Trail & Activity Log):**
   - Mở Drawer/Modal chi tiết hiển thị toàn bộ thuộc tính của PR.
   - Cung cấp Timeline từng bước trực quan: Ngày tạo -> Trưởng bộ phận duyệt -> Kế toán kiểm tra -> Giám đốc phê duyệt -> Hoàn tất PO.

10. **[FR-10] Phân trang & Xuất Báo cáo (Pagination & Export):**
    - Phân trang linh hoạt (5, 10, 20 mục/trang), hiển thị rõ `Hiển thị X - Y trên tổng số Z yêu cầu`.
    - Tính năng xuất dữ liệu danh sách sang định dạng file CSV/Excel hoặc In phiếu mua hàng phục vụ lưu trữ nội bộ.

---

### PHẦN 3: 12 KỊCH BẢN DỮ LIỆU DEMO NGHIỆP VỤ THỰC TẾ (DEMO DATA SCENARIOS)

| Mã PR | Tên hàng hóa / Dịch vụ | Phòng ban | Người đề xuất | Giá trị dự kiến | Mức ưu tiên | Trạng thái | Ngân sách & Ghi chú kịch bản |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-2026-1001** | 03 Laptop Dell XPS 15 9530 cho Senior Dev | IT & Kỹ thuật | Nguyễn Văn An | 135,000,000 đ | Cao | `PENDING` | Dưới ngân sách IT (còn 280tr). Chờ Finance thẩm định báo giá. |
| **PR-2026-1002** | 05 Màn hình Dell Ultrasharp 27" 4K | IT & Kỹ thuật | Trần Thị Mai | 54,500,000 đ | Trung bình | `APPROVED` | Đã qua duyệt Manager & Finance. Chuẩn bị tạo đơn đặt hàng. |
| **PR-2026-1003** | Gói tài khoản Figma Enterprise (15 seats) | Thiết kế & UI/UX | Lê Hoàng Nam | 42,000,000 đ | Trung bình | `PENDING` | Gia hạn hàng năm, cần xác nhận danh sách user thụ hưởng. |
| **PR-2026-1004** | Thuê gian hàng triển lãm TechExpo 2026 | Marketing | Phạm Hương Giang | 185,000,000 đ | Khẩn cấp | `PENDING` | Đang chờ Giám đốc điều hành duyệt vì giá trị lớn (> 100tr). |
| **PR-2026-1005** | Bàn ghế công thái học đợt onboarding Q1 | Hành chính - Nhân sự | Đỗ Minh Tuấn | 68,000,000 đ | Cao | `NEEDS_INFO` | Kế toán yêu cầu gửi thêm 02 bảng báo giá đối tác khác so sánh. |
| **PR-2026-1006** | Máy pha cà phê tự động văn phòng DeLonghi | Hành chính - Nhân sự | Bùi Thu Trang | 28,900,000 đ | Thấp | `REJECTED` | Quản lý từ chối do chi phí phúc lợi quý này cần ưu tiên khám sức khỏe. |
| **PR-2026-1007** | Bản quyền JetBrains All Products Pack (10 dev)| IT & Kỹ thuật | Nguyễn Văn An | 38,000,000 đ | Cao | `ORDERED` | Đã thanh toán thẻ tín dụng công ty và cấp key cho developer. |
| **PR-2026-1008** | Chiến dịch Google Ads & Performance Q2 | Marketing | Phạm Hương Giang | 240,000,000 đ | Cao | `PENDING` | Khoản chi trọng điểm, cần Director & Finance họp rà soát KPI. |
| **PR-2026-1009** | Thay thế 12 cụm Ắc quy UPS phòng Server | Vận hành & Hạ tầng | Vũ Đức Thắng | 76,000,000 đ | Khẩn cấp | `APPROVED` | Thiết bị đã hao mòn 90%, đã được duyệt khẩn cấp trong ngày. |
| **PR-2026-1010** | Dịch vụ kiểm toán tài chính nội bộ định kỳ | Kế toán - Tài chính | Đặng Hồng Hạnh | 115,000,000 đ | Trung bình | `APPROVED` | Hợp đồng nguyên tắc hàng năm với Big4, hồ sơ đầy đủ. |
| **PR-2026-1011** | Chi phí teambuilding dã ngoại mùa xuân | Ban Công đoàn | Hoàng Quốc Việt | 95,000,000 đ | Thấp | `DRAFT` | Bản nháp nhân sự đang hoàn thiện chương trình và khảo sát địa điểm. |
| **PR-2026-1012** | Máy chủ AI Training Server (2x RTX 4090) | R&D - Trí tuệ nhân tạo| Phan Gia Huy | 310,000,000 đ | Khẩn cấp | `PENDING` | CẢNH BÁO: Vượt ngân sách R&D tháng hiện tại (cần xin ngân sách bổ sung). |

---

### PHẦN 4: HƯỚNG DẪN TRẢI NGHIỆM TƯƠNG TÁC (INTERACTION WALKTHROUGH)
1. **Chuyển đổi UI Theme (Analytic UI vs shadcn/ui):**
   - Click nút chuyển đổi trên góc phải Header để cảm nhận:
     - `Analytic UI`: Thiết kế tập trung vào data dense, metric cards rực rỡ, badge màu nhận diện nhanh, tối ưu cho giám sát khối lượng dữ liệu lớn.
     - `shadcn/ui`: Thiết kế tối giản, viền mảnh chuẩn Radix/Zinc tinh tế, typography hiện đại, badge sắc sảo, nút bấm thanh lịch.
2. **Kiểm tra Phân quyền (Role Switcher):**
   - Chọn vai trò `Requester`: Sẽ chỉ thấy nút Đề xuất mới, nút duyệt bị khóa/ẩn.
   - Chọn vai trò `Manager` hoặc `Finance`: Thấy các nút Duyệt / Từ chối khả dụng.
   - Chọn vai trò `Director`: Thấy quyền lực duyệt tối cao cho mọi mức ngân sách.
3. **Thao tác Hàng loạt (Bulk Actions):**
   - Click chọn các checkbox ở đầu dòng.
   - Quan sát thanh Action bar nổi lên dưới đáy màn hình -> Bấm "Phê duyệt hàng loạt" -> Toàn bộ dòng đã chọn chuyển sang `APPROVED` và cập nhật KPI ngay lập tức.
4. **Kiểm tra Cảnh báo Ngân sách trong Form Tạo mới:**
   - Bấm "+ Tạo yêu cầu mua sắm".
   - Chọn phòng ban "R&D" hoặc "Marketing", gõ số tiền lớn (ví dụ `350,000,000`).
   - Quan sát widget tính toán ngân sách tự động cảnh báo đỏ "Vượt ngân sách khả dụng!".
