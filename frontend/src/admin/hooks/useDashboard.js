/**
 * useDashboard.js
 *
 * Owns loading/data/error state for the Dashboard, following the exact
 * AbortController-guarded pattern used throughout the user app's hooks
 * (useHome, useRoom, etc.).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import dashboardService from '../services/dashboardService';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchDashboard = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await dashboardService.getDashboard({ signal: controller.signal });
    if (abortControllerRef.current !== controller) return;

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
    return () => abortControllerRef.current?.abort();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}

export default useDashboard;