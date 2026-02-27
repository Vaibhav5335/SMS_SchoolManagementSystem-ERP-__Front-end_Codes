// -------------------------
// 1. Theme Management
// -------------------------
('Theme manager loading...');

window.toggleDarkMode = function () {
  ('Global toggleDarkMode function called');
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');

  // Update the icon immediately
  updateThemeIcon(isDark);

  // Save the user's preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  ('Theme toggled to:', isDark ? 'dark' : 'light');
  return isDark;
}

function updateThemeIcon(isDark) {
  const btn = document.querySelector('button[onclick="toggleDarkMode()"]');
  if (btn) {
    // Simple logic: If dark, show Sun. If light, show Moon.
    // Note: In the HTML, we have two <i> tags with 'hidden' classes 
    // relying on the parent 'dark' class, so CSS handles the icon switch automatically.
    // But if you want to force specific logic:
    // btn.innerHTML = isDark ? '<i class="fas fa-sun text-amber-400"></i>' : '<i class="fas fa-moon"></i>';
    ('Theme icon updated');
  }
}

// ✅ INIT THEME: FORCE LIGHT DEFAULT
// Logic: Always start with light theme unless user explicitly saved 'dark'
// This ensures all users see light theme first, then can switch if desired
document.addEventListener('DOMContentLoaded', function () {
  ('DOM loaded, initializing theme...');
  // Check if user has explicitly saved a dark theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    ('Loading user-preferred dark theme');
  } else {
    // Default to light theme (remove dark class if present)
    document.documentElement.classList.remove('dark');
    // Explicitly save light theme preference for consistency
    localStorage.setItem('theme', 'light');
    ('Loading default light theme');
  }
});

// Also initialize theme immediately if DOM is already loaded
if (document.readyState === 'loading') {
  ('DOM still loading, will initialize via event listener');
} else {
  ('DOM already loaded, initializing theme now');
  // DOM is already loaded, initialize now
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

('Theme manager loaded, window.toggleDarkMode exists:', typeof window.toggleDarkMode === 'function');