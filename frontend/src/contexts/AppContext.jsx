/**
 * AppContext.jsx
 *
 * Provides application-wide state that multiple pages/components need
 * without prop-drilling — currently the current user (from useUser) and
 * a simple global navigation/loading indicator flag.
 *
 * This context does NOT own business logic. It composes the useUser hook
 * (which already owns its own state/service calls) and exposes it at the
 * app root, so any component in the tree can read "who is the current
 * user" without needing to independently call useUser() and trigger a
 * duplicate fetch.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useUser } from '../hooks/useUser';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const userState = useUser();

  const value = useMemo(
    () => ({
      user: userState.user,
      userLoading: userState.userLoading,
      userError: userState.userError,
      refetchUser: userState.refetchUser,

      updateSettings: userState.updateSettings,
      updatingSettings: userState.updatingSettings,
      updateSettingsError: userState.updateSettingsError,

      favorites: userState.favorites,
      favoritesLoading: userState.favoritesLoading,
      favoritesError: userState.favoritesError,
      loadFavorites: userState.loadFavorites,

      addBookmark: userState.addBookmark,
      addingBookmark: userState.addingBookmark,
      addBookmarkError: userState.addBookmarkError,
    }),
    [userState]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook for consuming app-wide state (currently: user identity/session
 * data). Throws if used outside an AppProvider.
 */
export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}

export default AppContext;