/**
 * adminHelpers.js
 *
 * Small, pure formatting utilities specific to admin views. No
 * business logic, no data fetching — matches the same "pure helpers
 * only" role as the user app's utils/helpers.js.
 */

export function formatAdminDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Time-of-day salutation computed from the real client clock — this is
 * UI chrome (like "Good morning"), not fabricated business data. No
 * username or personalization is invented; nothing here claims to come
 * from the backend.
 */
export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatAdminTime(date = new Date()) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatAdminDateLong(date = new Date()) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}