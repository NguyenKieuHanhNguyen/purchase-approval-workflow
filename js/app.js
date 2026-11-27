/**
 * APP.JS - PURCHASE APPROVAL WORKFLOW
 * Tích hợp toàn diện Google Analytics UI Kit (Analytics_Components) & shadcn/ui Option
 */

// ========================================================
// 1. GLOBAL APPLICATION STATE
// ========================================================
const AppState = {
  theme: 'analytic', // 'analytic' (GA4 Components Kit) | 'shadcn'
  currentRole: 'MANAGER', // 'REQUESTER' | 'MANAGER' | 'FINANCE' | 'DIRECTOR'
  sidebarCollapsed: false,
  requests: [...INITIAL_PURCHASE_REQUESTS],
  departments: JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS)),
  selectedIds: new Set(),
  filters: {
    search: '',
    department: 'ALL',
    status: 'ALL',
    priority: 'ALL'
  },
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  pagination: {
    page: 1,
    pageSize: 5
  },
  currentDetailId: null,
  activePrompt: {
    type: null, // 'REJECT' | 'NEEDS_INFO'
    targetId: null
  },
  openRowMenuId: null,
  notifications: [
    {
      id: "notif-1",
      targetType: "PR",
      targetId: "PR-2026-1012",
      urgent: true,
      badge: "Cần duyệt gấp",
      badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
      icon: "fa-triangle-exclamation text-rose-600",
      title: "PR-2026-1012: AI Training Server (310.000.000 đ)",
      desc: "Khoản chi > 200tr, Kế toán đã thẩm định ngân sách. Đang chờ Giám đốc duyệt bước cuối.",
      time: "10 phút trước",
      unread: true
    },
    {
      id: "notif-2",
      targetType: "PR",
      targetId: "PR-2026-1013",
      urgent: true,
      badge: "Chờ duyệt cấp 1",
      badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "fa-clock text-amber-600",
      title: "PR-2026-1013: Chuột & bàn phím cơ QA (16.800.000 đ)",
      desc: "Nhân viên IT vừa gửi đề xuất mua thiết bị mới. Trưởng bộ phận cần thẩm định trước 17:00.",
      time: "45 phút trước",
      unread: true
    },
    {
      id: "notif-3",
      targetType: "PR",
      targetId: "PR-2026-1005",
      urgent: false,
      badge: "Cần bổ sung",
      badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "fa-circle-info text-purple-600",
      title: "PR-2026-1005: 30 Bàn ghế công thái học (68.000.000 đ)",
      desc: "Phòng Tài chính yêu cầu bổ sung thêm báo giá đối chiếu từ Sihoo và MerryFair.",
      time: "2 giờ trước",
      unread: true
    },
    {
      id: "notif-4",
      targetType: "BUDGET",
      targetId: "rnd",
      urgent: false,
      badge: "Cảnh báo quỹ",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
      icon: "fa-chart-pie text-orange-600",
      title: "Phòng R&D đã sử dụng 87% ngân sách quý",
      desc: "Hạn mức còn lại 90.000.000 đ / 700tr. Kiểm tra chi tiết số dư ngân sách 6 phòng ban.",
      time: "Hôm qua",
      unread: true
    },
    {
      id: "notif-5",
      targetType: "PR",
      targetId: "PR-2026-1002",
      urgent: false,
      badge: "Đã phê duyệt",
      badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "fa-circle-check text-emerald-600",
      title: "PR-2026-1002: 05 Màn hình Dell UltraSharp 4K (54.500.000 đ)",
      desc: "Phiếu đã hoàn tất phê duyệt. Sẵn sàng lập đơn đặt hàng PO.",
      time: "Hôm qua",
      unread: false
    }
  ],
  notifFilter: 'all'
};

// ========================================================
// 2. KHỞI TẠO ỨNG DỤNG (INITIALIZATION)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('paw_theme') || 'analytic';
  switchTheme(savedTheme, false);

  updateRoleUI();
  renderAll();
  renderNotifications();
  renderSpecScenarios();

  document.addEventListener('click', (e) => {
    const clickedWrapper = e.target.closest('[data-popover-wrapper]');
    document.querySelectorAll('[data-popover-wrapper]').forEach(wrapper => {
      if (wrapper !== clickedWrapper) {
        const panel = wrapper.querySelector('.popover-panel');
        if (panel) panel.classList.add('hidden');
      }
    });

    if (!e.target.closest('.row-action-menu-btn') && !e.target.closest('.row-action-dropdown')) {
      closeAllRowMenus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const input = document.getElementById('globalSearchInput');
      if (input) input.focus();
    }
    if (e.key === 'Escape') {
      closeDetailDrawer();
      closeCreateModal();
      closeSpecModal();
      closePromptModal();
      closeAccountPickerModal();
    }
  });
});

// ========================================================
// 3. THEME SWITCHER: GA4 ANALYTICS UI KIT VS SHADCN/UI
// ========================================================
function switchTheme(newTheme, showNotification = true) {
  AppState.theme = newTheme;
  localStorage.setItem('paw_theme', newTheme);

  const body = document.body;
  const btnAnalytic = document.getElementById('btn-theme-analytic');
  const btnShadcn = document.getElementById('btn-theme-shadcn');

  if (newTheme === 'shadcn') {
    body.classList.remove('theme-analytic');
    body.classList.add('theme-shadcn');

    if (btnShadcn) {
      btnShadcn.className = "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-zinc-900 text-white shadow-2xs font-semibold text-xs cursor-pointer";
    }
    if (btnAnalytic) {
      btnAnalytic.className = "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-medium cursor-pointer";
    }

    if (showNotification) {
      showToast("Chuyển sang shadcn/ui", "Đang sử dụng các components chuẩn shadcn/ui (Breadcrumb, Dropdown Menu, Alert Cards, Stack Trace).", "info");
    }
  } else {
    body.classList.remove('theme-shadcn');
    body.classList.add('theme-analytic');

    if (btnAnalytic) {
      btnAnalytic.className = "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-white text-blue-600 shadow-2xs font-semibold text-xs cursor-pointer";
    }
    if (btnShadcn) {
      btnShadcn.className = "px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer";
    }

    if (showNotification) {
      showToast("Chuyển sang Analytic Kit", "Đang sử dụng trọn bộ components chuẩn Google Analytics Components Kit.", "info");
    }
  }

  renderTable();
  if (AppState.currentDetailId) {
    const pr = AppState.requests.find(r => r.id === AppState.currentDetailId);
    if (pr) renderDrawerTimeline(pr);
  }
}

function toggleTheme() {
  const target = AppState.theme === 'analytic' ? 'shadcn' : 'analytic';
  switchTheme(target);
}

// ========================================================
// 4. COMPONENT SIDEBAR GA4 INTERACTIONS
// ========================================================
function toggleSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const icon = document.getElementById('sidebarToggleIcon');
  const labels = sidebar.querySelectorAll('.sidebar-label');

  AppState.sidebarCollapsed = !AppState.sidebarCollapsed;

  if (AppState.sidebarCollapsed) {
    sidebar.classList.remove('w-60');
    sidebar.classList.add('w-16', 'sidebar-collapsed');
    if (icon) icon.classList.add('rotate-180');
    labels.forEach(el => el.classList.add('hidden'));
  } else {
    sidebar.classList.remove('w-16', 'sidebar-collapsed');
    sidebar.classList.add('w-60');
    if (icon) icon.classList.remove('rotate-180');
    labels.forEach(el => el.classList.remove('hidden'));
  }
}

function setActiveNav(el, key) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('bg-blue-600', 'text-white', 'shadow-2xs', 'font-semibold');
    item.classList.add('text-slate-600', 'hover:bg-slate-100');
  });

  if (el) {
    el.classList.remove('text-slate-600', 'hover:bg-slate-100');
    el.classList.add('bg-blue-600', 'text-white', 'shadow-2xs', 'font-semibold');
  }
}

function filterByPending() {
  AppState.filters.status = 'PENDING';
  const statusEl = document.getElementById('filter-status');
  if (statusEl) statusEl.value = 'PENDING';
  AppState.pagination.page = 1;
  renderAll();
  showToast("Bộ lọc", "Đang hiển thị danh sách các yêu cầu Cần phê duyệt.", "info");
}

// ========================================================
// 5. ACCORDION WORKFLOW INTERACTION
// ========================================================
function toggleAccordion(contentId) {
  const body = document.getElementById(contentId);
  const chevron = document.getElementById('workflowAccordionChevron');
  if (body) {
    body.classList.toggle('hidden');
    if (chevron) chevron.classList.toggle('rotate-180');
  }
}

