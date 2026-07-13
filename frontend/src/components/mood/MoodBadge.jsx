import React from 'react';

const MoodBadge = ({ mood }) => {
  if (!mood) return null;

  return (
    <span className={`mood-badge mood-badge--${mood.id}`}>
      <span className="mood-badge-icon" aria-hidden="true">{mood.emoji}</span>
      <span className="mood-badge-label">{mood.label}</span>
    </span>
  );
};

export default MoodBadge;