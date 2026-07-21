/**
 * moodLandingService.js
 *
 * Owns API communication for the Mood Landing Experience.
 *
 * Per Backend API v1.0 (final): GET /api/moods/:moodSlug
 *
 * This endpoint was previously unconfirmed and guessed as
 * /api/moods/:moodSlug/landing. It is now confirmed as
 * /api/moods/:moodSlug directly — updated accordingly.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';

/**
 * Fetches the complete Mood Landing Experience for a given mood.
 *
 * @param {string} moodSlug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getMoodLandingExperience(moodSlug, options = {}) {
  if (!moodSlug) {
    return {
      success: false,
      data: null,
      error: {
        code: ERROR_CODES.INVALID_REQUEST,
        message: 'A mood identifier is required.',
      },
    };
  }

  const envelope = await apiClient.get(API_ENDPOINTS.MOOD_LANDING(moodSlug), {
    signal: options.signal,
  });

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
      message: 'Unable to load this experience.',
    },
  };
}

const moodLandingService = { getMoodLandingExperience };
export default moodLandingService;