// ========================================================
// 6. HEADER UTILITIES & POPOVERS
// ========================================================
function openHeaderPopover(panelId, event) {
  if (event) {
    event.preventDefault();
  }
  const targetPanel = document.getElementById(panelId);
  if (!targetPanel) return;

  const isClosed = targetPanel.classList.contains('hidden');

  document.querySelectorAll('.popover-panel').forEach(p => {
    if (p !== targetPanel) p.classList.add('hidden');
  });

  targetPanel.classList.toggle('hidden', !isClosed);
}

function toggleUserRoleMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const targetPanel = document.getElementById('popoverRoleMenu');
  if (!targetPanel) return;

  const isClosed = targetPanel.classList.contains('hidden');

  document.querySelectorAll('.popover-panel').forEach(p => {
    if (p !== targetPanel) p.classList.add('hidden');
  });

  if (isClosed) {
    targetPanel.classList.remove('hidden');
  } else {
    targetPanel.classList.add('hidden');
  }
}

// ========================================================
// 6.1 APPS LAUNCHER
// ========================================================
function launchApp(action) {
  const pop = document.getElementById('popoverProducts');
  if (pop) pop.classList.add('hidden');

  switch (action) {
    case 'PR':
      AppState.filters.status = 'ALL';
      AppState.filters.search = '';
      const reportSearch = document.getElementById('reportSearchInput');
      const globalSearch = document.getElementById('globalSearchInput');
      if (reportSearch) reportSearch.value = '';
      if (globalSearch) globalSearch.value = '';
      const statusFilterEl = document.getElementById('filter-status');
      if (statusFilterEl) statusFilterEl.value = 'ALL';
      AppState.pagination.page = 1;
      renderAll();
      scrollToTable();
      showToast('Quản lý Mua sắm (PR)', 'Đã mở danh sách toàn bộ yêu cầu mua sắm.', 'info');
      break;

    case 'PO':
      AppState.filters.status = 'ORDERED';
      const statusSelect = document.getElementById('filter-status');
      if (statusSelect) statusSelect.value = 'ORDERED';
      AppState.pagination.page = 1;
      renderAll();
      scrollToTable();
      showToast('Theo dõi Đơn Hàng PO', 'Đang hiển thị danh sách các phiếu đã được phê duyệt chuyển sang PO.', 'success');
      break;

    case 'BUDGET':
      openAccountPickerModal();
      showToast('Hạn mức Ngân sách', 'Mở bảng phân bổ và theo dõi số dư quỹ 6 phòng ban.', 'info');
      break;

    case 'NEW_PR':
      openCreateModal();
      break;

    case 'EXPORT':
      exportAllCSV();
      break;

    case 'PRINT':
      window.print();
      break;

    case 'RESET':
      AppState.requests = JSON.parse(JSON.stringify(INITIAL_PURCHASE_REQUESTS));
      AppState.departments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
      AppState.selectedIds = new Set();
      AppState.pagination.page = 1;
      renderAll();
      showToast('Khôi phục dữ liệu', 'Đã đặt lại 20 kịch bản mua hàng mẫu ban đầu thành công.', 'success');
      break;

    case 'EXT_CONTRACT':
      showToast('Hợp đồng Điện tử (E-Contract)', 'Tính năng ký số hợp đồng điện tử với nhà cung cấp (Gói Enterprise).', 'info');
      break;

    case 'EXT_INVENTORY':
      showToast('Quản lý Kho (Inventory)', 'Tính năng nhập kho và kiểm kê tài sản cấp phát (Gói Enterprise).', 'info');
      break;
  }
}

function toggleMoreProducts() {
  const list = document.getElementById('moreProductsList');
  const arrow = document.getElementById('arrowMoreProducts');
  if (!list) return;
  const isHidden = list.classList.contains('hidden');
  if (isHidden) {
    list.classList.remove('hidden');
    if (arrow) arrow.classList.add('rotate-180');
  } else {
    list.classList.add('hidden');
    if (arrow) arrow.classList.remove('rotate-180');
  }
}

