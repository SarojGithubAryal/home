/**
 * experienceService.js
 *
 * Owns all API communication for the Experience page.
 * Uses the shared apiClient + ADMIN_API_BASE, same as dashboardService.
 */

import apiClient, { unwrap } from '../../services/apiClient';
import { ADMIN_API_BASE } from '../config/adminConfig';

/**
 * GET /admin/experience
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function getExperience(options = {}) {
  const envelope = await apiClient.get(`${ADMIN_API_BASE}/experience`, {
    signal: options.signal,
  });

  if (envelope.success) {
    return { success: true, data: unwrap(envelope, {}), error: null };
  }
  return {
    success: false,
    data: null,
    error: envelope.error || { code: 'UNKNOWN_ERROR', message: 'Unable to load experience configuration.' },
  };
}

/**
 * PATCH /admin/experience
 * @param {object} payload - can contain greetings, quotes, homeConfig, recommendationRules, dailyMessages
 */
export async function updateExperience(payload) {
  const envelope = await apiClient.patch(`${ADMIN_API_BASE}/experience`, payload);

  if (envelope.success) {
    return { success: true, data: unwrap(envelope, {}), error: null };
  }
  return {
    success: false,
    data: null,
    error: envelope.error || { code: 'UNKNOWN_ERROR', message: 'Failed to update experience configuration.' },
  };
}

const experienceService = { getExperience, updateExperience };
export default experienceService;