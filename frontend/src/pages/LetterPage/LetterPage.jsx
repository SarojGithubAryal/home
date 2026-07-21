/**
 * LetterPage.jsx
 *
 * Full-screen letter view, reached via navigation.params.contentId.
 * Uses the universal GET /api/contents/:contentId endpoint.
 *
 * REMOVED: assumed `backgroundAssetKey` resolved via a room-scoped
 * AssetRegistry call (no longer valid — no roomSlug is available).
 * REMOVED: guessed `signOffLine` field with no documented source.
 * `body` is read from content.body (documented) and rendered as
 * paragraphs, handling both an array-of-strings or a single string
 * defensively. Sign-off name uses content.author (documented field).
 * "A LETTER FOR YOU" eyebrow is local UI chrome (decorative label,
 * not backend content) — same precedent as other small fixed UI
 * labels already established (e.g. Home's "I don't know" tile).
 */

import React from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useContent } from '../../hooks/useContent';
import { getPath } from '../../utils/helpers';
import './LetterPage.css';

function LetterPage({ contentId, onBack }) {
  const { data, loading, error, refetch } = useContent(contentId);

  const content = getPath(data, 'content', null);
  const title = getPath(content, 'title', null);
  const author = getPath(content, 'author', null);
  const bodyRaw = getPath(content, 'body', null);
  const bodyParagraphs = Array.isArray(bodyRaw) ? bodyRaw : bodyRaw ? [bodyRaw] : [];

  return (
    <PageContainer loading={loading} error={error} data={data} onRetry={refetch}>
      <div className="letter-canvas">
        <div className="letter-top">
          <IconButton icon="←" ariaLabel="Go back" onClick={() => onBack && onBack()} />
          <div className="letter-top-actions">
            <IconButton icon="🔖" ariaLabel="Bookmark" onClick={() => console.log('Bookmark (pending feature)')} />
            <IconButton icon="⋯" ariaLabel="More options" onClick={() => console.log('More options (pending feature)')} />
          </div>
        </div>

        <div className="letter-sheet">
          <span className="letter-eyebrow">A LETTER FOR YOU</span>
          {title && <h1 className="letter-title">{title}</h1>}
          <span className="letter-divider" aria-hidden="true">♥</span>

          <div className="letter-body">
            {bodyParagraphs.map((paragraph, index) => (
              <p key={index} className="letter-paragraph">{paragraph}</p>
            ))}
          </div>

          {author && (
            <div className="letter-signoff">
              <p className="letter-signoff-name">{author} ♥</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default LetterPage;