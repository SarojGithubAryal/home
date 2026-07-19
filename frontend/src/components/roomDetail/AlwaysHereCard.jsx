import React from 'react';

const AlwaysHereCard = ({ item, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(item);
  };

  const thumbnailStyle = item.thumbnail ? { backgroundImage: `url(${item.thumbnail})` } : undefined;

  return (
    <button type="button" className="always-here-card" onClick={handleClick}>
      <span className="always-here-thumbnail" style={thumbnailStyle}>
        <span className="always-here-play-icon" aria-hidden="true">▶</span>
      </span>

      <span className="always-here-info">
        <span className="always-here-title">{item.title}</span>
        {item.duration && <span className="always-here-duration">{item.duration}</span>}
      </span>
    </button>
  );
};

export default AlwaysHereCard;