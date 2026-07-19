/**
 * MoodTile.jsx
 *
 * A single selectable mood tile. Icon and label come entirely from the
 * backend-supplied mood object and are rendered verbatim — never
 * altered or invented.
 *
 * The data-mood attribute drives purely decorative color accents (see
 * MoodTile.css). Its value is a NORMALIZED form of mood.id (stripping a
 * leading "mood-"/"mood_" prefix if present), so accent styling stays
 * resilient to different backend id conventions without needing to
 * assume one exact format. This normalization affects presentation
 * only — mood.id itself, passed to onSelect, is never altered.
 */

import React from 'react';
import { classNames } from '../../utils/helpers';
import './MoodTile.css';

function normalizeAccentKey(id) {
  if (typeof id !== 'string') return id;
  return id.replace(/^mood[-_]/i, '');
}

function MoodTile({ mood, onSelect }) {
  const handleClick = () => {
    if (onSelect) onSelect(mood);
  };

  return (
    <button
      type="button"
      className={classNames('mood-tile')}
      data-mood={normalizeAccentKey(mood.id)}
      onClick={handleClick}
    >
      {mood.icon && (
        <span className="mood-tile-icon" aria-hidden="true">
          {mood.icon}
        </span>
      )}
      <span className="mood-tile-label">{mood.label}</span>
    </button>
  );
}

export default MoodTile;