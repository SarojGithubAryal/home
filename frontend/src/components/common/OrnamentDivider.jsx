/**
 * OrnamentDivider.jsx
 *
 * A small decorative line-mark-line divider used to separate content
 * blocks (hero title from supporting text; mood section from footer).
 * Purely presentational, no content dependency. The `mark` prop lets
 * different contexts use a different glyph (heart in the hero, leaf in
 * the footer) while sharing identical structure/spacing.
 */

import React from 'react';
import { classNames } from '../../utils/helpers';
import './OrnamentDivider.css';

function OrnamentDivider({ mark = '♥', className }) {
  return (
    <div className={classNames('ornament-divider', className)} aria-hidden="true">
      <span className="ornament-divider-line"></span>
      <span className="ornament-divider-mark">{mark}</span>
      <span className="ornament-divider-line"></span>
    </div>
  );
}

export default OrnamentDivider;