/**
 * useHear.js
 *
 * Owns all state for the Hear Experience (GET /api/rooms/:roomSlug/hear).
 * Mirrors useMoodLanding.js's structure: AbortController-guarded fetch
 * lifecycle, flat {data, loading, error} return shape. Reuses the
 * existing roomService.getHearExperience() — no new service file.
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import roomService from '../services/roomService';

/**
 * @param {string} roomSlug
 * @param {{ tabId?: string, search?: string, page?: number, limit?: number }} [listOptions]
 * @returns {{
 *   data: object|null,
 *   loading: boolean,
 *   error: {code: string, message: string}|null,
 *   refetch: () => void
 * }}
 */
export function useHear(roomSlug, listOptions = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomSlug));
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const { tabId, search, page, limit } = listOptions;

  const fetchHear = useCallback(async () => {
    if (!roomSlug) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await roomService.getHearExperience(roomSlug, {
      tabId,
      search,
      page,
      limit,
      signal: controller.signal,
    });

    if (abortControllerRef.current !== controller) return;

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error);
    }

    setLoading(false);
  }, [roomSlug, tabId, search, page, limit]);

  useEffect(() => {
    fetchHear();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchHear]);

  return {
    data,
    loading,
    error,
    refetch: fetchHear,
  };
}

export default useHear;