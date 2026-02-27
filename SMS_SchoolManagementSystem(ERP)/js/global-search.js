/**
 * GLOBAL SEARCH MODULE
 * Universal search across students, teachers, documents, and announcements
 * Features: Keyboard shortcuts (Ctrl+K), fuzzy matching, recent searches
 */

class GlobalSearch {
  constructor() {
    this.isOpen = false;
    this.searchableData = [];
    this.recentSearches = this.loadRecentSearches();
    this.maxRecentSearches = 5;
    this.init();
  }

  init() {
    // Create search UI
    this.createSearchUI();

    // Bind keyboard shortcuts
    this.bindKeyboardShortcuts();

    // Load searchable data
    this.loadSearchData();
  }

  createSearchUI() {
    const searchHTML = `
      <div id="globalSearchOverlay" class="hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] animate-fade-in">
        <div class="fixed inset-x-0 top-20 mx-auto max-w-2xl px-4">
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-down">
            <!-- Search Input -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <i class="fas fa-search text-slate-400"></i>
              <input 
                type="text" 
                id="globalSearchInput"
                placeholder="Search students, teachers, documents... (Ctrl+K)"
                class="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-base font-medium"
                autocomplete="off"
              />
              <kbd class="hidden sm:inline-block px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">ESC</kbd>
            </div>

            <!-- Search Results -->
            <div id="globalSearchResults" class="max-h-96 overflow-y-auto scrollbar-hide">
              <!-- Results will be injected here -->
            </div>

            <!-- Search Footer -->
            <div class="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-4">
                <span><kbd class="kbd-sm">↑↓</kbd> Navigate</span>
                <span><kbd class="kbd-sm">Enter</kbd> Select</span>
                <span><kbd class="kbd-sm">ESC</kbd> Close</span>
              </div>
              <button onclick="globalSearch.clearRecent()" class="hover:text-brand-600 transition-colors font-medium">Clear history</button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .kbd-sm {
          padding: 2px 6px;
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-weight: 600;
        }
        .dark .kbd-sm {
          background: #1e293b;
          border-color: #475569;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    `;

    // Inject into document
    const container = document.createElement('div');
    container.innerHTML = searchHTML;
    document.body.appendChild(container);
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }

      // ESC to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on overlay click
    document.getElementById('globalSearchOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'globalSearchOverlay') {
        this.close();
      }
    });

    // Handle search input
    document.getElementById('globalSearchInput')?.addEventListener('input', (e) => {
      this.performSearch(e.target.value);
    });
  }

  async loadSearchData() {
    // Data is now fetched dynamically via dataService.searchGlobal(query)
    // No need to preload hardcoded data
    this.searchableData = [];
  }

  open() {
    const overlay = document.getElementById('globalSearchOverlay');
    const input = document.getElementById('globalSearchInput');

    if (overlay && input) {
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      this.isOpen = true;

      // Focus input
      setTimeout(() => input.focus(), 100);

      // Show recent searches if no query
      if (!input.value.trim()) {
        this.showRecentSearches();
      }
    }
  }

  close() {
    const overlay = document.getElementById('globalSearchOverlay');
    const input = document.getElementById('globalSearchInput');

    if (overlay && input) {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      this.isOpen = false;
      input.value = '';
    }
  }

  async performSearch(query) {
    if (!query || query.length < 2) {
      this.showRecentSearches();
      return;
    }

    // Use DataService to fetch real results
    this.setLoading(true);
    try {
      const response = await dataService.searchGlobal(query);
      if (response.success) {
        this.displayResults(response.data, query);
      } else {
        this.displayResults([], query);
      }
    } catch (e) {
      console.error(e);
      this.displayResults([], query);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (loading && resultsContainer) {
      resultsContainer.innerHTML = '<div class="p-4 text-center"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    }
  }

  // fuzzySearch removed as it's now handled by dataService/Server


  displayResults(results, query = '') {
    const resultsContainer = document.getElementById('globalSearchResults');

    if (!resultsContainer) return;

    if (results.length === 0 && query) {
      resultsContainer.innerHTML = `
        <div class="p-8 text-center text-slate-500 dark:text-slate-400">
          <i class="fas fa-search text-4xl mb-3 opacity-20"></i>
          <p class="font-medium">No results found for "${query}"</p>
          <p class="text-sm mt-1">Try different keywords</p>
        </div>
      `;
      return;
    }

    const typeColors = {
      student: 'blue',
      teacher: 'purple',
      document: 'yellow',
      page: 'green'
    };

    const resultHTML = results.map(result => {
      const color = typeColors[result.type] || 'gray';
      return `
        <a href="${result.url}" onclick="globalSearch.saveToRecent(event, '${result.id}', '${result.name}', '${result.type}')" 
           class="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400 shrink-0">
            <i class="fas ${result.icon}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              ${this.highlightQuery(result.name, query)}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
              ${result.class || result.department || result.category || result.description || ''}
            </p>
          </div>
          <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ${result.type}
          </span>
        </a>
      `;
    }).join('');

    resultsContainer.innerHTML = resultHTML;
  }

  highlightQuery(text, query) {
    if (!query) return text;
    // Use safe regex escaping
    const escapedQuery = typeof Utils !== 'undefined' ? Utils.escapeRegExp(query) : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white px-1 rounded">$1</mark>');
  }

  showRecentSearches() {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    if (this.recentSearches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-8 text-center text-slate-500 dark:text-slate-400">
          <i class="fas fa-clock-rotate-left text-4xl mb-3 opacity-20"></i>
          <p class="font-medium">No recent searches</p>
          <p class="text-sm mt-1">Start typing to search</p>
        </div>
      `;
      return;
    }

    const recentHTML = `
      <div class="p-3 text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Recent Searches</div>
      ${this.recentSearches.map(item => `
        <a href="${item.url}" 
           class="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer group">
          <i class="fas fa-clock-rotate-left text-slate-400 w-10 text-center"></i>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-slate-900 dark:text-white truncate">${item.name}</p>
          </div>
          <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ${item.type}
          </span>
        </a>
      `).join('')}
    `;

    resultsContainer.innerHTML = recentHTML;
  }

  saveToRecent(event, id, name, type) {
    // Prevent default navigation if needed or capture URL safely
    let url = '#';
    if (event && event.currentTarget) {
      url = event.currentTarget.href;
    } else if (event && event.target) {
      url = event.target.closest('a').href;
    }

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(item => item.id !== id);

    // Add to beginning
    this.recentSearches.unshift({ id, name, type, url });

    // Keep only max recent
    this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);

    // Save to sessionStorage
    sessionStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  loadRecentSearches() {
    try {
      const saved = sessionStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  clearRecent() {
    this.recentSearches = [];
    sessionStorage.removeItem('recentSearches');
    this.showRecentSearches();
  }
}

// Initialize global search when DOM is ready
let globalSearch;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    globalSearch = new GlobalSearch();
  });
} else {
  globalSearch = new GlobalSearch();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalSearch;
}
