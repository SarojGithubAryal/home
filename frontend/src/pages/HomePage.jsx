import React, { useMemo } from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/hero/HeroSection';
import MoodGrid from '../components/mood/MoodGrid';
import UnknownMoodTile from '../components/mood/UnknownMoodTile';
import FooterComfort from '../components/common/FooterComfort';
import { getGreeting } from '../services/greetingService';
import { getComfortMessage } from '../services/comfortMessageService';
import moods from '../mock/moods';

const HomePage = ({ onMoodSelect }) => {
  const greeting = useMemo(() => getGreeting(), []);
  const comfortMessage = useMemo(() => getComfortMessage(), []);

  const handleMoodSelect = (mood) => {
    if (onMoodSelect) onMoodSelect(mood);
  };

  const handleUnknownSelect = () => {
    if (onMoodSelect) onMoodSelect({ id: 'unknown', emoji: '🤍', label: "I don't know" });
  };

  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        <HeroSection
          greetingText={greeting.text}
          supportingText="A little place that's always here, whenever you need it."
          comfortMessage={comfortMessage}
        />

        <section className="mood-section" aria-labelledby="mood-section-title">
          <h2 id="mood-section-title" className="mood-title">
            How are you feeling today?
          </h2>
          <p className="mood-subtitle">It's okay to feel any of it.</p>

          <MoodGrid moods={moods} onSelect={handleMoodSelect} />
          <UnknownMoodTile onSelect={handleUnknownSelect} />
        </section>

        <FooterComfort />
      </main>
    </div>
  );
};

export default HomePage;