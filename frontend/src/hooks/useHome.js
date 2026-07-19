/**
 * useHome.js
 *
 * Owns all state for the Home Experience: loading, data, error.
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 *
 * This hook is the only place Home-page fetching state lives. The Home
 * page component itself should only call this hook and render based on
 * the values it returns — it must never call homeService or apiClient
 * directly.
 *
 * This hook does not resolve assets. It returns the raw theme/asset
 * identifiers exactly as the backend sent them; resolving those into
 * actual paths via AssetRegistry is left to the components that render
 * them (e.g. Hero.jsx), keeping this hook's responsibility limited to
 * data + request lifecycle only.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import homeService from '../services/homeService';

/**
 * @returns {{
 *   data: object|null,
 *   loading: boolean,
 *   error: {code: string, message: string}|null,
 *   refetch: () => void
 * }}
 */
export function useHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks the AbortController for the in-flight request so it can be
  // cancelled if the component unmounts or a refetch is triggered before
  // the previous request resolves.
  const abortControllerRef = useRef(null);

  const fetchHome = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await homeService.getHomeExperience({ signal: controller.signal });

    // If this request was superseded by a newer one, ignore its result.
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
    fetchHome();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchHome]);

  return {
    data,
    loading,
    error,
    refetch: fetchHome,
  };
}

export default useHome;