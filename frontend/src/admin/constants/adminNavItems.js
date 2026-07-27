/**
 * adminNavItems.js
 *
 * Bottom navigation item definitions, matching the five sections shown
 * across every reference image. Icons are decorative UI chrome
 * (unicode glyphs), same precedent as the user app's IconButton usage
 * — not backend content.
 */

import ADMIN_PAGES from '../navigation/adminPages';

export const ADMIN_NAV_ITEMS = [
  { page: ADMIN_PAGES.DASHBOARD, label: 'Dashboard', icon: '🏠' },
  { page: ADMIN_PAGES.CONTENT_LIBRARY, label: 'Content', icon: '📁' },
  { page: ADMIN_PAGES.UPLOAD_CONTENT, label: 'Upload', icon: '➕' },
  { page: ADMIN_PAGES.EXPERIENCE_SETTINGS, label: 'Experience', icon: '🧭' },
  { page: ADMIN_PAGES.SETTINGS, label: 'Settings', icon: '⚙️' },
];

export default ADMIN_NAV_ITEMS;