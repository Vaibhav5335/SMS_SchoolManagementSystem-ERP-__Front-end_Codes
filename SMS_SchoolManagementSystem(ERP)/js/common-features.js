/**
 * Common Features Module
 * Provides reusable functionality for all pages
 */

(function () {
    'use strict';

    /**
     * Modal Management
     */
    const ModalManager = {
        /**
         * Open a modal
         * @param {string} modalId - ID of the modal element
         * @param {object} options - Options for modal (title, content, etc.)
         */
        open: function (modalId, options = {}) {
            const modal = document.getElementById(modalId);
            if (!modal) {
                console.warn('Modal not found:', modalId);
                return;
            }

            // Set title if provided
            if (options.title) {
                const titleElement = modal.querySelector('[data-modal-title]') || modal.querySelector('.modal-title') || modal.querySelector('h2, h3');
                if (titleElement) {
                    titleElement.textContent = options.title;
                }
            }

            // Set content if provided
            if (options.content) {
                const contentElement = modal.querySelector('[data-modal-content]') || modal.querySelector('.modal-content') || modal.querySelector('.modal-body');
                if (contentElement) {
                    // XSS FIX: Check if content is a string
                    if (typeof options.content === 'string') {
                        // Use a sanitizer or textContent if simple string
                        // For this implementation, we assume if it starts with < it might be intented HTML, 
                        // but we should sanitize it. Since we don't have a sanitizer lib, we'll try to be safe.
                        // Ideally use DOMPurify.sanitize(options.content)
                        if (options.safeHtml) {
                            contentElement.innerHTML = options.content; // Only use if explicitly marked safe
                        } else {
                            contentElement.textContent = options.content;
                        }
                    } else if (options.content instanceof Node) {
                        contentElement.innerHTML = '';
                        contentElement.appendChild(options.content);
                    }
                }
            }

            // Show modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            // Animate in
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');

                const modalContent = modal.querySelector('.modal-content, [data-modal-content]') || modal.querySelector('div > div');
                if (modalContent) {
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }
            });

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Focus first input if exists
            const firstInput = modal.querySelector('input, textarea, select, button');
            if (firstInput && firstInput.type !== 'hidden') {
                setTimeout(() => firstInput.focus(), 100);
            }
        },

        /**
         * Close a modal
         * @param {string} modalId - ID of the modal element
         */
        close: function (modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            // Animate out
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');

            const modalContent = modal.querySelector('.modal-content, [data-modal-content]') || modal.querySelector('div > div');
            if (modalContent) {
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');
            }

            // Hide after animation
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        },

        /**
         * Initialize modals with close buttons using event delegation
         */
        init: function () {
            // Global click listener for backdrop closing (Event Delegation)
            document.addEventListener('click', function (e) {
                // Check if the clicked element is a modal backdrop
                if (e.target.matches('.modal, [id$="Modal"]')) {
                    // Only close if it's currently visible/flex
                    if (!e.target.classList.contains('hidden')) {
                        ModalManager.close(e.target.id);
                    }
                }

                // Close button handling (Event Delegation)
                if (e.target.matches('[data-modal-close], .close-modal, .close-modal *')) {
                    const closeBtn = e.target.closest('[data-modal-close], .close-modal');
                    const modal = closeBtn.closest('.modal, [id$="Modal"]');
                    if (modal) {
                        ModalManager.close(modal.id);
                    }
                }
            });

            // Close on escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    // Find the top-most visible modal
                    const openModals = document.querySelectorAll('.modal:not(.hidden), [id$="Modal"]:not(.hidden)');
                    if (openModals.length > 0) {
                        // Close the last one (top one)
                        ModalManager.close(openModals[openModals.length - 1].id);
                    }
                }
            });
        }
    };

    /**
     * Search Functionality
     */
    const SearchManager = {
        /**
         * Perform search on a list
         * @param {string} searchTerm - Search query
         * @param {NodeList|Array} items - Items to search
         * @param {Function} searchFunction - Function to extract searchable text from item
         * @returns {Array} Filtered items
         */
        search: function (searchTerm, items, searchFunction) {
            if (!searchTerm || !items) return Array.from(items);

            const term = searchTerm.toLowerCase().trim();
            if (!term) return Array.from(items);

            return Array.from(items).filter(item => {
                const searchableText = searchFunction ? searchFunction(item) : item.textContent || '';
                return searchableText.toLowerCase().includes(term);
            });
        },

        /**
         * Initialize search input
         * @param {string} inputId - ID of search input
         * @param {Function} onSearch - Callback function when search changes
         */
        init: function (inputId, onSearch) {
            const input = document.getElementById(inputId);
            if (!input) return;

            let timeout;
            input.addEventListener('input', function (e) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (onSearch) {
                        onSearch(e.target.value);
                    }
                }, 300); // Debounce
            });
        }
    };

    /**
     * Filter Functionality
     */
    const FilterManager = {
        /**
         * Apply filters to items
         * @param {Array} items - Items to filter
         * @param {object} filters - Filter criteria
         * @param {Function} filterFunction - Function to check if item matches filters
         * @returns {Array} Filtered items
         */
        apply: function (items, filters, filterFunction) {
            if (!filters || Object.keys(filters).length === 0) return items;

            return items.filter(item => {
                if (filterFunction) {
                    return filterFunction(item, filters);
                }
                return true;
            });
        }
    };

    /**
     * Tab Management
     */
    const TabManager = {
        /**
         * Switch to a tab
         * @param {string} tabId - ID of tab to show
         * @param {string} containerId - ID of tab container (optional)
         */
        switch: function (tabId, containerId) {
            const container = containerId ? document.getElementById(containerId) : document;

            // Hide all tab contents
            container.querySelectorAll('[data-tab-content]').forEach(content => {
                content.classList.add('hidden');
            });

            // Remove active state from all tabs
            container.querySelectorAll('[data-tab]').forEach(tab => {
                tab.classList.remove('active', 'bg-primary-600', 'text-white');
                tab.classList.add('text-gray-600', 'hover:bg-gray-100');
            });

            // Show selected tab content
            const tabContent = container.querySelector(`[data-tab-content="${tabId}"]`);
            if (tabContent) {
                tabContent.classList.remove('hidden');
            }

            // Activate selected tab
            const tab = container.querySelector(`[data-tab="${tabId}"]`);
            if (tab) {
                tab.classList.add('active', 'bg-primary-600', 'text-white');
                tab.classList.remove('text-gray-600', 'hover:bg-gray-100');
            }
        },

        /**
         * Initialize tabs
         * @param {string} containerId - ID of tab container
         */
        init: function (containerId) {
            const container = containerId ? document.getElementById(containerId) : document;
            const tabs = container.querySelectorAll('[data-tab]');

            tabs.forEach(tab => {
                tab.addEventListener('click', function (e) {
                    e.preventDefault();
                    const tabId = this.getAttribute('data-tab');
                    TabManager.switch(tabId, containerId);
                });
            });
        }
    };

    // Removed FormHelper - Use Utils.FormValidator instead for consistent validation logic across the app.
    // Removed DarkModeManager - Use theme-manager.js instead to avoid conflicting localStorage keys.


    /**
     * Export to global scope
     */
    window.ModalManager = ModalManager;
    window.SearchManager = SearchManager;
    window.FilterManager = FilterManager;
    window.TabManager = TabManager;
    window.DarkModeManager = DarkModeManager;
    window.MobileMenuManager = MobileMenuManager;
    window.FormHelper = FormHelper;

    /**
     * Initialize on DOM ready
     */
    document.addEventListener('DOMContentLoaded', function () {
        ModalManager.init();
        // DarkModeManager.init(); // Handled by theme-manager.js
    });

})();

