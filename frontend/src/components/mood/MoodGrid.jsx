import React from 'react';
import MoodTile from './MoodTile';

const MoodGrid = ({ moods, onSelect }) => {
  if (!moods || moods.length === 0) return null;

  return (
    <div className="mood-grid" role="group" aria-label="Choose your mood">
      {moods.map((mood) => (
        <MoodTile key={mood.id} mood={mood} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default MoodGrid;