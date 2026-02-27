/**
 * NOTIFICATION SERVICE
 * Real-time notification center with bell icon, badge counts, and categories
 * Supports: Academic, Financial, Administrative, and System notifications
 */

class NotificationService {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.isOpen = false;
    this.categories = ['all', 'academic', 'financial', 'administrative', 'system'];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    // Create notification UI
    this.createNotificationUI();

    // Load notifications from storage
    this.loadNotifications();

    // Bind event listeners
    this.bindEvents();

    // Start polling for new notifications (every 30 seconds)
    this.startPolling();
  }

  createNotificationUI() {
    const notificationHTML = `
      <!-- Notification Bell Button -->
      <button 
        id="notificationBell"
        onclick="notificationService.toggle()"
        class="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <i class="fas fa-bell text-lg"></i>
        <span id="notificationBadge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
          0
        </span>
      </button>

      <!-- Notification Panel -->
      <div id="notificationPanel" class="hidden absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-in">
        
        <!-- Panel Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 class="font-bold text-slate-900 dark:text-white">Notifications</h3>
          <div class="flex items-center gap-2">
            <button onclick="notificationService.markAllAsRead()" class="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Mark all read
            </button>
            <button onclick="notificationService.close()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex gap-2 p-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          <button onclick="notificationService.filterBy('all')" data-filter="all" class="filter-btn active px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all">
            All
          </button>
          <button onclick="notificationService.filterBy('academic')" data-filter="academic" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all">
            Academic
          </button>
          <button onclick="notificationService.filterBy('financial')" data-filter="financial" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all">
            Financial
          </button>
          <button onclick="notificationService.filterBy('administrative')" data-filter="administrative" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all">
            Admin
          </button>
        </div>

        <!-- Notifications List -->
        <div id="notificationList" class="max-h-96 overflow-y-auto scrollbar-hide">
          <!-- Notifications will be injected here -->
        </div>

        <!-- Panel Footer -->
        <div class="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <a href="#" onclick="notificationService.viewAll(event)" class="block text-center text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
            View All Notifications
          </a>
        </div>
      </div>

      <style>
        .filter-btn {
          background: transparent;
          color: #64748b;
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .dark .filter-btn {
          color: #94a3b8;
        }
        .notification-item.unread {
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
        }
        .dark .notification-item.unread {
          background: rgba(59, 130, 246, 0.1);
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      </style>
    `;

    // Try to find the injection point
    const target = document.getElementById('notification-access');

    if (target) {
      target.id = 'notificationBellContainer';
      target.className = 'relative';
      target.innerHTML = notificationHTML;
    } else {
      // Fallback: create container and add to body
      const container = document.createElement('div');
      container.id = 'notificationBellContainer';
      container.className = 'relative';
      container.innerHTML = notificationHTML;
      document.body.appendChild(container);
    }
  }

  bindEvents() {
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('notificationPanel');
      const bell = document.getElementById('notificationBell');

      if (this.isOpen && panel && bell &&
        !panel.contains(e.target) && !bell.contains(e.target)) {
        this.close();
      }
    });
  }

  async loadNotifications() {
    try {
      // Try to fetch from server/Supabase
      if (dataService && typeof dataService.getNotifications === 'function') {
        const result = await dataService.getNotifications();
        if (result.success) {
          this.notifications = result.data;
        } else {
          this.loadMockNotifications();
        }
      } else {
        this.loadMockNotifications();
      }

      // Also load from localStorage
      const saved = localStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }

      this.updateUI();
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.loadMockNotifications();
    }
  }

  loadMockNotifications() {
    this.notifications = [
      {
        id: 'N001',
        category: 'academic',
        title: 'Exam Schedule Released',
        message: 'Mid-term exam schedule for Class 12th is now available',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        icon: 'fa-calendar-check',
        color: 'blue',
        actionUrl: '4 P-S_View/exam.html'
      },
      {
        id: 'N002',
        category: 'financial',
        title: 'Fee Payment Due',
        message: 'December tuition fee payment is pending. Due date: 15th Jan',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        icon: 'fa-rupee-sign',
        color: 'yellow',
        actionUrl: '4 P-S_View/finance.html'
      },
      {
        id: 'N003',
        category: 'administrative',
        title: 'Annual Sports Meet',
        message: 'Registration open for inter-school sports meet. Submit names by Friday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        icon: 'fa-bullhorn',
        color: 'purple',
        actionUrl: null
      },
      {
        id: 'N004',
        category: 'academic',
        title: 'Homework Submitted',
        message: 'Your Mathematics homework has been submitted successfully',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        icon: 'fa-check-circle',
        color: 'green',
        actionUrl: null
      },
      {
        id: 'N005',
        category: 'system',
        title: 'Profile Updated',
        message: 'Your profile information has been updated',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        read: true,
        icon: 'fa-user',
        color: 'gray',
        actionUrl: '4 P-S_View/profile.html'
      }
    ];

    this.saveNotifications();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
      panel.classList.remove('hidden');
      this.isOpen = true;
      this.renderNotifications();
    }
  }

  close() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
      panel.classList.add('hidden');
      this.isOpen = false;
    }
  }

  filterBy(category) {
    this.currentFilter = category;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderNotifications();
  }

  renderNotifications() {
    const listContainer = document.getElementById('notificationList');
    if (!listContainer) return;

    let filtered = this.notifications;
    if (this.currentFilter !== 'all') {
      filtered = this.notifications.filter(n => n.category === this.currentFilter);
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center text-slate-500 dark:text-slate-400">
          <i class="fas fa-bell-slash text-4xl mb-3 opacity-20"></i>
          <p class="font-medium">No notifications</p>
          <p class="text-xs mt-1">You're all caught up!</p>
        </div>
      `;
      return;
    }

    const notificationsHTML = filtered.map(notification => {
      const unreadClass = !notification.read ? 'notification-item unread' : 'notification-item';
      const timeAgo = this.getTimeAgo(notification.timestamp);

      return `
        <div class="${unreadClass} p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
             onclick="notificationService.markAsRead('${notification.id}'${notification.actionUrl ? `, '${notification.actionUrl}'` : ''})">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-${notification.color}-100 dark:bg-${notification.color}-900/20 flex items-center justify-center text-${notification.color}-600 dark:text-${notification.color}-400 shrink-0">
              <i class="fas ${notification.icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-semibold text-sm text-slate-900 dark:text-white truncate">${notification.title}</h4>
                ${!notification.read ? '<span class="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5"></span>' : ''}
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">${notification.message}</p>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-2">${timeAgo}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listContainer.innerHTML = notificationsHTML;
  }

  markAsRead(id, actionUrl = null) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.updateUI();
    }

    if (actionUrl) {
      window.location.href = actionUrl;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.updateUI();
    this.renderNotifications();
  }

  updateUI() {
    // Count unread
    this.unreadCount = this.notifications.filter(n => !n.read).length;

    // Update badge
    const badge = document.getElementById('notificationBadge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        badge.classList.remove('hidden');
        badge.classList.add('flex');
      } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
      }
    }
  }

  addNotification(notification) {
    const newNotification = {
      id: `N${Date.now()}`,
      category: notification.category || 'system',
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toISOString(),
      read: false,
      icon: notification.icon || 'fa-info-circle',
      color: notification.color || 'blue',
      actionUrl: notification.actionUrl || null
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.updateUI();

    // Show toast if errorHandler exists
    if (typeof errorHandler !== 'undefined') {
      errorHandler.showInfo(notification.title, notification.message);
    }
  }

  saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  async startPolling() {
    // Poll for new notifications every 30 seconds
    setInterval(async () => {
      if (document.hidden) return; // Don't poll if tab is backgrounded

      try {
        if (dataService && typeof dataService.getNotifications === 'function') {
          const result = await dataService.getNotifications();
          if (result.success && result.data.length > this.notifications.length) {
            // New notifications available
            const newOnes = result.data.filter(n =>
              !this.notifications.find(existing => existing.id === n.id)
            );

            newOnes.forEach(n => this.addNotification(n));
          }
        }
      } catch (error) {
        // Silently fail - don't spam console
      }
    }, 30000); // 30 seconds

    // Stop polling when tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Logic to pause polling could go here ideally, but for now checking inside interval is sufficient
      } else {
        // Tab became visible, maybe fetch immediately?
        this.loadNotifications();
      }
    });
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return past.toLocaleDateString();
  }

  viewAll(event) {
    event.preventDefault();
    // Navigate to dedicated notifications page (if it exists)
    // For now, just keep panel open
    alert('Full notifications page coming soon!');
  }

  clearAll() {
    if (confirm('Are you sure you want to delete all notifications?')) {
      this.notifications = [];
      this.saveNotifications();
      this.updateUI();
      this.renderNotifications();
    }
  }
}

// Initialize notification service when DOM is ready
let notificationService;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    notificationService = new NotificationService();
  });
} else {
  notificationService = new NotificationService();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationService;
}
