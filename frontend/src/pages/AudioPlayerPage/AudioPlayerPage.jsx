/**
 * AudioPlayerPage.jsx
 *
 * Full-screen audio player, reached via navigation.params.contentId.
 * Uses the universal GET /api/contents/:contentId endpoint (Backend API
 * v1.0). No roomSlug is available or needed here.
 *
 * REMOVED from the earlier temporary version: reliance on an assumed
 * `thumbnailAssetKey`/`backgroundAssetKey` field resolved via
 * AssetRegistry (not part of the frozen content contract, and
 * AssetRegistry's room-scoped resolvers require a roomSlug this page no
 * longer has). Any background imagery now comes directly from
 * content.media[] URLs, per the documented media shape — no semantic
 * asset resolution needed for content-level media.
 *
 * REMOVED: the "Why am I seeing this?" affordance — not part of the
 * frozen content contract, no documented field plausibly maps to it.
 * Should be reintroduced once/if the backend defines it.
 *
 * Kept: badge sourced from content.content_type (documented field);
 * duration from content.media[0].duration_seconds (documented).
 * Playback state (isPlaying, currentTime) remains local UI state, per
 * the API spec's explicit statement that playback behavior is a
 * frontend concern.
 */

import React, { useEffect, useRef, useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import { getPath } from '../../utils/helpers';
import './AudioPlayerPage.css';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function AudioPlayerPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comforted, setComforted] = useState(false);

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const subtitle = getPath(content, 'excerpt', null);
  const badge = getPath(content, 'content_type', null);

  const media = getPath(content, 'media', []);
  const mediaList = Array.isArray(media) ? media : [];
  const audioMedia = mediaList.find((item) => item.media_type === 'audio') || null;
  const imageMedia = mediaList.find((item) => item.media_type === 'image') || null;

  const mediaUrl = audioMedia?.url || null;
  const mediaDuration = audioMedia?.duration_seconds || null;
  const heroImage = imageMedia?.url || null;

  useEffect(() => {
    if (mediaDuration) setDuration(mediaDuration);
  }, [mediaDuration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const seekBy = (deltaSeconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + deltaSeconds));
  };

  const handleSeek = (event) => {
    if (!audioRef.current || !duration) return;
    const percent = Number(event.target.value) / 100;
    audioRef.current.currentTime = percent * duration;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div
        className="audio-player-canvas"
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      >
        <div className="audio-player-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="audio-player-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="audio-player-overlay">
          {badge && <span className="audio-player-badge">{badge}</span>}
          {title && <h1 className="audio-player-title">{title}</h1>}
          <span className="audio-player-divider" aria-hidden="true">♥</span>
          {subtitle && <p className="audio-player-subtitle">{subtitle}</p>}

          <div className="audio-player-meta">
            <span>{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progressPercent}
            onChange={handleSeek}
            className="audio-player-progress"
            aria-label="Seek"
          />
          <div className="audio-player-time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="audio-player-transport">
            <button type="button" className="audio-player-transport-btn" onClick={() => seekBy(-15)} aria-label="Rewind 15 seconds">↺15</button>
            <button type="button" className="audio-player-transport-btn" aria-label="Previous">⏮</button>
            <button type="button" className="audio-player-transport-btn audio-player-transport-btn--primary" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button type="button" className="audio-player-transport-btn" aria-label="Next">⏭</button>
            <button type="button" className="audio-player-transport-btn" onClick={() => seekBy(15)} aria-label="Forward 15 seconds">15↻</button>
          </div>

          <button
            type="button"
            className="audio-player-comfort-btn"
            onClick={() => setComforted(!comforted)}
            aria-pressed={comforted}
          >
            {comforted ? '❤' : '♡'} This comforts me
          </button>
        </div>

        <audio
          ref={audioRef}
          src={mediaUrl || undefined}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration || duration)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </PageContainer>
  );
}

export default AudioPlayerPage;