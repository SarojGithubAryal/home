/**
 * HeroDivider.jsx
 *
 * A small decorative divider (line-heart-line) used to separate the
 * hero's title area from its supporting text. Purely presentational —
 * no content, no data dependency.
 */

import React from 'react';
import './HeroDivider.css';

function HeroDivider() {
  return (
    <div className="hero-divider" aria-hidden="true">
      <span className="hero-divider-line"></span>
      <span className="hero-divider-mark">♥</span>
      <span className="hero-divider-line"></span>
    </div>
  );
}

export default HeroDivider;