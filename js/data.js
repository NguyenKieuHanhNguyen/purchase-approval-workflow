/**
 * DATA.JS - Dữ liệu khởi tạo & Cấu hình hệ thống Purchase Approval Workflow
 */

// Danh sách phòng ban và hạn mức ngân sách quý (VNĐ)
const INITIAL_DEPARTMENTS = [
  {
    id: "it",
    name: "IT & Kỹ thuật",
    totalBudget: 800000000,
    usedBudget: 520000000,
    manager: "Trần Minh Hoàng"
  },
  {
    id: "marketing",
    name: "Marketing & Truyền thông",
    totalBudget: 600000000,
    usedBudget: 425000000,
    manager: "Vũ Hải Đăng"
  },
  {
    id: "hr_admin",
    name: "Hành chính - Nhân sự",
    totalBudget: 350000000,
    usedBudget: 253100000,
    manager: "Ngô Lan Anh"
  },
  {
    id: "rnd",
    name: "R&D - Trí tuệ nhân tạo",
    totalBudget: 700000000,
    usedBudget: 610000000,
    manager: "Lê Quốc Bảo"
  },
  {
    id: "operations",
    name: "Vận hành & Hạ tầng",
    totalBudget: 400000000,
    usedBudget: 176000000,
    manager: "Phạm Hữu Đạt"
  },
  {
    id: "finance",
    name: "Kế toán - Tài chính",
    totalBudget: 250000000,
    usedBudget: 115000000,
    manager: "Đặng Hồng Hạnh"
  }
];

// Danh sách vai trò demo
const USER_ROLES = {
  REQUESTER: {
    id: "REQUESTER",
    name: "Nhân viên đề xuất (Requester)",
    badge: "Requester",
    userName: "Nguyễn Văn An",
    email: "nvan@procureflow.vn",
    dept: "Phòng Kỹ thuật CNTT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    description: "Tạo phiếu PR, bổ sung tài liệu, theo dõi tiến độ"
  },
  MANAGER: {
    id: "MANAGER",
    name: "Trưởng bộ phận (Manager)",
    badge: "Dept Manager",
    userName: "Trần Minh Hoàng",
    email: "tmhoang@procureflow.vn",
    dept: "Phòng Phát triển Phần mềm",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    description: "Thẩm định nhu cầu bước 1 (hạn mức < 50,000,000 đ)"
  },
  FINANCE: {
    id: "FINANCE",
    name: "Kiểm soát ngân sách (Finance)",
    badge: "Finance Controller",
    userName: "Đặng Hồng Hạnh",
    email: "dhhanh@procureflow.vn",
    dept: "Phòng Tài chính - Kế toán",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
    description: "Kiểm tra ngân sách, duyệt chi từ 50tr - 200tr"
  },
  DIRECTOR: {
    id: "DIRECTOR",
    name: "Giám đốc điều hành (Director)",
    badge: "Executive Director",
    userName: "Trịnh Quang Vinh",
    email: "tqvinh@procureflow.vn",
    dept: "Ban Tổng Giám Đốc",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    description: "Phê duyệt cấp cao (> 200,000,000 đ hoặc khẩn cấp)"
  }
};

