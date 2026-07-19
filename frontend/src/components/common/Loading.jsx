/**
 * Loading.jsx
 *
 * Reusable loading indicator. Receives props only — no data fetching,
 * no hook calls. Used by PageContainer (and directly by any component
 * that needs an inline loading indicator smaller than a full page,
 * e.g. useMoods' `selecting` state).
 */

import React from 'react';
import './Loading.css';
import { classNames } from '../../utils/helpers';
import AssetRegistry from '../../assets/AssetRegistry';

/**
 * @param {object} props
 * @param {string} [props.message] - optional text shown beneath the indicator
 * @param {'page'|'inline'} [props.variant] - controls sizing/layout
 * @param {string} [props.className]
 */
function Loading({ message, variant = 'page', className }) {
  const asset = AssetRegistry.resolveLoadingAsset();

  return (
    <div
      className={classNames('loading', `loading--${variant}`, className)}
      role="status"
      aria-live="polite"
    >
      <img className="loading-asset" src={asset} alt="" aria-hidden="true" />
      <span className="loading-spinner" aria-hidden="true"></span>
      {message && <p className="loading-message">{message}</p>}
      <span className="visually-hidden">{message || 'Loading'}</span>
    </div>
  );
}

export default Loading;