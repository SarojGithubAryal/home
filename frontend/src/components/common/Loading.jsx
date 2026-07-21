/**
 * Loading.jsx
 *
 * Reusable loading indicator.
 */

import React from 'react';
import './Loading.css';
import { classNames } from '../../utils/helpers';

/**
 * @param {object} props
 * @param {string} [props.message]
 * @param {'page'|'inline'} [props.variant]
 * @param {string} [props.className]
 */
function Loading({ message, variant = 'page', className }) {
  return (
    <div
      className={classNames('loading', `loading--${variant}`, className)}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner" aria-hidden="true"></span>

      {message && (
        <p className="loading-message">
          {message}
        </p>
      )}

      <span className="visually-hidden">
        {message || 'Loading'}
      </span>
    </div>
  );
}

export default Loading;