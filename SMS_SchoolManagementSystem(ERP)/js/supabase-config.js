/**
 * Supabase Configuration
 * Set your Supabase credentials here
 * Get these from: https://supabase.com/dashboard/project/[project-id]/settings/api
 */

const SUPABASE_CONFIG = {
  // Replace with your Supabase URL from the dashboard
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',

  // Replace with your Supabase Anon Key from the dashboard
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY_HERE',

  // Database tables required
  TABLES: {
    STUDENTS: 'students',
    PARENTS: 'parents',
    FEES: 'fees',
    ATTENDANCE: 'attendance',
    EXAMS: 'exams',
    TIMETABLE: 'timetable',
    CHAT_MESSAGES: 'chat_messages',
    DOCUMENTS: 'documents',
    LEAVES: 'leaves',
    COMMUNICATIONS: 'communications'
  },

  // Helper to check if config is valid
  isValid: function () {
    const isDefaultUrl = this.SUPABASE_URL.includes('YOUR_PROJECT_ID') || this.SUPABASE_URL === 'https://YOUR_PROJECT_ID.supabase.co';
    const isDefaultKey = this.SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY') || this.SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE';
    return !isDefaultUrl && !isDefaultKey;
  }
};

// Initialize Supabase Client (loaded from CDN)
// Initialize Supabase Client (loaded from CDN)
window.supabaseClient = null;

if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.isValid()) {
  try {
    window.supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.SUPABASE_URL,
      SUPABASE_CONFIG.SUPABASE_ANON_KEY
    );
  } catch (e) {
    console.error('Supabase initialization failed:', e);
  }
} else {
  console.warn('Supabase not configured or library not loaded. Using mock data mode.');
}
