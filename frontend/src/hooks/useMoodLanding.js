/**
 * useMoodLanding.js
 *
 * Owns all state for the Mood Landing Experience: loading, data, error.
 * Structured identically to useHome.js — same AbortController-guarded
 * fetch lifecycle, same flat return shape — so this hook is immediately
 * familiar to anyone already extending useHome.js.
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 *
 * This hook does not resolve assets. It returns raw backend data exactly
 * as received; MoodLandingPage resolves any needed asset paths via
 * AssetRegistry itself, keeping this hook decoupled from presentation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import moodLandingService from '../services/moodLandingService';

/**
 * @param {string} moodSlug - the selected mood's identifier. If falsy,
 *   no request is made and the hook returns its idle state.
 * @returns {{
 *   data: object|null,
 *   loading: boolean,
 *   error: {code: string, message: string}|null,
 *   refetch: () => void
 * }}
 */
export function useMoodLanding(moodSlug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(moodSlug));
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchMoodLanding = useCallback(async () => {
    if (!moodSlug) {
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

    const result = await moodLandingService.getMoodLandingExperience(moodSlug, {
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
  }, [moodSlug]);

  useEffect(() => {
    fetchMoodLanding();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMoodLanding]);

  return {
    data,
    loading,
    error,
    refetch: fetchMoodLanding,
  };
}

export default useMoodLanding;