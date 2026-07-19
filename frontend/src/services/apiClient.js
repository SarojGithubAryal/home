/**
 * apiClient.js
 *
 * The single source of raw HTTP communication with the backend.
 *
 * Responsibilities:
 *  - Build and send fetch requests
 *  - Enforce and parse the standard response envelope:
 *      { success: true,  data:  {...} }
 *      { success: false, error: { code, message } }
 *  - Normalize failures that never reach the envelope (network errors,
 *    non-JSON responses, timeouts) into that same envelope shape, so every
 *    caller downstream (services, hooks, components) only ever deals with
 *    one consistent shape — never a raw fetch Response, never a thrown
 *    exception for expected failure cases.
 *
 * No service file should call fetch() directly. Every service imports and
 * calls apiClient's request functions instead.
 *
 * This file owns NO endpoint paths beyond what it receives as arguments,
 * NO business logic, and NO asset resolution. It is purely transport.
 */

import { RESPONSE_KEYS, ERROR_CODES, HTTP_METHODS } from '../utils/constants';
import { getPath } from '../utils/helpers';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/**
 * Builds a normalized failure envelope. Used both when the backend itself
 * returns { success: false, error }, and when the request fails before a
 * backend response is ever received (network down, invalid JSON, etc).
 */
function buildErrorEnvelope(code, message) {
  return {
    [RESPONSE_KEYS.SUCCESS]: false,
    [RESPONSE_KEYS.ERROR]: {
      code: code || ERROR_CODES.UNKNOWN_ERROR,
      message: message || 'Something went wrong. Please try again.',
    },
  };
}

/**
 * Validates that a parsed JSON body actually matches the documented
 * envelope shape. If the backend ever returns something malformed, this
 * converts it into a SERVER_ERROR envelope rather than letting an
 * unexpected shape propagate into hooks/components.
 */
function isValidEnvelope(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (typeof payload[RESPONSE_KEYS.SUCCESS] !== 'boolean') return false;

  if (payload[RESPONSE_KEYS.SUCCESS] === true) {
    return RESPONSE_KEYS.DATA in payload;
  }

  return RESPONSE_KEYS.ERROR in payload;
}

/**
 * Core request function. All exported helpers below funnel through this.
 *
 * @param {string} url - Full request path (e.g. from API_ENDPOINTS)
 * @param {object} options
 * @param {string} options.method - One of HTTP_METHODS
 * @param {object} [options.body] - Request payload, JSON-serialized
 * @param {object} [options.headers] - Additional/override headers
 * @param {AbortSignal} [options.signal] - For request cancellation
 * @returns {Promise<{success: boolean, data?: any, error?: {code, message}}>}
 */
async function request(url, { method = HTTP_METHODS.GET, body, headers, signal } = {}) {
  let response;

  try {
    response = await fetch(url, {
      method,
      headers: { ...DEFAULT_HEADERS, ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkError) {
    if (networkError?.name === 'AbortError') {
      return buildErrorEnvelope(ERROR_CODES.NETWORK_ERROR, 'Request was cancelled.');
    }
    return buildErrorEnvelope(
      ERROR_CODES.NETWORK_ERROR,
      'Unable to reach the server. Please check your connection.'
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch (parseError) {
    return buildErrorEnvelope(
      ERROR_CODES.SERVER_ERROR,
      'The server returned an unexpected response.'
    );
  }

  if (!isValidEnvelope(payload)) {
    return buildErrorEnvelope(
      ERROR_CODES.SERVER_ERROR,
      'The server response did not match the expected format.'
    );
  }

  if (!response.ok && payload[RESPONSE_KEYS.SUCCESS] !== false) {
    // Defensive fallback: HTTP-level failure but envelope claimed success.
    // Should never happen against a correctly-implemented backend, but we
    // never trust transport status over the envelope's own success flag
    // unless the envelope itself is ambiguous.
    return buildErrorEnvelope(
      ERROR_CODES.SERVER_ERROR,
      'The server reported an error without a valid error envelope.'
    );
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Public request helpers
// ---------------------------------------------------------------------------

/**
 * Performs a GET request.
 * @param {string} url
 * @param {{ signal?: AbortSignal }} [options]
 */
export function get(url, options = {}) {
  return request(url, { method: HTTP_METHODS.GET, signal: options.signal });
}

/**
 * Performs a POST request.
 * @param {string} url
 * @param {object} [body]
 * @param {{ signal?: AbortSignal }} [options]
 */
export function post(url, body, options = {}) {
  return request(url, { method: HTTP_METHODS.POST, body, signal: options.signal });
}

/**
 * Performs a PATCH request.
 * @param {string} url
 * @param {object} [body]
 * @param {{ signal?: AbortSignal }} [options]
 */
export function patch(url, body, options = {}) {
  return request(url, { method: HTTP_METHODS.PATCH, body, signal: options.signal });
}

/**
 * Performs a DELETE request.
 * @param {string} url
 * @param {{ signal?: AbortSignal }} [options]
 */
export function del(url, options = {}) {
  return request(url, { method: HTTP_METHODS.DELETE, signal: options.signal });
}

/**
 * Extracts the data payload from a successful envelope, or returns the
 * provided fallback if the envelope failed. Services use this to unwrap
 * apiClient's response into the raw `data` object before shaping it for
 * hooks — while still preserving the full envelope for error-aware callers
 * that need the error code/message.
 */
export function unwrap(envelope, fallback = null) {
  if (envelope?.[RESPONSE_KEYS.SUCCESS] === true) {
    return getPath(envelope, RESPONSE_KEYS.DATA, fallback);
  }
  return fallback;
}

const apiClient = { get, post, patch, del, unwrap };

export default apiClient;