// 20 Kịch bản mua hàng mẫu đa dạng trạng thái, phòng ban, mức giá
const INITIAL_PURCHASE_REQUESTS = [
  {
    id: "PR-2026-1001",
    title: "03 Laptop Dell XPS 15 9530 cho Senior Dev",
    category: "Thiết bị phần cứng",
    department: "it",
    departmentName: "IT & Kỹ thuật",
    requester: {
      name: "Nguyễn Văn An",
      role: "Senior Software Engineer",
      email: "an.nguyen@company.vn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-18 09:30",
    updatedAt: "2026-11-19 14:15",
    amount: 135000000,
    priority: "HIGH",
    vendor: "Dell Vietnam Authorized Distributor",
    vendorLink: "https://dell.com/vn/xps-15-9530",
    status: "PENDING",
    purpose: "Cấp phát máy trạm đồ họa & compile code tốc độ cao cho 3 kỹ sư dự án Core Banking chuẩn bị Golive quý 1.",
    items: [
      { name: "Dell XPS 15 (i9-13900H, 32GB RAM, 1TB SSD, RTX 4060)", qty: 3, unitPrice: 45000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Nguyễn Văn An (Requester)", time: "18/11/2026 09:30", note: "Đã đính kèm bảng cấu hình yêu cầu kỹ thuật và 3 báo giá", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Trần Minh Hoàng (Manager)", time: "18/11/2026 14:20", note: "Xác nhận đúng định mức nhân sự Senior Dev. Chuyển Finance.", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "19/11/2026 14:15", note: "Đang kiểm tra gói bảo hành ProSupport và đối chiếu hạn mức ngân sách IT.", status: "current" },
      { step: "Ban Giám Đốc phê duyệt", user: "Trịnh Quang Vinh (Director)", time: "-", note: "Chờ Finance hoàn tất thẩm định", status: "pending" }
    ]
  },
  {
    id: "PR-2026-1002",
    title: "05 Màn hình Dell Ultrasharp 27 inch 4K (U2723QE)",
    category: "Thiết bị phần cứng",
    department: "it",
    departmentName: "IT & Kỹ thuật",
    requester: {
      name: "Trần Thị Mai",
      role: "Frontend Tech Lead",
      email: "mai.tran@company.vn",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-16 10:15",
    updatedAt: "2026-11-17 16:45",
    amount: 54500000,
    priority: "MEDIUM",
    vendor: "Công ty Cổ phần Máy tính Hà Nội",
    vendorLink: "https://hanoicomputer.com.vn/dell-u2723qe",
    status: "APPROVED",
    purpose: "Nâng cấp màn hình chuẩn màu sắc phục vụ kiểm tra giao diện ứng dụng trên màn hình Retina / 4K.",
    items: [
      { name: "Màn hình Dell UltraSharp U2723QE 27 inch IPS Black 4K", qty: 5, unitPrice: 10900000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Trần Thị Mai (Requester)", time: "16/11/2026 10:15", note: "Gửi kèm link sản phẩm chính hãng", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Trần Minh Hoàng (Manager)", time: "16/11/2026 15:30", note: "Đồng ý trang bị cho nhóm Frontend", status: "completed" },
      { step: "Kế toán thẩm định", user: "Đặng Hồng Hạnh (Finance)", time: "17/11/2026 11:20", note: "Ngân sách IT đủ điều kiện chi trả", status: "completed" },
      { step: "Ban Giám Đốc phê duyệt", user: "Trịnh Quang Vinh (Director)", time: "17/11/2026 16:45", note: "Đã phê duyệt. Chuyển phòng Mua hàng làm PO.", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1003",
    title: "Gói tài khoản Figma Enterprise thường niên (15 seats)",
    category: "Phần mềm & Bản quyền",
    department: "rnd",
    departmentName: "R&D - Trí tuệ nhân tạo",
    requester: {
      name: "Lê Hoàng Nam",
      role: "Lead Product Designer",
      email: "nam.le@company.vn",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-19 08:30",
    updatedAt: "2026-11-19 11:00",
    amount: 42000000,
    priority: "MEDIUM",
    vendor: "Figma Inc. (USA) / Thanh toán thẻ cty",
    vendorLink: "https://figma.com/pricing",
    status: "PENDING",
    purpose: "Gia hạn gói thiết kế UI/UX và Design System toàn công ty cho năm 2027.",
    items: [
      { name: "Figma Enterprise Tier Subscription (15 full design seats x 12 months)", qty: 1, unitPrice: 42000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Lê Hoàng Nam", time: "19/11/2026 08:30", note: "Hóa đơn VAT quốc tế và hợp đồng điện tử", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Lê Quốc Bảo (Manager)", time: "19/11/2026 11:00", note: "Xác nhận danh sách 15 designers hợp lệ", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "-", note: "Đang chờ phân bổ hạn mục phần mềm", status: "current" }
    ]
  },
  {
    id: "PR-2026-1004",
    title: "Thuê gian hàng chuẩn triển lãm TechExpo Vietnam 2026",
    category: "Marketing & Sự kiện",
    department: "marketing",
    departmentName: "Marketing & Truyền thông",
    requester: {
      name: "Phạm Hương Giang",
      role: "Marketing Director Assistant",
      email: "giang.pham@company.vn",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-15 14:00",
    updatedAt: "2026-11-18 10:20",
    amount: 185000000,
    priority: "URGENT",
    vendor: "Hiệp hội Phần mềm Vinasa / TechExpo BTC",
    vendorLink: "https://techexpo.vn/booth-registration",
    status: "PENDING",
    purpose: "Thuê 2 gian hàng mặt tiền trung tâm hội chợ SECC để quảng bá nền tảng AI và tìm kiếm khách hàng doanh nghiệp B2B.",
    items: [
      { name: "Vị trí gian hàng Diamond A01-A02 (36m2) + Thiết kế thi công", qty: 1, unitPrice: 185000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Phạm Hương Giang", time: "15/11/2026 14:00", note: "Hạn chót giữ chỗ trước 25/11/2026", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Vũ Hải Đăng (Manager)", time: "16/11/2026 09:10", note: "Đã thống nhất kế hoạch ROI dự kiến", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "18/11/2026 10:20", note: "Đã thẩm định hợp đồng và điều khoản đặt cọc 50%", status: "completed" },
      { step: "Ban Giám Đốc phê duyệt", user: "Trịnh Quang Vinh (Director)", time: "-", note: "Chờ Director chốt hạn mức tài trợ", status: "current" }
    ]
  },
  {
    id: "PR-2026-1005",
    title: "30 Bàn ghế công thái học đợt onboarding nhân sự Q1",
    category: "Cơ sở vật chất",
    department: "hr_admin",
    departmentName: "Hành chính - Nhân sự",
    requester: {
      name: "Đỗ Minh Tuấn",
      role: "Facilities Officer",
      email: "tuan.do@company.vn",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-17 11:20",
    updatedAt: "2026-11-19 15:40",
    amount: 68000000,
    priority: "HIGH",
    vendor: "Nội thất Epione Vietnam",
    vendorLink: "https://epione.vn/ergonomic-chair-easy-chair",
    status: "NEEDS_INFO",
    purpose: "Trang bị bàn ghế chống đau lưng cho văn phòng tầng 8 theo chỉ thị bảo vệ sức khỏe nhân viên.",
    items: [
      { name: "Ghế công thái học Epione Easy Chair 2.0", qty: 20, unitPrice: 2400000 },
      { name: "Bàn nâng hạ tự động Single Motor 1m4", qty: 10, unitPrice: 2000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Đỗ Minh Tuấn", time: "17/11/2026 11:20", note: "Đã chọn gói khuyến mãi chiết khấu doanh nghiệp 15%", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Ngô Lan Anh (Manager)", time: "17/11/2026 16:30", note: "Đồng ý về quy mô số lượng", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "19/11/2026 15:40", note: "YÊU CẦU BỔ SUNG: Vui lòng lấy thêm báo giá cạnh tranh từ thương hiệu Sihoo và MerryFair để đối chiếu chính sách bảo hành.", status: "current" }
    ]
  },
  {
    id: "PR-2026-1006",
    title: "Máy pha cà phê tự động DeLonghi Magnifica S cho Pantry",
    category: "Cơ sở vật chất",
    department: "hr_admin",
    departmentName: "Hành chính - Nhân sự",
    requester: {
      name: "Bùi Thu Trang",
      role: "HR & Culture Specialist",
      email: "trang.bui@company.vn",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-14 09:00",
    updatedAt: "2026-11-15 17:00",
    amount: 28900000,
    priority: "LOW",
    vendor: "Siêu thị Điện Máy Xanh",
    vendorLink: "https://dienmayxanh.com/may-pha-ca-phe-delonghi",
    status: "REJECTED",
    purpose: "Phục vụ đồ uống miễn phí buổi sáng cho nhân viên công ty tại pantry tầng 7.",
    items: [
      { name: "Máy pha cà phê tự động DeLonghi Magnifica S ECAM 22.110.B", qty: 1, unitPrice: 24900000 },
      { name: "Phụ kiện vòi đánh sữa và 10kg hạt Arabica Cầu Đất", qty: 1, unitPrice: 4000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Bùi Thu Trang", time: "14/11/2026 09:00", note: "Đã có chữ ký khảo sát từ các phòng ban", status: "completed" },
      { step: "Trưởng bộ phận từ chối", user: "Ngô Lan Anh (Manager)", time: "15/11/2026 17:00", note: "TỪ CHỐI: Quý này ngân sách phúc lợi đang dồn trọng tâm cho gói Khám sức khỏe định kỳ và bảo hiểm sức khỏe cao cấp.", status: "rejected" }
    ]
  },
  {
    id: "PR-2026-1007",
    title: "Bản quyền JetBrains All Products Pack (10 developer)",
    category: "Phần mềm & Bản quyền",
    department: "it",
    departmentName: "IT & Kỹ thuật",
    requester: {
      name: "Nguyễn Văn An",
      role: "Senior Software Engineer",
      email: "an.nguyen@company.vn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-10 08:30",
    updatedAt: "2026-11-12 11:20",
    amount: 38000000,
    priority: "HIGH",
    vendor: "JetBrains s.r.o / Đại lý Pacisoft Vietnam",
    vendorLink: "https://pacisoft.vn/jetbrains-all-products-pack",
    status: "ORDERED",
    purpose: "Công cụ lập trình IntelliJ IDEA Ultimate, WebStorm, PyCharm phục vụ lập trình viên fullstack.",
    items: [
      { name: "JetBrains All Products Pack for Organizations (1 year subscription)", qty: 10, unitPrice: 3800000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Nguyễn Văn An", time: "10/11/2026 08:30", note: "Đã có danh sách email tài khoản nhận license", status: "completed" },
      { step: "Trưởng phòng duyệt", user: "Trần Minh Hoàng", time: "10/11/2026 14:00", note: "Đã duyệt", status: "completed" },
      { step: "Finance duyệt", user: "Đặng Hồng Hạnh", time: "11/11/2026 09:30", note: "Hạn mức hợp lệ", status: "completed" },
      { step: "Đặt hàng & Cấp phát", user: "Phòng Mua hàng & Kế toán", time: "12/11/2026 11:20", note: "Đã thanh toán PO #9921 và gửi License key kích hoạt cho 10 kỹ sư.", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1008",
    title: "Chiến dịch quảng cáo Google Ads & Performance Q2",
    category: "Marketing & Sự kiện",
    department: "marketing",
    departmentName: "Marketing & Truyền thông",
    requester: {
      name: "Phạm Hương Giang",
      role: "Marketing Director Assistant",
      email: "giang.pham@company.vn",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-17 15:00",
    updatedAt: "2026-11-19 16:30",
    amount: 240000000,
    priority: "HIGH",
    vendor: "Google Asia Pacific Pte. Ltd",
    vendorLink: "https://ads.google.com/ups/routing?source=206&subid=xs-ip-gemini-adlt",
    status: "PENDING",
    purpose: "Chạy chiến dịch tìm kiếm và GDN nhắm đến tệp khách hàng quản lý doanh nghiệp vừa và nhỏ (SME).",
    items: [
      { name: "Ngân sách chi trả trực tiếp Ads Spend (3 tháng)", qty: 1, unitPrice: 240000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Phạm Hương Giang", time: "17/11/2026 15:00", note: "Đính kèm bản cam kết KPI (CPL < 250k)", status: "completed" },
      { step: "Trưởng phòng duyệt", user: "Vũ Hải Đăng", time: "18/11/2026 10:00", note: "Đã rà soát dự toán và chỉ số chuyển đổi", status: "completed" },
      { step: "Finance rà soát", user: "Đặng Hồng Hạnh", time: "19/11/2026 16:30", note: "Khoản chi > 200tr, cần phê duyệt chung cuộc từ Tổng Giám Đốc", status: "current" },
      { step: "Giám đốc phê duyệt", user: "Trịnh Quang Vinh", time: "-", note: "Chờ họp ban giám đốc vào sáng thứ Hai", status: "pending" }
    ]
  },
  {
    id: "PR-2026-1009",
    title: "Thay thế 12 cụm Ắc quy UPS phòng Server Data Center",
    category: "Vật tư & Thiết bị vận hành",
    department: "operations",
    departmentName: "Vận hành & Hạ tầng",
    requester: {
      name: "Vũ Đức Thắng",
      role: "Infrastructure Lead",
      email: "thang.vu@company.vn",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-19 07:15",
    updatedAt: "2026-11-19 09:45",
    amount: 76000000,
    priority: "URGENT",
    vendor: "Công ty Cổ phần Năng lượng APC Vietnam",
    vendorLink: "https://apc.com/vn/ups-batteries",
    status: "APPROVED",
    purpose: "KHẨN CẤP: Hệ thống UPS phòng máy chủ cảnh báo ắc quy suy giảm còn dưới 25% dung lượng, có nguy cơ sập nguồn khi mất điện lưới.",
    items: [
      { name: "Ắc quy chuyên dụng 12V-100Ah CSB Battery", qty: 12, unitPrice: 5500000 },
      { name: "Chi phí nhân công tháo lắp và kiểm chuẩn kỹ thuật an toàn", qty: 1, unitPrice: 10000000 }
    ],
    timeline: [
      { step: "Tạo phiếu khẩn cấp", user: "Vũ Đức Thắng", time: "19/11/2026 07:15", note: "Kèm hình ảnh log cảnh báo từ máy chủ giám sát", status: "completed" },
      { step: "Trưởng phòng duyệt", user: "Phạm Hữu Đạt", time: "19/11/2026 08:00", note: "Duyệt khẩn cấp, yêu cầu thay thế ngay", status: "completed" },
      { step: "Finance duyệt chi", user: "Đặng Hồng Hạnh", time: "19/11/2026 08:45", note: "Trích từ quỹ dự phòng rủi ro hạ tầng", status: "completed" },
      { step: "Giám đốc phê duyệt", user: "Trịnh Quang Vinh", time: "19/11/2026 09:45", note: "Đã phê duyệt ưu tiên cao nhất.", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1010",
    title: "Dịch vụ kiểm toán tài chính nội bộ định kỳ năm 2026",
    category: "Dịch vụ tư vấn chuyên nghiệp",
    department: "finance",
    departmentName: "Kế toán - Tài chính",
    requester: {
      name: "Đặng Hồng Hạnh",
      role: "Finance Controller",
      email: "hanh.dang@company.vn",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-12 14:00",
    updatedAt: "2026-11-15 10:00",
    amount: 115000000,
    priority: "MEDIUM",
    vendor: "KPMG Vietnam Co., Ltd",
    vendorLink: "https://kpmg.com/vn/audit-services",
    status: "APPROVED",
    purpose: "Thực hiện soát xét báo cáo tài chính quý 4 và chuẩn bị hồ sơ quyết toán thuế năm.",
    items: [
      { name: "Hợp đồng kiểm toán độc lập đợt 2", qty: 1, unitPrice: 115000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Đặng Hồng Hạnh", time: "12/11/2026 14:00", note: "Căn cứ hợp đồng nguyên tắc đã ký", status: "completed" },
      { step: "Giám đốc phê duyệt", user: "Trịnh Quang Vinh", time: "15/11/2026 10:00", note: "Đã ký duyệt giải ngân theo tiến độ hợp đồng", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1011",
    title: "Chi phí tổ chức Teambuilding dã ngoại mùa xuân 2027",
    category: "Phúc lợi & Sự kiện nội bộ",
    department: "hr_admin",
    departmentName: "Hành chính - Nhân sự",
    requester: {
      name: "Hoàng Quốc Việt",
      role: "Internal Event Lead",
      email: "viet.hoang@company.vn",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-19 16:00",
    updatedAt: "2026-11-19 16:00",
    amount: 95000000,
    priority: "LOW",
    vendor: "Saigontourist Group",
    vendorLink: "https://saigontourist.net",
    status: "DRAFT",
    purpose: "Bản nháp kế hoạch đưa 120 cán bộ nhân viên tham quan nghỉ dưỡng tại Mũi Né (2 ngày 1 đêm).",
    items: [
      { name: "Xe đưa đón 45 chỗ + Khách sạn 4 sao + Gala Dinner", qty: 1, unitPrice: 95000000 }
    ],
    timeline: [
      { step: "Tạo bản nháp", user: "Hoàng Quốc Việt", time: "19/11/2026 16:00", note: "Đang đợi bình chọn địa điểm từ toàn thể nhân viên", status: "current" }
    ]
  },
  {
    id: "PR-2026-1012",
    title: "Máy chủ AI Training Server chuyên dụng (2x NVIDIA RTX 4090 24GB)",
    category: "Thiết bị phần cứng",
    department: "rnd",
    departmentName: "R&D - Trí tuệ nhân tạo",
    requester: {
      name: "Phan Gia Huy",
      role: "Lead AI Researcher",
      email: "huy.phan@company.vn",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-19 11:45",
    updatedAt: "2026-11-19 15:30",
    amount: 310000000,
    priority: "URGENT",
    vendor: "Công ty Cổ phần Máy chủ Siêu Tốc (Supermicro VN)",
    vendorLink: "https://sieutoc.com.vn/ai-training-rig",
    status: "PENDING",
    purpose: "Huấn luyện mô hình Large Language Model nội bộ và Fine-tune xử lý tài liệu tài chính ngân hàng. CẢNH BÁO: Vượt ngân sách khả dụng của R&D tháng này (cần xin duyệt đặc biệt).",
    items: [
      { name: "Server Rack 4U, Dual Xeon Gold, 256GB ECC RAM, 2x RTX 4090", qty: 1, unitPrice: 310000000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Phan Gia Huy", time: "19/11/2026 11:45", note: "Đã bổ sung bản phân tích Benchmark hiệu năng so với thuê Cloud GPU (tiết kiệm 60% sau 6 tháng)", status: "completed" },
      { step: "Trưởng phòng duyệt", user: "Lê Quốc Bảo (Manager)", time: "19/11/2026 13:10", note: "Ủng hộ mạnh mẽ, đề xuất xin trích thêm ngân sách đặc thù từ quỹ R&D tổng", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "19/11/2026 15:30", note: "CẢNH BÁO: Khoản chi 310tr vượt mức dư ngân sách R&D (còn 90tr). Đã chuyển trình Tổng Giám Đốc xem xét phê duyệt ngoại lệ.", status: "current" },
      { step: "Tổng Giám Đốc duyệt", user: "Trịnh Quang Vinh (Director)", time: "-", note: "Chờ ý kiến quyết định của Ban Tổng Giám Đốc", status: "pending" }
    ]
  },
  {
    id: "PR-2026-1013",
    title: "04 Chuột & bàn phím cơ không dây phục vụ QA & Testing",
    category: "Thiết bị phần cứng",
    department: "it",
    departmentName: "IT & Kỹ thuật",
    requester: {
      name: "Trần Thị Mai",
      role: "Frontend Tech Lead",
      email: "mai.tran@company.vn",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-20 09:00",
    updatedAt: "2026-11-20 10:15",
    amount: 16800000,
    priority: "LOW",
    vendor: "GearVN Vietnam",
    vendorLink: "https://gearvn.com/keychron-logitech",
    status: "PENDING",
    purpose: "Thay thế bộ phím chuột đã hao mòn cho nhóm QA kiểm thử giao diện và thao tác phím tắt liên tục.",
    items: [
      { name: "Bàn phím cơ Keychron K2 Pro Wireless", qty: 4, unitPrice: 2400000 },
      { name: "Chuột không dây Logitech MX Master 3S", qty: 4, unitPrice: 1800000 }
    ],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: "Trần Thị Mai", time: "20/11/2026 09:00", note: "Khoản chi dưới 50tr, thuộc hạn mức duyệt của Trưởng bộ phận", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Trần Minh Hoàng (Manager)", time: "-", note: "Đang chờ Trưởng bộ phận xác nhận nhu cầu", status: "current" }
    ]
  },
  {
    id: "PR-2026-1014",
    title: "Sản xuất video giới thiệu sản phẩm & KOL review Q4",
    category: "Marketing & Sự kiện",
    department: "marketing",
    departmentName: "Marketing & Truyền thông",
    requester: {
      name: "Phạm Hương Giang",
      role: "Marketing Director Assistant",
      email: "giang.pham@company.vn",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-20 11:10",
    updatedAt: "2026-11-20 14:00",
    amount: 85000000,
    priority: "HIGH",
    vendor: "Studio Sáng Tạo 24h",
    vendorLink: "https://sangtao24h.vn/production-package",
    status: "APPROVED",
    purpose: "Quay dựng video showcase tính năng mới và phát sóng trên kênh YouTube/LinkedIn doanh nghiệp.",
    items: [
      { name: "Gói sản xuất TVC/Demo Video 4K + Hậu kỳ & Motion", qty: 1, unitPrice: 60000000 },
      { name: "Booking Tech Reviewer chuyên ngành công nghệ", qty: 1, unitPrice: 25000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Phạm Hương Giang", time: "20/11/2026 11:10", note: "Kèm storyboard chi tiết", status: "completed" },
      { step: "Trưởng phòng duyệt", user: "Vũ Hải Đăng", time: "20/11/2026 12:30", note: "Đã duyệt kịch bản và ngân sách", status: "completed" },
      { step: "Finance thẩm định", user: "Đặng Hồng Hạnh", time: "20/11/2026 14:00", note: "Đã phê duyệt trong hạn mức Marketing", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1015",
    title: "Gói Cloud Hosting & Database Production AWS (Tháng 12)",
    category: "Phần mềm & Bản quyền",
    department: "operations",
    departmentName: "Vận hành & Hạ tầng",
    requester: {
      name: "Vũ Đức Thắng",
      role: "Infrastructure Lead",
      email: "thang.vu@company.vn",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-21 08:45",
    updatedAt: "2026-11-21 10:20",
    amount: 148000000,
    priority: "URGENT",
    vendor: "Amazon Web Services (AWS)",
    vendorLink: "https://aws.amazon.com/pricing",
    status: "ORDERED",
    purpose: "Duy trì cụm EC2, RDS và S3 phục vụ lưu lượng truy cập cao điểm cuối năm.",
    items: [
      { name: "AWS Compute, Managed RDS & Data Transfer (Dec 2026)", qty: 1, unitPrice: 148000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Vũ Đức Thắng", time: "21/11/2026 08:45", note: "Đính kèm báo cáo dự báo chi phí AWS Cost Explorer", status: "completed" },
      { step: "Finance & Director duyệt", user: "Đặng Hồng Hạnh & Trịnh Quang Vinh", time: "21/11/2026 10:20", note: "Đã duyệt và đối soát thẻ thanh toán doanh nghiệp.", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1016",
    title: "Bộ dụng cụ vệ sinh & khử khuẩn văn phòng định kỳ 6 tháng",
    category: "Vật tư & Thiết bị vận hành",
    department: "hr_admin",
    departmentName: "Hành chính - Nhân sự",
    requester: {
      name: "Đỗ Minh Tuấn",
      role: "Facilities Officer",
      email: "tuan.do@company.vn",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-21 13:20",
    updatedAt: "2026-11-21 15:00",
    amount: 19500000,
    priority: "MEDIUM",
    vendor: "Công ty TNHH Vệ sinh Xanh Sài Gòn",
    vendorLink: "https://vesinhxanh.vn/supplies",
    status: "NEEDS_INFO",
    purpose: "Bổ sung dung dịch sát khuẩn, giấy vệ sinh và vật tư vệ sinh cho 2 tầng văn phòng.",
    items: [
      { name: "Combo vật tư vệ sinh & khử khuẩn văn phòng (6 tháng)", qty: 1, unitPrice: 19500000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Đỗ Minh Tuấn", time: "21/11/2026 13:20", note: "Đã gửi danh sách định mức", status: "completed" },
      { step: "Trưởng bộ phận", user: "Ngô Lan Anh", time: "21/11/2026 15:00", note: "Cần bổ sung chi tiết đơn giá từng mặt hàng trước khi duyệt", status: "current" }
    ]
  },
  {
    id: "PR-2026-1017",
    title: "Mua bộ Dataset huấn luyện mô hình OCR tiếng Việt",
    category: "Phần mềm & Bản quyền",
    department: "rnd",
    departmentName: "R&D - Trí tuệ nhân tạo",
    requester: {
      name: "Phan Gia Huy",
      role: "Lead AI Researcher",
      email: "huy.phan@company.vn",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-22 09:15",
    updatedAt: "2026-11-22 09:15",
    amount: 64000000,
    priority: "HIGH",
    vendor: "VietData AI Lab",
    vendorLink: "https://vietdata.ai/ocr-dataset",
    status: "DRAFT",
    purpose: "Bản nháp đề xuất mua 50.000 mẫu hóa đơn & chứng từ có gán nhãn chuẩn phục vụ bài toán trích xuất tài liệu.",
    items: [
      { name: "Vietnamese Financial Document OCR Dataset (50k annotated samples)", qty: 1, unitPrice: 64000000 }
    ],
    timeline: [
      { step: "Lưu bản nháp", user: "Phan Gia Huy", time: "22/11/2026 09:15", note: "Đang kiểm tra độ phủ chữ viết tay trước khi gửi duyệt", status: "current" }
    ]
  },
  {
    id: "PR-2026-1018",
    title: "Khóa đào tạo chuẩn hóa quy trình kế toán & thuế 2026",
    category: "Dịch vụ tư vấn chuyên nghiệp",
    department: "finance",
    departmentName: "Kế toán - Tài chính",
    requester: {
      name: "Đặng Hồng Hạnh",
      role: "Finance Controller",
      email: "hanh.dang@company.vn",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-22 10:40",
    updatedAt: "2026-11-22 14:20",
    amount: 34000000,
    priority: "MEDIUM",
    vendor: "Viện Kế toán & Kiểm toán VN",
    vendorLink: "https://vienketoan.vn/course-2026",
    status: "APPROVED",
    purpose: "Cập nhật chính sách hóa đơn điện tử và quy định thuế mới cho 6 nhân sự phòng Tài chính - Kế toán.",
    items: [
      { name: "Vé tham dự khóa chuyên đề (6 học viên)", qty: 6, unitPrice: 5666667 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Đặng Hồng Hạnh", time: "22/11/2026 10:40", note: "Kèm lịch học và syllabus", status: "completed" },
      { step: "Giám đốc phê duyệt", user: "Trịnh Quang Vinh", time: "22/11/2026 14:20", note: "Đồng ý cử nhân sự tham gia đào tạo", status: "completed" }
    ]
  },
  {
    id: "PR-2026-1019",
    title: "In ấn tài liệu Catalog & Booth backdrop hội nghị khách hàng",
    category: "Marketing & Sự kiện",
    department: "marketing",
    departmentName: "Marketing & Truyền thông",
    requester: {
      name: "Phạm Hương Giang",
      role: "Marketing Director Assistant",
      email: "giang.pham@company.vn",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-23 08:20",
    updatedAt: "2026-11-23 11:05",
    amount: 22500000,
    priority: "LOW",
    vendor: "Xưởng In Nhanh Offset Sài Gòn",
    vendorLink: "https://innhanhsaigon.vn/catalog",
    status: "REJECTED",
    purpose: "In 500 cuốn catalog giới thiệu giải pháp và bộ backdrop sự kiện.",
    items: [
      { name: "In 500 cuốn Catalog giấy Couche 150gsm + cán màng mờ", qty: 1, unitPrice: 14500000 },
      { name: "Bộ Backdrop khung sắt & Standee sự kiện", qty: 1, unitPrice: 8000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Phạm Hương Giang", time: "23/11/2026 08:20", note: "Đã gửi file thiết kế", status: "completed" },
      { step: "Trưởng bộ phận từ chối", user: "Vũ Hải Đăng", time: "23/11/2026 11:05", note: "TỪ CHỐI: Chuyển sang dùng QR Code & brochure số để tiết kiệm chi phí in ấn và thân thiện môi trường.", status: "rejected" }
    ]
  },
  {
    id: "PR-2026-1020",
    title: "02 Switch mạng quản lý 24 cổng 10Gbps cho tủ Rack chính",
    category: "Vật tư & Thiết bị vận hành",
    department: "operations",
    departmentName: "Vận hành & Hạ tầng",
    requester: {
      name: "Vũ Đức Thắng",
      role: "Infrastructure Lead",
      email: "thang.vu@company.vn",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
    },
    createdAt: "2026-11-24 09:10",
    updatedAt: "2026-11-24 10:50",
    amount: 92000000,
    priority: "HIGH",
    vendor: "Cisco / Đại lý Thiết bị Mạng NetPro",
    vendorLink: "https://netpro.vn/catalyst-switch-10g",
    status: "PENDING",
    purpose: "Tăng băng thông kết nối nội bộ giữa các cụm máy chủ và hệ thống lưu trữ NAS.",
    items: [
      { name: "Managed Switch 24-Port 10GbE SFP+", qty: 2, unitPrice: 46000000 }
    ],
    timeline: [
      { step: "Tạo phiếu", user: "Vũ Đức Thắng", time: "24/11/2026 09:10", note: "Đính kèm sơ đồ đấu nối mạng nội bộ", status: "completed" },
      { step: "Trưởng bộ phận duyệt", user: "Phạm Hữu Đạt", time: "24/11/2026 10:50", note: "Đã xác nhận nhu cầu kỹ thuật, chuyển kiểm soát ngân sách", status: "completed" },
      { step: "Kiểm soát ngân sách", user: "Đặng Hồng Hạnh (Finance)", time: "-", note: "Đang đối chiếu hạn mức vận hành quý 4", status: "current" }
    ]
  }
];

// Trạng thái cấu hình nhãn, màu sắc
const STATUS_CONFIG = {
  DRAFT: {
    label: "Bản nháp",
    badgeAnalytic: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
    badgeShadcn: "bg-secondary text-secondary-foreground border border-input",
    icon: "fa-pencil"
  },
  PENDING: {
    label: "Chờ phê duyệt",
    badgeAnalytic: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    badgeShadcn: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-medium",
    icon: "fa-clock"
  },
  NEEDS_INFO: {
    label: "Cần bổ sung",
    badgeAnalytic: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
    badgeShadcn: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30 font-medium",
    icon: "fa-circle-question"
  },
  APPROVED: {
    label: "Đã phê duyệt",
    badgeAnalytic: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    badgeShadcn: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-medium",
    icon: "fa-circle-check"
  },
  REJECTED: {
    label: "Từ chối",
    badgeAnalytic: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    badgeShadcn: "bg-destructive/15 text-destructive dark:text-red-400 border border-destructive/30 font-medium",
    icon: "fa-circle-xmark"
  },
  ORDERED: {
    label: "Đã hoàn tất / PO",
    badgeAnalytic: "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    badgeShadcn: "bg-primary/10 text-primary dark:text-indigo-400 border border-primary/25 font-medium",
    icon: "fa-truck-fast"
  }
};

// Mức ưu tiên
const PRIORITY_CONFIG = {
  LOW: {
    label: "Thấp",
    badgeAnalytic: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
    badgeShadcn: "text-muted-foreground bg-muted border border-border",
    dot: "bg-slate-400"
  },
  MEDIUM: {
    label: "Trung bình",
    badgeAnalytic: "text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300",
    badgeShadcn: "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900",
    dot: "bg-blue-500"
  },
  HIGH: {
    label: "Cao",
    badgeAnalytic: "text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
    badgeShadcn: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20",
    dot: "bg-amber-500"
  },
  URGENT: {
    label: "Khẩn cấp",
    badgeAnalytic: "text-rose-700 bg-rose-50 border border-rose-200 animate-pulse dark:bg-rose-950/40 dark:text-rose-300",
    badgeShadcn: "text-red-600 dark:text-red-400 bg-destructive/10 border border-destructive/30 font-semibold",
    dot: "bg-red-500 animate-ping"
  }
};

// Định dạng tiền tệ VNĐ
function formatVND(amount) {
  if (amount === undefined || amount === null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "đ");
}

// Định dạng số rút gọn (triệu / tỷ)
function formatCompactVND(amount) {
  if (!amount) return "0 đ";
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + " tỷ";
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(0) + " tr";
  }
  return formatVND(amount);
}