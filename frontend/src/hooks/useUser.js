/**
 * useUser.js
 *
 * Owns all state for the User APIs.
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 *
 * Covers all four documented User endpoints via userService:
 *   GET   /api/user/me          -> on-demand profile fetch
 *   PATCH /api/user/settings    -> on-demand mutation
 *   GET   /api/user/favorites   -> on-demand fetch
 *   POST  /api/user/bookmarks   -> on-demand mutation
 *
 * IMPORTANT (single-owner v1):
 * This hook no longer fetches the user profile automatically on mount.
 * The application is a single-owner experience without authentication;
 * startup must not depend on any user API. User data is loaded only when
 * a future page (Settings, Favorites, Bookmarks, etc.) explicitly calls
 * refetchUser() or another on-demand action. The hook starts with an
 * idle state (user === null, userLoading === false, userError === null).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import userService from '../services/userService';

/**
 * @returns {{
 *   user: object|null,
 *   userLoading: boolean,
 *   userError: {code: string, message: string}|null,
 *   refetchUser: () => void,
 *
 *   updateSettings: (settingsUpdate: object) => Promise<boolean>,
 *   updatingSettings: boolean,
 *   updateSettingsError: {code: string, message: string}|null,
 *
 *   favorites: object|null,
 *   favoritesLoading: boolean,
 *   favoritesError: {code: string, message: string}|null,
 *   loadFavorites: () => Promise<boolean>,
 *
 *   addBookmark: (bookmarkPayload: object) => Promise<boolean>,
 *   addingBookmark: boolean,
 *   addBookmarkError: {code: string, message: string}|null
 * }}
 */
export function useUser() {
  // --- Current user profile state --------------------------------------
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false); // on-demand only
  const [userError, setUserError] = useState(null);

  const userAbortRef = useRef(null);

  /**
   * Fetches the current user's profile on demand.
   * Not called automatically — callers (e.g., Settings page) must invoke
   * this function explicitly.
   */
  const fetchUser = useCallback(async () => {
    if (userAbortRef.current) {
      userAbortRef.current.abort();
    }

    const controller = new AbortController();
    userAbortRef.current = controller;

    setUserLoading(true);
    setUserError(null);

    const result = await userService.getCurrentUser({ signal: controller.signal });

    if (userAbortRef.current !== controller) return;

    if (result.success) {
      setUser(result.data);
      setUserError(null);
    } else {
      setUser(null);
      setUserError(result.error);
    }

    setUserLoading(false);
  }, []);

  // No automatic fetch on mount. The profile is loaded only when refetchUser()
  // is called from a page that actually needs user data.

  // --- Settings update state --------------------------------------------
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [updateSettingsError, setUpdateSettingsError] = useState(null);

  const settingsAbortRef = useRef(null);

  const updateSettings = useCallback(async (settingsUpdate) => {
    if (settingsAbortRef.current) {
      settingsAbortRef.current.abort();
    }

    const controller = new AbortController();
    settingsAbortRef.current = controller;

    setUpdatingSettings(true);
    setUpdateSettingsError(null);

    const result = await userService.updateUserSettings(settingsUpdate, {
      signal: controller.signal,
    });

    if (settingsAbortRef.current !== controller) return false;

    if (result.success) {
      setUser(result.data);
      setUpdateSettingsError(null);
      setUpdatingSettings(false);
      return true;
    }

    setUpdateSettingsError(result.error);
    setUpdatingSettings(false);
    return false;
  }, []);

  // --- Favorites state ---------------------------------------------------
  const [favorites, setFavorites] = useState(null);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);

  const favoritesAbortRef = useRef(null);

  const loadFavorites = useCallback(async () => {
    if (favoritesAbortRef.current) {
      favoritesAbortRef.current.abort();
    }

    const controller = new AbortController();
    favoritesAbortRef.current = controller;

    setFavoritesLoading(true);
    setFavoritesError(null);

    const result = await userService.getUserFavorites({ signal: controller.signal });

    if (favoritesAbortRef.current !== controller) return false;

    if (result.success) {
      setFavorites(result.data);
      setFavoritesError(null);
      setFavoritesLoading(false);
      return true;
    }

    setFavorites(null);
    setFavoritesError(result.error);
    setFavoritesLoading(false);
    return false;
  }, []);

  // --- Bookmark creation state --------------------------------------------
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [addBookmarkError, setAddBookmarkError] = useState(null);

  const bookmarkAbortRef = useRef(null);

  const addBookmark = useCallback(async (bookmarkPayload) => {
    if (bookmarkAbortRef.current) {
      bookmarkAbortRef.current.abort();
    }

    const controller = new AbortController();
    bookmarkAbortRef.current = controller;

    setAddingBookmark(true);
    setAddBookmarkError(null);

    const result = await userService.createBookmark(bookmarkPayload, {
      signal: controller.signal,
    });

    if (bookmarkAbortRef.current !== controller) return false;

    setAddingBookmark(false);

    if (result.success) {
      setAddBookmarkError(null);
      return true;
    }

    setAddBookmarkError(result.error);
    return false;
  }, []);

  // --- Cleanup on unmount --------------------------------------------------
  useEffect(() => {
    return () => {
      if (userAbortRef.current) userAbortRef.current.abort();
      if (settingsAbortRef.current) settingsAbortRef.current.abort();
      if (favoritesAbortRef.current) favoritesAbortRef.current.abort();
      if (bookmarkAbortRef.current) bookmarkAbortRef.current.abort();
    };
  }, []);

  return {
    user,
    userLoading,
    userError,
    refetchUser: fetchUser,

    updateSettings,
    updatingSettings,
    updateSettingsError,

    favorites,
    favoritesLoading,
    favoritesError,
    loadFavorites,

    addBookmark,
    addingBookmark,
    addBookmarkError,
  };
}

export default useUser;