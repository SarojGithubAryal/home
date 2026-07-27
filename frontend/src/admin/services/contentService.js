/**
 * contentService.js
 *
 * Communicates with GET /api/admin/content.
 * Accepts all possible filter parameters — only truthy values are sent.
 */

const API_BASE = '/api/admin';

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

  const res = await fetch(`${API_BASE}/content?${params.toString()}`, { signal });

  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Unknown error');
  }

  return json.data; // { items, pagination, filters }
}

export default { fetchContent };