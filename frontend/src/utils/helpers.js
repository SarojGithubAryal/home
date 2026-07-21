/**
 * helpers.js
 *
 * Generic, pure utility functions used across the frontend.
 *
 * This file contains NO API logic (see apiClient.js), NO asset resolution
 * logic (see AssetRegistry.js), and NO business/domain logic. Every function
 * here is a stateless, side-effect-free utility that operates purely on the
 * arguments it receives.
 *
 * If a function needs to know about endpoints, response envelopes, semantic
 * identifiers, or room/mood/user concepts, it does not belong in this file.
 */

// ---------------------------------------------------------------------------
// Object / value safety
// ---------------------------------------------------------------------------

/**
 * Safely reads a nested value from an object using a dot-notation path,
 * without throwing if an intermediate key is missing.
 *
 * Used by services/hooks when reading fields out of backend response data,
 * since response shapes should never cause a hard crash if a field is
 * temporarily absent (e.g. during backend rollout of a new field).
 *
 * @example
 * getPath({ a: { b: 1 } }, 'a.b', 0); // 1
 * getPath({ a: {} }, 'a.b', 0);       // 0
 */
export function getPath(source, path, fallback = undefined) {
  if (!source || typeof path !== 'string') return fallback;

  const segments = path.split('.');
  let current = source;

  for (const segment of segments) {
    if (current === null || current === undefined) return fallback;
    current = current[segment];
  }

  return current === undefined ? fallback : current;
}

/**
 * Returns true if a value is null, undefined, an empty string, an empty
 * array, or an empty plain object. Used by EmptyState-driven UI logic in
 * hooks to decide whether fetched data should be treated as "no content."
 */
export function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ---------------------------------------------------------------------------
// Class name composition
// ---------------------------------------------------------------------------

/**
 * Joins conditional class names into a single string, skipping any falsy
 * values. Keeps components free of manual template-string concatenation
 * for conditional CSS classes.
 *
 * @example
 * classNames('card', isActive && 'card--active', null, 'card--large');
 * // 'card card--active card--large'
 */
export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Async control flow
// ---------------------------------------------------------------------------

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Used sparingly (e.g. debouncing user-triggered requests), never for
 * simulating network latency in production code paths.
 */
export function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Returns a debounced version of a function: repeated calls within `wait`
 * milliseconds collapse into a single call after the last invocation.
 * Used by hooks that respond to rapid user input (e.g. search fields)
 * before triggering a service call.
 */
export function debounce(fn, wait = 300) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string (as returned by the backend) into a short,
 * human-readable relative-or-absolute label. Falls back to the raw value
 * if parsing fails, rather than throwing.
 *
 * This is pure display formatting only — it does not decide *what* date
 * to show (that is backend/content-driven), only *how* to format it.
 */
export function formatDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

/**
 * Generates a reasonably unique id for client-only purposes (e.g. React
 * keys for optimistic UI state). Never used for anything that must match
 * or be sent to the backend — the backend is the sole authority on
 * persisted identifiers.
 */
export function generateClientId(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Builds a URL query string from an object of optional parameters.
 * Returns an empty string if no truthy keys are found.
 *
 * @param {object} params - key/value pairs (values may be undefined/null)
 * @returns {string}
 */
export function buildListQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}