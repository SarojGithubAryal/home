/**
 * App.jsx
 *
 * Central navigation owner, integrated against Backend API v1.0
 * (frozen).
 *
 * Navigation state is now a HISTORY STACK, not a single {page, props}
 * pair. navigate() pushes; goBack() pops. Every page receives the same
 * generic goBack as its onBack — no page hardcodes what "back" means or
 * where it leads, satisfying "Back should return to the actual previous
 * page" for any depth of navigation (Home -> Room -> Hear -> Audio
 * Player -> back -> Hear -> back -> Room -> back -> Home).
 *
 * All navigation is driven exclusively by handleNavigation(), which
 * receives a backend response { success, navigation, data } and uses
 * resolveNavigation() to determine the target page. No page decides its
 * own destination; HomePage's mood selection now also flows through
 * this same mechanism (previously a bespoke onMoodSelected callback —
 * removed).
 */

import React, { useCallback, useState } from 'react';

import HomePage from './pages/HomePage';
import MoodLandingPage from './pages/MoodLanding/MoodLandingPage';
import RoomPage from './pages/Room/RoomPage';
import HearPage from './pages/HearPage/HearPage';
import ReadPage from './pages/ReadPage/ReadPage';
import SeePage from './pages/SeePage/SeePage';
import HearDetailPage from './pages/HearDetailPage/HearDetailPage';
import ReadDetailPage from './pages/ReadDetailPage/ReadDetailPage';
import SeeDetailPage from './pages/SeeDetailPage/SeeDetailPage';
import MemoryDetailPage from './pages/MemoryDetailPage/MemoryDetailPage';
import MemoryPage from './pages/MemoryPage/MemoryPage';

import PAGES from './navigation/pages';
import resolveNavigation from './navigation/navigationResolver';

const INITIAL_HISTORY = [{ page: PAGES.HOME, props: {} }];

function App() {
  const [history, setHistory] = useState(INITIAL_HISTORY);

  const currentEntry = history[history.length - 1];

  /**
   * Pushes a new page onto the history stack.
   */
  const navigate = useCallback((page, props = {}) => {
    setHistory((prev) => [...prev, { page, props }]);
  }, []);

  /**
   * Generic back handler, given to every page as onBack. Pops the
   * history stack, returning to whatever screen was actually visited
   * before — never a hardcoded destination.
   */
  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  /**
   * Receives a backend response after a user action:
   * { success, navigation: { experience, params }, data }
   * Resolves it into a frontend page and navigates to it.
   */
  const handleNavigation = useCallback(
    (response) => {
      if (!response?.success) return;

      const resolved = resolveNavigation(response.navigation);
      if (!resolved) {
        console.warn('Navigation could not be resolved:', response.navigation);
        return;
      }

      navigate(resolved.page, resolved.props);
    },
    [navigate]
  );

  function renderCurrentPage() {
    const { page, props } = currentEntry;

    switch (page) {
      case PAGES.MOOD_LANDING:
        return (
          <MoodLandingPage moodSlug={props.moodSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.ROOM:
        return (
          <RoomPage roomSlug={props.roomSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.HEAR:
        return (
          <HearPage roomSlug={props.roomSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.READ:
        return (
          <ReadPage roomSlug={props.roomSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.SEE:
        return (
          <SeePage roomSlug={props.roomSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.MEMORY:
        return (
          <MemoryPage roomSlug={props.roomSlug} onBack={goBack} onNavigation={handleNavigation} />
        );

      case PAGES.MEMORY_VIEWER:
        return <MemoryDetailPage contentId={props.contentId} onBack={goBack} />;

      case PAGES.AUDIO_PLAYER:
        return (
          <HearDetailPage contentId={props.contentId} onBack={goBack} />
        );

      case PAGES.LETTER_VIEWER:
        return (
          <ReadDetailPage contentId={props.contentId} onBack={goBack} />
        );

      case PAGES.PHOTO_VIEWER:
        return (
          <SeeDetailPage contentId={props.contentId} onBack={goBack} />
        );

      case PAGES.HOME:
      default:
        return <HomePage onNavigation={handleNavigation} />;
    }
  }

  return renderCurrentPage();
}

export default App;