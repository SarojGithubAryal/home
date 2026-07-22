/**
 * SeeDetailPage.jsx (renamed from PhotoPage.jsx)
 *
 * Full-screen photo view. Reached only from SeePage (list). Uses
 * GET /api/contents/:contentId. Renders see_layout.webp (via
 * AssetRegistry) as the background; the backend photo fills the
 * Polaroid placeholder area via object-fit: contain, never stretched.
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './SeeDetailPage.css';

function SeeDetailPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const layoutImage = AssetRegistry.getExperienceLayout('see');
  const [comforted, setComforted] = useState(false);

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const caption = getPath(content, 'excerpt', null);
  const dateLabel = getPath(content, 'dates.formatted', null) || getPath(content, 'dates.createdAt', null);
  const whySeeingText = getPath(content, 'metadata.whySeeingText', null);

  const media = getPath(content, 'media', []);
  const mediaList = Array.isArray(media) ? media : [];
  const imageMedia = mediaList.find((m) => m.media_type === 'image') || null;
  const photoUrl = imageMedia?.url || null;

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div
        className="see-detail-canvas"
        style={layoutImage ? { backgroundImage: `url(${layoutImage})` } : undefined}
      >
        <div className="see-detail-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="see-detail-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="see-detail-content">
          <div className="see-detail-polaroid">
            {photoUrl && <img src={photoUrl} alt="" className="see-detail-photo" />}
          </div>

          <div className="see-detail-details">
            {title && <h1 className="see-detail-title">{title}</h1>}
            {caption && <p className="see-detail-caption">{caption}</p>}
            {dateLabel && <p className="see-detail-date">{dateLabel}</p>}
          </div>

          <div className="see-detail-actions">
            <button type="button" className="see-detail-comfort-btn" onClick={() => setComforted(!comforted)} aria-pressed={comforted}>
              {comforted ? '❤' : '♡'} This comforts me
            </button>
            {whySeeingText && (
              <button type="button" className="see-detail-why-seeing-btn">
                Why am I seeing this?
              </button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default SeeDetailPage;