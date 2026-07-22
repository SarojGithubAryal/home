/**
 * EmptyState.jsx
 *
 * Reusable empty-content display, shown when a successful API response
 * contains no meaningful data (per isEmptyValue() in helpers.js). Content
 * (title/message) is passed in as props — this component never hardcodes
 * copy, per the project's content rules.
 */

import React from 'react';
import './EmptyState.css';
import { classNames } from '../../utils/helpers';
import AssetRegistry from '../../assets/AssetRegistry';

/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {string} [props.className]
 */
function EmptyState({ title, message, className }) {
const asset = AssetRegistry.resolveEmptyStateAsset();

return (
  <div className={classNames('empty-state', className)}>
    {asset && (
      <img
        className="empty-state-asset"
        src={asset}
        alt=""
        aria-hidden="true"
      />
    )}

    {title && <p className="empty-state-title">{title}</p>}
    {message && <p className="empty-state-message">{message}</p>}
  </div>
);
}

export default EmptyState;