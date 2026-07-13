import React, { useMemo } from 'react';
import Header from '../components/layout/Header';
import RoomIntro from '../components/room/RoomIntro';
import RoomList from '../components/room/RoomList';
import SomethingElseLink from '../components/room/SomethingElseLink';
import { getMoodMessage } from '../services/moodMessageService';
import { getRooms } from '../services/roomService';

const MoodPage = ({ mood, onBack, onSelectRoom, onSelectSomethingElse }) => {
  const message = useMemo(() => getMoodMessage(mood?.id), [mood]);
  const rooms = useMemo(() => getRooms(), []);

const handleRoomSelect = (room) => {
  if (onSelectRoom) onSelectRoom(room);
};

  const handleSomethingElse = () => {
    if (onSelectSomethingElse) onSelectSomethingElse();
  };

  return (
    <div className="mood-page">
      <div className="mood-page-backdrop" aria-hidden="true"></div>

      <div className="mood-page-main">
        <Header variant="mood" mood={mood} onBack={onBack} />

        <RoomIntro title={message.title} icon={message.icon} subtitle={message.subtitle} />

        <section className="destinations-section" aria-labelledby="destinations-title">
          <h2 id="destinations-title" className="destinations-title">
            Where would you like to go?
          </h2>
          <p className="destinations-subtitle">These places might bring you a little comfort.</p>

          <RoomList rooms={rooms} onSelect={handleRoomSelect} />
        </section>

        <SomethingElseLink onClick={handleSomethingElse} />
      </div>
    </div>
  );
};

export default MoodPage;