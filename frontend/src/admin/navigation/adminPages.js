/**
 * adminPages.js
 *
 * Registry of Admin Panel sections. Mirrors the user app's PAGES
 * pattern (navigation/pages.js) but scoped entirely to admin — no
 * shared state, no cross-import with the user app's navigation.
 *
 * These constants are used by:
 *   - AdminApp.jsx (page switching)
 *   - AdminLayout / bottom navigation (rendering navigation items)
 *   - Any component that needs to reference a page key
 *
 * When adding a new page, add its constant here and update:
 *   - AdminApp.jsx renderPage() switch
 *   - Bottom navigation configuration (if not automated)
 */

export const ADMIN_PAGES = Object.freeze({
  DASHBOARD: 'DASHBOARD',
  CONTENT_LIBRARY: 'CONTENT_LIBRARY',
  UPLOAD_CONTENT: 'UPLOAD_CONTENT',     // Upload Content page – implemented
  EXPERIENCE_SETTINGS: 'EXPERIENCE_SETTINGS', // Experience page – placeholder
  SETTINGS: 'SETTINGS',                 // Settings page – placeholder
});

export default ADMIN_PAGES;