/**
 * moodService.js
 *
 * Owns all API communication for the Mood Experience.
 *
 * Per 06_API_CONTRACTS.md:
 *   GET  /api/moods         -> Returns all available moods.
 *   POST /api/moods/select  -> Stores the selected mood and returns the
 *                              next recommended experience.
 *
 * This service does not reshape backend payloads beyond unwrapping the
 * standard envelope. The backend owns the Mood Experience shape entirely.
 *
 * This service contains no fetch logic (see apiClient.js) and no asset
 * resolution logic (see AssetRegistry.js).
 *
 * No mock/placeholder data is included here. The backend (v1.0) is
 * complete and frozen, so this service calls it directly.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';
import { getPath } from '../utils/helpers';

/**
 * Fetches all available moods.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{
 *   success: boolean,
 *   data: object|null,
 *   error: { code: string, message: string }|null
 * }>}
 */
export async function getMoods(options = {}) {
  const envelope = await apiClient.get(API_ENDPOINTS.MOODS, { signal: options.signal });

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
      message: 'Unable to load moods.',
    },
  };
}

/**
 * Submits the user's selected mood and receives the next recommended
 * experience in return.
 *
 * @param {object} moodSelection - payload identifying the selected mood,
 *   shaped exactly as the backend expects (this service does not alter
 *   or validate its structure — validation is a backend responsibility
 *   per 06_API_CONTRACTS.md "API RESPONSIBILITIES").
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{
 *   success: boolean,
 *   data: object|null,
 *   error: { code: string, message: string }|null
 * }>}
 */
export async function selectMood(moodSelection, options = {}) {
  const envelope = await apiClient.post(API_ENDPOINTS.MOODS_SELECT, moodSelection, {
    signal: options.signal,
  });

  if (envelope.success) {
    return {
      success: true,
      data: unwrap(envelope, null),
      // Per Backend API v1.0: POST /api/moods/select returns a
      // navigation object (to MOOD_LANDING). Surfaced here so the hook
      // and page can forward it to App.jsx's handleNavigation, instead
      // of the page inventing its own destination.
      navigation: getPath(envelope, 'navigation', null),
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    navigation: null,
    error: envelope.error || {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: 'Unable to save your mood selection.',
    },
  };
}
const moodService = { getMoods, selectMood };

export default moodService;