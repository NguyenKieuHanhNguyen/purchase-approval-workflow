# ProcureFlow - Hệ Thống Phê Duyệt Mua Hàng Doanh Nghiệp (Purchase Approval Workflow)

> **Hệ thống xây dựng trên nền tảng Google Analytics UI Kit (`https://nguyenkieuhanhnguyen.github.io/Analytics_Components/`)**  
> Kết hợp tùy chọn chuyển đổi linh hoạt sang phong cách **`shadcn/ui`**.

---

## 🏛️ TÍCH HỢP ĐẦY ĐỦ CÁC COMPONENTS TỪ GOOGLE ANALYTICS UI KIT

Hệ thống sử dụng trực tiếp cấu trúc HTML, CSS/Tailwind, SVG Icons và logic tương tác từ kho components [Analytics_Components](https://nguyenkieuhanhnguyen.github.io/Analytics_Components/):

| STT | Component trong Analytics_Components | File gốc | Ứng dụng vào hệ thống ProcureFlow |
| :--- | :--- | :--- | :--- |
| **1** | **GA4 Collapsible Sidebar** | `sidebar.html` | Thanh điều hướng bên trái chuẩn GA4: Logo 3 vạch cam, menu (Tổng quan, Yêu cầu PR [active xanh Google], Cần phê duyệt, Ngân sách), nút thu gọn/bung ra ở góc dưới. |
| **2** | **Top Header Utilities** | `header-utilities.html` | Thanh trên cùng GA4: Khung Account Selector, ô Search toàn cục trung tâm, Product Switcher (9 ô vuông), Trợ giúp (`?`), Chuông thông báo, Avatar tài khoản. |
| **3** | **Reports Library Table** | `reports-library.html` | Bảng danh sách yêu cầu mua sắm chuẩn GA4: Toolbar tiêu đề + Tooltip `?`, nút `+ Tạo yêu cầu mới` màu xanh Google, ô tìm kiếm tức thì, checkbox `selectAll`, SVG icon loại hàng, cột Menu thao tác 3 chấm dọc (`⋮`), phân trang GA4 (dropdown số dòng/trang, label `1 – 5/12`, bộ 4 nút `|<`, `<`, `>`, `>|`). |
| **4** | **Right Insights Drawer** | `insights-drawer.html` | Ngăn kéo trượt ra từ mép phải màn hình: Header có icon & nút đóng `✕`, 2 tab "Chi tiết đề xuất" & "Nhật ký phê duyệt (Timeline)", footer action buttons (Yêu cầu bổ sung, Từ chối, Phê duyệt). |
| **5** | **Accordion Tasks** | `accordion.html` | Khối Accordion "Quy trình thẩm định & phê duyệt mua sắm 4 bước" có thể thu gọn/mở rộng, có số thứ tự và badge trạng thái. |
| **6** | **Popup Picker Modal** | `popup-picker.html` | Hộp thoại chọn Phòng ban & tra cứu hạn mức ngân sách quý gồm 2 cột: Danh sách phòng ban và Chi tiết số dư khả dụng. |
| **7** | **Overview Metric Cards** | `exploration-carousel.html` | 4 thẻ chỉ số KPI tài chính mua sắm tổng quan: Tổng yêu cầu, Chờ phê duyệt, Đã phê duyệt, Ngân sách khả dụng & thanh tiến độ. |

---

## 🎨 CHUYỂN ĐỔI LINH HOẠT 2 PHONG CÁCH GIAO DIỆN (DUAL UI THEME)

- **Option 1: Analytic UI (Google Analytics Components Kit - Mặc định)**:
  - Tối ưu cho giám sát khối lượng dữ liệu lớn, thẻ số liệu trực quan, chuẩn nhận diện của Google Analytics 4: Sidebar GA4, Header utilities, Reports Library Table, Right Insights Drawer.
- **Option 2: shadcn/ui (Chuẩn ui.shadcn.com)**:
  - **Thiết kế tối giản & tinh tế**: Áp dụng bảng màu Zinc, font Inter, viền siêu mảnh `border-zinc-200`, bo góc chuẩn `rounded-lg/rounded-xl`, độ tương phản cao.
  - **AI Elements / Stack Trace**: Chuẩn [shadcn/ui Stack Trace](https://ui.shadcn.com/docs/ai-elements/base/stack-trace) dành cho Quy trình thẩm định 4 pha (`PHASE 1..4`, latency, status badge) và Nhật ký Audit Log Timeline trong Drawer.
  - **Bảng dữ liệu & Thao tác**: Badge trạng thái font monospace `font-mono border border-zinc-200`, nút chính đen `bg-zinc-900`, menu thao tác 3 chấm thiết kế chuẩn shadcn Popover.
  - Chuyển đổi tức thời chỉ bằng 1 click trên Header mà không tải lại trang!

---

## 📋 20 YÊU CẦU ĐÃ TRIỂN KHAI HOÀN CHỈNH

### Phần A: 10 Yêu Cầu Chức Năng (Functional Requirements)
1. **[FR-01]** Khởi tạo Phiếu Mua Hàng (form đầy đủ thông tin, validation, tự sinh mã PR-2026-xxxx).
2. **[FR-02]** Tự động kiểm tra Hạn mức Ngân sách thời gian thực (Real-time Budget Check).
3. **[FR-03]** Đính kèm Báo giá & Link tham chiếu nhà cung cấp.
4. **[FR-04]** Phê duyệt Đa cấp (Approve) và tự động ghi nhật ký Audit Trail.
5. **[FR-05]** Từ chối (Reject) kèm popup nhập lý do bắt buộc.
6. **[FR-06]** Yêu cầu bổ sung thông tin (Needs Info / Request Info).
7. **[FR-07]** Tìm kiếm & Lọc đa tiêu chí (Live Search, Lọc Phòng ban, Lọc Trạng thái, Lọc Ưu tiên).
8. **[FR-08]** Xử lý Hàng loạt (Bulk Actions bar nổi khi chọn checkbox).
9. **[FR-09]** Right Drawer Xem Chi tiết & Timeline Lịch sử duyệt 4 cấp trực quan.
10. **[FR-10]** Phân trang GA4 linh hoạt & Xuất dữ liệu CSV / In ấn.

### Phần B: 12 Kịch Bản Dữ Liệu Demo Thực Tế (Demo Scenarios)
1. `PR-2026-1001`: 03 Laptop Dell XPS 15 (135tr, IT, Pending)
2. `PR-2026-1002`: 05 Màn hình Dell Ultrasharp 27" 4K (54.5tr, IT, Approved)
3. `PR-2026-1003`: Gói bản quyền Figma Enterprise 15 seats (42tr, R&D, Pending)
4. `PR-2026-1004`: Thuê gian hàng TechExpo 2026 (185tr, Marketing, Urgent, Pending)
5. `PR-2026-1005`: 30 Bàn ghế công thái học đợt onboarding (68tr, HR, Needs Info)
6. `PR-2026-1006`: Máy pha cà phê tự động DeLonghi cho Pantry (28.9tr, HR, Rejected)
7. `PR-2026-1007`: Bản quyền JetBrains All Products Pack (38tr, IT, Ordered)
8. `PR-2026-1008`: Chiến dịch Google Ads & Performance Q2 (240tr, Marketing, Pending)
9. `PR-2026-1009`: Thay 12 cụm Ắc quy UPS phòng Server (76tr, Vận hành, Urgent, Approved)
10. `PR-2026-1010`: Dịch vụ kiểm toán tài chính nội bộ định kỳ (115tr, Kế toán, Approved)
11. `PR-2026-1011`: Chi phí dã ngoại teambuilding mùa xuân (95tr, HR, Draft)
12. `PR-2026-1012`: Máy chủ AI Training Server 2x RTX 4090 (310tr, R&D, Urgent, Pending - **Cảnh báo vượt ngân sách**)

---

## 🚀 HƯỚNG DẪN MỞ & DEMO TRỰC TIẾP

1. Mở file [index.html](file:///d:/Thực tập/PJ_UNG_DUNG/index.html) bằng trình duyệt bất kỳ (Chrome, Edge, Firefox) hoặc qua Live Server trong VS Code.
2. Thử nghiệm các thao tác nổi bật:
   - **Bấm nút thu gọn Sidebar GA4** ở góc dưới bên trái (`w-60` $\leftrightarrow$ `w-16`).
   - **Bấm vào khung Account Selector trên Topbar** để mở Popup Picker chọn phòng ban và xem chi tiết ngân sách.
   - **Click vào bất kỳ dòng nào trong bảng** để mở Right Insights Drawer trượt ra từ bên phải.
   - **Bấm nút menu 3 chấm (`⋮`)** trên mỗi dòng để thao tác nhanh (Duyệt, Từ chối, In phiếu).
   - **Tích chọn nhiều checkbox** để mở thanh Floating Bulk Action Bar dưới đáy màn hình.
   - **Bấm nút "+ Tạo yêu cầu mới"** để test tính năng Real-time Budget Check cảnh báo vượt ngân sách.
   - **Bấm nút "UI Style: shadcn/ui"** để xem giao diện biến chuyển sang phong cách tối giản.
