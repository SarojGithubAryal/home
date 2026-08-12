/**
 * uploadService.js – Media operations only
 * Real Admin Backend integration for file uploads.
 * Uses the frozen backend API contract.
 */

import apiClient from '../../services/apiClient';

const ADMIN_API_BASE = '/api/admin';

/**
 * Upload a single file to Dropbox via the Admin Backend.
 */
export const uploadMedia = async (file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${ADMIN_API_BASE}/media`, {
    method: 'POST',
    body: formData,
    signal,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error?.message || 'Media upload failed');
  }
  return result;
};

/**
 * Replace an existing media file (keeps the same media ID).
 */
export const replaceMedia = async (id, file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${ADMIN_API_BASE}/media/${id}`, {
    method: 'PATCH',
    body: formData,
    signal,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error?.message || 'Media replacement failed');
  }
  return result;
};

/**
 * Delete a single media file (Dropbox + DB).
 */
export const deleteMedia = async (id, signal) => {
  const response = await apiClient.del(`${ADMIN_API_BASE}/media/${id}`, { signal });
  return response;
};