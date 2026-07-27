/**
 * dashboardService.js
 *
 * Owns API communication for GET /admin/dashboard, per the frozen
 * backend contract. Reuses the existing shared apiClient — no separate
 * admin API client. Endpoint URL built from adminConfig's ADMIN_API_BASE
 * (VITE_API_URL + '/admin'), not the user app's relative API_ENDPOINTS
 * registry, since the admin backend contract requires an absolute
 * VITE_API_URL base.
 */

import apiClient, { unwrap } from '../../services/apiClient';
import { ADMIN_API_BASE } from '../config/adminConfig';
import { ERROR_CODES } from '../../utils/constants';

/**
 * Fetches the Dashboard summary.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{success: boolean, data: object|null, error: object|null}>}
 */
export async function getDashboard(options = {}) {
  const envelope = await apiClient.get(`${ADMIN_API_BASE}/dashboard`, {
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
      message: 'Unable to load dashboard.',
    },
  };
}

const dashboardService = { getDashboard };
export default dashboardService;