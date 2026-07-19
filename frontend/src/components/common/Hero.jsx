/**
 * Hero.jsx
 *
 * Reusable hero banner component, used by any page that needs a large
 * photo/gradient banner with overlay content (Home, Room, etc.).
 *
 * This component receives already-resolved asset paths and raw content
 * as props — it does not call AssetRegistry itself, so the calling page
 * decides whether it's resolving a Home hero, a Room hero, or any future
 * hero variant. This keeps Hero.jsx fully generic and reusable rather
 * than coupled to any one Experience's asset-resolution rules.
 */

import React from 'react';
import './Hero.css';
import { classNames } from '../../utils/helpers';

/**
 * @param {object} props
 * @param {string} [props.backgroundImage] - resolved asset path (via AssetRegistry
 *   in the calling page/hook), not a raw semantic identifier
 * @param {React.ReactNode} [props.topContent] - e.g. header controls overlaid on the hero
 * @param {React.ReactNode} props.children - main hero content (title, quote, etc.)
 * @param {string} [props.className]
 */
function Hero({ backgroundImage, topContent, children, className }) {
  const heroStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined;

  return (
    <section className={classNames('app-hero', className)} style={heroStyle}>
      {topContent && <div className="app-hero-top">{topContent}</div>}

      <div className="app-hero-overlay">
        <div className="app-hero-content">{children}</div>
      </div>
    </section>
  );
}

export default Hero;