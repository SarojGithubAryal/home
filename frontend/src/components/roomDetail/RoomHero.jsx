import React from 'react';

const RoomHero = ({ room }) => {
  const heroStyle = room.assets?.hero
    ? { backgroundImage: `url(${room.assets.hero})` }
    : undefined;

  return (
    <section className="room-hero" style={heroStyle} aria-label={room.name}>
      <div className="room-hero-overlay">
        <div className="room-hero-content">
          <h1 className="room-hero-title">
            {room.name} <span aria-hidden="true">{room.icon}</span>
          </h1>

          <p className="room-hero-quote">{room.quote}</p>

          {room.updatedAt && (
            <span className="room-hero-timestamp">
              <span className="room-hero-timestamp-icon" aria-hidden="true">🕐</span>
              Last updated: {room.updatedAt}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default RoomHero;