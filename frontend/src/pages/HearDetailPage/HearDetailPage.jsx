/**
 * HearDetailPage.jsx (renamed from AudioPlayerPage.jsx)
 *
 * Full-screen audio player. Reached only from HearPage (list) via
 * navigation.params.contentId. Uses GET /api/contents/:contentId.
 * Renders exactly one item — no list, no tabs, no browsing.
 *
 * "Why am I seeing this" reads defensively from content.metadata (no
 * fixed field name confirmed) — renders only if the backend actually
 * supplies it, never fabricated.
 */

import React, { useEffect, useRef, useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import { getPath } from '../../utils/helpers';
import './HearDetailPage.css';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function HearDetailPage({ contentId, onBack }) {
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
  const dateLabel = getPath(content, 'dates.formatted', null) || getPath(content, 'dates.createdAt', null);
  const whySeeingText = getPath(content, 'metadata.whySeeingText', null);

  const media = getPath(content, 'media', []);
  const mediaList = Array.isArray(media) ? media : [];
  const audioMedia = mediaList.find((m) => m.media_type === 'audio') || null;
  const imageMedia = mediaList.find((m) => m.media_type === 'image') || null;

  const mediaUrl = audioMedia?.url || null;
  const mediaDuration = audioMedia?.duration_seconds || null;
  const heroImage = imageMedia?.url || null;

  useEffect(() => {
    if (mediaDuration) setDuration(mediaDuration);
  }, [mediaDuration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const seekBy = (delta) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = (Number(e.target.value) / 100) * duration;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div className="hear-detail-canvas" style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}>
        <div className="hear-detail-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="hear-detail-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="hear-detail-overlay">
          {badge && <span className="hear-detail-badge">{badge}</span>}
          {title && <h1 className="hear-detail-title">{title}</h1>}
          <span className="hear-detail-divider" aria-hidden="true">♥</span>
          {subtitle && <p className="hear-detail-subtitle">{subtitle}</p>}

          <div className="hear-detail-meta">
            {dateLabel && <span>📅 {dateLabel}</span>}
            <span>🕐 {formatTime(duration)}</span>
          </div>

          <input type="range" min="0" max="100" value={progressPercent} onChange={handleSeek} className="hear-detail-progress" aria-label="Seek" />
          <div className="hear-detail-time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="hear-detail-transport">
            <button type="button" className="hear-detail-transport-btn" onClick={() => seekBy(-15)} aria-label="Rewind 15 seconds">↺15</button>
            <button type="button" className="hear-detail-transport-btn" aria-label="Previous">⏮</button>
            <button type="button" className="hear-detail-transport-btn hear-detail-transport-btn--primary" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button type="button" className="hear-detail-transport-btn" aria-label="Next">⏭</button>
            <button type="button" className="hear-detail-transport-btn" onClick={() => seekBy(15)} aria-label="Forward 15 seconds">15↻</button>
          </div>

          <button type="button" className="hear-detail-comfort-btn" onClick={() => setComforted(!comforted)} aria-pressed={comforted}>
            {comforted ? '❤' : '♡'} This comforts me
          </button>

          {whySeeingText && (
            <div className="hear-detail-why-seeing">
              <span className="hear-detail-why-seeing-icon" aria-hidden="true">🌸</span>
              <span className="hear-detail-why-seeing-text">{whySeeingText}</span>
              <span aria-hidden="true">›</span>
            </div>
          )}
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

export default HearDetailPage;