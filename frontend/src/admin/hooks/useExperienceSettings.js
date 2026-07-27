/**
 * useExperienceSettings.js
 *
 * Owns all state and CRUD operations for the Experience page.
 * Uses PATCH /admin/experience for every mutation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import experienceService from '../services/experienceService';

export function useExperienceSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchExperience = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const result = await experienceService.getExperience({ signal: controller.signal });
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
    fetchExperience();
    return () => abortControllerRef.current?.abort();
  }, [fetchExperience]);

  // Shared mutation helper – sends partial payload and refetches on success
  const updateExperience = useCallback(async (payload) => {
    const result = await experienceService.updateExperience(payload);
    if (result.success) await fetchExperience();
    return result;
  }, [fetchExperience]);

  // ── GREETINGS CRUD ─────────────────────────────────────
  const greetings = data?.greetings || [];

  const addGreeting = useCallback(
    (greeting) => updateExperience({ greetings: [...greetings, greeting] }),
    [greetings, updateExperience]
  );

  const updateGreeting = useCallback(
    (id, fields) =>
      updateExperience({
        greetings: greetings.map((g) => (g.id === id ? { ...g, ...fields } : g)),
      }),
    [greetings, updateExperience]
  );

  const deleteGreeting = useCallback(
    (id) =>
      updateExperience({
        greetings: greetings.filter((g) => g.id !== id),
      }),
    [greetings, updateExperience]
  );

  const toggleGreetingActive = useCallback(
    (id) => {
      const g = greetings.find((item) => item.id === id);
      if (!g) return;
      return updateGreeting(id, { is_active: !g.is_active });
    },
    [greetings, updateGreeting]
  );

  const moveGreetingUp = useCallback(
    (index) => {
      if (index <= 0) return;
      const list = [...greetings];
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      return updateExperience({ greetings: list });
    },
    [greetings, updateExperience]
  );

  const moveGreetingDown = useCallback(
    (index) => {
      if (index >= greetings.length - 1) return;
      const list = [...greetings];
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
      return updateExperience({ greetings: list });
    },
    [greetings, updateExperience]
  );

  // ── QUOTES CRUD ────────────────────────────────────────
  const quotes = data?.quotes || [];

  const addQuote = useCallback(
    (quote) => updateExperience({ quotes: [...quotes, quote] }),
    [quotes, updateExperience]
  );

  const updateQuote = useCallback(
    (id, fields) =>
      updateExperience({
        quotes: quotes.map((q) => (q.id === id ? { ...q, ...fields } : q)),
      }),
    [quotes, updateExperience]
  );

  const deleteQuote = useCallback(
    (id) =>
      updateExperience({
        quotes: quotes.filter((q) => q.id !== id),
      }),
    [quotes, updateExperience]
  );

  const toggleQuoteActive = useCallback(
    (id) => {
      const q = quotes.find((item) => item.id === id);
      if (!q) return;
      return updateQuote(id, { is_active: !q.is_active });
    },
    [quotes, updateQuote]
  );

  // ── DAILY MESSAGES CRUD ────────────────────────────────
  const dailyMessages = data?.dailyMessages || [];

  const addMessage = useCallback(
    (message) => updateExperience({ dailyMessages: [...dailyMessages, message] }),
    [dailyMessages, updateExperience]
  );

  const updateMessage = useCallback(
    (id, fields) =>
      updateExperience({
        dailyMessages: dailyMessages.map((m) => (m.id === id ? { ...m, ...fields } : m)),
      }),
    [dailyMessages, updateExperience]
  );

  const deleteMessage = useCallback(
    (id) =>
      updateExperience({
        dailyMessages: dailyMessages.filter((m) => m.id !== id),
      }),
    [dailyMessages, updateExperience]
  );

  const toggleMessageActive = useCallback(
    (id) => {
      const m = dailyMessages.find((item) => item.id === id);
      if (!m) return;
      return updateMessage(id, { is_active: !m.is_active });
    },
    [dailyMessages, updateMessage]
  );

  // ── HOME CONFIG ────────────────────────────────────────
  const homeConfig = data?.homeConfig || {};

  const updateHomeConfig = useCallback(
    (config) => updateExperience({ homeConfig: config }),
    [updateExperience]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchExperience,
    // Greetings
    addGreeting,
    updateGreeting,
    deleteGreeting,
    toggleGreetingActive,
    moveGreetingUp,
    moveGreetingDown,
    // Quotes
    addQuote,
    updateQuote,
    deleteQuote,
    toggleQuoteActive,
    // Daily Messages
    addMessage,
    updateMessage,
    deleteMessage,
    toggleMessageActive,
    // Home Config
    updateHomeConfig,
  };
}

export default useExperienceSettings;