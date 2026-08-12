/**
 * contentService.js
 *
 * All Admin Content API calls: list, create, update, delete.
 * Uses the frozen admin backend contract.
 */

import apiClient from '../../services/apiClient';

const ADMIN_API_BASE = '/api/admin';

/**
 * Fetch content list with filters and pagination.
 */
export async function fetchContent({
  page = 1,
  limit = 10,
  search = '',
  type,
  room,
  mood,
  status,
  sort = 'created_at',
  order = 'desc',
  signal,
} = {}) {
  const params = new URLSearchParams({ page, limit, sort, order });

  if (search) params.set('search', search);
  if (type) params.set('type', type);
  if (room) params.set('room', room);
  if (mood) params.set('mood', mood);
  if (status) params.set('status', status);

  const res = await fetch(`${ADMIN_API_BASE}/content?${params.toString()}`, { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message || 'Unknown error');
  }

  return json.data; // { items, pagination, filters }
}

/**
 * Create a new content item.
 */
export async function createContent(payload, signal) {
  const response = await apiClient.post(`${ADMIN_API_BASE}/content`, payload, { signal });
  return response;
}

/**
 * Update an existing content item.
 */
export async function updateContent(id, payload, signal) {
  const response = await apiClient.patch(`${ADMIN_API_BASE}/content/${id}`, payload, { signal });
  return response;
}

/**
 * Delete a content item and all its media (Dropbox + DB).
 */
export async function deleteContent(id, signal) {
  const response = await apiClient.del(`${ADMIN_API_BASE}/content/${id}`, { signal });
  return response;
}

export default { fetchContent, createContent, updateContent, deleteContent };