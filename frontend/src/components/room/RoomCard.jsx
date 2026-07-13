import React from 'react';

const RoomCard = ({ room, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(room);
  };

  // Once backend supplies real photos, pass room.imageUrl and it
  // will render here automatically, with the accent fade laid on top.
  const cardStyle = room.imageUrl
    ? { backgroundImage: `url(${room.imageUrl})` }
    : undefined;

  return (
    <button
      type="button"
      className={`room-card room-card--${room.accent}`}
      style={cardStyle}
      onClick={handleClick}
    >
      <span className="room-card-content">
        <span className="room-card-title">
          {room.title}
          <span className="room-card-title-icon" aria-hidden="true">{room.icon}</span>
        </span>
        <span className="room-card-description">{room.description}</span>
      </span>

      <span className="room-card-arrow" aria-hidden="true">→</span>
    </button>
  );
};

export default RoomCard;