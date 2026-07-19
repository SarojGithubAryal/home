/**
 * MoodPrompt.jsx
 *
 * A navigation entry point into the Mood Experience (GET /api/moods),
 * rendered on the Home page. This component does NOT fetch or render
 * the actual mood list — mood selection is its own Experience/page
 * (per 06_API_CONTRACTS.md, moods are a separate endpoint from Home).
 *
 * The label below ("Select a mood") is treated as decorative UI/
 * navigation chrome — like a "Try again" retry button — rather than
 * backend business content, since Home Experience's documented
 * categories (Greeting, Hero, Recommended room, Daily message, Footer,
 * Theme) do not include a mood-prompt field. If the backend later adds
 * a semantic field for this prompt's copy, this label should be
 * replaced with a prop-driven value at that time.
 *
 * Navigation is not yet wired to an actual route change — no routing
 * library has been introduced in this phase. onSelect is called and the
 * caller (HomePage) currently only logs the intent, pending routing
 * integration in a future phase.
 */

import React from 'react';
import Button from '../common/Button';
import { classNames } from '../../utils/helpers';
import './MoodPrompt.css';

function MoodPrompt({ onSelect, className }) {
  return (
    <div className={classNames('mood-prompt', className)}>
      <p className="mood-prompt-text">Select a mood</p>
      <Button variant="primary" onClick={onSelect}>
        Continue
      </Button>
    </div>
  );
}

export default MoodPrompt;