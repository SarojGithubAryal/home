import React from 'react';

const UnknownMoodTile = ({ onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect();
  };

  return (
    <div className="unknown-mood-tile">
      <button type="button" className="unknown-mood-button" onClick={handleClick}>
        <span className="unknown-mood-icon" aria-hidden="true">🤍</span>
        <span className="unknown-mood-label">I don't know</span>
      </button>
      <p className="unknown-mood-subtext">I just need a moment</p>
    </div>
  );
};

export default UnknownMoodTile;