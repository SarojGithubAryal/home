/**
 * UnknownMoodTile.jsx
 *
 * A fixed "I don't know" affordance beneath the mood grid. Unlike
 * MoodTile, this option's copy is not backend content — it functions as
 * local UI chrome (same precedent as MoodPrompt's earlier placeholder
 * label), since it represents "skip/no preference" rather than a
 * specific backend-defined mood. Selecting it calls onSelect with a
 * synthetic { id: 'unknown' } payload so the Mood Experience's select
 * flow (POST /api/moods/select) still receives a valid selection shape.
 */

import React from 'react';
import './UnknownMoodTile.css';

function UnknownMoodTile({ onSelect }) {
  const handleClick = () => {
    if (onSelect) onSelect({ id: 'unknown', label: "I don't know" });
  };

  return (
    <button type="button" className="unknown-mood-tile" onClick={handleClick}>
      <span className="unknown-mood-icon" aria-hidden="true">🤍</span>
      <span className="unknown-mood-text">
        <span className="unknown-mood-title">I don't know</span>
        <span className="unknown-mood-subtitle">I just need a moment</span>
      </span>
    </button>
  );
}

export default UnknownMoodTile;