// useRead.js
import { useCallback, useEffect, useRef, useState } from 'react';
import roomService from '../services/roomService';

export function useRead(roomSlug, listOptions = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomSlug));
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const { tabId, search, page, limit } = listOptions;

  const fetchRead = useCallback(async () => {
    if (!roomSlug) {
      setData(null); setLoading(false); setError(null); return;
    }
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true); setError(null);

    const result = await roomService.getReadExperience(roomSlug, {
      tabId, search, page, limit, signal: controller.signal,
    });
    if (abortControllerRef.current !== controller) return;

    if (result.success) { setData(result.data); setError(null); }
    else { setData(null); setError(result.error); }
    setLoading(false);
  }, [roomSlug, tabId, search, page, limit]);

  useEffect(() => {
    fetchRead();
    return () => abortControllerRef.current?.abort();
  }, [fetchRead]);

  return { data, loading, error, refetch: fetchRead };
}

export default useRead;