/**
 * Button.jsx
 *
 * Reusable button component. Receives props only — no business logic,
 * no data fetching. All visual variants are controlled via props/CSS
 * modifier classes; no inline styles.
 */

import React from 'react';
import './Button.css';
import { classNames } from '../../utils/helpers';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onClick]
 * @param {'button'|'submit'} [props.type]
 * @param {'primary'|'secondary'|'ghost'} [props.variant]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading] - shows a disabled/pending visual state
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  ariaLabel,
  className,
}) {
  return (
    <button
      type={type}
      className={classNames(
        'app-button',
        `app-button--${variant}`,
        loading && 'app-button--loading',
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  );
}

export default Button;