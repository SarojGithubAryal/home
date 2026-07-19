/**
 * DailyMessage.jsx
 *
 * Renders the Home Experience's daily message: a left icon, text/
 * subtext, and an optional right-aligned accent icon. Accepts either a
 * plain string or an object shape ({ icon, text, subtext, accentIcon }),
 * since the exact backend field shape is not specified at the field
 * level in 06_API_CONTRACTS.md.
 */

import React from 'react';
import { getPath, classNames } from '../../utils/helpers';
import './DailyMessage.css';

function DailyMessage({ message, className }) {
  if (!message) return null;

  const text = typeof message === 'string' ? message : getPath(message, 'text', null);
  const icon = typeof message === 'object' ? getPath(message, 'icon', null) : null;
  const subtext = typeof message === 'object' ? getPath(message, 'subtext', null) : null;
  const accentIcon = typeof message === 'object' ? getPath(message, 'accentIcon', null) : null;

  if (!text) return null;

  return (
    <div className={classNames('daily-message', className)}>
      {icon && (
        <span className="daily-message-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="daily-message-body">
        <p className="daily-message-text">{text}</p>
        {subtext && <p className="daily-message-subtext">{subtext}</p>}
      </div>
      {accentIcon && (
        <span className="daily-message-accent" aria-hidden="true">
          {accentIcon}
        </span>
      )}
    </div>
  );
}

export default DailyMessage;