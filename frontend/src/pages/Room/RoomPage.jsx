/**
 * RoomPage.jsx
 *
 * The Room Experience screen. Built with the exact architecture
 * established for HomePage and MoodLandingPage: this page is the SOLE
 * layout owner. It decides hero composition, spacing, section order,
 * card placement, and loading/error/empty presentation. Nested reusable
 * components (PageContainer, IconButton, Button, Loading, ErrorState)
 * render only themselves — nothing else is broken into a separate
 * component file, keeping the whole screen legible as one unit.
 *
 * Data flow: useRoom(roomSlug) — already-existing, unmodified hook from
 * Phase F1 — fetches GET /api/rooms/:roomSlug via roomService and
 * apiClient. No new hook or service was required; the Room Experience
 * contract documented by the backend audit maps directly onto the
 * existing useRoom/roomService chain.
 *
 * NAVIGATION: this page NEVER decides where a click leads. Every
 * interactive element (featured primary/secondary action, each action
 * card, each highlight item) calls handleNavigate(), which does nothing
 * but forward the backend-supplied { experience, params } object upward
 * via the onNavigate prop. This page has zero knowledge of what "HEAR",
 * "READ", "SEE", or "MEMORY" mean — that interpretation belongs entirely
 * to whatever navigation owner receives onNavigate (App.jsx).
 *
 * Every piece of business content (hero title/subtitle/last-updated
 * label, featured card, actions, highlights, footer) comes from the
 * backend via useRoom(). Field access uses getPath() throughout, since
 * exact nesting can vary defensively even against a documented contract.
 * A small number of purely structural UI affordances (chevron glyphs,
 * a clock icon beside the "last updated" label, a generic "Open" button
 * label) are local UI chrome, not backend content — consistent with the
 * same precedent already established in HomePage/MoodLandingPage
 * (e.g. "I don't know" tile copy, back-arrow glyph).
 *
 * THEME IMAGE CONFIG: this page has no knowledge of how a room's theme
 * image should be positioned. AssetRegistry.getRoomTheme() returns the
 * full visual config — { image, position } — and this page simply
 * renders both values into the hero's inline style. No positioning
 * value is ever hardcoded here.
 */

import React from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import Button from '../../components/common/Button';
import { useRoom } from '../../hooks/useRoom';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './RoomPage.css';

function isValidNavigation(navigation) {
    return Boolean(navigation) && typeof navigation === 'object' && navigation.experience;
}

