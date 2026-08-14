import React from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './ReadDetailPage.css';

function ReadDetailPage({ contentId, onBack, timeVariant = 'day' }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const environmentUrl = AssetRegistry.getDetailEnvironmentTheme(timeVariant);

  const content = getPath(data, 'content', null);

  const title = getPath(content, 'title', null);
  const author = getPath(content, 'author', null);
  const bodyRaw = getPath(content, 'detail.body', null);
  const bodyParagraphs = Array.isArray(bodyRaw) ? bodyRaw : bodyRaw ? [bodyRaw] : [];
  const readingTimeLabel = getPath(content, 'detail.readingTimeLabel', null);
  const dateLabel = getPath(content, 'dates.formatted', null) || getPath(content, 'dates.createdAt', null);

  const media = getPath(content, 'media', []);
  const mediaList = Array.isArray(media) ? media : [];
  const images = mediaList.filter(m => m.media_type === 'image');

  return (
    <PageContainer loading={loading} error={error} data={data} isEmpty={!content} onRetry={refetch}>
      <div className="detail-environment-container">
        {environmentUrl && (
          <div
            className="detail-environment-background"
            style={{ backgroundImage: `url(${environmentUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="read-detail-canvas">
          <div className="read-detail-top">
            <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
            <div className="read-detail-top-actions">
              <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
              <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
            </div>
          </div>

          <div className="read-detail-sheet">
            <div className="read-detail-paper">
              <span className="read-detail-tape" aria-hidden="true" />

              <div className="read-detail-paper-head">
                <span className="read-detail-eyebrow">A LETTER FOR YOU</span>
                {title && <h1 className="read-detail-title">{title}</h1>}
                <div className="read-detail-meta">
                  {author && <span className="read-detail-author">{author}</span>}
                  {dateLabel && <span className="read-detail-date">{dateLabel}</span>}
                  {readingTimeLabel && <span className="read-detail-reading-time">{readingTimeLabel}</span>}
                </div>
                <span className="read-detail-divider" aria-hidden="true">♥</span>
              </div>

              <div className="read-detail-scroll">
                <div className="read-detail-body">
                  {bodyParagraphs.map((paragraph, index) => (
                    <p key={index} className="read-detail-paragraph">{paragraph}</p>
                  ))}
                </div>

                {images.length > 0 && (
                  <div className="read-detail-images">
                    {images.map(img => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.alt_text || 'Attached image'}
                        className="read-detail-image"
                      />
                    ))}
                  </div>
                )}

                {author && (
                  <p className="read-detail-signoff">{author} ♥</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default ReadDetailPage;
