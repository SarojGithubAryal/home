import React from 'react';

const RoomActionCard = ({ action, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(action);
  };

  return (
    <button type="button" className={`room-action-card room-action-card--${action.type}`} onClick={handleClick}>
      <span className="room-action-icon">{action.icon}</span>

      <span className="room-action-text">
        <span className="room-action-title">{action.title}</span>
        <span className="room-action-subtitle">{action.subtitle}</span>
      </span>

      {typeof action.count === 'number' && (
        <span className="room-action-count">
          {action.count} items
          <span className="room-action-chevron" aria-hidden="true">›</span>
        </span>
      )}
    </button>
  );
};

export default RoomActionCard;