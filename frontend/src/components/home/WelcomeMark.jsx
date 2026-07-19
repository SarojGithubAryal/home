/**
 * WelcomeMark.jsx
 *
 * The app's identity tagline ("Welcome home"), rendered in the accent
 * script typeface. This is NOT backend content — it is brand chrome
 * (the application's wordmark/tagline), same category as the earlier
 * "Select a mood" label precedent, distinct from the time-based
 * Greeting text (which IS backend-driven via Greeting.jsx). If the
 * backend later exposes a semantic field for this, replace the fixed
 * string below with a prop.
 */

import React from 'react';
import './WelcomeMark.css';

function WelcomeMark() {
  return (
    <p className="welcome-mark">
      Welcome home <span className="welcome-mark-heart" aria-hidden="true">❤</span>
    </p>
  );
}

export default WelcomeMark;