/**
 * useMemory.js
 *
 * Owns all state for the Memory Experience (GET /api/rooms/:roomSlug/memory).
 * Structured identically to useHear/useRead/useSee.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import roomService from '../services/roomService';

export function useMemory(roomSlug, listOptions = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomSlug));
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const { tabId, search, page, limit } = listOptions;

  const fetchMemory = useCallback(async () => {
    if (!roomSlug) {
      setData(null); setLoading(false); setError(null); return;
    }
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true); setError(null);

    const result = await roomService.getMemoryExperience(roomSlug, {
      tabId, search, page, limit, signal: controller.signal,
    });
    if (abortControllerRef.current !== controller) return;

    if (result.success) { setData(result.data); setError(null); }
    else { setData(null); setError(result.error); }
    setLoading(false);
  }, [roomSlug, tabId, search, page, limit]);

  useEffect(() => {
    fetchMemory();
    return () => abortControllerRef.current?.abort();
  }, [fetchMemory]);

  return { data, loading, error, refetch: fetchMemory };
}

export default useMemory;