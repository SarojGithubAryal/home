/**
 * HearPage.jsx
 *
 * The Hear Experience screen. Follows the exact architecture already
 * established for RoomPage.jsx: this page is the SOLE layout owner.
 * Internal helper components (HearHeader, TabBar, FeaturedAudioCard,
 * AudioListItem, MiniPlayerBar) live inside this file only — none of
 * them are extracted into components/. Only genuinely reusable
 * components (PageContainer, IconButton, Button) are imported.
 *
 * Data flow: useHear(roomSlug, { tabId }) fetches
 * GET /api/rooms/:roomSlug/hear via the existing roomService, exactly
 * matching the Room Sub-Experience API spec. Tab switching re-fetches
 * by changing the tabId passed into useHear — the backend, not this
 * page, decides what each tab contains.
 *
 * NAVIGATION: this page never decides where a click leads. Every
 * navigable item (featured card, list item) calls handleNavigate(),
 * which does nothing but forward the backend-supplied
 * { experience, params } object upward via onNavigation, wrapped in the
 * standard { success, navigation, data } envelope — identical pattern
 * to RoomPage.jsx's handleNavigate.
 *
 * Inline playback (play/pause icon per row, persistent mini player bar)
 * is local UI state only — which item is "currently playing" and its
 * play position are frontend concerns per the API spec's "Playback &
 * Player Configuration" section ("the frontend decides playback
 * behavior"). No business content is invented; all titles, subtitles,
 * durations, badges, and thumbnails come from the backend.
 */

import React, { useRef, useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useHear } from '../../hooks/useHear';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath, classNames } from '../../utils/helpers';
import './HearPage.css';
import EmptyExperience from '../../components/common/EmptyExperience';

function isValidNavigation(navigation) {
    return Boolean(navigation) && typeof navigation === 'object' && navigation.experience;
}

function HearHeader({ title, onBack, onBookmark, onMore }) {
    const hearIconImage = AssetRegistry.getExperienceIcon('hear');

    return (
        <div className="hear-header">
            <div className="hear-header-left">
                <IconButton
                    icon="←"
                    ariaLabel="Go back"
                    onClick={onBack}
                />

                <h1 className="hear-header-title">
                    {title}

                    {hearIconImage ? (
                        <img
                            src={hearIconImage}
                            alt=""
                            className="hear-header-icon"
                            aria-hidden="true"
                        />
                    ) : (
                        <span
                            className="hear-header-icon"
                            aria-hidden="true"
                        >
                            🎧
                        </span>
                    )}
                </h1>
            </div>

            <div className="hear-header-actions">
                <IconButton
                    icon="🔖"
                    ariaLabel="Bookmark"
                    onClick={onBookmark}
                />

                <IconButton
                    icon="⋯"
                    ariaLabel="More options"
                    onClick={onMore}
                />
            </div>
        </div>
    );
}

function TabBar({ tabs, activeTabId, onSelectTab }) {
    if (!Array.isArray(tabs) || tabs.length === 0) return null;

    return (
        <div className="hear-tab-bar" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={tab.id === activeTabId}
                    className={classNames('hear-tab', tab.id === activeTabId && 'hear-tab--active')}
                    onClick={() => onSelectTab(tab.id)}
                >
                    {tab.title}
                </button>
            ))}
        </div>
    );
}

function FeaturedAudioCard({ item, onNavigate }) {
    // NOTE: AssetRegistry v1 has no per-section thumbnail resolver;
    // renders without a background image rather than calling the
    // removed resolveRoomSectionArtwork method.
    const thumbnail = null;

    return (
        <button
            type="button"
            className="hear-featured-card"
            style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
            onClick={() => onNavigate(item.navigation)}
        >
            <span className="hear-featured-overlay">
                {item.badge && <span className="hear-featured-badge">{item.badge}</span>}
                <span className="hear-featured-title">{item.title}</span>
                {item.subtitle && <span className="hear-featured-subtitle">{item.subtitle}</span>}
            </span>
        </button>
    );
}

function AudioListItem({ item, isPlaying, onTogglePlay, onNavigate }) {
    // NOTE: see FeaturedAudioCard above — no v1 equivalent yet.
    const thumbnail = null;

    const handlePlayClick = (event) => {
        event.stopPropagation();
        onTogglePlay(item);
    };

    return (
        <button
            type="button"
            className={classNames('hear-list-item', isPlaying && 'hear-list-item--playing')}
            onClick={() => onNavigate(item.navigation)}
        >
            <span
                className="hear-list-item-thumbnail"
                style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
                aria-hidden="true"
            >
                {item.badge && <span className="hear-list-item-badge">{item.badge}</span>}
            </span>

            <span className="hear-list-item-body">
                <span className="hear-list-item-title">{item.title}</span>
                {item.subtitle && <span className="hear-list-item-subtitle">{item.subtitle}</span>}
                {item.durationLabel && (
                    <span className="hear-list-item-meta">{item.durationLabel}</span>
                )}
            </span>

            <span
                role="button"
                tabIndex={0}
                className="hear-list-item-play"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={handlePlayClick}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') handlePlayClick(event);
                }}
            >
                {isPlaying ? '⏸' : '▶'}
            </span>
        </button>
    );
}

