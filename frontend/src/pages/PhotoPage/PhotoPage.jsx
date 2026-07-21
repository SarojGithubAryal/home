/**
 * PhotoPage.jsx
 *
 * Full-screen photo view, reached via navigation.params.contentId.
 * Uses the universal GET /api/contents/:contentId endpoint.
 *
 * REMOVED: assumed `backgroundAssetKey`/`thumbnailAssetKey` resolved
 * via room-scoped AssetRegistry calls. The photo itself now comes
 * directly from content.media[] (media_type: "image").url, per the
 * documented media shape.
 * REMOVED: guessed `noteText` and "Why am I seeing this?" — no
 * documented source field for either.
 * Caption uses content.excerpt (documented field).
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import { getPath } from '../../utils/helpers';
import './PhotoPage.css';

function PhotoPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const [comforted, setComforted] = useState(false);

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const caption = getPath(content, 'excerpt', null);

  const media = getPath(content, 'media', []);
  const mediaList = Array.isArray(media) ? media : [];
  const imageMedia = mediaList.find((item) => item.media_type === 'image') || null;
  const photoUrl = imageMedia?.url || null;

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div className="photo-canvas">
        <div className="photo-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="photo-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="photo-content">
          {photoUrl && <div className="photo-frame" style={{ backgroundImage: `url(${photoUrl})` }} />}

          <div className="photo-details">
            {title && <h1 className="photo-title">{title}</h1>}
            <span className="photo-heart" aria-hidden="true">♥</span>
            {caption && <p className="photo-caption">{caption}</p>}
          </div>

          <button
            type="button"
            className="photo-comfort-btn"
            onClick={() => setComforted(!comforted)}
            aria-pressed={comforted}
          >
            {comforted ? '❤' : '♡'} This comforts me
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

export default PhotoPage;