function RoomPage({ roomSlug, onBack, onNavigation }) {
    const { room: experience, roomLoading, roomError, refetchRoom } = useRoom(roomSlug);

    // Backend is now the single source of truth for time — never
    // calculated client-side. Falls back to null if theme/timeVariant
    // is absent from the payload; AssetRegistry.getRoomTheme() already
    // defaults to "day" internally when passed a falsy value.
    const timeVariant = getPath(experience, 'theme.timeVariant', undefined);

    const roomTheme = AssetRegistry.getRoomTheme(roomSlug, timeVariant);
    console.log("Room slug:", roomSlug);
    console.log("Room theme:", roomTheme);

    const heroStyle = roomTheme?.image
        ? {
            backgroundImage: `url(${roomTheme.image})`,
            backgroundPosition: roomTheme.position || undefined,
        }
        : undefined;

    // NOTE: AssetRegistry v1 has no equivalent of the old generic icon
    // resolver. The room-hero icon badge (top-right of the hero) has no
    // mapping in the new asset system, so it renders nothing rather than
    // calling a method that no longer exists. Flag for follow-up if a
    // per-room icon asset is added later.
    const roomIconImage = null;

    const heroTitle = getPath(experience, 'hero.title', null);
    const heroSubtitle = getPath(experience, 'hero.subtitle', null);
    const lastUpdatedLabel = getPath(experience, 'hero.lastUpdatedLabel', null);

    const featured = getPath(experience, 'featured', null);
    const featuredBadgeText = getPath(featured, 'badgeText', null);
    const featuredBadgeIcon = getPath(featured, 'badgeIcon', null);
    const featuredTitle = getPath(featured, 'title', null);
    const featuredSubtitle = getPath(featured, 'subtitle', null);
    // NOTE: AssetRegistry v1 has no per-room "recommendation artwork"
    // mapping (only theme + card). Featured-card imagery renders nothing
    // for now rather than calling the removed resolveRoomRecommendationArtwork
    // method. Flag for follow-up once a real asset exists for this slot.
    const featuredImage = null;
    const featuredPrimaryNavigation = getPath(featured, 'primaryAction.navigation', null);
    const featuredSecondaryNavigation = getPath(featured, 'secondaryAction.navigation', null);

    const actions = getPath(experience, 'actions', []);
    const actionList = Array.isArray(actions) ? actions : [];

    const highlights = getPath(experience, 'highlights', null);
    const highlightsTitle = getPath(highlights, 'title', null);
    const highlightsSubtitle = getPath(highlights, 'subtitle', null);
    const highlightItems = getPath(highlights, 'items', []);
    const highlightList = Array.isArray(highlightItems) ? highlightItems : [];

    const footer = getPath(experience, 'footer', null);
    const footerIcon = getPath(footer, 'icon', null);
    const footerText = getPath(footer, 'text', null);
    // NOTE: AssetRegistry v1 has no decoration resolver. Footer decorative
    // imagery renders nothing rather than calling the removed
    // resolveDecoration method. Flag for follow-up.
    const footerDecorativeImage = null;

    const handleNavigate = (navigation) => {
        if (!isValidNavigation(navigation)) return;
        if (onNavigation) {
            onNavigation({
                success: true,
                navigation,
                data: {},
            });
        }
    };

    const handleBack = () => {
        if (onBack) onBack();
    };

    return (
        <PageContainer
            loading={roomLoading}
            error={roomError}
            data={experience}
            onRetry={refetchRoom}
            emptyTitle="Nothing here yet"
            emptyMessage="Check back soon."
        >
            <div className="room-canvas">
                <div
                    className="room-hero"
                    style={heroStyle}
                >
                    <div className="room-hero-top">
                        <IconButton icon="←" ariaLabel="Go back" onClick={handleBack} />

                        {roomIconImage && (
                            <span className="room-hero-icon-badge" aria-hidden="true">
                                <img src={roomIconImage} alt="" className="room-hero-icon-image" />
                            </span>
                        )}
                    </div>

                    <div className="room-hero-overlay">
                        <div className="room-hero-content">
                            {heroTitle && <h1 className="room-hero-title">{heroTitle}</h1>}
                            {heroSubtitle && <p className="room-hero-subtitle">{heroSubtitle}</p>}

                            {lastUpdatedLabel && (
                                <span className="room-hero-updated-label">
                                    <span className="room-hero-updated-icon" aria-hidden="true">
                                        🕐
                                    </span>
                                    {lastUpdatedLabel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="room-panel">
                    <div className="room-content-stack">
                        {featured && featuredTitle && (
                            <section className="room-featured" aria-label="Featured">
                                <div
                                    className="room-featured-image"
                                    style={featuredImage ? { backgroundImage: `url(${featuredImage})` } : undefined}
                                    aria-hidden="true"
                                ></div>

                                <div className="room-featured-body">
                                    {(featuredBadgeText || featuredBadgeIcon) && (
                                        <span className="room-featured-badge">
                                            {featuredBadgeText}
                                            {featuredBadgeIcon && (
                                                <span aria-hidden="true"> {featuredBadgeIcon}</span>
                                            )}
                                        </span>
                                    )}

                                    <p className="room-featured-title">{featuredTitle}</p>
                                    {featuredSubtitle && (
                                        <p className="room-featured-subtitle">{featuredSubtitle}</p>
                                    )}
                                </div>

                                <div className="room-featured-actions">
                                    {isValidNavigation(featuredPrimaryNavigation) && (
                                        <IconButton
                                            icon="▶"
                                            ariaLabel="Open"
                                            className="room-featured-primary"
                                            onClick={() => handleNavigate(featuredPrimaryNavigation)}
                                        />
                                    )}

                                    {isValidNavigation(featuredSecondaryNavigation) && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleNavigate(featuredSecondaryNavigation)}
                                        >
                                            Open ›
                                        </Button>
                                    )}
                                </div>
                            </section>
                        )}

                        {actionList.length > 0 && (
                            <section className="room-actions" aria-label="What would you like to do?">
                                <div className="room-actions-grid">
                                    {actionList.map((action, index) => (
                                        <button
                                            key={action.navigation?.params?.contentId || action.title || index}
                                            type="button"
                                            className="room-action-card"
                                            data-index={index % 4}
                                            onClick={() => handleNavigate(action.navigation)}
                                        >
                                            {(() => {
                                                const experienceType = action.navigation?.experience?.toLowerCase();
                                                const actionIconImage = AssetRegistry.getExperienceIcon(experienceType);
                                                if (actionIconImage) {
                                                    return (
                                                        <img
                                                            src={actionIconImage}
                                                            alt=""
                                                            className="room-action-icon"
                                                            aria-hidden="true"
                                                        />
                                                    );
                                                }
                                                return action.icon ? (
                                                    <span className="room-action-icon" aria-hidden="true">
                                                        {action.icon}
                                                    </span>
                                                ) : null;
                                            })()}
                                            <span className="room-action-text">
                                                <span className="room-action-title">{action.title}</span>
                                                {action.subtitle && (
                                                    <span className="room-action-subtitle">{action.subtitle}</span>
                                                )}
                                            </span>
                                            <span className="room-action-chevron" aria-hidden="true">
                                                ›
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {highlights && highlightList.length > 0 && (
                            <section className="room-highlights" aria-label={highlightsTitle || 'Highlights'}>
                                {highlightsTitle && (
                                    <h2 className="room-highlights-title">{highlightsTitle}</h2>
                                )}
                                {highlightsSubtitle && (
                                    <p className="room-highlights-subtitle">{highlightsSubtitle}</p>
                                )}

                                <div className="room-highlights-scroll">
                                    {highlightList.map((item, index) => {
                                        // NOTE: AssetRegistry v1 has no per-section thumbnail
                                        // resolver. Highlight thumbnails render nothing rather
                                        // than calling the removed resolveRoomSectionArtwork
                                        // method. Flag for follow-up.
                                        const thumbnailImage = null;

                                        return (
                                            <button
                                                key={item.navigation?.params?.contentId || item.title || index}
                                                type="button"
                                                className="room-highlight-card"
                                                onClick={() => handleNavigate(item.navigation)}
                                            >
                                                <span
                                                    className="room-highlight-thumbnail"
                                                    style={thumbnailImage ? { backgroundImage: `url(${thumbnailImage})` } : undefined}
                                                >
                                                    <span className="room-highlight-play-icon" aria-hidden="true">
                                                        ▶
                                                    </span>
                                                </span>

                                                <span className="room-highlight-info">
                                                    <span className="room-highlight-item-title">{item.title}</span>
                                                    {(item.badge || item.duration) && (
                                                        <span className="room-highlight-meta">
                                                            {item.badge}
                                                            {item.badge && item.duration ? ' · ' : ''}
                                                            {item.duration}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {footer && footerText && (
                            <footer className="room-footer">
                                <hr className="divider" />
                                <p className="room-footer-text">
                                    {footerText}
                                    {footerIcon && <span aria-hidden="true"> {footerIcon}</span>}
                                </p>
                                {footerDecorativeImage && (
                                    <img
                                        src={footerDecorativeImage}
                                        alt=""
                                        className="room-footer-decoration"
                                        aria-hidden="true"
                                    />
                                )}
                            </footer>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

export default RoomPage;