document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById("appShell");
  if (!shell) return;

  // 1. Configuration: Updated with Stats, Academics, and Feedback Cell
  const navLinks = [
    { href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard' },
    { href: 'profile.html', icon: 'fa-folder-open', label: 'Profile' },
    { href: 'attendance.html', icon: 'fa-check-circle', label: 'Attendance', badge: 'New' },
    { href: 'academics.html', icon: 'fa-book-open', label: 'Academics' },
    { href: 'stats.html', icon: 'fa-chart-line', label: 'Stats' },
    { href: 'timetable.html', icon: 'fa-calendar-days', label: 'Timetable' },
    { href: 'exam.html', icon: 'fa-file-signature', label: 'Exams Schedule' },
    { href: 'finance.html', icon: 'fa-receipt', label: 'Fees & Payments' },
    { href: 'hallticket.html', icon: 'fa-ticket-simple', label: 'Hall Ticket' },
    { href: 'documents.html', icon: 'fa-folder-open', label: 'Documents' },
    { href: 'communication.html', icon: 'fa-comments', label: 'Feedback Cell' },
  ];

  // 2. The Shell HTML Template
  shell.innerHTML = `
    <div id="mobileOverlay" onclick="toggleSidebar(false)" 
         class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 hidden transition-opacity duration-300 lg:hidden" aria-hidden="true"></div>

    <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a]">

      <aside id="sidebar" 
             class="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none lg:static lg:h-full lg:shrink-0">
        
        <div class="flex items-center gap-3 h-16 px-6 border-b border-slate-100 dark:border-slate-800">
          <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/30">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div>
            <p class="font-bold tracking-tight text-slate-900 dark:text-white leading-none">EduPortal</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Parent Panel</p>
          </div>
          <button onclick="toggleSidebar(false)" class="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          ${navLinks.map(link => `
            <a href="${link.href}" data-nav-link
               class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium transition-all group">
              <i class="fas ${link.icon} text-lg w-6 text-center group-hover:scale-110 transition-transform"></i>
              <span>${link.label}</span>
              ${link.badge ? `<span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">${link.badge}</span>` : ''}
            </a>
          `).join('')}
          <br>
          <div class="mt-8 px-3">
             <p class="px-2 mb-3 text-[10px] tracking-widest font-extrabold text-slate-400 uppercase">Quick Actions</p>
             <div class="grid grid-cols-2 gap-2">
                <a href="apply-leave.html" 
                   class="col-span-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center hover:shadow-md transition-all group">
                   <i class="fas fa-bed text-blue-600 dark:text-blue-400 text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                   <p class="text-[10px] font-bold text-blue-800 dark:text-blue-300">Apply Leave</p>
                </a>
             </div>
          </div>
        </nav>

        <div class="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onclick="openLogoutModal()" class="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <i class="fas fa-right-from-bracket text-lg w-6 text-center"></i>
            <span class="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <header class="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div class="flex items-center gap-4">
            <button onclick="toggleSidebar(true)" class="lg:hidden p-2 -ml-2 text-slate-500 hover:text-brand-600">
              <i class="fas fa-bars text-xl"></i>
            </button>
            <h2 class="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate" id="pageTitle">
              </h2>
          </div>

          <div class="flex items-center gap-2 sm:gap-4 relative">
          <div class="flex items-center gap-2 sm:gap-4 relative">
             <button onclick="toggleDarkMode()" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <i class="fas fa-moon dark:hidden"></i>
                <i class="fas fa-sun hidden dark:block text-amber-400"></i>
             </button>
             <div id="notification-access"></div>

             <!-- Profile / Avatar -->
             <div class="relative">
                <div class="flex items-center gap-3 pl-2 sm:border-l border-slate-200 dark:border-slate-700">
                   <div class="text-right hidden sm:block">
                      <p class="text-xs font-bold text-slate-900 dark:text-white" data-user-info="studentName">Rishu Kumar</p>
                      <p class="text-[10px] text-slate-500" data-user-info="studentClass">Class 12th</p>
                   </div>
                   <img id="profileBtn" src="https://ui-avatars.com/api/?name=Rishu+Kumar&background=0D8ABC&color=fff" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer" alt="User" onclick="toggleProfileCard(event)">
                </div>

                <div id="profileCard" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-800 z-50">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700">R</div>
                    <div>
                      <div id="pcName" class="text-sm font-bold">Rishu Kumar</div>
                      <div id="pcClass" class="text-[12px] text-slate-500">Class 12th</div>
                    </div>
                  </div>
                  <div class="mt-3 text-xs text-slate-600 dark:text-slate-300">
                    Year: <strong id="pcYear">2026</strong>
                  </div>
                </div>
             </div>
          </div>
        </header>

        <main id="mainScroll" class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth relative">
           <div id="pageContent" class="max-w-7xl mx-auto pb-20"></div>
        </main>
        
        <a id="chatFab" href="chat.html" class="absolute bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-xl shadow-brand-600/30 transition-transform hover:scale-105 active:scale-95">
           <i class="fas fa-comment-dots text-2xl"></i>
        </a>
      </div>
    </div>
  `;

  // 3. Migrate Content: Move the specific page content into the new shell
  // RACE CONDITION FIX: Ensure we wait for content to be parsed
  const migrateContent = () => {
    const existingMain = document.querySelector("main:not(#mainScroll)");
    if (existingMain) {
      document.getElementById("pageContent").innerHTML = existingMain.innerHTML;
      existingMain.remove(); // Clean up old tag
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', migrateContent);
  } else {
    migrateContent();
  }

  // 4. Initialize Active State & Page Title
  setActiveState();

  // 5. Hide FAB on Chat Page
  if (window.location.pathname.includes('chat.html')) {
    const fab = document.getElementById('chatFab');
    if (fab) fab.style.display = 'none';
  }

  // 6. Clean up body classes to prevent double scrollbars
  // Remove padding and height classes that conflict with app shell layout
  document.body.classList.remove('min-h-screen', 'h-full', 'pb-12', 'pb-20', 'pb-2');

});

