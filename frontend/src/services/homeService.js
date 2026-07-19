/**
 * homeService.js
 *
 * Owns all API communication for the Home Experience.
 *
 * Per 06_API_CONTRACTS.md:
 *   GET /api/home
 *   Returns everything required to render the Home page:
 *     Greeting, Hero, Recommended room, Daily message, Footer, Theme.
 *
 * This service does not reshape the backend's Experience payload beyond
 * unwrapping the standard envelope — the backend owns the Home Experience
 * shape entirely (per 02_SYSTEM_PHILOSOPHY.md / 06_API_CONTRACTS.md
 * "RESPONSE OWNERSHIP": neither side should invent additional fields).
 *
 * This service contains no fetch logic (see apiClient.js) and no asset
 * resolution logic (see AssetRegistry.js) — hooks/components pass raw
 * theme/asset identifiers from the returned data into AssetRegistry
 * themselves.
 *
 * No mock/placeholder data is included here. The backend (v1.0) is
 * complete and frozen per project instructions, so this service calls it
 * directly rather than shipping temporary fixtures that would need later
 * removal.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';

/**
 * Fetches the complete Home Experience payload.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{
 *   success: boolean,
 *   data: object|null,
 *   error: { code: string, message: string }|null
 * }>}
 */
export async function getHomeExperience(options = {}) {
  const envelope = await apiClient.get(API_ENDPOINTS.HOME, { signal: options.signal });

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
      message: 'Unable to load the Home experience.',
    },
  };
}

const homeService = { getHomeExperience };

export default homeService;