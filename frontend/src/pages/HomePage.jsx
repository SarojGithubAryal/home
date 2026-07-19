/**
 * HomePage.jsx
 *
 * The real Home page, matching the approved reference image. Consumes
 * the Home Experience (GET /api/home) via useHome, and the Mood
 * Experience via MoodSelector's useMoods — both through the existing,
 * unmodified Hooks -> Services -> apiClient -> Backend flow.
 */

import React, { useMemo } from 'react';
import PageContainer from '../layouts/PageContainer';
import Hero from '../components/common/Hero';
import IconButton from '../components/common/IconButton';
import OrnamentDivider from '../components/common/OrnamentDivider';
import Greeting from '../components/home/Greeting';
import WelcomeMark from '../components/home/WelcomeMark';
import HeroSupportingText from '../components/home/HeroSupportingText';
import DailyMessage from '../components/home/DailyMessage';
import MoodSelector from '../components/home/MoodSelector';
import RecommendedRoom from '../components/home/RecommendedRoom';
import HomeFooter from '../components/home/HomeFooter';
import { useHome } from '../hooks/useHome';
import AssetRegistry from '../assets/AssetRegistry';
import { getPath } from '../utils/helpers';
import './HomePage.css';

function resolveHeroVariant(data) {
  return (
    getPath(data, 'theme.heroVariant', null) ||
    getPath(data, 'hero.heroVariant', null) ||
    getPath(data, 'hero.variant', null) ||
    null
  );
}

// WelcomeMark always renders a fixed local wordmark ("Welcome home ❤").
// If the backend's greeting text is itself just that same phrase, showing
// both stacks two identical headings. This guard compares the backend
// text against our OWN known local string (not backend content), purely
// to avoid a visible duplicate — it never substitutes or invents backend
// content.
const WELCOME_MARK_PHRASE = 'welcome home';

function isRedundantGreeting(text) {
  if (typeof text !== 'string') return false;
  return text.trim().toLowerCase().replace(/[.!]+$/, '') === WELCOME_MARK_PHRASE;
}

function HomePage() {
  const { data, loading, error, refetch } = useHome();

  const heroVariant = resolveHeroVariant(data);
  const heroImage = useMemo(() => AssetRegistry.resolveHomeHero(heroVariant), [heroVariant]);

  const rawGreetingText =
    getPath(data, 'greeting.text', null) || getPath(data, 'greeting', null);
  const greetingText =
    typeof rawGreetingText === 'string' && !isRedundantGreeting(rawGreetingText)
      ? rawGreetingText
      : null;

  const heroSupportingText = getPath(data, 'hero.subtitle', null);

  const handleMenuOpen = () => {
    console.log('Open menu (pending routing/navigation integration)');
  };

  const handleSoundToggle = () => {
    console.log('Toggle sound (pending future feature)');
  };

  const handleMoodSelected = (mood) => {
    console.log('Mood selected (pending routing integration):', mood);
  };

  const handleRecommendedRoomSelect = (room) => {
    console.log('Navigate to room (pending routing integration):', room);
  };

  return (
    <PageContainer
      loading={loading}
      error={error}
      data={data}
      onRetry={refetch}
      emptyTitle="Nothing here yet"
      emptyMessage="Check back soon."
    >
      <div className="home-canvas">
        <Hero
          backgroundImage={heroImage}
          className="home-hero"
          topContent={
            <>
              <IconButton icon="☰" ariaLabel="Open menu" onClick={handleMenuOpen} />
              <IconButton icon="♪" ariaLabel="Toggle sound" onClick={handleSoundToggle} />
            </>
          }
        >
          <Greeting text={greetingText} />
          <WelcomeMark />
          <OrnamentDivider mark="♥" />
          <HeroSupportingText text={heroSupportingText} />
          <div className="home-daily-message-slot">
            <DailyMessage message={getPath(data, 'dailyMessage', null)} />
          </div>
        </Hero>

        <div className="home-mood-panel">
          <div className="home-content-stack">
            <MoodSelector onMoodSelected={handleMoodSelected} />
            <RecommendedRoom
              room={getPath(data, 'recommendedRoom', null)}
              onSelect={handleRecommendedRoomSelect}
            />
            <HomeFooter footer={getPath(data, 'footer', null)} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default HomePage;