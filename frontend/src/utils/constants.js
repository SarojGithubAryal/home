/**
 * constants.js
 *
 * Single source of truth for API constants and generic application constants.
 *
 *  - API base URL and endpoint paths (per 06_API_CONTRACTS.md — no endpoint
 *    exists here unless it is defined in that document / confirmed by backend)
 *  - Standard response envelope keys
 *  - Standard error codes (per 06_API_CONTRACTS.md "ERROR CODES")
 *  - HTTP methods
 *
 * This file owns NO semantic/asset vocabulary. Per 08_ASSET_ARCHITECTURE.md,
 * the backend owns semantic identifiers (theme variants, paper styles,
 * decorations, etc.) and sends them as plain strings in API responses.
 * AssetRegistry.js resolves whatever string arrives, with fallback behavior,
 * rather than validating it against a predefined frontend enum.
 *
 * No component, hook, or service should hardcode a URL string or error code
 * anywhere else in the codebase. Import from here instead.
 */

// ---------------------------------------------------------------------------
// API base
// ---------------------------------------------------------------------------

export const API_BASE_URL = '/api';

// ---------------------------------------------------------------------------
// API endpoints
// Exactly as defined in 06_API_CONTRACTS.md. Static paths are strings;
// dynamic paths are functions that accept the required identifier(s).
//
// NOTE: /api/user/* paths below assume they mirror the /api/me/* structure
// documented in 06_API_CONTRACTS.md (base, /settings, /favorites,
// /bookmarks) with only the root segment renamed. Confirm against the
// actual backend if any of these four sub-paths differ.
// ---------------------------------------------------------------------------

export const API_ENDPOINTS = {
  HOME: `${API_BASE_URL}/home`,

  MOODS: `${API_BASE_URL}/moods`,
  MOODS_SELECT: `${API_BASE_URL}/moods/select`,
  // Confirmed per Backend API v1.0 (final): returns the Mood Landing page.
  MOOD_LANDING: (moodSlug) => `${API_BASE_URL}/moods/${moodSlug}`,

  ROOM: (roomSlug) => `${API_BASE_URL}/rooms/${roomSlug}`,
  ROOM_HEAR: (roomSlug) => `${API_BASE_URL}/rooms/${roomSlug}/hear`,
  ROOM_READ: (roomSlug) => `${API_BASE_URL}/rooms/${roomSlug}/read`,
  ROOM_SEE: (roomSlug) => `${API_BASE_URL}/rooms/${roomSlug}/see`,
  ROOM_MEMORY: (roomSlug) => `${API_BASE_URL}/rooms/${roomSlug}/memory`,

  USER: `${API_BASE_URL}/user`,
  USER_SETTINGS: `${API_BASE_URL}/user/settings`,
  USER_FAVORITES: `${API_BASE_URL}/user/favorites`,
  USER_BOOKMARKS: `${API_BASE_URL}/user/bookmarks`,

  // Universal content detail endpoint, per Backend API v1.0 (frozen).
  // Replaces the previously-guessed per-room content endpoint.
  CONTENT: (contentId) => `${API_BASE_URL}/contents/${contentId}`,
};

// ---------------------------------------------------------------------------
// Standard response envelope
// Per 06_API_CONTRACTS.md — every response has exactly this shape.
// ---------------------------------------------------------------------------

export const RESPONSE_KEYS = {
  SUCCESS: 'success',
  DATA: 'data',
  ERROR: 'error',
};

// ---------------------------------------------------------------------------
// Standard error codes
// Per 06_API_CONTRACTS.md "ERROR CODES" section.
// ---------------------------------------------------------------------------

export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_REQUEST: 'INVALID_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  // Frontend-only addition: used when apiClient cannot reach the network
  // at all (e.g. offline, request never reached the server). Not part of
  // the backend contract — never sent by the backend, only ever produced
  // locally by apiClient.js.
  NETWORK_ERROR: 'NETWORK_ERROR',
};

// ---------------------------------------------------------------------------
// Room experience types
// Mirrors the four documented room sub-experience endpoints
// (/api/rooms/:roomSlug/hear|read|see|memory) per 06_API_CONTRACTS.md.
// This is a URL-routing concern, not asset/semantic vocabulary, so it
// stays here rather than in AssetRegistry.js.
// ---------------------------------------------------------------------------

export const ROOM_EXPERIENCE_TYPES = {
  HEAR: 'hear',
  READ: 'read',
  SEE: 'see',
  MEMORY: 'memory',
};

// ---------------------------------------------------------------------------
// HTTP methods (used by apiClient.js)
// ---------------------------------------------------------------------------

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};