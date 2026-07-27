/**
 * settingsService.js
 *
 * Owns all API communication for the Settings page.
 * Uses the shared apiClient + ADMIN_API_BASE — same established
 * pattern as dashboardService.js and experienceService.js.
 */

import apiClient, { unwrap } from '../../services/apiClient';
import { ADMIN_API_BASE } from '../config/adminConfig';

/**
 * GET /admin/settings
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function getSettings(options = {}) {
  const envelope = await apiClient.get(`${ADMIN_API_BASE}/settings`, {
    signal: options.signal,
  });

  if (envelope.success) {
    return { success: true, data: unwrap(envelope, {}), error: null };
  }
  return {
    success: false,
    data: null,
    error: envelope.error || { code: 'UNKNOWN_ERROR', message: 'Unable to load settings.' },
  };
}

/**
 * PATCH /admin/settings
 * @param {object} payload - any subset of: language, theme_preference,
 *   notification_enabled, auto_play_audio, privacy_level
 */
export async function updateSettings(payload) {
  const envelope = await apiClient.patch(`${ADMIN_API_BASE}/settings`, payload);

  if (envelope.success) {
    return { success: true, data: unwrap(envelope, {}), error: null };
  }
  return {
    success: false,
    data: null,
    error: envelope.error || { code: 'UNKNOWN_ERROR', message: 'Failed to update settings.' },
  };
}

const settingsService = { getSettings, updateSettings };
export default settingsService;