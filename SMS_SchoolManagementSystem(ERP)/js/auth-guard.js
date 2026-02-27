/**
 * Authentication Guard
 * Protects pages that require authentication
 */

(function () {
    'use strict';

    // Check authentication on page load
    document.addEventListener('DOMContentLoaded', function () {
        // Check if SessionManager is available
        if (typeof SessionManager === 'undefined') {
            console.warn('SessionManager not loaded. Authentication check skipped.');
            return;
        }

        // Get current page path
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        const isLoginPage = currentPath.includes('login.html') || currentHref.includes('login.html');

        // If not login page, check authentication
        if (!isLoginPage) {
            try {
                const session = SessionManager.getSession();

                if (!session) {
                    // Robust logic to find login.html relative to current location
                    const currentPath = window.location.pathname;

                    // Check if we are inside a 'View' folder (e.g., /1 Sup_Admin-View/dashboard.html)
                    // If so, we need to go up one level.
                    // Ideally, we should check against the base path, but relative paths work best for file://

                    let loginPath = 'login.html';

                    // Check if we are in a subfolder (simple heuristic: if path has a directory component that isn't root)
                    // For this specific project structure: /folder/file.html
                    const pathSegments = currentPath.split('/').filter(p => p && !p.includes(':')); // Filter out drive letters on Windows

                    // If we are deep in the structure
                    if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].endsWith('.html') && pathSegments.length > 1) {
                        // E.g. /ERP/1 Sup_Admin-View/dashboard.html -> ERP is root? No, we don't know root name.
                        // But we know 'dashboard.html' is inside a view folder.
                        loginPath = '../login.html';
                    }

                    // Fallback/Overwrite if explicitly in known folders
                    if (currentPath.includes('_View') || currentPath.includes('-View')) {
                        loginPath = '../login.html';
                    }

                    window.location.href = loginPath;
                    return;
                }

                // Set user info in page if elements exist
                const userInfoElements = document.querySelectorAll('[data-user-info]');
                userInfoElements.forEach(element => {
                    try {
                        const infoType = element.getAttribute('data-user-info');
                        if (session.userData && session.userData[infoType]) {
                            // Use textContent to prevent XSS
                            element.textContent = session.userData[infoType];
                        }
                    } catch (e) {
                        console.error('Error setting user info:', e);
                    }
                });

                // Update role-specific elements
                const roleElements = document.querySelectorAll('[data-role]');
                roleElements.forEach(element => {
                    try {
                        const requiredRole = element.getAttribute('data-role');
                        if (session.role !== requiredRole) {
                            element.style.display = 'none';
                        }
                    } catch (e) {
                        console.error('Error updating role elements:', e);
                    }
                });
            } catch (error) {
                console.error('Authentication check error:', error);
                // On error, redirect to login for safety
                window.location.href = '../login.html';
            }
        } else {
            // If on login page, don't auto-redirect even if authenticated
            // This allows users to log in as different roles or test credentials
            // The login form will always be shown
        }
    });
})();

