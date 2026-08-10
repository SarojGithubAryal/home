/**
 * MemoryDetailPage.jsx
 *
 * Full‑screen memory view. Reached only from MemoryPage (list).
 * The time‑variant environmental theme provides the background.
 * The memory content (title, body, author) is rendered on top.
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath } from '../../utils/helpers';
import './MemoryDetailPage.css';

function MemoryDetailPage({ contentId, onBack, timeVariant = 'day' }) {
  const { data, loading, error, refetch } = useContent(contentId);
  const environmentUrl = AssetRegistry.getDetailEnvironmentTheme(timeVariant);

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const author = getPath(content, 'author', null);
  const bodyRaw = getPath(content, 'body', null);
  const bodyParagraphs = Array.isArray(bodyRaw) ? bodyRaw : bodyRaw ? [bodyRaw] : [];
  const closingLine = getPath(content, 'metadata.closingLine', null);
  const [comforted, setComforted] = useState(false);

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div className="detail-environment-container">
        {environmentUrl && (
          <div
            className="detail-environment-background"
            style={{ backgroundImage: `url(${environmentUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="memory-detail-canvas">
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
      </div>
    </PageContainer>
  );
}

export default MemoryDetailPage;