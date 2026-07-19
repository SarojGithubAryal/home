import React from 'react';
import Header from '../components/layout/Header';
import RoomHero from '../components/roomDetail/RoomHero';
import RecommendationCard from '../components/roomDetail/RecommendationCard';
import RoomActionGrid from '../components/roomDetail/RoomActionGrid';
import AlwaysHereSection from '../components/roomDetail/AlwaysHereSection';
import FooterComfort from '../components/common/FooterComfort';

const RoomDetailPage = ({ room, onBack, onSelectAction, onSelectAlwaysHereItem, onSelectMoreComfort, onRecommendationPlay, onRecommendationOpen }) => {
  if (!room) return null;

  const handlePrimaryAction = (action) => {
    if (onRecommendationPlay) onRecommendationPlay(action, room);
  };

  const handleSecondaryAction = (action) => {
    if (onRecommendationOpen) onRecommendationOpen(action, room);
  };

  const handleActionSelect = (action) => {
    if (onSelectAction) onSelectAction(action, room);
  };

  const handleAlwaysHereSelect = (item) => {
    if (onSelectAlwaysHereItem) onSelectAlwaysHereItem(item, room);
  };

  const handleMoreComfort = () => {
    if (onSelectMoreComfort) onSelectMoreComfort(room);
  };

  return (
    <div className="room-detail-page">
      <div className="room-detail-hero-wrap">
        <Header variant="room" onBack={onBack} roomIcon={room.icon} />
        <RoomHero room={room} />
      </div>

      <main className="room-detail-main">
        <RecommendationCard
          recommendation={room.recommendation}
          artwork={room.assets?.recommendation}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleSecondaryAction}
        />

        <RoomActionGrid actions={room.actions} onSelect={handleActionSelect} />

        <AlwaysHereSection
          alwaysHere={room.alwaysHere}
          onSelectItem={handleAlwaysHereSelect}
          onSelectMore={handleMoreComfort}
        />

        <FooterComfort icon={room.footer?.icon} lines={room.footer?.lines} />
      </main>
    </div>
  );
};

export default RoomDetailPage;