function MiniPlayerBar({ item, isPlaying, onTogglePlay, onExpand }) {
    if (!item) return null;

    return (
        <div className="hear-mini-player" onClick={onExpand}>
            <span className="hear-mini-player-title">{item.title}</span>
            {item.durationLabel && (
                <span className="hear-mini-player-meta">{item.durationLabel}</span>
            )}
            <span
                role="button"
                tabIndex={0}
                className="hear-mini-player-toggle"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={(event) => {
                    event.stopPropagation();
                    onTogglePlay(item);
                }}
            >
                {isPlaying ? '⏸' : '▶'}
            </span>
        </div>
    );
}

function HearPage({ roomSlug, onBack, onNavigation }) {
    const [activeTabId, setActiveTabId] = useState(null);
    const [playingItemId, setPlayingItemId] = useState(null);
    const audioRef = useRef(null);

    const { data, loading, error, refetch } = useHear(roomSlug, { tabId: activeTabId });

    const configTitle = getPath(data, 'config.title', null);
    const configSubtitle = getPath(data, 'config.subtitle', null);

    const pageQuote = getPath(data, 'pageQuote', null);

    const stats = getPath(data, 'stats', []);

    const emptyStateText = getPath(data, 'config.emptyStateText', null);
    const showTabs = getPath(data, 'config.showTabs', false);
    const showFeatured = getPath(data, 'config.showFeatured', false);

    const tabs = getPath(data, 'tabs', []);
    const tabList = Array.isArray(tabs) ? tabs : [];
    const resolvedActiveTabId = activeTabId || getPath(data, 'activeTabId', null);

    const featured = getPath(data, 'featured', []);
    const featuredList = Array.isArray(featured) ? featured : [];

    const items = getPath(data, 'items', []);
    const itemList = Array.isArray(items) ? items : [];

    const experienceState = getPath(data, 'state', 'POPULATED');
    const isEmptyExperience = experienceState === 'EMPTY';

    const playingItem =
        itemList.find((item) => item.id === playingItemId) || null;
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

    const handleTogglePlay = (item) => {
        const mediaUrl = getPath(item, 'media.0.url', null);

        if (playingItemId === item.id) {
            audioRef.current?.pause();
            setPlayingItemId(null);
            return;
        }

        setPlayingItemId(item.id);

        if (audioRef.current && mediaUrl) {
            audioRef.current.src = mediaUrl;
            audioRef.current.play().catch(() => { });
        }
    };

    const handleSelectTab = (tabId) => {
        setActiveTabId(tabId);
    };

    const handleBack = () => {
        if (onBack) onBack();
    };

    return (
        <PageContainer
            loading={loading}
            error={error}
            data={data}
            onRetry={refetch}
            emptyTitle="Nothing here yet"
            emptyMessage={emptyStateText || 'Check back soon.'}
        >
            <div className="hear-canvas">
                <div className="hear-content">
                    <HearHeader
                        title={configTitle}
                        onBack={handleBack}
                        onBookmark={() => console.log('Bookmark (pending feature)')}
                        onMore={() => console.log('More options (pending feature)')}
                    />

                    {!isEmptyExperience && (
                        <>
                            {configSubtitle && (
                                <div className="hear-subtitle">
                                    {configSubtitle}
                                </div>
                            )}

                            {pageQuote?.text && (
                                <div className="hear-page-quote">
                                    {pageQuote.text}
                                </div>
                            )}

                            {Array.isArray(stats) && stats.length > 0 && (
                                <div className="hear-stats">
                                    {stats.map((stat) => (
                                        <div
                                            key={stat.id}
                                            className="hear-stat"
                                        >
                                            <div className="hear-stat-value">
                                                {stat.value}
                                            </div>

                                            <div className="hear-stat-label">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {isEmptyExperience ? (
                        <EmptyExperience
                            icon="🎧"
                            title={emptyStateText || 'No recordings yet'}
                            subtitle={configSubtitle}
                        />) : (
                        <>
                            {showTabs && (
                                <TabBar
                                    tabs={tabList}
                                    activeTabId={resolvedActiveTabId}
                                    onSelectTab={handleSelectTab}
                                />
                            )}

                            {showFeatured && featuredList.length > 0 && (
                                <div className="hear-featured-row">
                                    {featuredList.map((item) => (
                                        <FeaturedAudioCard
                                            key={item.id}
                                            item={item}
                                            roomSlug={roomSlug}
                                            onNavigate={handleNavigate}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="hear-list">
                                {itemList.map((item) => (
                                    <AudioListItem
                                        key={item.id}
                                        item={item}
                                        roomSlug={roomSlug}
                                        isPlaying={playingItemId === item.id}
                                        onTogglePlay={handleTogglePlay}
                                        onNavigate={handleNavigate}
                                    />
                                ))}
                            </div>

                            <audio
                                ref={audioRef}
                                onEnded={() => setPlayingItemId(null)}
                            />
                        </>
                    )}
                </div>
            </div>

            {!isEmptyExperience && (
                <MiniPlayerBar
                    item={playingItem}
                    isPlaying={Boolean(playingItem)}
                    onTogglePlay={handleTogglePlay}
                    onExpand={() =>
                        playingItem && handleNavigate(playingItem.navigation)
                    }
                />
            )}
        </PageContainer>
    );
}

export default HearPage;