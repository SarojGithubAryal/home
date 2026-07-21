/**
 * MoodLandingPage.jsx
 *
 * The Mood Landing screen — shown after a mood is selected on Home.
 * This page is the SOLE layout owner of its own screen. It decides hero
 * composition, spacing, section order, card placement, and
 * loading/error/footer presentation. Nested reusable components
 * (IconButton, OrnamentDivider, Loading, ErrorState) render only
 * themselves.
 *
 * This file has NO knowledge of HomePage — it never imports it, never
 * renders it. Its `moodSlug` prop and `onBack` callback are both
 * supplied entirely by App.jsx, which owns all navigation centrally.
 * When the back button is pressed, this page simply calls onBack(); it
 * does not decide what "back" means or which page comes next.
 *
 * Data flow: useMoodLanding(moodSlug) fetches this page's own backend
 * data independently, exactly matching the same isolated-fetch pattern
 * as HomePage's useHome(). No backend payload from Home is ever passed
 * into this page — only the moodSlug navigation identifier.
 *
 * Every piece of business content — badge, headline, paragraph, section
 * title/subtitle, destination list, alternative option — comes from the
 * backend via useMoodLanding(). Field access uses getPath() throughout,
 * since the exact backend JSON shape is not confirmed (see
 * moodLandingService.js header) — this page defensively degrades
 * (renders nothing for a missing field) rather than assuming a rigid
 * schema.
 */

import React from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import OrnamentDivider from '../../components/common/OrnamentDivider';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { useMoodLanding } from '../../hooks/useMoodLanding';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './MoodLandingPage.css';

function MoodLandingPage({ moodSlug, onBack, onNavigation }) {
  const { data, loading, error, refetch } = useMoodLanding(moodSlug);

  const heroImage = AssetRegistry.getMoodLandingTheme();

  const badgeEmoji = getPath(data, 'hero.badgeEmoji', null);
  const badgeText = getPath(data, 'hero.badgeText', null);
  const headline = getPath(data, 'hero.headline', null);
  const headlineDecoration = getPath(data, 'hero.headlineDecoration', null);
  const paragraph = getPath(data, 'hero.paragraph', null);

  const sectionTitle = getPath(data, 'section.title', null);
  const sectionSubtitle = getPath(data, 'section.subtitle', null);

  const rooms = getPath(data, 'rooms', []);
  const roomList = Array.isArray(rooms) ? rooms : [];

  const alternativeText = getPath(data, 'alternativeOption.text', null);
  const alternativeIcon = getPath(data, 'alternativeOption.icon', null);
  const alternativeRoute = getPath(data, 'alternativeOption.route', null);

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleRoomSelect = (room) => {
    if (room.navigation && onNavigation) {
      // Wrap navigation into the expected response format
      onNavigation({
        success: true,
        navigation: room.navigation,
        data: {},
      });
    }
  };

  const handleAlternativeSelect = () => {
    console.log('Navigate to alternative option (pending routing integration):', alternativeRoute);
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
      <div className="mood-landing-canvas">
        <div
          className="mood-landing-hero"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
        >
          <div className="mood-landing-hero-top">
            <IconButton icon="←" ariaLabel="Go back" onClick={handleBack} />

            {(badgeEmoji || badgeText) && (
              <span className="mood-landing-badge">
                {badgeEmoji && (
                  <span className="mood-landing-badge-emoji" aria-hidden="true">
                    {badgeEmoji}
                  </span>
                )}
                {badgeText && <span className="mood-landing-badge-text">{badgeText}</span>}
              </span>
            )}
          </div>

          <div className="mood-landing-hero-overlay">
            <div className="mood-landing-hero-content">
              {headline && (
                <h1 className="mood-landing-headline">
                  {headline}
                  {headlineDecoration && (
                    <span className="mood-landing-headline-decoration" aria-hidden="true">
                      {' '}
                      {headlineDecoration}
                    </span>
                  )}
                </h1>
              )}

              {paragraph && <p className="mood-landing-paragraph">{paragraph}</p>}

              <OrnamentDivider mark="♥" />
            </div>
          </div>
        </div>

        <div className="mood-landing-panel">
          <div className="mood-landing-content-stack">
            <section className="mood-landing-section" aria-labelledby="mood-landing-section-title">
              {sectionTitle && (
                <h2 id="mood-landing-section-title" className="mood-landing-section-title">
                  {sectionTitle}
                </h2>
              )}
              {sectionSubtitle && (
                <p className="mood-landing-section-subtitle">{sectionSubtitle}</p>
              )}

              {roomList.length > 0 && (
                <div className="mood-landing-destination-list">
                  {roomList.map((room) => {
                    const roomCardImage = AssetRegistry.getRoomCard(
                      room?.navigation?.params?.roomSlug
                    );
                    return (
                    <button
                      key={room.id}
                      type="button"
                      className="mood-landing-destination-card"
                      onClick={() => handleRoomSelect(room)}
                    >
                      <span
                        className="mood-landing-destination-image"
                        aria-hidden="true"
                        style={roomCardImage ? { backgroundImage: `url(${roomCardImage})` } : undefined}
                      ></span>

                      <span className="mood-landing-destination-body">
                        <span className="mood-landing-destination-title">
                          {room.title}
                          {room.emoji && (
                            <span className="mood-landing-destination-emoji" aria-hidden="true">
                              {' '}
                              {room.emoji}
                            </span>
                          )}
                        </span>
                        {room.subtitle && (
                          <span className="mood-landing-destination-subtitle">
                            {room.subtitle}
                          </span>
                        )}
                      </span>

                      <span className="mood-landing-destination-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                    );
                  })}
                </div>
              )}
            </section>

            {alternativeText && (
              <button
                type="button"
                className="mood-landing-alternative"
                onClick={handleAlternativeSelect}
              >
                {alternativeIcon && (
                  <span className="mood-landing-alternative-icon" aria-hidden="true">
                    {alternativeIcon}
                  </span>
                )}
                <span className="mood-landing-alternative-text">{alternativeText}</span>
                <span className="mood-landing-alternative-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default MoodLandingPage;