function scrollToTable() {
  const tableEl = document.getElementById('table-card') || document.querySelector('.reports-library-table');
  if (tableEl) {
    tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function exportAllCSV() {
  const rows = [
    ["Mã PR", "Tên Hàng Hóa", "Phòng Ban", "Người Đề Xuất", "Số Tiền (VND)", "Ưu Tiên", "Trạng Thái", "Ngày Tạo"]
  ];
  AppState.requests.forEach(r => {
    rows.push([
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.departmentName}"`,
      `"${r.requester.name}"`,
      r.amount,
      r.priority,
      r.status,
      r.createdAt
    ]);
  });
  const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ProcureFlow_All_PRs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Xuất báo cáo thành công', `Đã tải về toàn bộ danh sách ${AppState.requests.length} phiếu mua sắm.`, 'success');
}

// ========================================================
// 6.2 NOTIFICATION CENTER
// ========================================================
function renderNotifications() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  const notifs = AppState.notifications || [];
  const filter = AppState.notifFilter || 'all';
  const displayed = filter === 'urgent' ? notifs.filter(n => n.urgent) : notifs;

  const unreadCount = notifs.filter(n => n.unread).length;

  const badgeEl = document.getElementById('notif-badge');
  if (badgeEl) {
    if (unreadCount > 0) {
      badgeEl.textContent = unreadCount;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }

  const unreadTextEl = document.getElementById('notif-unread-count-text');
  if (unreadTextEl) {
    unreadTextEl.textContent = `${unreadCount} mới`;
  }

  const totalCountEl = document.getElementById('notif-total-count');
  if (totalCountEl) totalCountEl.textContent = notifs.length;

  const urgentCountEl = document.getElementById('notif-urgent-count');
  if (urgentCountEl) urgentCountEl.textContent = notifs.filter(n => n.urgent).length;

  if (displayed.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-slate-400">
        <i class="fa-solid fa-bell-slash text-2xl mb-2 text-slate-300 block"></i>
        <span class="text-xs">Không có thông báo nào cần xử lý.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = displayed.map(n => `
    <div onclick="openNotificationItem('${n.id}')" class="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${n.unread ? 'bg-blue-50/40' : ''}">
      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
        <i class="fa-solid ${n.icon} text-xs"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-0.5">
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${n.badgeClass}">${n.badge}</span>
          <span class="text-[9px] text-slate-400 shrink-0">${n.time}</span>
        </div>
        <div class="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">${n.title}</div>
        <div class="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">${n.desc}</div>
      </div>
      ${n.unread ? '<span class="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"></span>' : ''}
    </div>
  `).join('');
}

function openNotificationItem(notifId) {
  const notif = AppState.notifications.find(n => n.id === notifId);
  if (!notif) return;

  notif.unread = false;
  renderNotifications();

  const pop = document.getElementById('popoverNotifications');
  if (pop) pop.classList.add('hidden');

  if (notif.targetType === 'PR') {
    openDetailDrawer(notif.targetId);
    showToast('Mở chi tiết phiếu', `Đang xem phiếu ${notif.targetId} từ thông báo.`, 'info');
  } else if (notif.targetType === 'BUDGET') {
    openAccountPickerModal();
    showToast('Cảnh báo ngân sách', 'Kiểm tra tỷ lệ sử dụng quỹ của các phòng ban.', 'info');
  }
}

function markAllNotificationsRead() {
  AppState.notifications.forEach(n => n.unread = false);
  renderNotifications();
  showToast('Đã đọc tất cả', 'Toàn bộ thông báo đã được đánh dấu đã đọc.', 'info');
}

function setNotifFilter(type) {
  AppState.notifFilter = type;
  const btnAll = document.getElementById('btnNotifTabAll');
  const btnUrgent = document.getElementById('btnNotifTabUrgent');
  if (type === 'all') {
    if (btnAll) btnAll.className = 'px-2.5 py-1 rounded-md font-bold bg-white text-slate-800 shadow-2xs cursor-pointer';
    if (btnUrgent) btnUrgent.className = 'px-2.5 py-1 rounded-md font-medium text-slate-500 hover:text-slate-800 hover:bg-white/60 cursor-pointer';
  } else {
    if (btnAll) btnAll.className = 'px-2.5 py-1 rounded-md font-medium text-slate-500 hover:text-slate-800 hover:bg-white/60 cursor-pointer';
    if (btnUrgent) btnUrgent.className = 'px-2.5 py-1 rounded-md font-bold bg-white text-rose-700 shadow-2xs cursor-pointer';
  }
  renderNotifications();
}

function filterPendingPRsFromNotif() {
  const pop = document.getElementById('popoverNotifications');
  if (pop) pop.classList.add('hidden');
  AppState.filters.status = 'PENDING';
  const statusFilterEl = document.getElementById('filter-status');
  if (statusFilterEl) statusFilterEl.value = 'PENDING';
  AppState.pagination.page = 1;
  renderAll();
  scrollToTable();
  showToast('Bộ lọc nhanh', 'Đang hiển thị danh sách các phiếu đang chờ duyệt.', 'info');
}

function clearReadNotifications() {
  AppState.notifications = AppState.notifications.filter(n => n.unread);
  renderNotifications();
  showToast('Đã dọn thông báo', 'Đã xóa các thông báo đã đọc khỏi danh sách.', 'info');
}

// ========================================================
// 7. ROLE SWITCHER & PERMISSION SIMULATION
// ========================================================
function switchRole(roleId) {
  if (!USER_ROLES[roleId]) return;
  AppState.currentRole = roleId;
  updateRoleUI();

  const roleMenu = document.getElementById('popoverRoleMenu');
  if (roleMenu) roleMenu.classList.add('hidden');

  const role = USER_ROLES[roleId];
  showToast(
    `Đã chuyển tài khoản: ${role.userName}`,
    `Vai trò: ${role.name} (${role.description})`,
    "info"
  );

  renderTable();
  if (AppState.currentDetailId) {
    const pr = AppState.requests.find(r => r.id === AppState.currentDetailId);
    if (pr) updateDrawerActionButtons(pr);
  }
}

function updateRoleUI() {
  const role = USER_ROLES[AppState.currentRole];
  if (!role) return;

  const userNameEl = document.getElementById('current-user-name');
  if (userNameEl) userNameEl.textContent = role.userName;

  const userRoleEl = document.getElementById('current-user-role-label');
  if (userRoleEl) userRoleEl.textContent = role.name;

  const initials = role.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarInitialsEl = document.getElementById('current-user-avatar-initials');
  if (avatarInitialsEl) avatarInitialsEl.textContent = initials;

  const popName = document.getElementById('popover-current-user-name');
  if (popName) popName.textContent = role.userName;

  const popEmail = document.getElementById('popover-current-user-email');
  if (popEmail) popEmail.textContent = role.email || `${role.id.toLowerCase()}@procureflow.vn`;

  const popRole = document.getElementById('popover-current-user-role');
  if (popRole) popRole.textContent = role.name;

  const popAvatar = document.getElementById('popover-avatar-preview');
  if (popAvatar) popAvatar.textContent = initials;

  document.querySelectorAll('.role-opt').forEach(opt => {
    const isCurrent = opt.dataset.role === AppState.currentRole;
    const checkIcon = opt.querySelector('.check-icon');
    if (checkIcon) {
      if (isCurrent) {
        checkIcon.classList.remove('hidden');
        opt.classList.add('bg-blue-50/80', 'border-blue-200');
        opt.classList.remove('border-transparent');
      } else {
        checkIcon.classList.add('hidden');
        opt.classList.remove('bg-blue-50/80', 'border-blue-200');
        opt.classList.add('border-transparent');
      }
    }
  });
}

// ========================================================
// 8. POPUP ACCOUNT & DEPARTMENT PICKER
// ========================================================
function openAccountPickerModal() {
  renderPickerDepartments();
  const modal = document.getElementById('account-picker-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeAccountPickerModal() {
  const modal = document.getElementById('account-picker-modal');
  if (modal) modal.classList.add('hidden');
}

function renderPickerDepartments(selectedDeptId = null) {
  const listEl = document.getElementById('picker-dept-list');
  const detailEl = document.getElementById('picker-dept-detail');
  if (!listEl || !detailEl) return;

  const currentDept = selectedDeptId || (AppState.filters.department !== 'ALL' ? AppState.filters.department : 'it');
  const deptData = AppState.departments.find(d => d.id === currentDept) || AppState.departments[0];

  listEl.innerHTML = AppState.departments.map(d => {
    const isSelected = d.id === deptData.id;
    return `
      <div onclick="renderPickerDepartments('${d.id}')" class="p-2.5 rounded-lg border ${isSelected ? 'border-blue-500 bg-blue-50/60 font-bold text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'} cursor-pointer flex items-center justify-between transition-colors">
        <div>
          <div class="text-xs">${d.name}</div>
          <div class="text-[10px] text-slate-400 font-normal">Trưởng bộ phận: ${d.manager}</div>
        </div>
        <span class="text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-500'}">${formatCompactVND(d.totalBudget)}</span>
      </div>
    `;
  }).join('');

  const remaining = deptData.totalBudget - deptData.usedBudget;
  const pct = Math.round((deptData.usedBudget / deptData.totalBudget) * 100);

  detailEl.innerHTML = `
    <div>
      <div class="flex items-center justify-between pb-2 border-b border-slate-200">
        <h4 class="font-bold text-slate-900 text-sm">${deptData.name}</h4>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${pct > 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">${pct}% đã sử dụng</span>
      </div>

      <div class="space-y-3 mt-3 text-xs">
        <div class="flex justify-between">
          <span class="text-slate-500">Tổng ngân sách quý:</span>
          <strong class="text-slate-800">${formatVND(deptData.totalBudget)}</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Đã giải ngân:</span>
          <span class="text-slate-700">${formatVND(deptData.usedBudget)}</span>
        </div>
        <div class="flex justify-between font-bold text-blue-600 text-sm pt-2 border-t border-slate-200">
          <span>Số dư khả dụng:</span>
          <span>${formatVND(remaining)}</span>
        </div>
      </div>
    </div>

    <div class="pt-4">
      <button onclick="selectDepartmentFromPicker('${deptData.id}')" class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs">
        Lọc theo phòng ban này
      </button>
    </div>
  `;
}

function selectDepartmentFromPicker(deptId) {
  AppState.filters.department = deptId;
  const filterDeptEl = document.getElementById('filter-department');
  if (filterDeptEl) filterDeptEl.value = deptId;
  AppState.pagination.page = 1;

  const propTextEl = document.getElementById('currentPropertyText');
  if (propTextEl) {
    if (deptId === 'ALL') {
      propTextEl.textContent = "Tất cả Phòng ban";
    } else {
      const d = AppState.departments.find(dept => dept.id === deptId);
      if (d) propTextEl.textContent = d.name;
    }
  }

  closeAccountPickerModal();
  renderAll();
  showToast("Cập nhật bộ lọc", `Đã lọc hiển thị theo: ${propTextEl ? propTextEl.textContent : deptId}`, "info");
}

function openDeptBudgetModal() {
  openAccountPickerModal();
}

// ========================================================
// 9. DATA RENDERING & KPI CALCULATION
// ========================================================
function renderAll() {
  renderKPIs();
  renderTable();
  renderPagination();
}

function renderKPIs() {
  const total = AppState.requests.length;
  const pendingRequests = AppState.requests.filter(r => r.status === 'PENDING' || r.status === 'NEEDS_INFO');
  const approvedRequests = AppState.requests.filter(r => r.status === 'APPROVED' || r.status === 'ORDERED');

  const pendingVal = pendingRequests.reduce((sum, r) => sum + r.amount, 0);
  const approvedVal = approvedRequests.reduce((sum, r) => sum + r.amount, 0);

  const totalDeptBudget = AppState.departments.reduce((sum, d) => sum + d.totalBudget, 0);
  const totalUsedBudget = AppState.departments.reduce((sum, d) => sum + d.usedBudget, 0);
  const remainingBudget = totalDeptBudget - totalUsedBudget;
  const usedPercent = Math.round((totalUsedBudget / totalDeptBudget) * 100);

  const elTotal = document.getElementById('kpi-total-pr');
  const elPending = document.getElementById('kpi-pending-pr');
  const elPendingVal = document.getElementById('kpi-pending-val');
  const elApproved = document.getElementById('kpi-approved-pr');
  const elApprovedVal = document.getElementById('kpi-approved-val');
  const elRemaining = document.getElementById('kpi-remaining-budget');
  const elPct = document.getElementById('kpi-budget-percent');
  const budgetBar = document.getElementById('kpi-budget-bar');

  if (elTotal) elTotal.textContent = total;
  if (elPending) elPending.textContent = pendingRequests.length;
  if (elPendingVal) elPendingVal.textContent = formatCompactVND(pendingVal);
  if (elApproved) elApproved.textContent = approvedRequests.length;
  if (elApprovedVal) elApprovedVal.textContent = formatCompactVND(approvedVal);
  if (elRemaining) elRemaining.textContent = formatCompactVND(remainingBudget);
  if (elPct) elPct.textContent = `${usedPercent}%`;
  if (budgetBar) budgetBar.style.width = `${Math.min(usedPercent, 100)}%`;

  const sidebarPendingBadge = document.getElementById('sidebar-pending-badge');
  if (sidebarPendingBadge) {
    sidebarPendingBadge.textContent = pendingRequests.length;
  }
}

function getProcessedRequests() {
  let list = [...AppState.requests];

  if (AppState.filters.search.trim()) {
    const q = AppState.filters.search.toLowerCase().trim();
    list = list.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.requester.name.toLowerCase().includes(q) ||
      (r.vendor && r.vendor.toLowerCase().includes(q)) ||
      r.departmentName.toLowerCase().includes(q)
    );
  }

  if (AppState.filters.department !== 'ALL') {
    list = list.filter(r => r.department === AppState.filters.department);
  }

  if (AppState.filters.status !== 'ALL') {
    list = list.filter(r => r.status === AppState.filters.status);
  }

  if (AppState.filters.priority !== 'ALL') {
    list = list.filter(r => r.priority === AppState.filters.priority);
  }

  list.sort((a, b) => {
    let valA = a[AppState.sort.column];
    let valB = b[AppState.sort.column];

    if (AppState.sort.column === 'amount') {
      return AppState.sort.direction === 'asc' ? valA - valB : valB - valA;
    }

    if (typeof valA === 'string') {
      return AppState.sort.direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  return list;
}

// ========================================================
// 10. COMPONENT BẢNG THƯ VIỆN BÁO CÁO
// ========================================================
function renderTable() {
  const tbody = document.getElementById('reportTableBody');
  const emptyState = document.getElementById('empty-state');
  if (!tbody) return;

  const processed = getProcessedRequests();

  if (processed.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    const selectAllEl = document.getElementById('selectAllReports');
    if (selectAllEl) selectAllEl.checked = false;
    updateBulkActionBar();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const startIdx = (AppState.pagination.page - 1) * AppState.pagination.pageSize;
  const paginatedList = processed.slice(startIdx, startIdx + AppState.pagination.pageSize);

  const allCurrentSelected = paginatedList.length > 0 && paginatedList.every(r => AppState.selectedIds.has(r.id));
  const selectAllEl = document.getElementById('selectAllReports');
  if (selectAllEl) selectAllEl.checked = allCurrentSelected;

  const isShadcn = AppState.theme === 'shadcn';

  tbody.innerHTML = paginatedList.map(pr => {
    const isSelected = AppState.selectedIds.has(pr.id);
    const statusCfg = STATUS_CONFIG[pr.status] || STATUS_CONFIG.PENDING;
    const priorityCfg = PRIORITY_CONFIG[pr.priority] || PRIORITY_CONFIG.MEDIUM;
    const badgeClass = isShadcn ? statusCfg.badgeShadcn : statusCfg.badgeAnalytic;
    const priorityBadgeClass = isShadcn ? priorityCfg.badgeShadcn : priorityCfg.badgeAnalytic;

    let typeSvg = `
      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    `;
    if (pr.category.includes('Phần mềm')) {
      typeSvg = `
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      `;
    } else if (pr.category.includes('Marketing')) {
      typeSvg = `
        <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      `;
    }

    return `
      <tr class="hover:bg-slate-50/80 transition-colors cursor-pointer report-row ${isSelected ? 'bg-blue-50/30' : ''}">
        <td class="py-4 px-4 text-center" onclick="event.stopPropagation()">
          <input 
            type="checkbox" 
            class="report-checkbox w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer accent-blue-600"
            ${isSelected ? 'checked' : ''} 
            onchange="toggleSelectItem('${pr.id}')"
          >
        </td>

        <td class="py-4 px-4 text-slate-600" onclick="openDetailDrawer('${pr.id}')">
          <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            ${typeSvg}
          </div>
        </td>

        <td class="py-4 px-4 min-w-[220px]" onclick="openDetailDrawer('${pr.id}')">
          <div class="font-medium text-slate-800 line-clamp-1 hover:text-blue-600 text-xs" title="${pr.title}">
            ${pr.title}
          </div>
          <div class="text-[10px] text-slate-400 mt-1 line-clamp-1">${pr.purpose}</div>
        </td>

        <td class="py-4 px-4 whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <div class="font-bold ${isShadcn ? 'text-zinc-900 font-mono' : 'text-blue-600'} text-xs">${pr.id}</div>
          <div class="text-[10px] text-slate-400 mt-1">${pr.createdAt}</div>
        </td>

        <td class="py-4 px-4 whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <span class="text-xs text-slate-700">${pr.departmentName}</span>
        </td>

        <td class="py-4 px-4 whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <div class="flex items-center gap-2.5">
            <img src="${pr.requester.avatar}" class="w-7 h-7 rounded-full object-cover border border-slate-200" alt="${pr.requester.name}">
            <div>
              <div class="text-xs font-medium text-slate-800">${pr.requester.name}</div>
              <div class="text-[10px] text-slate-400">${pr.requester.role.split(' ')[0]}</div>
            </div>
          </div>
        </td>

        <td class="py-4 px-4 text-right whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <div class="font-bold text-slate-900 text-xs ${isShadcn ? 'font-mono' : ''}">${formatVND(pr.amount)}</div>
        </td>

        <td class="py-4 px-4 text-center whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1.5 ${priorityBadgeClass}">
            <span class="w-1.5 h-1.5 rounded-full ${priorityCfg.dot}"></span>
            ${priorityCfg.label}
          </span>
        </td>

        <td class="py-4 px-4 text-center whitespace-nowrap" onclick="openDetailDrawer('${pr.id}')">
          <span class="badge-status ${badgeClass}">
            <i class="fa-solid ${statusCfg.icon} text-[9px]"></i>
            ${statusCfg.label}
          </span>
        </td>

        <td class="py-4 px-4 w-12 text-center relative" onclick="event.stopPropagation()">
          <button type="button" onclick="toggleRowMenu('${pr.id}')" class="row-action-menu-btn w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          <div id="row-menu-${pr.id}" class="row-action-dropdown hidden absolute right-2 top-10 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-30 p-1.5 text-left text-xs animate-in fade-in">
            <button onclick="openDetailDrawer('${pr.id}'); closeAllRowMenus();" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium">
              <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Xem chi tiết</span>
            </button>
            ${renderRowQuickMenuItems(pr, isShadcn)}
            <div class="border-t border-slate-100 my-1"></div>
            <button onclick="printSinglePR('${pr.id}'); closeAllRowMenus();" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium">
              <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>In phiếu PR</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateBulkActionBar();
}

function renderRowQuickMenuItems(pr, isShadcn = false) {
  if (AppState.currentRole === 'REQUESTER') return '';

  if (pr.status === 'PENDING' || pr.status === 'NEEDS_INFO') {
    return `
      <button onclick="quickApprove('${pr.id}'); closeAllRowMenus();" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold">
        <svg class="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Phê duyệt</span>
      </button>
      <button onclick="openNeedsInfoModal('${pr.id}'); closeAllRowMenus();" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 text-sky-600 hover:text-sky-700 transition-colors font-medium">
        <svg class="w-4 h-4 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Cần bổ sung</span>
      </button>
      <button onclick="openRejectModal('${pr.id}'); closeAllRowMenus();" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-semibold">
        <svg class="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span>Từ chối</span>
      </button>
    `;
  }
  return '';
}

function toggleRowMenu(id) {
  const menu = document.getElementById(`row-menu-${id}`);
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  closeAllRowMenus();
  if (isHidden) {
    menu.classList.remove('hidden');
    AppState.openRowMenuId = id;
  }
}

function closeAllRowMenus() {
  document.querySelectorAll('.row-action-dropdown').forEach(m => m.classList.add('hidden'));
  AppState.openRowMenuId = null;
}

// ========================================================
// 11. PHÂN TRANG CHUẨN GA4
// ========================================================
function renderPagination() {
  const processed = getProcessedRequests();
  const totalItems = processed.length;
  const pageSize = AppState.pagination.pageSize;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const currentPage = AppState.pagination.page;

  if (currentPage > totalPages) {
    AppState.pagination.page = totalPages;
  }

  const start = totalItems === 0 ? 0 : (AppState.pagination.page - 1) * pageSize + 1;
  const end = Math.min(AppState.pagination.page * pageSize, totalItems);

  const infoEl = document.getElementById('paginationInfo');
  if (infoEl) infoEl.innerText = `${start} – ${end}/${totalItems}`;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const btnFirst = document.getElementById('btnFirstPage');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  const btnLast = document.getElementById('btnLastPage');

  [btnFirst, btnPrev].forEach(btn => {
    if (!btn) return;
    btn.disabled = isFirst;
    btn.classList.toggle("text-slate-300", isFirst);
    btn.classList.toggle("cursor-not-allowed", isFirst);
    btn.classList.toggle("text-slate-600", !isFirst);
    btn.classList.toggle("hover:bg-slate-100", !isFirst);
  });

  [btnNext, btnLast].forEach(btn => {
    if (!btn) return;
    btn.disabled = isLast;
    btn.classList.toggle("text-slate-300", isLast);
    btn.classList.toggle("cursor-not-allowed", isLast);
    btn.classList.toggle("text-slate-600", !isLast);
    btn.classList.toggle("hover:bg-slate-100", !isLast);
  });
}

function changePage(page) {
  const totalPages = Math.ceil(getProcessedRequests().length / AppState.pagination.pageSize) || 1;
  if (page >= 1 && page <= totalPages) {
    AppState.pagination.page = page;
    renderTable();
    renderPagination();
  }
}

function prevPage() {
  changePage(AppState.pagination.page - 1);
}

function nextPage() {
  changePage(AppState.pagination.page + 1);
}

function lastPage() {
  const totalPages = Math.ceil(getProcessedRequests().length / AppState.pagination.pageSize) || 1;
  changePage(totalPages);
}

function changePageSize(size) {
  AppState.pagination.pageSize = parseInt(size, 10);
  AppState.pagination.page = 1;
  renderTable();
  renderPagination();
}

// ========================================================
// 12. BỘ LỌC, TÌM KIẾM & SẮP XẾP
// ========================================================
function handleSearch(val) {
  AppState.filters.search = val;
  AppState.pagination.page = 1;

  const reportSearch = document.getElementById('reportSearchInput');
  const globalSearch = document.getElementById('globalSearchInput');
  if (reportSearch && reportSearch.value !== val) reportSearch.value = val;
  if (globalSearch && globalSearch.value !== val) globalSearch.value = val;

  renderTable();
  renderPagination();
}

function handleFilterChange() {
  const deptEl = document.getElementById('filter-department');
  const statusEl = document.getElementById('filter-status');
  if (deptEl) AppState.filters.department = deptEl.value;
  if (statusEl) AppState.filters.status = statusEl.value;
  AppState.pagination.page = 1;

  renderTable();
  renderPagination();
}

function resetFilters() {
  AppState.filters = {
    search: '',
    department: 'ALL',
    status: 'ALL',
    priority: 'ALL'
  };

  const reportSearch = document.getElementById('reportSearchInput');
  const globalSearch = document.getElementById('globalSearchInput');
  const deptEl = document.getElementById('filter-department');
  const statusEl = document.getElementById('filter-status');

  if (reportSearch) reportSearch.value = '';
  if (globalSearch) globalSearch.value = '';
  if (deptEl) deptEl.value = 'ALL';
  if (statusEl) statusEl.value = 'ALL';
  AppState.pagination.page = 1;

  renderAll();
  showToast("Đã đặt lại", "Bộ lọc đã được đưa về trạng thái mặc định.", "info");
}

function handleSort(col) {
  if (AppState.sort.column === col) {
    AppState.sort.direction = AppState.sort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    AppState.sort.column = col;
    AppState.sort.direction = 'desc';
  }

  const arrow = document.getElementById('sort-amount-arrow');
  if (arrow) {
    arrow.textContent = AppState.sort.direction === 'asc' ? '↑' : '↓';
  }

  renderTable();
}

// ========================================================
// 13. CHỌN HÀNG LOẠT (BULK ACTIONS)
// ========================================================
function toggleSelectAll(checked) {
  const processed = getProcessedRequests();
  const startIdx = (AppState.pagination.page - 1) * AppState.pagination.pageSize;
  const currentBatch = processed.slice(startIdx, startIdx + AppState.pagination.pageSize);

  if (checked) {
    currentBatch.forEach(r => AppState.selectedIds.add(r.id));
  } else {
    currentBatch.forEach(r => AppState.selectedIds.delete(r.id));
  }

  renderTable();
}

function toggleSelectItem(id) {
  if (AppState.selectedIds.has(id)) {
    AppState.selectedIds.delete(id);
  } else {
    AppState.selectedIds.add(id);
  }

  renderTable();
}

function updateBulkActionBar() {
  const bar = document.getElementById('bulk-action-bar');
  const countEl = document.getElementById('bulk-selected-count');
  const count = AppState.selectedIds.size;

  if (countEl) countEl.textContent = count;
  if (bar) {
    if (count > 0) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }
}

function clearBulkSelection() {
  AppState.selectedIds.clear();
  renderTable();
}

function handleBulkApprove() {
  if (AppState.currentRole === 'REQUESTER') {
    showToast("Không đủ quyền", "Tài khoản Requester không có quyền phê duyệt phiếu.", "warning");
    return;
  }

  const role = USER_ROLES[AppState.currentRole];
  let count = 0;

  AppState.requests.forEach(r => {
    if (AppState.selectedIds.has(r.id) && (r.status === 'PENDING' || r.status === 'NEEDS_INFO')) {
      r.status = 'APPROVED';
      r.updatedAt = getNowDateTime();
      applyDepartmentBudgetUsage(r);
      r.timeline.push({
        step: `Phê duyệt hàng loạt bởi ${role.badge}`,
        user: `${role.userName} (${role.badge})`,
        time: getNowDateTime(),
        note: `Phê duyệt hàng loạt từ thanh tác vụ GA4`,
        status: 'completed'
      });
      count++;
    }
  });

  clearBulkSelection();
  renderAll();
  showToast("Phê duyệt thành công", `Đã phê duyệt ${count} yêu cầu mua sắm đã chọn.`, "success");
}

function handleBulkReject() {
  if (AppState.currentRole === 'REQUESTER') {
    showToast("Không đủ quyền", "Tài khoản Requester không thể từ chối phiếu.", "warning");
    return;
  }

  const role = USER_ROLES[AppState.currentRole];
  let count = 0;

  AppState.requests.forEach(r => {
    if (AppState.selectedIds.has(r.id) && (r.status === 'PENDING' || r.status === 'NEEDS_INFO')) {
      r.status = 'REJECTED';
      r.updatedAt = getNowDateTime();
      r.timeline.push({
        step: `Từ chối hàng loạt`,
        user: `${role.userName} (${role.badge})`,
        time: getNowDateTime(),
        note: `Bị từ chối trong đợt rà soát định kỳ`,
        status: 'rejected'
      });
      count++;
    }
  });

  clearBulkSelection();
  renderAll();
  showToast("Đã từ chối hàng loạt", `Đã từ chối ${count} yêu cầu mua sắm đã chọn.`, "warning");
}

function handleBulkExport() {
  const selectedRequests = AppState.requests.filter(r => AppState.selectedIds.has(r.id));
  if (selectedRequests.length === 0) return;

  generateCSV(selectedRequests, `YeuCauMuaSam_Selected_${Date.now()}.csv`);
  showToast("Xuất CSV", `Đã xuất ${selectedRequests.length} yêu cầu được chọn ra file CSV.`, "success");
}

// ========================================================
// 14. COMPONENT RIGHT INSIGHTS DRAWER & PHÂN QUYỀN HẠN MỨC
// ========================================================
function canRoleApproveAmount(roleId, amount) {
  if (roleId === 'REQUESTER') return false;
  if (roleId === 'DIRECTOR') return true;
  if (roleId === 'FINANCE') return amount <= 200000000;
  if (roleId === 'MANAGER') return amount < 50000000;
  return false;
}

function applyDepartmentBudgetUsage(pr) {
  const dept = AppState.departments.find(d => d.id === pr.department);
  if (!dept || pr._budgetApplied) return;
  dept.usedBudget = Math.min(dept.totalBudget, dept.usedBudget + pr.amount);
  pr._budgetApplied = true;
}

function openDetailDrawer(id) {
  const pr = AppState.requests.find(r => r.id === id);
  if (!pr) return;

  AppState.currentDetailId = id;
  const isShadcn = AppState.theme === 'shadcn';
  const statusCfg = STATUS_CONFIG[pr.status] || STATUS_CONFIG.PENDING;
  const priorityCfg = PRIORITY_CONFIG[pr.priority] || PRIORITY_CONFIG.MEDIUM;

  const prIdEl = document.getElementById('drawer-pr-id');
  if (prIdEl) prIdEl.textContent = pr.id;

  const badgeEl = document.getElementById('drawer-status-badge');
  if (badgeEl) {
    badgeEl.className = `badge-status ${isShadcn ? statusCfg.badgeShadcn : statusCfg.badgeAnalytic}`;
    badgeEl.innerHTML = `<i class="fa-solid ${statusCfg.icon} text-[9px]"></i> ${statusCfg.label}`;
  }

  document.getElementById('drawer-title').textContent = pr.title;
  document.getElementById('drawer-category').textContent = pr.category;
  document.getElementById('drawer-department').textContent = pr.departmentName;
  document.getElementById('drawer-created-at').textContent = pr.createdAt;
  document.getElementById('drawer-amount').textContent = formatVND(pr.amount);

  document.getElementById('drawer-priority-badge').innerHTML = `
    <span class="px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 ${isShadcn ? priorityCfg.badgeShadcn : priorityCfg.badgeAnalytic}">
      <span class="w-1.5 h-1.5 rounded-full ${priorityCfg.dot}"></span>
      ${priorityCfg.label}
    </span>
  `;

  document.getElementById('drawer-requester-name').textContent = pr.requester.name;
  document.getElementById('drawer-requester-role').textContent = pr.requester.role;
  document.getElementById('drawer-requester-avatar').src = pr.requester.avatar;

  document.getElementById('drawer-vendor').textContent = pr.vendor || "Chưa xác định";
  const vendorLinkRow = document.getElementById('drawer-vendor-link-row');
  const vendorLinkEl = document.getElementById('drawer-vendor-link');
  if (vendorLinkRow && vendorLinkEl) {
    if (pr.vendorLink) {
      vendorLinkRow.classList.remove('hidden');
      vendorLinkEl.href = pr.vendorLink;
    } else {
      vendorLinkRow.classList.add('hidden');
    }
  }

  document.getElementById('drawer-purpose').textContent = pr.purpose || "Không có giải trình chi tiết.";

  const itemsList = document.getElementById('drawer-items-list');
  if (itemsList) {
    if (pr.items && pr.items.length > 0) {
      itemsList.innerHTML = pr.items.map(item => `
        <tr class="hover:bg-slate-50">
          <td class="py-1.5 px-2.5 font-medium text-slate-800">${item.name}</td>
          <td class="py-1.5 px-2 text-center text-slate-600">${item.qty}</td>
          <td class="py-1.5 px-2 text-right text-slate-600">${formatVND(item.unitPrice)}</td>
          <td class="py-1.5 px-2.5 text-right font-bold text-slate-900">${formatVND(item.qty * item.unitPrice)}</td>
        </tr>
      `).join('');
    } else {
      itemsList.innerHTML = `<tr><td colspan="4" class="p-2 text-center text-slate-400">Không có danh mục lẻ.</td></tr>`;
    }
  }

  renderDrawerTimeline(pr);
  updateDrawerActionButtons(pr);

  const drawer = document.getElementById('drawerAnnotations');
  if (drawer) drawer.classList.remove('translate-x-full');
}

function closeDetailDrawer() {
  const drawer = document.getElementById('drawerAnnotations');
  if (drawer) drawer.classList.add('translate-x-full');
  AppState.currentDetailId = null;
}

function switchDrawerTab(tab) {
  const tabDetail = document.getElementById('drawer-tab-detail');
  const tabTimeline = document.getElementById('drawer-tab-timeline');
  const viewDetail = document.getElementById('drawer-view-detail');
  const viewTimeline = document.getElementById('drawer-view-timeline');

  if (tab === 'detail') {
    tabDetail.className = "py-2.5 px-3 border-b-2 border-blue-600 text-blue-600 transition-colors font-bold";
    tabTimeline.className = "py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors";
    viewDetail.classList.remove('hidden');
    viewTimeline.classList.add('hidden');
  } else {
    tabTimeline.className = "py-2.5 px-3 border-b-2 border-blue-600 text-blue-600 transition-colors font-bold";
    tabDetail.className = "py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors";
    viewTimeline.classList.remove('hidden');
    viewDetail.classList.add('hidden');
  }
}

function renderDrawerTimeline(pr) {
  const container = document.getElementById('drawer-timeline-container');
  if (!container) return;

  if (!pr.timeline || pr.timeline.length === 0) {
    container.innerHTML = '<div class="text-xs text-slate-400">Chưa có nhật ký hoạt động.</div>';
    return;
  }

  if (AppState.theme === 'shadcn') {
    container.className = "space-y-3";
    container.innerHTML = `
      <div class="shadcn-trace space-y-3">
        ${pr.timeline.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isErr = step.status === 'rejected';
          const isCurr = step.status === 'current';
          const badgeBg = isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isErr ? 'bg-red-50 text-red-700 border-red-200' : isCurr ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200';
          const statusDot = isDone ? 'bg-emerald-500' : isErr ? 'bg-red-500' : isCurr ? 'bg-amber-500 animate-pulse' : 'bg-zinc-300';

          return `
            <div class="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs space-y-2">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}">
                    PHASE ${idx + 1}
                  </span>
                  <span class="font-semibold text-zinc-900">${step.step}</span>
                </div>
                <span class="font-mono text-[10px] text-zinc-400">${step.time}</span>
              </div>
              <div class="text-xs text-zinc-600 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
                <span class="font-medium">${step.user}</span>
              </div>
              ${step.note ? `
                <div class="shadcn-trace-content mt-2 text-[11px] font-mono text-zinc-700 bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg">
                  <div class="text-[10px] text-zinc-400 font-sans uppercase font-bold mb-0.5 tracking-wider">Audit Log Trace:</div>
                  ${step.note}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  container.className = "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200";
  container.innerHTML = pr.timeline.map(step => {
    let icon = "fa-check";
    let iconBg = "bg-emerald-600 text-white";

    if (step.status === 'rejected') {
      icon = "fa-xmark";
      iconBg = "bg-rose-600 text-white";
    } else if (step.status === 'current') {
      icon = "fa-hourglass-half";
      iconBg = "bg-amber-500 text-white animate-pulse";
    } else if (step.status === 'pending') {
      icon = "fa-circle";
      iconBg = "bg-slate-200 text-slate-400";
    }

    return `
      <div class="relative pl-6">
        <span class="absolute -left-3.5 top-0 w-7 h-7 rounded-full ${iconBg} flex items-center justify-center text-[10px] shadow-xs">
          <i class="fa-solid ${icon}"></i>
        </span>
        <div class="space-y-0.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-slate-800">${step.step}</span>
            <span class="text-[10px] text-slate-400 font-mono">${step.time}</span>
          </div>
          <div class="text-[11px] text-slate-500 font-medium">${step.user}</div>
          ${step.note ? `<p class="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">${step.note}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function updateDrawerActionButtons(pr) {
  const actionsContainer = document.getElementById('drawer-actions');
  if (!actionsContainer) return;
  const isRequester = AppState.currentRole === 'REQUESTER';

  if (isRequester || pr.status === 'APPROVED' || pr.status === 'REJECTED' || pr.status === 'ORDERED') {
    actionsContainer.innerHTML = `
      <div class="w-full flex items-center justify-between">
        <span class="text-xs text-slate-400 italic">
          ${isRequester ? 'Chế độ xem của Requester' : 'Phiếu đã hoàn tất quy trình'}
        </span>
        <button onclick="printCurrentPR()" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
          <i class="fa-solid fa-print mr-1"></i> In phiếu
        </button>
      </div>
    `;
  } else {
    actionsContainer.innerHTML = `
      <button onclick="openNeedsInfoModal()" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors">
        <i class="fa-solid fa-question text-sky-500 mr-1"></i> Bổ sung
      </button>

      <div class="flex items-center gap-2">
        <button onclick="openRejectModal()" class="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors">
          <i class="fa-solid fa-xmark mr-1"></i> Từ chối
        </button>
        <button onclick="approveCurrentDrawerPR()" class="ga-btn-primary px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors">
          <i class="fa-solid fa-check mr-1"></i> Phê duyệt
        </button>
      </div>
    `;
  }
}

function approveCurrentDrawerPR() {
  if (!AppState.currentDetailId) return;
  quickApprove(AppState.currentDetailId);
  openDetailDrawer(AppState.currentDetailId);
}

function quickApprove(id) {
  if (AppState.currentRole === 'REQUESTER') {
    showToast("Không đủ quyền", "Requester không thể phê duyệt phiếu mua hàng.", "warning");
    return;
  }

  const pr = AppState.requests.find(r => r.id === id);
  if (!pr) return;

  const role = USER_ROLES[AppState.currentRole];
  const withinLimit = canRoleApproveAmount(AppState.currentRole, pr.amount);

  pr.status = 'APPROVED';
  pr.updatedAt = getNowDateTime();
  applyDepartmentBudgetUsage(pr);
  pr.timeline.push({
    step: `Phê duyệt bởi ${role.badge}`,
    user: `${role.userName} (${role.name})`,
    time: getNowDateTime(),
    note: withinLimit
      ? `Đã phê duyệt trong hạn mức phân quyền (${formatVND(pr.amount)})`
      : `Đã phê duyệt (ghi nhận vượt hạn mức chuẩn của ${role.badge} để demo luồng)`,
    status: 'completed'
  });

  renderAll();
  showToast(
    "Đã phê duyệt",
    withinLimit
      ? `Phiếu ${pr.id} đã được phê duyệt thành công.`
      : `Phiếu ${pr.id} (${formatVND(pr.amount)}) đã duyệt (lưu ý: vượt hạn mức chuẩn của ${role.badge}).`,
    withinLimit ? "success" : "warning"
  );
}

function openRejectModal(id = null) {
  const targetId = id || AppState.currentDetailId;
  if (!targetId) return;

  if (AppState.currentRole === 'REQUESTER') {
    showToast("Không đủ quyền", "Requester không có quyền từ chối phiếu.", "warning");
    return;
  }

  AppState.activePrompt = { type: 'REJECT', targetId };
  document.getElementById('prompt-modal-title').textContent = `Từ chối phiếu ${targetId}`;
  document.getElementById('prompt-modal-desc').textContent = "Vui lòng nhập lý do từ chối cụ thể để thông báo cho nhân viên đề xuất:";
  document.getElementById('prompt-modal-input').value = "";
  document.getElementById('prompt-modal-confirm-btn').textContent = "Xác nhận từ chối";
  document.getElementById('prompt-modal-confirm-btn').className = "px-4 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm";

  document.getElementById('action-prompt-modal').classList.remove('hidden');
}

function openNeedsInfoModal(id = null) {
  const targetId = id || AppState.currentDetailId;
  if (!targetId) return;

  if (AppState.currentRole === 'REQUESTER') {
    showToast("Không đủ quyền", "Requester không thể yêu cầu bổ sung thông tin.", "warning");
    return;
  }

  AppState.activePrompt = { type: 'NEEDS_INFO', targetId };
  document.getElementById('prompt-modal-title').textContent = `Yêu cầu bổ sung thông tin cho ${targetId}`;
  document.getElementById('prompt-modal-desc').textContent = "Nhập nội dung cần nhân viên đề xuất làm rõ hoặc bổ sung tài liệu:";
  document.getElementById('prompt-modal-input').value = "";
  document.getElementById('prompt-modal-confirm-btn').textContent = "Gửi yêu cầu";
  document.getElementById('prompt-modal-confirm-btn').className = "px-4 py-1.5 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm";

  document.getElementById('action-prompt-modal').classList.remove('hidden');
}

function closePromptModal() {
  const modal = document.getElementById('action-prompt-modal');
  if (modal) modal.classList.add('hidden');
  AppState.activePrompt = { type: null, targetId: null };
}

function confirmPromptAction() {
  const note = document.getElementById('prompt-modal-input').value.trim();
  if (!note) {
    alert("Vui lòng nhập nội dung lý do hoặc yêu cầu bổ sung!");
    return;
  }

  const { type, targetId } = AppState.activePrompt;
  const pr = AppState.requests.find(r => r.id === targetId);
  if (!pr) return;

  const role = USER_ROLES[AppState.currentRole];

  if (type === 'REJECT') {
    pr.status = 'REJECTED';
    pr.updatedAt = getNowDateTime();
    pr.timeline.push({
      step: `Từ chối bởi ${role.badge}`,
      user: `${role.userName} (${role.badge})`,
      time: getNowDateTime(),
      note: `Lý do từ chối: ${note}`,
      status: 'rejected'
    });
    showToast("Đã từ chối phiếu", `Phiếu ${pr.id} đã bị từ chối với lý do ghi nhận.`, "warning");
  } else if (type === 'NEEDS_INFO') {
    pr.status = 'NEEDS_INFO';
    pr.updatedAt = getNowDateTime();
    pr.timeline.push({
      step: `Yêu cầu bổ sung tài liệu`,
      user: `${role.userName} (${role.badge})`,
      time: getNowDateTime(),
      note: `Yêu cầu: ${note}`,
      status: 'current'
    });
    showToast("Đã gửi yêu cầu", `Đã gửi yêu cầu bổ sung thông tin tới ${pr.requester.name}.`, "info");
  }

  closePromptModal();
  renderAll();

  if (AppState.currentDetailId === targetId) {
    openDetailDrawer(targetId);
  }
}

// ========================================================
// 15. TẠO MỚI PHIẾU MUA SẮM
// ========================================================
function openCreateModal() {
  const form = document.getElementById('create-pr-form');
  if (form) form.reset();
  const totalDisplay = document.getElementById('new-pr-total-display');
  if (totalDisplay) totalDisplay.textContent = "0 đ";
  updateBudgetCheckPreview();
  const modal = document.getElementById('create-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCreateModal() {
  const modal = document.getElementById('create-modal');
  if (modal) modal.classList.add('hidden');
}

function calculateTotalAmount() {
  const qty = parseInt(document.getElementById('new-pr-qty').value, 10) || 0;
  const unitPrice = parseFloat(document.getElementById('new-pr-unit-price').value) || 0;
  const total = qty * unitPrice;

  const totalDisplay = document.getElementById('new-pr-total-display');
  if (totalDisplay) totalDisplay.textContent = formatVND(total);
  updateBudgetCheckPreview(total);
}

function updateBudgetCheckPreview(currentAmount = null) {
  const deptSelect = document.getElementById('new-pr-department');
  if (!deptSelect) return;
  const dept = AppState.departments.find(d => d.id === deptSelect.value);
  if (!dept) return;

  const remaining = dept.totalBudget - dept.usedBudget;
  const remEl = document.getElementById('budget-preview-remaining');
  if (remEl) remEl.textContent = formatVND(remaining);

  if (currentAmount === null) {
    const qty = parseInt(document.getElementById('new-pr-qty')?.value, 10) || 0;
    const unitPrice = parseFloat(document.getElementById('new-pr-unit-price')?.value) || 0;
    currentAmount = qty * unitPrice;
  }

  const warningEl = document.getElementById('budget-warning-message');
  const statusEl = document.getElementById('budget-preview-status');
  const barEl = document.getElementById('budget-preview-bar');

  const afterPct = Math.round(((dept.usedBudget + currentAmount) / dept.totalBudget) * 100);
  if (barEl) barEl.style.width = `${Math.min(afterPct, 100)}%`;

  if (currentAmount > remaining) {
    if (statusEl) {
      statusEl.textContent = "Vượt hạn mức ngân sách!";
      statusEl.className = "font-bold text-rose-600 text-[11px]";
    }
    if (warningEl) warningEl.classList.remove('hidden');
    if (barEl) barEl.className = "bg-rose-600 h-1.5 rounded-full";
  } else {
    if (statusEl) {
      statusEl.textContent = `Trong định mức (${afterPct}% sử dụng)`;
      statusEl.className = "font-semibold text-emerald-600 text-[11px]";
    }
    if (warningEl) warningEl.classList.add('hidden');
    if (barEl) barEl.className = "bg-blue-600 h-1.5 rounded-full";
  }
}

function handleCreatePR(event) {
  event.preventDefault();

  const title = document.getElementById('new-pr-title').value.trim();
  const department = document.getElementById('new-pr-department').value;
  const category = document.getElementById('new-pr-category').value;
  const priority = document.getElementById('new-pr-priority').value;
  const vendor = document.getElementById('new-pr-vendor').value.trim();
  const vendorLink = document.getElementById('new-pr-link').value.trim();
  const qty = parseInt(document.getElementById('new-pr-qty').value, 10) || 1;
  const unitPrice = parseFloat(document.getElementById('new-pr-unit-price').value) || 0;
  const purpose = document.getElementById('new-pr-purpose').value.trim();
  const total = qty * unitPrice;

  const deptObj = AppState.departments.find(d => d.id === department);
  const nextNum = 1000 + AppState.requests.length + 1;
  const newId = `PR-2026-${nextNum}`;

  const role = USER_ROLES[AppState.currentRole];

  const newPR = {
    id: newId,
    title,
    category,
    department,
    departmentName: deptObj ? deptObj.name : department,
    requester: {
      name: role.userName,
      role: role.name,
      email: `${role.userName.toLowerCase().replace(/\s+/g, '.')}@company.vn`,
      avatar: role.avatar
    },
    createdAt: getNowDateTime(),
    updatedAt: getNowDateTime(),
    amount: total,
    priority,
    vendor: vendor || "Nhà cung cấp mở",
    vendorLink: vendorLink || null,
    status: 'PENDING',
    purpose,
    items: [{ name: title, qty, unitPrice }],
    timeline: [
      { step: "Tạo phiếu đề xuất", user: `${role.userName} (${role.badge})`, time: getNowDateTime(), note: "Đã khởi tạo phiếu và gửi cấp duyệt", status: "completed" },
      { step: "Thẩm định ngân sách & nhu cầu", user: "Manager & Finance", time: "-", note: "Đang phân bổ người xử lý", status: "current" }
    ]
  };

  AppState.requests.unshift(newPR);
  closeCreateModal();
  renderAll();

  showToast("Tạo phiếu thành công", `Phiếu ${newId} đã được tạo và gửi vào luồng phê duyệt!`, "success");
}

function handleSaveDraft() {
  const title = document.getElementById('new-pr-title').value.trim() || "Yêu cầu mua sắm bản nháp";
  const department = document.getElementById('new-pr-department').value;
  const category = document.getElementById('new-pr-category').value;
  const priority = document.getElementById('new-pr-priority').value;
  const qty = parseInt(document.getElementById('new-pr-qty').value, 10) || 1;
  const unitPrice = parseFloat(document.getElementById('new-pr-unit-price').value) || 0;
  const total = qty * unitPrice;
  const deptObj = AppState.departments.find(d => d.id === department);
  const nextNum = 1000 + AppState.requests.length + 1;
  const newId = `PR-2026-${nextNum}`;
  const role = USER_ROLES[AppState.currentRole];

  const draftPR = {
    id: newId,
    title,
    category,
    department,
    departmentName: deptObj ? deptObj.name : department,
    requester: {
      name: role.userName,
      role: role.name,
      email: `${role.userName.toLowerCase().replace(/\s+/g, '.')}@company.vn`,
      avatar: role.avatar
    },
    createdAt: getNowDateTime(),
    updatedAt: getNowDateTime(),
    amount: total,
    priority,
    vendor: document.getElementById('new-pr-vendor').value.trim() || "Chưa có",
    status: 'DRAFT',
    purpose: document.getElementById('new-pr-purpose').value.trim() || "Bản nháp lưu tạm thời",
    items: [{ name: title, qty, unitPrice }],
    timeline: [
      { step: "Lưu bản nháp", user: role.userName, time: getNowDateTime(), note: "Bản nháp chưa gửi duyệt", status: "current" }
    ]
  };

  AppState.requests.unshift(draftPR);
  closeCreateModal();
  renderAll();
  showToast("Đã lưu bản nháp", `Phiếu ${newId} đã được lưu thành công. Bạn có thể chỉnh sửa sau.`, "info");
}

// ========================================================
// 16. XUẤT CSV & IN ẤN
// ========================================================
function exportToCSV() {
  const processed = getProcessedRequests();
  generateCSV(processed, `DanhSach_YeuCauMuaSam_GA4_${Date.now()}.csv`);
  showToast("Xuất CSV", `Đã xuất ${processed.length} phiếu mua hàng ra file CSV.`, "success");
}

function generateCSV(list, filename) {
  const headers = ["Mã PR", "Tên Hàng Hóa / Dịch Vụ", "Phòng Ban", "Danh Mục", "Người Đề Xuất", "Giá Trị (VNĐ)", "Ưu Tiên", "Trạng Thái", "Ngày Tạo"];

  const rows = list.map(r => [
    `"${r.id}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.departmentName}"`,
    `"${r.category}"`,
    `"${r.requester.name}"`,
    r.amount,
    `"${PRIORITY_CONFIG[r.priority]?.label || r.priority}"`,
    `"${STATUS_CONFIG[r.status]?.label || r.status}"`,
    `"${r.createdAt}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printCurrentPR() {
  if (!AppState.currentDetailId) return;
  printSinglePR(AppState.currentDetailId);
}

function printSinglePR(id) {
  const pr = AppState.requests.find(r => r.id === id);
  if (!pr) return;

  const printArea = document.getElementById('print-area');
  if (!printArea) return;

  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #111;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <div>
          <h1 style="font-size: 22px; margin: 0; text-transform: uppercase;">Phiếu Yêu Cầu Mua Sắm (PR)</h1>
          <p style="margin: 5px 0; color: #555;">Hệ thống ProcureFlow Enterprise - GA4 UI Kit</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 18px; margin: 0; color: #1a73e8;">${pr.id}</h2>
          <p style="margin: 5px 0; font-size: 12px; color: #777;">Ngày tạo: ${pr.createdAt}</p>
        </div>
      </div>

      <div style="margin: 25px 0; line-height: 1.8; font-size: 14px;">
        <p><strong>Tiêu đề:</strong> ${pr.title}</p>
        <p><strong>Phòng ban:</strong> ${pr.departmentName} &nbsp;|&nbsp; <strong>Danh mục:</strong> ${pr.category}</p>
        <p><strong>Người đề xuất:</strong> ${pr.requester.name} (${pr.requester.role}) - ${pr.requester.email}</p>
        <p><strong>Nhà cung cấp dự kiến:</strong> ${pr.vendor || "N/A"}</p>
        <p><strong>Mức độ ưu tiên:</strong> ${PRIORITY_CONFIG[pr.priority]?.label || pr.priority}</p>
        <p><strong>Trạng thái:</strong> ${STATUS_CONFIG[pr.status]?.label || pr.status}</p>
        <p><strong>Mục đích mua sắm:</strong> ${pr.purpose}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
            <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Hạng mục</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #cbd5e1; width: 60px;">SL</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; width: 140px;">Đơn giá</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; width: 160px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${(pr.items || []).map(i => `
            <tr>
              <td style="padding: 10px; border: 1px solid #cbd5e1;">${i.name}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">${i.qty}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">${formatVND(i.unitPrice)}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1; font-weight: bold;">${formatVND(i.qty * i.unitPrice)}</td>
            </tr>
          `).join('')}
          <tr style="background: #f8fafc; font-weight: bold;">
            <td colspan="3" style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">TỔNG CỘNG:</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #cbd5e1; color: #b91c1c; font-size: 15px;">${formatVND(pr.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 50px; display: flex; justify-content: space-between; text-align: center; font-size: 13px;">
        <div>
          <p><strong>Người Đề Xuất</strong></p>
          <div style="height: 60px;"></div>
          <p>${pr.requester.name}</p>
        </div>
        <div>
          <p><strong>Trưởng Bộ Phận</strong></p>
          <div style="height: 60px;"></div>
          <p>Xác nhận nhu cầu</p>
        </div>
        <div>
          <p><strong>Kiểm Soát Ngân Sách</strong></p>
          <div style="height: 60px;"></div>
          <p>Đặng Hồng Hạnh</p>
        </div>
        <div>
          <p><strong>Ban Giám Đốc Phê Duyệt</strong></p>
          <div style="height: 60px;"></div>
          <p>Trịnh Quang Vinh</p>
        </div>
      </div>
    </div>
  `;

  window.print();
}

// ========================================================
// 17. SPEC & REQUIREMENTS MODAL
// ========================================================
function openSpecModal() {
  const modal = document.getElementById('spec-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeSpecModal() {
  const modal = document.getElementById('spec-modal');
  if (modal) modal.classList.add('hidden');
}

function switchSpecTab(tab) {
  const tabs = ['func', 'scenarios', 'roles'];
  tabs.forEach(t => {
    const btn = document.getElementById(`spec-tab-${t}`);
    const content = document.getElementById(`spec-content-${t}`);
    if (!btn || !content) return;
    if (t === tab) {
      btn.className = "py-3 px-4 border-b-2 border-blue-600 text-blue-600 transition-colors flex items-center gap-1.5 font-bold";
      content.classList.remove('hidden');
    } else {
      btn.className = "py-3 px-4 border-b-2 border-transparent hover:text-slate-900 transition-colors flex items-center gap-1.5 text-slate-500 font-medium";
      content.classList.add('hidden');
    }
  });
}

function renderSpecScenarios() {
  const tbody = document.getElementById('spec-scenarios-table-body');
  if (!tbody) return;

  tbody.innerHTML = INITIAL_PURCHASE_REQUESTS.map(r => {
    const statusCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
    return `
      <tr class="hover:bg-slate-50">
        <td class="py-2 px-3 font-bold text-blue-600">${r.id}</td>
        <td class="py-2 px-3 font-medium text-slate-800">${r.title}</td>
        <td class="py-2 px-3 text-slate-600">${r.departmentName}</td>
        <td class="py-2 px-3 text-right font-bold text-slate-900">${formatVND(r.amount)}</td>
        <td class="py-2 px-3 text-center">
          <span class="badge-status ${statusCfg.badgeAnalytic} text-[10px]">
            ${statusCfg.label}
          </span>
        </td>
        <td class="py-2 px-3 text-slate-500 text-[11px]">${r.purpose}</td>
      </tr>
    `;
  }).join('');
}

// ========================================================
// 18. TOAST NOTIFICATIONS & HELPER FUNCTIONS
// ========================================================
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');

  let icon = "fa-circle-info text-blue-500";
  let border = "border-slate-200";

  if (type === 'success') {
    icon = "fa-circle-check text-emerald-500";
    border = "border-emerald-200";
  } else if (type === 'warning') {
    icon = "fa-triangle-exclamation text-amber-500";
    border = "border-amber-200";
  } else if (type === 'error') {
    icon = "fa-circle-exclamation text-rose-500";
    border = "border-rose-200";
  }

  toast.className = `toast-item pointer-events-auto bg-white rounded-xl shadow-xl border ${border} p-3.5 flex items-start gap-3 transition-all select-none`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base mt-0.5"></i>
    <div class="flex-1">
      <div class="text-xs font-bold text-slate-800">${title}</div>
      <div class="text-[11px] text-slate-500 mt-0.5 leading-snug">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 text-xs">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

function getNowDateTime() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}`;
}

