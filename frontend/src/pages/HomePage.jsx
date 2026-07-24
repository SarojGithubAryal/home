/**
 * HomePage.jsx
 *
 * Home Experience
 */

import React from 'react';
import PageContainer from '../layouts/PageContainer';
import IconButton from '../components/common/IconButton';
import OrnamentDivider from '../components/common/OrnamentDivider';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import MoodGrid from '../components/mood/MoodGrid';
import UnknownMoodTile from '../components/mood/UnknownMoodTile';
import { useHome } from '../hooks/useHome';
import { useMoods } from '../hooks/useMoods';
import AssetRegistry from '../assets/AssetRegistry';
import { getPath } from '../utils/helpers';
import './HomePage.css';

const WELCOME_MARK_PHRASE = 'welcome home';

function isRedundantGreeting(text) {
  if (typeof text !== 'string') return false;
  return text.trim().toLowerCase().replace(/[.!]+$/, '') === WELCOME_MARK_PHRASE;
}

function HomePage({ onNavigation }) {
  const { data, loading, error, refetch } = useHome();

  const {
    moods,
    moodsLoading,
    moodsError,
    refetchMoods,
    selectMood,
    selecting,
  } = useMoods();

  // Backend is now the single source of truth for time — never
  // calculated client-side. Falls back to null if theme/timeVariant
  // is absent from the payload; AssetRegistry.getHomeTheme() already
  // defaults to "day" internally when passed a falsy value.
  const timeVariant = getPath(data, 'theme.timeVariant', null);

  const heroImage = AssetRegistry.getHomeTheme(timeVariant);

  const rawGreetingText =
    getPath(data, 'greeting.text', null) ||
    getPath(data, 'greeting', null);

  const baseGreetingText =
    typeof rawGreetingText === 'string' &&
    !isRedundantGreeting(rawGreetingText)
      ? rawGreetingText
      : null;

  // Per backend contract: the greeting name comes from
  // greeting.username specifically — NOT userProfile.displayName,
  // which is currently only a placeholder field. getPath() falls back
  // to null safely if greeting.username is missing or the greeting
  // shape ever changes, so this never throws — it just omits the name.
  const greetingUsername = getPath(data, 'greeting.username', null);

  // Appends ", {username}!" to the backend's greeting text (e.g.
  // "Good afternoon." -> "Good afternoon, Sana!"), without touching
  // the greeting text itself or any time-of-day logic. Strips a
  // single trailing "!" or "." from the base greeting before
  // appending, since the combined string supplies its own closing
  // "!". If greeting.username is missing or empty, greetingText stays
  // exactly baseGreetingText — no dangling comma or exclamation mark.
  const hasGreetingUsername =
    typeof greetingUsername === 'string' && greetingUsername.trim().length > 0;

  const greetingText =
    baseGreetingText && hasGreetingUsername
      ? `${baseGreetingText.replace(/[.!]+$/, '')}, ${greetingUsername.trim()}!`
      : baseGreetingText;

  const heroSupportingText =
    getPath(data, 'hero.subtitle', null);

  const dailyMessage = getPath(data, 'dailyMessage', null);

  const dailyMessageText =
    typeof dailyMessage === 'string'
      ? dailyMessage
      : getPath(dailyMessage, 'text', null);

  const dailyMessageSubtext =
    typeof dailyMessage === 'object'
      ? getPath(dailyMessage, 'subtext', null)
      : null;

  const recommendedRoom = getPath(data, 'recommendedRoom', null);

  const recommendedRoomTitle =
    getPath(recommendedRoom, 'name', null) ||
    getPath(recommendedRoom, 'title', null);

  const recommendedRoomDescription =
    getPath(recommendedRoom, 'description', null) ||
    getPath(recommendedRoom, 'quote', null);

  const recommendedRoomCtaLabel =
    getPath(recommendedRoom, 'ctaLabel', null) || 'Enter';

  const footer = getPath(data, 'footer', null);

  const footerIcon = getPath(footer, 'icon', null);

  const footerLines = getPath(footer, 'lines', null);

  const footerText = getPath(footer, 'text', null);

  const footerContent =
    Array.isArray(footerLines) && footerLines.length > 0
      ? footerLines
      : footerText
      ? [footerText]
      : [];

  const moodList =
    Array.isArray(moods)
      ? moods
      : getPath(moods, 'items', []) || [];

  const handleMenuOpen = () => {
    console.log('Menu');
  };

  const handleSoundToggle = () => {
    console.log('Sound');
  };

  const handleMoodSelect = async (mood) => {
    const navigation = await selectMood({
      moodId: mood.id,
    });

    if (navigation && onNavigation) {
      onNavigation({
        success: true,
        navigation,
        data: {},
      });
    }
  };

  const handleRecommendedRoomSelect = () => {
    console.log(recommendedRoom);
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
        <div
          className="home-hero"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="home-hero-top">
            <IconButton
              icon="☰"
              ariaLabel="Open menu"
              onClick={handleMenuOpen}
            />

            <IconButton
              icon="♪"
              ariaLabel="Toggle sound"
              onClick={handleSoundToggle}
            />
          </div>

          <div className="home-hero-overlay">
            <div className="home-hero-content">
              {greetingText && (
                <p className="home-greeting">
                  {greetingText}
                </p>
              )}

              <p className="home-welcome-mark">
                Welcome home{' '}
                <span
                  className="home-welcome-mark-heart"
                  aria-hidden="true"
                >
                  ❤
                </span>
              </p>

              <OrnamentDivider mark="♥" />

              {heroSupportingText && (
                <p className="home-hero-supporting-text">
                  {heroSupportingText}
                </p>
              )}

              {dailyMessageText && (
                <p className="home-affirmation">
                  {dailyMessageText}

                  {dailyMessageSubtext && (
                    <>
                      <br />

                      <span className="home-affirmation-subtext">
                        {dailyMessageSubtext}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="home-mood-panel">
          <div className="home-content-stack">
            <section
              className="home-mood-section"
              aria-labelledby="home-mood-title"
            >
              <h2
                id="home-mood-title"
                className="home-mood-title"
              >
                How are you feeling today?
              </h2>

              <p className="home-mood-subtitle">
                It's okay to feel any of it.
              </p>

              {moodsLoading && (
                <Loading
                  variant="inline"
                  message="Loading moods"
                />
              )}

              {!moodsLoading && moodsError && (
                <ErrorState
                  error={moodsError}
                  onRetry={refetchMoods}
                />
              )}

              {!moodsLoading && !moodsError && (
                <div className="home-mood-body">
                  <MoodGrid
                    moods={moodList}
                    onSelect={handleMoodSelect}
                  />

                  <UnknownMoodTile
                    onSelect={handleMoodSelect}
                  />
                </div>
              )}

              {selecting && (
                <Loading
                  variant="inline"
                  message="Saving your mood"
                />
              )}
            </section>

            {recommendedRoomTitle && (
              <section
                className="home-recommended-section"
                aria-labelledby="home-recommended-title"
              >
                <h2
                  id="home-recommended-title"
                  className="home-recommended-heading"
                >
                  Recommended for you
                </h2>

                <div className="home-recommended-card">
                  <div className="home-recommended-body">
                    <p className="home-recommended-title">
                      {recommendedRoomTitle}
                    </p>

                    {recommendedRoomDescription && (
                      <p className="home-recommended-description">
                        {recommendedRoomDescription}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleRecommendedRoomSelect}
                  >
                    {recommendedRoomCtaLabel}
                  </Button>
                </div>
              </section>
            )}

            {footerContent.length > 0 && (
              <footer className="home-footer">
                <OrnamentDivider mark="🌿" />

                <p className="home-footer-text">
                  {footerContent.join(' ')}

                  {footerIcon && (
                    <span aria-hidden="true">
                      {' '}
                      {footerIcon}
                    </span>
                  )}
                </p>
              </footer>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default HomePage;