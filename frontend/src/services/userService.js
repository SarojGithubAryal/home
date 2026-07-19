/**
 * userService.js
 *
 * Owns all API communication for the User APIs.
 *
 * Per 06_API_CONTRACTS.md "USER APIs" (paths adjusted to the confirmed
 * backend routing of /api/user/* rather than /api/me/*, per project
 * clarification — see API_ENDPOINTS in constants.js):
 *
 *   GET   /api/user/me            -> Returns the current user's profile.
 *   PATCH /api/user/settings   -> Updates the current user's settings.
 *   GET   /api/user/favorites  -> Returns the current user's favorites.
 *   POST  /api/user/bookmarks  -> Creates a bookmark for the current user.
 *
 * This service does not reshape backend payloads beyond unwrapping the
 * standard envelope. The backend owns every User payload shape entirely.
 *
 * This service contains no fetch logic (see apiClient.js) and no asset
 * resolution logic (see AssetRegistry.js).
 *
 * No mock/placeholder data is included here. The backend (v1.0) is
 * complete and frozen, so this service calls it directly.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';

/**
 * Normalizes an apiClient envelope into this service's flat result shape.
 */
function toResult(envelope, fallbackMessage) {
  if (envelope.success) {
    return {
      success: true,
      data: unwrap(envelope, null),
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error: envelope.error || {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: fallbackMessage,
    },
  };
}

/**
 * Fetches the current user's profile.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getCurrentUser(options = {}) {
  const envelope = await apiClient.get(API_ENDPOINTS.USER_ME, { signal: options.signal });
  return toResult(envelope, 'Unable to load your profile.');
}

/**
 * Updates the current user's settings.
 *
 * @param {object} settingsUpdate - payload shaped exactly as the backend
 *   expects; this service does not alter or validate its structure.
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function updateUserSettings(settingsUpdate, options = {}) {
  const envelope = await apiClient.patch(API_ENDPOINTS.USER_SETTINGS, settingsUpdate, {
    signal: options.signal,
  });
  return toResult(envelope, 'Unable to update your settings.');
}

/**
 * Fetches the current user's favorites.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getUserFavorites(options = {}) {
  const envelope = await apiClient.get(API_ENDPOINTS.USER_FAVORITES, {
    signal: options.signal,
  });
  return toResult(envelope, 'Unable to load your favorites.');
}

/**
 * Creates a bookmark for the current user.
 *
 * @param {object} bookmarkPayload - payload shaped exactly as the backend
 *   expects; this service does not alter or validate its structure.
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function createBookmark(bookmarkPayload, options = {}) {
  const envelope = await apiClient.post(API_ENDPOINTS.USER_BOOKMARKS, bookmarkPayload, {
    signal: options.signal,
  });
  return toResult(envelope, 'Unable to save your bookmark.');
}

const userService = {
  getCurrentUser,
  updateUserSettings,
  getUserFavorites,
  createBookmark,
};

export default userService;