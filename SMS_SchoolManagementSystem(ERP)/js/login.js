'use strict';

/**
 * LOGIN PAGE LOGIC
 * Handles UI interactions, role selection, and form submission for the login page.
 */

// Role configurations
const roleConfig = {
    'super-admin': {
        icon: 'fa-crown',
        bgColor: 'from-indigo-600 to-indigo-700',
        iconColor: 'text-indigo-600',
        title: 'Super Admin',
        subtitle: 'Platform Owner Access',
        fields: ['email', 'password'],
        redirect: '1 Sup_Admin-View/dashboard.html'
    },
    'school-admin': {
        icon: 'fa-user-tie',
        bgColor: 'from-green-600 to-green-700',
        iconColor: 'text-green-600',
        title: 'School Admin',
        subtitle: 'Principal / Management Access',
        fields: ['phone', 'otp'],
        redirect: '2 Sch_Admin-View/dashboard.html'
    },
    'teacher': {
        icon: 'fa-chalkboard-teacher',
        bgColor: 'from-purple-600 to-purple-700',
        iconColor: 'text-purple-600',
        title: 'Teacher Portal',
        subtitle: 'Staff Access',
        fields: ['phone', 'otp'],
        redirect: '3 Teacher-View/dashboard.html'
    },
    'parent-student': {
        icon: 'fa-user-friends',
        bgColor: 'from-orange-600 to-orange-700',
        iconColor: 'text-orange-600',
        title: 'Parent Portal',
        subtitle: 'Access your child\'s information',
        fields: ['phone', 'otp'],
        redirect: '4 P-S_View/dashboard.html'
    }
};