// --- Helper Functions ---

function setActiveState() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || "dashboard.html";

  // Clean filename (remove hash or query params)
  const cleanPage = page.split('?')[0].split('#')[0];

  // Update Sidebar Links
  const links = document.querySelectorAll('[data-nav-link]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (cleanPage === href || (cleanPage === '' && href === 'dashboard.html')) {
      // Active Style
      link.className = "flex items-center gap-3 px-3 py-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-bold border border-brand-100 dark:border-brand-900/30 transition-all shadow-sm";

      // Update Header Title based on active link
      const titleEl = document.getElementById('pageTitle');
      if (titleEl) titleEl.textContent = link.querySelector('span').textContent;
    } else {
      // Inactive Style
      link.className = "flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium transition-all";
    }
  });
}

// Global Toggle Function
window.toggleSidebar = function (show) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');

  if (show) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }
};

// Notifications & Profile Card Handlers
window.toggleProfileCard = function (e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const card = document.getElementById('profileCard');
  if (!card) return;

  // Populate from header info if available
  const nameEl = document.querySelector('[data-user-info="studentName"]');
  const classEl = document.querySelector('[data-user-info="studentClass"]');
  const pcName = document.getElementById('pcName');
  const pcClass = document.getElementById('pcClass');
  if (pcName && nameEl) pcName.textContent = nameEl.textContent.trim();
  if (pcClass && classEl) pcClass.textContent = classEl.textContent.trim();

  card.classList.toggle('hidden');
  const notif = document.getElementById('notifPopup');
  if (notif && !notif.classList.contains('hidden')) notif.classList.add('hidden');
};

// Close popups when clicking outside or pressing Escape
document.addEventListener('click', function (e) {
  const notif = document.getElementById('notifPopup');
  const profile = document.getElementById('profileCard');

  if (notif && !notif.classList.contains('hidden')) {
    if (!e.target.closest('#notifPopup') && !e.target.closest('#notifBtn')) notif.classList.add('hidden');
  }
  if (profile && !profile.classList.contains('hidden')) {
    if (!e.target.closest('#profileCard') && !e.target.closest('#profileBtn')) profile.classList.add('hidden');
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const notif = document.getElementById('notifPopup');
    const profile = document.getElementById('profileCard');
    if (notif && !notif.classList.contains('hidden')) notif.classList.add('hidden');
    if (profile && !profile.classList.contains('hidden')) profile.classList.add('hidden');
  }
});