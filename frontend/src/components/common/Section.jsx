/**
 * Section.jsx
 *
 * Reusable content-section wrapper providing consistent semantic
 * structure (a labelled <section>) and spacing for any page section —
 * e.g. a Home page's "recommended room" block, a Room page's action
 * grid, etc. Receives props/content only; owns no data or content itself.
 */

import React, { useId } from 'react';
import './Section.css';
import { classNames } from '../../utils/helpers';

/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
function Section({ title, subtitle, children, className }) {
  const headingId = useId();

  return (
    <section
      className={classNames('app-section', className)}
      aria-labelledby={title ? headingId : undefined}
    >
      {title && (
        <h2 id={headingId} className="app-section-title">
          {title}
        </h2>
      )}
      {subtitle && <p className="app-section-subtitle">{subtitle}</p>}

      <div className="app-section-content">{children}</div>
    </section>
  );
}

export default Section;