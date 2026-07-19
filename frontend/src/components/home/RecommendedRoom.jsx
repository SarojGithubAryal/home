/**
 * RecommendedRoom.jsx
 *
 * Renders the Home Experience's recommended-room data. Fully
 * backend-driven — title, description, and CTA label all come from the
 * `room` prop. Field names are read defensively (via getPath) since
 * 06_API_CONTRACTS.md documents only the category name ("Recommended
 * room"), not its field-level shape.
 */

import React from 'react';
import Section from '../common/Section';
import Button from '../common/Button';
import { getPath, classNames } from '../../utils/helpers';
import './RecommendedRoom.css';

function RecommendedRoom({ room, onSelect, className }) {
  if (!room) return null;

  const title = getPath(room, 'name', null) || getPath(room, 'title', null);
  const description = getPath(room, 'description', null) || getPath(room, 'quote', null);
  const ctaLabel = getPath(room, 'ctaLabel', null) || 'Enter';

  if (!title) return null;

  const handleSelect = () => {
    if (onSelect) onSelect(room);
  };

  return (
    <Section title="Recommended for you" className={className}>
      <div className="recommended-room">
        <div className="recommended-room-body">
          <p className="recommended-room-title">{title}</p>
          {description && <p className="recommended-room-description">{description}</p>}
        </div>

        <Button variant="secondary" onClick={handleSelect}>
          {ctaLabel}
        </Button>
      </div>
    </Section>
  );
}

export default RecommendedRoom;