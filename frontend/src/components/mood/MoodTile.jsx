import React from 'react';

const MoodTile = ({ mood, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(mood);
  };

  return (
    <button
      type="button"
      className={`mood-tile mood-tile--${mood.id}`}
      onClick={handleClick}
    >
      <span className="mood-tile-icon">{mood.emoji}</span>
      <span className="mood-tile-label">{mood.label}</span>
    </button>
  );
};

export default MoodTile;