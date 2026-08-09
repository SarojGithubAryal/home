import apiClient from '../../services/apiClient';

const MEDIA_ENDPOINT = '/api/admin/media';
const CONTENT_ENDPOINT = '/api/admin/content';

/**
 * Upload a single file and return the created media object.
 * Uses raw fetch because the body is multipart/form-data.
 */
export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(MEDIA_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error?.error?.message ||
      error?.message ||
      `Upload failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  const envelope = await response.json();
  if (!envelope.success) {
    throw new Error(envelope?.error?.message || 'Upload failed');
  }
  return envelope.data.media;   // { id, url, ... }
}

/**
 * Create a new content item.
 * The payload must include room_id and content_type_id as UUIDs.
 */
export async function createContent(payload) {
  const envelope = await apiClient.post(CONTENT_ENDPOINT, payload);
  if (!envelope.success) {
    throw new Error(envelope?.error?.message || 'Failed to create content');
  }
  return envelope.data.content;
}

/**
 * Update an existing content item.
 */
export async function updateContent(id, payload) {
  const envelope = await apiClient.patch(`${CONTENT_ENDPOINT}/${id}`, payload);
  if (!envelope.success) {
    throw new Error(envelope?.error?.message || 'Failed to update content');
  }
  return envelope.data.content;
}

/**
 * Delete a content item and all associated media.
 */
export async function deleteContent(id) {
  const envelope = await apiClient.del(`${CONTENT_ENDPOINT}/${id}`);
  if (!envelope.success) {
    throw new Error(envelope?.error?.message || 'Failed to delete content');
  }
  return true;
}

/**
 * Delete a single media item (also removes the Dropbox file).
 */
export async function deleteMedia(mediaId) {
  const envelope = await apiClient.del(`${MEDIA_ENDPOINT}/${mediaId}`);
  if (!envelope.success) {
    throw new Error(envelope?.error?.message || 'Failed to delete media');
  }
  return true;
}