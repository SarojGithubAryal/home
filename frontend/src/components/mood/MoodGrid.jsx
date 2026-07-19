/**
 * MoodGrid.jsx
 *
 * Renders a responsive grid of MoodTile components from a backend-
 * supplied moods array. Contains no knowledge of specific mood content.
 */

import React from 'react';
import MoodTile from './MoodTile';
import './MoodGrid.css';

function MoodGrid({ moods, onSelect }) {
  if (!Array.isArray(moods) || moods.length === 0) return null;

  return (
    <div className="mood-grid" role="group" aria-label="Choose your mood">
      {moods.map((mood) => (
        <MoodTile key={mood.id} mood={mood} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default MoodGrid;