/**
 * App.jsx
 *
 * Central navigation owner.
 *
 * Pages never import one another.
 * Pages never decide what page comes next.
 * They simply forward the backend response.
 *
 * App.jsx receives the backend navigation instruction,
 * resolves it into a frontend page,
 * then renders the appropriate page.
 */

import React, { useCallback, useState } from 'react';

import HomePage from './pages/HomePage';
import MoodLandingPage from './pages/MoodLanding/MoodLandingPage';
import RoomPage from './pages/Room/RoomPage';

import PAGES from './navigation/pages';
import resolveNavigation from './navigation/navigationResolver';

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [pageProps, setPageProps] = useState({});

  /**
   * Low-level page switch.
   */
  const navigate = useCallback((page, props = {}) => {
    setCurrentPage(page);
    setPageProps(props);
  }, []);

  /**
   * Receives a backend response after a user action.
   *
   * Expected shape:
   *
   * {
   *   success:true,
   *   navigation:{
   *     experience:"MOOD_LANDING",
   *     params:{
   *       moodSlug:"sad"
   *     }
   *   },
   *   data:{...}
   * }
   */
const handleNavigation = useCallback(
  (response) => {
    console.log("========== HANDLE NAVIGATION ==========");
    console.log("Full backend response:", response);

    if (!response?.success) {
      console.warn("Response not successful.");
      return;
    }

    console.log("Navigation payload:", response.navigation);

    const resolved = resolveNavigation(response.navigation);

    console.log("Resolved page:", resolved);

    if (!resolved) {
      console.warn("Navigation could not be resolved.");
      return;
    }

    console.log("Navigating to:", resolved.page, resolved.props);

    navigate(resolved.page, resolved.props);
  },
  [navigate]
);
  /**
   * Temporary back behaviour.
   *
   * Until a navigation history exists, every page returns to Home.
   *
   * KNOWN LIMITATION: this means Room's back button also returns to
   * Home, not to the Mood Landing screen it was reached from. This is
   * intentional per current instructions (no per-hop context, e.g.
   * fromMoodSlug, is being introduced) rather than an oversight — see
   * the navigation history report accompanying this integration.
   */
  const handleBackToHome = useCallback(() => {
    navigate(PAGES.HOME);
  }, [navigate]);

  function renderCurrentPage() {
    switch (currentPage) {
      case PAGES.ROOM:
        return (
          <RoomPage
            roomSlug={pageProps.roomSlug}
            onBack={handleBackToHome}
            onNavigation={handleNavigation}
          />
        );

      case PAGES.MOOD_LANDING:
        return (
          <MoodLandingPage
            moodSlug={pageProps.moodSlug}
            onBack={handleBackToHome}
            onNavigation={handleNavigation}
          />
        );

      case PAGES.HOME:
      default:
        return (
          <HomePage
            onNavigation={handleNavigation}
          />
        );
    }
  }

  return renderCurrentPage();
}

export default App;