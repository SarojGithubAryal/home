/**
 * IconButton.jsx
 *
 * A generic circular icon-only button — reusable chrome for any page
 * needing a compact icon control (menu toggle, sound toggle, back
 * button, etc.). Purely presentational; the calling page supplies the
 * icon glyph/element and click behavior.
 */

import React from 'react';
import { classNames } from '../../utils/helpers';
import './IconButton.css';

function IconButton({ icon, onClick, ariaLabel, className }) {
  return (
    <button
      type="button"
      className={classNames('icon-button', className)}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

export default IconButton;