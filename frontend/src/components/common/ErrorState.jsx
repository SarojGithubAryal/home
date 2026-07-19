/**
 * ErrorState.jsx
 *
 * Reusable error display. Receives an error object (in the standard
 * {code, message} shape every service/hook already normalizes to) and an
 * optional retry handler. Contains no fetching logic — retry is entirely
 * delegated to whatever function the calling page/hook provides.
 */

import React from 'react';
import './ErrorState.css';
import { classNames } from '../../utils/helpers';
import AssetRegistry from '../../assets/AssetRegistry';

/**
 * @param {object} props
 * @param {{code: string, message: string}|null} props.error
 * @param {() => void} [props.onRetry]
 * @param {string} [props.className]
 */
function ErrorState({ error, onRetry, className }) {
  const asset = AssetRegistry.resolveErrorStateAsset();
  const message = error?.message || 'Something went wrong. Please try again.';

  return (
    <div className={classNames('error-state', className)} role="alert">
      <img className="error-state-asset" src={asset} alt="" aria-hidden="true" />
      <p className="error-state-message">{message}</p>

      {onRetry && (
        <button type="button" className="error-state-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;