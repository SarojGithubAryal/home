/**
 * useAdminSettings.js
 *
 * Owns state and mutation for the Settings page. Mirrors the
 * fetch-then-refetch-on-save pattern already used by
 * useExperienceSettings.js.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import settingsService from '../services/settingsService';

export function useAdminSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchSettings = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await settingsService.getSettings({ signal: controller.signal });
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
    fetchSettings();
    return () => abortControllerRef.current?.abort();
  }, [fetchSettings]);

  const saveSettings = useCallback(
    async (fields) => {
      setIsSaving(true);
      const result = await settingsService.updateSettings(fields);
      if (result.success) await fetchSettings();
      setIsSaving(false);
      return result;
    },
    [fetchSettings]
  );

  return {
    data,
    loading,
    error,
    isSaving,
    refetch: fetchSettings,
    saveSettings,
  };
}

export default useAdminSettings;