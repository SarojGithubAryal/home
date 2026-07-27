/**
 * adminEntry.js
 *
 * The single source of truth for the Admin Panel's hidden entry path.
 * No router library — this is a plain pathname check performed once at
 * the application root (main.jsx).
 */

export const ADMIN_ROUTE_PATH = '/kanha';

export function isAdminRoute(pathname = window.location.pathname) {
  return pathname === ADMIN_ROUTE_PATH || pathname.startsWith(`${ADMIN_ROUTE_PATH}/`);
}