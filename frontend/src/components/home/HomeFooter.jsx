/**
 * HomeFooter.jsx
 *
 * Renders the Home Experience's footer content, preceded by a
 * decorative leaf ornament divider. Supports either a single text field
 * or a lines array, since the exact backend shape for "Footer" is not
 * specified at the field level in 06_API_CONTRACTS.md. Fully
 * backend-driven — renders nothing if no footer content exists.
 */

import React from 'react';
import OrnamentDivider from '../common/OrnamentDivider';
import { getPath, classNames } from '../../utils/helpers';
import './HomeFooter.css';

function HomeFooter({ footer, className }) {
  if (!footer) return null;

  const icon = getPath(footer, 'icon', null);
  const lines = getPath(footer, 'lines', null);
  const text = getPath(footer, 'text', null);

  const content = Array.isArray(lines) && lines.length > 0 ? lines : text ? [text] : [];

  if (content.length === 0) return null;

  return (
    <footer className={classNames('home-footer', className)}>
      <OrnamentDivider mark="🌿" />
      <p className="home-footer-text">
        {content.join(' ')}
        {icon && <span aria-hidden="true"> {icon}</span>}
      </p>
    </footer>
  );
}

export default HomeFooter;