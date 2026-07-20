/**
 * moodLandingService.js
 *
 * Owns API communication for the Mood Landing Experience — the screen
 * shown after a mood is selected (hero + destination list), per the
 * reference image for this phase.
 *
 * *** ENDPOINT NOT CONFIRMED ***
 * 06_API_CONTRACTS.md documents GET /api/moods and POST /api/moods/select
 * (which returns "the next recommended experience") but does not document
 * a dedicated Mood Landing endpoint. The path below is a placeholder built
 * to match the existing Room Experience URL pattern
 * (/api/rooms/:roomSlug -> /api/moods/:moodSlug/landing) and MUST be
 * verified against the real backend before this is treated as final.
 * This is flagged the same way uncertain field paths are flagged
 * throughout HomePage.jsx — via getPath() fallbacks, never silent
 * assumption.
 *
 * This service does not reshape backend payloads beyond unwrapping the
 * standard envelope. It contains no fetch logic (see apiClient.js) and
 * no asset resolution logic (see AssetRegistry.js).
 */

import apiClient, { unwrap } from './apiClient';
import { API_BASE_URL, ERROR_CODES } from '../utils/constants';

/**
 * UNCONFIRMED endpoint builder — see file header. Kept local to this
 * service (rather than added to the shared API_ENDPOINTS registry in
 * constants.js) specifically because it is unverified; promote it to
 * constants.js once confirmed against the real backend contract.
 */
function buildMoodLandingEndpoint(moodSlug) {
  return `${API_BASE_URL}/moods/${moodSlug}/landing`;
}

/**
 * Fetches the complete Mood Landing Experience for a given mood.
 *
 * @param {string} moodSlug - the selected mood's identifier
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

  const envelope = await apiClient.get(buildMoodLandingEndpoint(moodSlug), {
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