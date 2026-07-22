/**
 * MemoryDetailPage.jsx (new — previously stopgapped by reusing
 * LetterPage; that stopgap is now retired)
 *
 * Full-screen memory view. Reached only from MemoryPage (list). Uses
 * GET /api/contents/:contentId. Renders memory_layout.webp (via
 * AssetRegistry) as the background; decorative flowers on that image
 * stay untouched — only the paper's placeholder area receives content.
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './MemoryDetailPage.css';

function MemoryDetailPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const layoutImage = AssetRegistry.getExperienceLayout('memory');

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const author = getPath(content, 'author', null);
  const bodyRaw = getPath(content, 'body', null);
  const bodyParagraphs = Array.isArray(bodyRaw) ? bodyRaw : bodyRaw ? [bodyRaw] : [];
  const closingLine = getPath(content, 'metadata.closingLine', null);
  const [comforted, setComforted] = useState(false);

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div
        className="memory-detail-canvas"
        style={layoutImage ? { backgroundImage: `url(${layoutImage})` } : undefined}
      >
        <div className="memory-detail-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="memory-detail-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="memory-detail-sheet">
          {title && <h1 className="memory-detail-title">{title}</h1>}
          <span className="memory-detail-divider" aria-hidden="true">♥</span>

          <div className="memory-detail-body">
            {bodyParagraphs.map((paragraph, index) => (
              <p key={index} className="memory-detail-paragraph">{paragraph}</p>
            ))}
          </div>

          {author && <p className="memory-detail-signoff">{author} ♥</p>}

          {closingLine && (
            <p className="memory-detail-closing">{closingLine}</p>
          )}
        </div>

        <div className="memory-detail-actions">
          <button type="button" className="memory-detail-comfort-btn" onClick={() => setComforted(!comforted)} aria-pressed={comforted}>
            {comforted ? '❤' : '♡'} This comforts me
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

export default MemoryDetailPage;