/**
 * Error & UI Utilities
 * Handles error display and notification UI
 */

class ErrorHandler {
  constructor() {
    this.toastContainer = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[100] space-y-2 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }
    this.toastContainer = document.getElementById('toast-container');
  }

  // Show error toast notification
  showError(title, message, duration = 5000) {
    const toast = this.createToast('error', title, message);
    this.displayToast(toast, duration);
  }

  // Show success toast notification
  showSuccess(title, message, duration = 3000) {
    const toast = this.createToast('success', title, message);
    this.displayToast(toast, duration);
  }

  // Show warning toast notification
  showWarning(title, message, duration = 4000) {
    const toast = this.createToast('warning', title, message);
    this.displayToast(toast, duration);
  }

  // Show info toast notification
  showInfo(title, message, duration = 3000) {
    const toast = this.createToast('info', title, message);
    this.displayToast(toast, duration);
  }

  // Create toast HTML element
  createToast(type, title, message) {
    const toast = document.createElement('div');

    const colorClasses = {
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    };

    const icons = {
      error: 'fa-circle-exclamation',
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const colorClass = colorClasses[type] || colorClasses.info;
    const icon = icons[type] || icons.info;

    toast.className = `${colorClass} border rounded-lg p-4 shadow-lg pointer-events-auto animate-slide-in backdrop-blur-sm`;

    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <i class="fas ${icon} text-lg shrink-0 mt-0.5"></i>
        <div class="flex-1">
          <p class="font-bold text-sm">${title}</p>
          <p class="text-xs opacity-90 mt-1 leading-relaxed">${message}</p>
        </div>
        <button class="close-toast text-lg opacity-75 hover:opacity-100 transition-opacity shrink-0">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    toast.querySelector('.close-toast').addEventListener('click', () => {
      toast.remove();
    });

    return toast;
  }

  // Display toast and auto-remove
  displayToast(toast, duration) {
    this.toastContainer.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        toast.style.transition = 'all 0.3s ease';

        setTimeout(() => {
          // Clone and replace to strip all event listeners before removal
          const clone = toast.cloneNode(true);
          toast.parentNode.replaceChild(clone, toast);
          clone.remove();
        }, 300);
      }, duration);
    }
  }

  // Show loading spinner
  showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 gap-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 dark:border-t-brand-400 animate-spin"></div>
        </div>
        <p class="text-sm font-medium text-slate-600 dark:text-slate-400">${message}</p>
      </div>
    `;
  }

  // Show error state
  showErrorState(containerId, title = 'Error Loading Data', message = 'Unable to fetch data. Please try again later.', retryCallback = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let retryHtml = '';
    if (retryCallback) {
      retryHtml = `<button onclick="retryLoadData()" class="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-sm transition-colors active:scale-95">
        <i class="fas fa-redo mr-2"></i> Try Again
      </button>`;
    }

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 gap-4">
        <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <i class="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <div class="text-center">
          <h3 class="font-bold text-slate-900 dark:text-white text-lg">${title}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xs">${message}</p>
        </div>
        ${retryHtml}
      </div>
    `;

    if (retryCallback) {
      window.retryLoadData = retryCallback;
    }
  }

  // Show empty state
  showEmptyState(containerId, message = 'No data available', icon = 'fa-inbox') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 gap-4">
        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <i class="fas ${icon} text-2xl"></i>
        </div>
        <p class="text-sm font-medium text-slate-600 dark:text-slate-400">${message}</p>
      </div>
    `;
  }

  // Format error message for display
  formatErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      // Clean up technical error messages
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('connection')) {
        return 'Network connection error. Please check your internet connection.';
      }
      if (message.includes('unauthorized') || message.includes('401')) {
        return 'Session expired. Please log in again.';
      }
      if (message.includes('forbidden') || message.includes('403')) {
        return 'You do not have permission to perform this action.';
      }
      if (message.includes('not found') || message.includes('404')) {
        return 'The requested resource was not found.';
      }
      if (message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }

      return error.message;
    }

    return 'An unexpected error occurred. Please try again later.';
  }
}

// Initialize global error handler
const errorHandler = new ErrorHandler();

// Add global error listener
if (typeof dataService !== 'undefined') {
  dataService.onError((error) => {
    errorHandler.showError(error.title, errorHandler.formatErrorMessage(error));
    console.error('Data Service Error:', error);
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});

// Add CSS animations if not already present
if (!document.querySelector('style[data-error-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-error-animations', 'true');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(400px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease cubic-bezier(0.25, 1, 0.5, 1);
    }
  `;
  document.head.appendChild(style);
}
