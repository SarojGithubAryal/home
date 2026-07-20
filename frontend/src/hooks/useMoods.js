/**
 * useMoods.js
 *
 * Owns all state for the Mood Experience.
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 *
 * This hook covers both documented Mood endpoints:
 *   GET  /api/moods         (list of available moods, fetched on mount)
 *   POST /api/moods/select  (submit selection, triggered by user action)
 *
 * These are modeled as two separate state groups rather than one, since
 * they have different lifecycles: the mood list loads automatically,
 * while a selection is a user-triggered mutation that can be called zero
 * or more times during the hook's lifetime.
 *
 * This hook does not resolve assets and does not decide navigation/routing
 * based on the selection result — it only exposes the raw "next
 * recommended experience" data returned by the backend. The page/router
 * layer decides what to do with it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import moodService from '../services/moodService';

/**
 * @returns {{
 *   moods: object|null,
 *   moodsLoading: boolean,
 *   moodsError: {code: string, message: string}|null,
 *   refetchMoods: () => void,
 *   selectedResult: object|null,
 *   selecting: boolean,
 *   selectError: {code: string, message: string}|null,
 *   selectMood: (moodSelection: object) => Promise<{
  success: boolean,
  data: object|null,
  navigation: object|null,
  error: object|null
}|null>
 * }}
 */
export function useMoods() {
  // --- Mood list state -----------------------------------------------
  const [moods, setMoods] = useState(null);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [moodsError, setMoodsError] = useState(null);

  const listAbortRef = useRef(null);

  const fetchMoods = useCallback(async () => {
    if (listAbortRef.current) {
      listAbortRef.current.abort();
    }

    const controller = new AbortController();
    listAbortRef.current = controller;

    setMoodsLoading(true);
    setMoodsError(null);

    const result = await moodService.getMoods({ signal: controller.signal });

    if (listAbortRef.current !== controller) return;

    if (result.success) {
      setMoods(result.data);
      setMoodsError(null);
    } else {
      setMoods(null);
      setMoodsError(result.error);
    }

    setMoodsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoods();

    return () => {
      if (listAbortRef.current) {
        listAbortRef.current.abort();
      }
    };
  }, [fetchMoods]);

  // --- Mood selection state --------------------------------------------
  const [selectedResult, setSelectedResult] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selectError, setSelectError] = useState(null);

  const selectAbortRef = useRef(null);

  /**
   * Submits a mood selection. Returns true on success, false on failure,
   * so callers (e.g. a page's onSelect handler) can decide whether to
   * proceed with navigation without re-inspecting hook state directly.
   *
   * @param {object} moodSelection - payload shaped as the backend expects
   * @returns {Promise<{
  success:boolean,
  data:object|null,
  navigation?:object|null,
  error?:object|null
}>}
   */
const selectMood = useCallback(async (moodSelection) => {
  if (selectAbortRef.current) {
    selectAbortRef.current.abort();
  }

  const controller = new AbortController();
  selectAbortRef.current = controller;

  setSelecting(true);
  setSelectError(null);

  const result = await moodService.selectMood(moodSelection, {
    signal: controller.signal,
  });

  if (selectAbortRef.current !== controller) {
    return null;
  }

  setSelecting(false);

  if (result.success) {
    setSelectedResult(result.data);
    setSelectError(null);

    return result;
  }

  setSelectedResult(null);
  setSelectError(result.error);

  return result;
}, []);

  useEffect(() => {
    return () => {
      if (selectAbortRef.current) {
        selectAbortRef.current.abort();
      }
    };
  }, []);

  return {
    moods,
    moodsLoading,
    moodsError,
    refetchMoods: fetchMoods,

    selectedResult,
    selecting,
    selectError,
    selectMood,
  };
}

export default useMoods;