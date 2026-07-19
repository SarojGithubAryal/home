/**
 * roomService.js
 *
 * Owns all API communication for the Room Experience and its
 * sub-experiences.
 *
 * Per 06_API_CONTRACTS.md:
 *   GET /api/rooms/:roomSlug          -> Room Experience
 *     Includes: Room information, Hero, Quote, Recommendation, Actions,
 *     Footer, Theme.
 *   GET /api/rooms/:roomSlug/hear     -> Hear Experience
 *     Includes: Audio list, Currently playing, Recommendation, Theme.
 *   GET /api/rooms/:roomSlug/read     -> Read Experience
 *     Includes: Letters, Notes, Quotes, Theme.
 *   GET /api/rooms/:roomSlug/see      -> See Experience
 *     Includes: Photos, Albums, Recommendation, Theme.
 *   GET /api/rooms/:roomSlug/memory   -> Memory Experience
 *     Includes: Timeline, Memories, Recommendation, Theme.
 *
 * This service does not reshape backend payloads beyond unwrapping the
 * standard envelope. The backend owns every Experience shape entirely.
 *
 * This service contains no fetch logic (see apiClient.js) and no asset
 * resolution logic (see AssetRegistry.js) — roomSlug is a routing/identity
 * concern, not an asset concern, so it is passed straight through to the
 * endpoint builders in constants.js.
 *
 * No mock/placeholder data is included here. The backend (v1.0) is
 * complete and frozen, so this service calls it directly.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';

/**
 * Builds a standard failure result when roomSlug is missing, without
 * making a network call. Every exported function below requires a
 * roomSlug, since every documented Room endpoint is scoped to one.
 */
function missingRoomSlugResult() {
  return {
    success: false,
    data: null,
    error: {
      code: ERROR_CODES.INVALID_REQUEST,
      message: 'A room identifier is required.',
    },
  };
}

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
 * Fetches the complete Room Experience for a given room.
 *
 * @param {string} roomSlug - e.g. "mom", "dad"
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getRoomExperience(roomSlug, options = {}) {
  if (!roomSlug) return missingRoomSlugResult();

  const envelope = await apiClient.get(API_ENDPOINTS.ROOM(roomSlug), {
    signal: options.signal,
  });

  return toResult(envelope, 'Unable to load this room.');
}

/**
 * Fetches the Hear Experience for a given room.
 *
 * @param {string} roomSlug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getHearExperience(roomSlug, options = {}) {
  if (!roomSlug) return missingRoomSlugResult();

  const envelope = await apiClient.get(API_ENDPOINTS.ROOM_HEAR(roomSlug), {
    signal: options.signal,
  });

  return toResult(envelope, 'Unable to load audio for this room.');
}

/**
 * Fetches the Read Experience for a given room.
 *
 * @param {string} roomSlug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getReadExperience(roomSlug, options = {}) {
  if (!roomSlug) return missingRoomSlugResult();

  const envelope = await apiClient.get(API_ENDPOINTS.ROOM_READ(roomSlug), {
    signal: options.signal,
  });

  return toResult(envelope, 'Unable to load reading content for this room.');
}

/**
 * Fetches the See Experience for a given room.
 *
 * @param {string} roomSlug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getSeeExperience(roomSlug, options = {}) {
  if (!roomSlug) return missingRoomSlugResult();

  const envelope = await apiClient.get(API_ENDPOINTS.ROOM_SEE(roomSlug), {
    signal: options.signal,
  });

  return toResult(envelope, 'Unable to load the gallery for this room.');
}

/**
 * Fetches the Memory Experience for a given room.
 *
 * @param {string} roomSlug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getMemoryExperience(roomSlug, options = {}) {
  if (!roomSlug) return missingRoomSlugResult();

  const envelope = await apiClient.get(API_ENDPOINTS.ROOM_MEMORY(roomSlug), {
    signal: options.signal,
  });

  return toResult(envelope, 'Unable to load memories for this room.');
}

const roomService = {
  getRoomExperience,
  getHearExperience,
  getReadExperience,
  getSeeExperience,
  getMemoryExperience,
};

export default roomService;