/**
 * ReadDetailPage.jsx (renamed from LetterPage.jsx)
 *
 * Full-screen letter view. Reached only from ReadPage (list). Uses
 * GET /api/contents/:contentId. Renders the read_layout.webp paper
 * (via AssetRegistry) as the page background, with backend content
 * (title, body paragraphs, author) rendered on top inside a paper card.
 */

import React from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './ReadDetailPage.css';

function ReadDetailPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const layoutImage = AssetRegistry.getExperienceLayout('read');

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const author = getPath(content, 'author', null);
  const bodyRaw = getPath(content, 'body', null);
  const bodyParagraphs = Array.isArray(bodyRaw) ? bodyRaw : bodyRaw ? [bodyRaw] : [];

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div
        className="read-detail-canvas"
        style={layoutImage ? { backgroundImage: `url(${layoutImage})` } : undefined}
      >
        <div className="read-detail-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="read-detail-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="read-detail-sheet">
          <span className="read-detail-eyebrow">A LETTER FOR YOU</span>
          {title && <h1 className="read-detail-title">{title}</h1>}
          <span className="read-detail-divider" aria-hidden="true">♥</span>

          <div className="read-detail-body">
            {bodyParagraphs.map((paragraph, index) => (
              <p key={index} className="read-detail-paragraph">{paragraph}</p>
            ))}
          </div>

          {author && (
            <p className="read-detail-signoff">{author} ♥</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default ReadDetailPage;