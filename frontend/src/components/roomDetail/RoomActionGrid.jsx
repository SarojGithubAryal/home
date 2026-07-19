import React from 'react';
import RoomActionCard from './RoomActionCard';

const RoomActionGrid = ({ actions, onSelect }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <section className="room-action-section" aria-labelledby="room-action-title">
      <h2 id="room-action-title" className="room-action-title-heading">
        What would you like to do?
      </h2>

      <div className="room-action-grid">
        {actions.map((action) => (
          <RoomActionCard key={action.id} action={action} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
};

export default RoomActionGrid;