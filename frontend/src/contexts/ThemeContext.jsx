/**
 * ThemeContext.jsx
 *
 * Provides the currently active theme/atmosphere identifiers (as returned
 * by whichever Experience payload is active — Home, Room, etc.) to any
 * component in the tree that needs them, without prop-drilling through
 * every layout level.
 *
 * This context stores only the raw semantic theme data as received from
 * the backend (e.g. { heroVariant, paperStyle, decorationPack, palette }).
 * It does NOT resolve these into asset paths itself — components that
 * need actual paths call AssetRegistry directly with values read from
 * this context. This keeps ThemeContext a pure data-passing layer per
 * 08_ASSET_ARCHITECTURE.md's separation of semantic identifiers from
 * asset resolution.
 */

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [themeData, setThemeData] = useState(null);

  /**
   * Replaces the active theme data. Called whenever a page loads an
   * Experience payload containing a "Theme" section (Home, Room, or any
   * Room sub-experience).
   */
  const setTheme = useCallback((nextThemeData) => {
    setThemeData(nextThemeData || null);
  }, []);

  /**
   * Clears the active theme data, e.g. when navigating to a page with no
   * theme context of its own.
   */
  const clearTheme = useCallback(() => {
    setThemeData(null);
  }, []);

  const value = useMemo(
    () => ({
      themeData,
      setTheme,
      clearTheme,
    }),
    [themeData, setTheme, clearTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook for consuming the active theme data.
 * Throws if used outside a ThemeProvider, to catch integration mistakes
 * early rather than silently returning undefined.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default ThemeContext;