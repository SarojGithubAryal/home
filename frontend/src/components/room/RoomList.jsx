import React from 'react';
import RoomCard from './RoomCard';

const RoomList = ({ rooms, onSelect }) => {
  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default RoomList;