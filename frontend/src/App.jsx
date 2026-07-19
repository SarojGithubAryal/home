/**
 * App.jsx
 *
 * Root application component.
 *
 * TEMPORARY: currently renders HomePage directly (a static placeholder,
 * not the real backend-driven Home page) to verify React, routing
 * wiring, layout, and the styling foundation render correctly end-to-
 * end. No routing logic has been added here — router/index.js's route
 * table is unchanged, and this file makes no API calls itself.
 *
 * When real page implementation begins, this file's responsibility will
 * become routing composition only (rendering whichever page matches the
 * current route) — it will not gain data-fetching or business logic of
 * its own, consistent with the Pages -> Hooks -> Services -> apiClient
 * layering rule.
 */

import React from 'react';
import HomePage from './pages/HomePage';

function App() {
  return <HomePage />;
}

export default App;