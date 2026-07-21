/**
 * useContent.js
 *
 * Owns state for a single content item's full detail, fetched via the
 * universal GET /api/contents/:contentId endpoint (Backend API v1.0).
 * No roomSlug is needed — content is fetched by contentId alone.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import contentService from '../services/contentService';

/**
 * @param {string} contentId
 * @returns {{ data: object|null, loading: boolean, error: object|null, refetch: () => void }}
 */
export function useContent(contentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(contentId));
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchContent = useCallback(async () => {
    if (!contentId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await contentService.getContentDetail(contentId, { signal: controller.signal });

    if (abortControllerRef.current !== controller) return;

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error);
    }
    setLoading(false);
  }, [contentId]);

  useEffect(() => {
    fetchContent();
    return () => abortControllerRef.current?.abort();
  }, [fetchContent]);

  return { data, loading, error, refetch: fetchContent };
}

export default useContent;