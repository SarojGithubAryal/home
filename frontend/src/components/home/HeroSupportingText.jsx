/**
 * HeroSupportingText.jsx
 *
 * Renders the Home Experience's hero supporting line (the sentence
 * beneath the divider, above the daily-message card). Backend-driven —
 * renders nothing if no value is supplied.
 */

import React from 'react';
import './HeroSupportingText.css';

function HeroSupportingText({ text }) {
  if (!text) return null;
  return <p className="hero-supporting-text">{text}</p>;
}

export default HeroSupportingText;