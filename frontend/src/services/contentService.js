/**
 * contentService.js
 *
 * Owns API communication for the universal content detail endpoint.
 *
 * Per Backend API v1.0 (frozen):
 *   GET /api/contents/:contentId
 *
 * This REPLACES the previous temporary, room-scoped, guessed endpoint
 * (GET /api/rooms/:roomSlug/content/:contentSlug). Content is no longer
 * room-scoped for fetching purposes — a single contentId is sufficient,
 * consistent with the "Navigation Rules" section of the frozen contract
 * ("Navigation only carries identifiers... Content: contentId").
 *
 * Response shape (per frozen contract):
 *   data.content: { title, body, excerpt, author, metadata, media,
 *                    content_type, navigation }
 *   data.theme, data.greeting, data.metadata (envelope-level, standard
 *   Experience fields, same pattern as every other endpoint).
 *
 * This service does not reshape the response beyond unwrapping the
 * standard envelope.
 */

import apiClient, { unwrap } from './apiClient';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants';
import { getPath } from '../utils/helpers';

/**
 * Fetches a single content item's full detail.
 *
 * @param {string} contentId
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, navigation: object|null, error: object|null}>}
 */
export async function getContentDetail(contentId, options = {}) {
  if (!contentId) {
    return {
      success: false,
      data: null,
      navigation: null,
      error: { code: ERROR_CODES.INVALID_REQUEST, message: 'A content identifier is required.' },
    };
  }

  const envelope = await apiClient.get(API_ENDPOINTS.CONTENT(contentId), {
    signal: options.signal,
  });

  if (envelope.success) {
    return {
      success: true,
      data: unwrap(envelope, null),
      navigation: getPath(envelope, 'navigation', null),
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    navigation: null,
    error: envelope.error || { code: ERROR_CODES.UNKNOWN_ERROR, message: 'Unable to load this content.' },
  };
}

const contentService = { getContentDetail };
export default contentService;