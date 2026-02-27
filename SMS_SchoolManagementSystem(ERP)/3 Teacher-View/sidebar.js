document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById("appShell");
  if (!shell) return;

  // Configuration: Teacher-specific navigation
  const navLinks = [
    { href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard' },
    { href: 'profile.html', icon: 'fa-user-circle', label: 'Profile' },
    { href: 'attendance.html', icon: 'fa-check-circle', label: 'Attendance' },
    { href: 'homework.html', icon: 'fa-book-open', label: 'Homework' },
    { href: 'marks.html', icon: 'fa-chart-line', label: 'Marks' },
    { href: 'communication.html', icon: 'fa-comments', label: 'Communication' },
  ];

  // Shell HTML Template
  shell.innerHTML = `
    <div id="mobileOverlay" onclick="toggleSidebar(false)" 
         class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 hidden transition-opacity duration-300 lg:hidden" aria-hidden="true"></div>

    <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a] p-2">

      <aside id="sidebar" 
             class="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none lg:static lg:h-full lg:shrink-0">
        
        <div class="flex items-center gap-3 h-16 px-6 border-b border-slate-100 dark:border-slate-800">
          <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/30">
            <i class="fas fa-chalkboard-user"></i>
          </div>
          <div>
            <p class="font-bold tracking-tight text-slate-900 dark:text-white leading-none">EduPortal</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Teacher Panel</p>
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
            <h2 class="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate" id="pageTitle"></h2>
          </div>

          <div class="flex items-center gap-2 sm:gap-4 relative">
             <button onclick="toggleDarkMode()" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <i class="fas fa-moon dark:hidden"></i>
                <i class="fas fa-sun hidden dark:block text-amber-400"></i>
             </button>
             <div id="notification-access"></div>

             <!-- Profile Menu -->
             <div class="relative">
               <button id="profileBtn" onclick="toggleProfileMenu(event)" class="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                 <i class="fas fa-user-circle text-lg"></i>
               </button>
               <div id="profileMenu" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-800 z-50">
                 <div class="text-sm font-bold mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">Mrs. Priya Singh</div>
                 <div class="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                   <a href="profile.html" class="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Profile Settings</a>
                   <a href="#" class="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Account</a>
                   <button onclick="openLogoutModal()" class="w-full text-left p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400">Logout</button>
                 </div>
               </div>
             </div>
          </div>
        </header>

        <main id="mainContent" class="flex-1 overflow-y-auto scrollbar-hide">
          <!-- Page content injected here -->
        </main>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div id="logoutModal" class="hidden fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center animat-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Sign Out?</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Are you sure you want to sign out? You'll need to login again to access your account.</p>
        <div class="flex gap-3">
          <button onclick="closeLogoutModal()" class="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors">
            Cancel
          </button>
          <button onclick="confirmLogout()" class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `;

  // Update page title based on current page
  const pageTitleMap = {
    'dashboard.html': 'Dashboard',
    'attendance.html': 'Attendance Management',
    'homework.html': 'Homework & Assignments',
    'marks.html': 'Student Marks',
    'communication.html': 'Parent Communication',
    'profile.html': 'Teacher Profile',
  };

  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = pageTitleMap[currentPage] || 'Dashboard';
  }
});

// Sidebar Toggle
function toggleSidebar(open) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  if (!sidebar || !overlay) return;

  if (open) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

// Profile Menu Toggle
function toggleProfileMenu(event) {
  event.stopPropagation();
  const profileMenu = document.getElementById('profileMenu');
  if (profileMenu) {
    profileMenu.classList.toggle('hidden');
  }
}

// Open Logout Modal
function openLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

// Close Logout Modal
function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Confirm Logout
async function confirmLogout() {
  try {
    if (typeof SessionManager !== 'undefined') {
      SessionManager.clearSession();
    } else {
      localStorage.removeItem('userSession');
    }

    if (typeof NotificationManager !== 'undefined') {
      NotificationManager.success('Logged out successfully');
    }

    setTimeout(() => {
      window.location.href = '../login.html';
    }, 500);
  } catch (error) {
    console.error('Logout error:', error);
    if (typeof NotificationManager !== 'undefined') {
      NotificationManager.error('Error during logout');
    }
  }
}

// Close profile menu when clicking outside
document.addEventListener('click', () => {
  const profileMenu = document.getElementById('profileMenu');
  if (profileMenu) {
    profileMenu.classList.add('hidden');
  }
});