let currentRole = null;

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 4000) {
    // If NotificationManager is available from utils.js, use it
    if (typeof NotificationManager !== 'undefined') {
        NotificationManager.show(message, type, duration);
        return;
    }

    // Fallback implementation if NotificationManager not loaded
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-brand-600'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 ${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg transform translate-x-full transition-transform duration-300 pointer-events-auto fade-in`;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span class="text-sm font-black flex-1">${escapeHtml(message)}</span>
        <button onclick="this.parentElement.remove()" class="hover:opacity-80 transition-opacity">
            <i class="fas fa-times"></i>
        </button>
    `;

    const container = document.getElementById('toast-container');
    if (container) {
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
        });

        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

function escapeHtml(text) {
    if (typeof Utils !== 'undefined' && Utils.sanitize) {
        return Utils.sanitize(text);
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update login form based on selected role
 */
function updateLoginForm() {
    const roleElem = document.getElementById('userRole');
    if (!roleElem) return;

    const role = roleElem.value;
    currentRole = role;

    if (!role) {
        resetForm();
        return;
    }

    const config = roleConfig[role];
    if (!config) {
        showToast('Invalid role selected', 'error');
        return;
    }

    const roleTitle = document.getElementById('roleTitle');
    const roleSubtitle = document.getElementById('roleSubtitle');
    const submitButton = document.getElementById('submitButton');

    // Update title and subtitle
    roleTitle.textContent = config.title;
    roleSubtitle.textContent = config.subtitle;

    // Reset button class
    submitButton.className = 'w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-brand-200 transition transform active:scale-95 flex items-center justify-center btn-press disabled:opacity-50 disabled:cursor-not-allowed';

    // Hide all fields first
    document.getElementById('emailField').classList.add('hidden');
    document.getElementById('phoneField').classList.add('hidden');
    document.getElementById('otpPasswordField').classList.add('hidden');
    document.getElementById('passwordField').classList.add('hidden');
    document.getElementById('otpButton').classList.add('hidden');

    // Show required fields based on role
    if (config.fields.includes('email')) {
        const emailField = document.getElementById('emailField');
        emailField.classList.remove('hidden');
        document.getElementById('email').required = true;
    } else {
        const email = document.getElementById('email');
        if (email) email.required = false;
    }

    if (config.fields.includes('phone')) {
        const phoneField = document.getElementById('phoneField');
        phoneField.classList.remove('hidden');
        document.getElementById('phone').required = true;
    } else {
        const phone = document.getElementById('phone');
        if (phone) phone.required = false;
    }

    if (config.fields.includes('otp')) {
        const otpField = document.getElementById('otpPasswordField');
        otpField.classList.remove('hidden');
        const otpButton = document.getElementById('otpButton');
        otpButton.classList.remove('hidden');
        otpButton.className = `px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all whitespace-nowrap btn-press font-black text-sm shadow-lg shadow-brand-200`;
        document.getElementById('otpPassword').required = true;
    } else {
        const otpPassword = document.getElementById('otpPassword');
        if (otpPassword) otpPassword.required = false;
    }

    if (config.fields.includes('password')) {
        const passwordField = document.getElementById('passwordField');
        passwordField.classList.remove('hidden');
        document.getElementById('password').required = true;
    } else {
        const password = document.getElementById('password');
        if (password) password.required = false;
    }

    // Update icon colors to brand color
    const icons = ['emailIcon', 'phoneIcon', 'otpIcon', 'passwordIcon', 'roleLabelIcon'];
    icons.forEach(iconId => {
        const icon = document.getElementById(iconId);
        if (icon) {
            const baseClasses = icon.className.split(' ').filter(cls => !cls.startsWith('text-'));
            icon.className = baseClasses.join(' ') + ' text-brand-600';
        }
    });
}

/**
 * Reset form to initial state
 */
function resetForm() {
    const roleTitle = document.getElementById('roleTitle');
    const roleSubtitle = document.getElementById('roleSubtitle');
    const submitButton = document.getElementById('submitButton');

    roleTitle.textContent = 'School Management';
    roleSubtitle.textContent = 'Select your role to continue';
    submitButton.className = 'w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-brand-200 transition transform active:scale-95 flex items-center justify-center btn-press disabled:opacity-50 disabled:cursor-not-allowed';

    // Reset icon colors
    const icons = ['emailIcon', 'phoneIcon', 'otpIcon', 'passwordIcon', 'roleLabelIcon'];
    icons.forEach(iconId => {
        const icon = document.getElementById(iconId);
        if (icon) {
            const baseClasses = icon.className.split(' ').filter(cls => !cls.startsWith('text-'));
            icon.className = baseClasses.join(' ') + ' text-brand-600';
        }
    });

    // Hide all fields
    document.getElementById('emailField').classList.add('hidden');
    document.getElementById('phoneField').classList.add('hidden');
    document.getElementById('otpPasswordField').classList.add('hidden');
    document.getElementById('passwordField').classList.add('hidden');
    document.getElementById('otpButton').classList.add('hidden');

    // Clear field errors
    ['email', 'phone', 'otpPassword', 'password'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (typeof FormValidator !== 'undefined') {
                FormValidator.clearFieldError(field);
            }
            field.value = '';
        }
    });
}

/**
 * Toggle password visibility
 */
function togglePassword() {
    const password = document.getElementById('password');
    const icon = document.getElementById('toggleIcon');
    if (password.type === 'password') {
        password.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        password.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Handle OTP sending
 */
async function handleSendOTP() {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value.trim();

    if (!phone) {
        showToast('Please enter your phone number first', 'warning');
        phoneInput.focus();
        return;
    }

    const otpButton = document.getElementById('otpButton');
    const originalText = otpButton.innerHTML;

    // Rate limit check using localStorage for persistence across reloads
    const lastSent = localStorage.getItem('otp_last_sent_' + phone);
    if (lastSent && (Date.now() - parseInt(lastSent)) < 30000) {
        showToast('Please wait 30 seconds before resending OTP', 'warning');
        return;
    }

    otpButton.disabled = true;
    otpButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Sending...';

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast(`OTP sent to ${phone}`, 'success');
        localStorage.setItem('otp_last_sent_' + phone, Date.now().toString());
    } catch (error) {
        showToast('Failed to send OTP. Please try again.', 'error');
    } finally {
        otpButton.disabled = false;
        otpButton.innerHTML = originalText;
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Expose functions to global scope for HTML onclick attributes
window.updateLoginForm = updateLoginForm;
window.togglePassword = togglePassword;
window.handleSendOTP = handleSendOTP;

/**
 * Handle form submission
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const role = document.getElementById('userRole').value;

            if (!role) {
                showToast('Please select a user role', 'warning');
                document.getElementById('userRole').focus();
                return;
            }

            const config = roleConfig[role];
            if (!config) {
                showToast('Invalid role selected', 'error');
                return;
            }

            // Validate all required fields
            let isValid = true;

            if (config.fields.includes('email')) {
                const emailInput = document.getElementById('email');
                if (!emailInput.value.trim()) {
                    isValid = false;
                    showToast('Please enter your email address', 'warning');
                } else if (typeof FormValidator !== 'undefined' && !FormValidator.validateField(emailInput, 'email')) {
                    isValid = false;
                }
            }

            if (config.fields.includes('phone')) {
                const phoneInput = document.getElementById('phone');
                if (!phoneInput.value.trim()) {
                    isValid = false;
                    showToast('Please enter your phone number', 'warning');
                } else if (typeof FormValidator !== 'undefined' && !FormValidator.validateField(phoneInput, 'phone')) {
                    isValid = false;
                }
            }

            if (config.fields.includes('password')) {
                const passwordInput = document.getElementById('password');
                if (!passwordInput.value) {
                    isValid = false;
                    showToast('Please enter your password', 'warning');
                }
            }

            if (config.fields.includes('otp')) {
                const otpInput = document.getElementById('otpPassword');
                if (!otpInput.value.trim()) {
                    isValid = false;
                    showToast('Please enter OTP or Password', 'warning');
                }
            }

            if (!isValid) {
                return;
            }

            // Collect credentials
            const credentials = {};
            if (config.fields.includes('email')) {
                credentials.email = document.getElementById('email').value.trim();
            }
            if (config.fields.includes('phone')) {
                credentials.phone = document.getElementById('phone').value.trim();
            }
            // Set password from either password field or OTP field
            if (config.fields.includes('password')) {
                credentials.password = document.getElementById('password').value;
            } else if (config.fields.includes('otp')) {
                credentials.password = document.getElementById('otpPassword').value.trim();
            }

            // Show loading state
            const submitButton = document.getElementById('submitButton');
            const submitText = document.getElementById('submitText');
            const originalText = submitText.textContent;

            // Rate limit check for login attempts (client side protection)
            const lastAttempt = localStorage.getItem('login_last_attempt');
            if (lastAttempt && (Date.now() - parseInt(lastAttempt)) < 3000) {
                // Prevent spamming
                return;
            }
            localStorage.setItem('login_last_attempt', Date.now().toString());

            submitButton.disabled = true;
            submitText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';

            try {
                // Attempt login using ApiService (which uses MockAuthService or Real API)
                let response;
                if (typeof ApiService !== 'undefined') {
                    response = await ApiService.login(role, credentials);
                } else {
                    throw new Error('System error: ApiService not available');
                }

                if (!response || !response.success || !response.user) {
                    throw new Error('Login failed. Please try again.');
                }

                // Set session
                if (typeof SessionManager !== 'undefined') {
                    SessionManager.setSession(role, response.user);
                } else {
                    throw new Error('System error: SessionManager not available');
                }

                // Handle "Remember Me"
                const rememberMe = document.getElementById('rememberMe').checked;
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }

                showToast('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = config.redirect;
                }, 500);

            } catch (error) {
                submitButton.disabled = false;
                submitText.textContent = originalText;
                const errorMessage = error.message || 'Invalid credentials. Please try again.';
                showToast(errorMessage, 'error');

                if (config.fields.includes('password')) {
                    document.getElementById('password').value = '';
                }
                if (config.fields.includes('otp')) {
                    document.getElementById('otpPassword').value = '';
                }
            }
        });
    }

    // Initialize session check
    if (typeof SessionManager !== 'undefined') {
        const session = SessionManager.getSession();
        if (session && session.role) {
            setTimeout(() => {
                showToast('You can log in as a different user or continue to your dashboard', 'info', 5000);
            }, 1000);
        }
    }
});
