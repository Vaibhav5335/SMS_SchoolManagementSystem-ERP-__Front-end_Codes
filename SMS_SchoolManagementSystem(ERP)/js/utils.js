/**
 * School Management System - Utility Functions
 * Production-ready utility functions for the application
 */

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

const SessionManager = {
    /**
     * Set user session after successful login
     * @param {string} role - User role
     * @param {object} userData - User data object
     */
    setSession: function (role, userData) {
        const session = {
            role: role,
            userData: userData,
            loginTime: new Date().toISOString(),
            // Set 24 hour expiry
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        // Use sessionStorage for better security (cleared on tab close)
        // In production, use HttpOnly cookies
        sessionStorage.setItem('userSession', JSON.stringify(session));
        sessionStorage.setItem('isAuthenticated', 'true');
    },

    /**
     * Get current user session
     * @returns {object|null} Session object or null
     */
    getSession: function () {
        const sessionStr = sessionStorage.getItem('userSession');
        if (!sessionStr) return null;

        try {
            const session = JSON.parse(sessionStr);
            // Check if session expired
            if (new Date(session.expiresAt) < new Date()) {
                console.warn('Session expired');
                this.clearSession();
                // Redirect to login if expired
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = '../login.html';
                }
                return null;
            }
            return session;
        } catch (e) {
            console.error('Error parsing session:', e);
            this.clearSession();
            return null;
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function () {
        const session = this.getSession();
        return session !== null && sessionStorage.getItem('isAuthenticated') === 'true';
    },

    /**
     * Get current user role
     * @returns {string|null}
     */
    getRole: function () {
        const session = this.getSession();
        return session ? session.role : null;
    },

    /**
     * Clear user session
     */
    clearSession: function () {
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('rememberMe'); // Also clear remember me if clearing session
    },

    /**
     * Redirect to login if not authenticated
     * @param {string} requiredRole - Required role (optional)
     */
    requireAuth: function (requiredRole = null) {
        if (!this.isAuthenticated()) {
            window.location.href = '../login.html';
            return false;
        }

        if (requiredRole && this.getRole() !== requiredRole) {
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.error('Access denied. Insufficient permissions.');
            }
            window.location.href = '../login.html';
            return false;
        }

        return true;
    }
};

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

const NotificationManager = {
    /**
     * Show a toast notification
     * @param {string} message - Notification message
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    show: function (message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existing = document.querySelector('.notification-container');
        if (existing) {
            existing.remove();
        }

        // Create notification container
        const container = document.createElement('div');
        container.className = 'notification-container fixed top-4 right-4 z-50 max-w-md';

        const bgColors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        // Sanitize message to prevent XSS
        const sanitizedMessage = Utils.sanitize(message);

        const notificationDiv = document.createElement('div');
        notificationDiv.className = `${bgColors[type] || bgColors.info} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in`;

        const icon = document.createElement('i');
        icon.className = `fas ${icons[type] || icons.info} text-xl`;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'flex-1';
        messageSpan.textContent = message; // Use textContent for safety

        const closeButton = document.createElement('button');
        closeButton.className = 'hover:opacity-75';
        closeButton.setAttribute('aria-label', 'Close notification');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.onclick = function () {
            container.remove();
        };

        notificationDiv.appendChild(icon);
        notificationDiv.appendChild(messageSpan);
        notificationDiv.appendChild(closeButton);
        container.appendChild(notificationDiv);

        document.body.appendChild(container);

        // Auto remove after duration
        setTimeout(() => {
            if (container.parentNode) {
                container.style.animation = 'slide-out 0.3s ease-out';
                setTimeout(() => container.remove(), 300);
            }
        }, duration);
    },

    /**
     * Show success notification
     */
    success: function (message, duration) {
        this.show(message, 'success', duration);
    },

    /**
     * Show error notification
     */
    error: function (message, duration) {
        this.show(message, 'error', duration);
    },

    /**
     * Show warning notification
     */
    warning: function (message, duration) {
        this.show(message, 'warning', duration);
    },

    /**
     * Show info notification
     */
    info: function (message, duration) {
        this.show(message, 'info', duration);
    }
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ============================================================================
// FORM VALIDATION
// ============================================================================

const FormValidator = {
    /**
     * Validate email format
     * @param {string} email
     * @returns {boolean}
     */
    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone number (Indian format)
     * @param {string} phone
     * @returns {boolean}
     */
    validatePhone: function (phone) {
        // Remove non-digit characters for validation
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it has enough digits (min 10)
        // This accepts 10-digit numbers, numbers with country codes (11-13 digits), etc.
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    },

    /**
     * Validate password strength
     * @param {string} password
     * @returns {object} {valid: boolean, message: string}
     */
    validatePassword: function (password) {
        // Stronger password policy
        // Min 8 chars, at least 1 number, 1 special char
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        // Simple complexity check
        const hasNumber = /\d/.test(password);
        if (!hasNumber) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true, message: '' };
    },

    /**
     * Show field error
     * @param {HTMLElement} field
     * @param {string} message
     */
    showFieldError: function (field, message) {
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:ring-indigo-500');

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    },

    /**
     * Clear field error
     * @param {HTMLElement} field
     */
    clearFieldError: function (field) {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.classList.add('border-gray-300', 'focus:ring-indigo-500');

        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    /**
     * Validate form field
     * @param {HTMLElement} field
     * @param {string} type - 'email', 'phone', 'password', 'required'
     * @returns {boolean}
     */
    validateField: function (field, type = 'required') {
        const value = field.value.trim();

        // Clear previous errors
        this.clearFieldError(field);

        // Required validation
        if (type === 'required' && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (type === 'email' && !this.validateEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        // Phone validation
        if (type === 'phone' && !this.validatePhone(value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        // Password validation
        if (type === 'password') {
            const result = this.validatePassword(value);
            if (!result.valid) {
                this.showFieldError(field, result.message);
                return false;
            }
        }

        return true;
    }
};

// ============================================================================
// LOADING STATE MANAGEMENT
// ============================================================================

const LoadingManager = {
    /**
     * Show loading state on button
     * @param {HTMLElement} button
     * @param {string} loadingText
     */
    showButtonLoading: function (button, loadingText = 'Loading...') {
        if (!button) return;
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;

        // Create spinner icon safely
        const spinner = document.createElement('i');
        spinner.className = 'fas fa-spinner fa-spin mr-2';
        button.innerHTML = '';
        button.appendChild(spinner);
        button.appendChild(document.createTextNode(loadingText));

        // UTILS FIX: Add timeout to prevent infinite loading state
        setTimeout(() => {
            if (button && button.disabled) {
                this.hideButtonLoading(button);
            }
        }, 30000); // 30s timeout
    },

    /**
     * Hide loading state on button
     * @param {HTMLElement} button
     */
    hideButtonLoading: function (button) {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    },

    /**
     * Show page loading overlay
     */
    showPageLoading: function () {
        // Remove existing overlay if present
        const existing = document.getElementById('pageLoadingOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'pageLoadingOverlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'bg-white dark:bg-gray-800 rounded-lg p-8 text-center';

        const spinner = document.createElement('i');
        spinner.className = 'fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4';

        const text = document.createElement('p');
        text.className = 'text-gray-700 dark:text-gray-300';
        text.textContent = 'Loading...';

        contentDiv.appendChild(spinner);
        contentDiv.appendChild(text);
        overlay.appendChild(contentDiv);
        document.body.appendChild(overlay);
    },

    /**
     * Hide page loading overlay
     */
    hidePageLoading: function () {
        const overlay = document.getElementById('pageLoadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

// ============================================================================
// API SIMULATION (for production, replace with actual API calls)
// ============================================================================

const ApiService = {
    /**
     * Simulate API delay
     * @param {number} ms
     * @returns {Promise}
     */
    delay: function (ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Authenticate user
     * @param {string} role
     * @param {object} credentials
     * @returns {Promise<object>}
     */
    login: async function (role, credentials) {
        // Use the separate MockAuthService if available
        if (typeof MockAuthService !== 'undefined') {
            return MockAuthService.validate(role, credentials);
        } else {
            // Fallback if MockAuthService not loaded (should not happen if included)
            console.error('MockAuthService not loaded');
            throw new Error('Authentication service unavailable');
        }
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const Utils = {
    /**
     * Format date
     * @param {Date|string} date
     * @param {string} format
     * @returns {string}
     */
    formatDate: function (date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    /**
     * Debounce function
     * @param {Function} func
     * @param {number} wait
     * @returns {Function}
     */
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format currency (Indian Rupees)
     * @param {number} amount
     * @returns {string}
     */
    formatCurrency: function (amount) {
        return '₹' + amount.toLocaleString('en-IN');
    },

    /**
     * Sanitize input
     * @param {string} input
     * @returns {string}
     */
    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} input - Raw text to escape
     * @returns {string} HTML-escaped text
     */
    sanitize: function (input) {
        if (typeof input !== 'string') {
            return String(input || '');
        }
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Escape characters for RegExp to prevent injection attacks
     * @param {string} string
     * @returns {string}
     */
    escapeRegExp: function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - Target element
     * @param {string} html - HTML string (will be sanitized)
     * @returns {void}
     */
    safeSetHTML: function (element, html) {
        if (!element) return;
        element.innerHTML = this.sanitize(html);
    },

    /**
     * Create element with safe text content
     * @param {string} tag - HTML tag name
     * @param {string} text - Text content
     * @param {object} attributes - Element attributes
     * @returns {HTMLElement}
     */
    createSafeElement: function (tag, text, attributes = {}) {
        const element = document.createElement(tag);
        if (text) {
            element.textContent = text;
        }
        Object.keys(attributes).forEach(key => {
            if (key === 'className' || key === 'class') {
                element.className = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        return element;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SessionManager,
        NotificationManager,
        FormValidator,
        LoadingManager,
        ApiService,
        Utils
    };
}

