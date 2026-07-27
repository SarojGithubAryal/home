import React from 'react';
import './Display.css';

/**
 * Display.jsx
 *
 * Consolidated reusable display components per the approved refactor:
 * AdminCard, StatusBadge, SectionHeader, EmptyState, LoadingState,
 * ErrorState. Only AdminCard/LoadingState/ErrorState/EmptyState are
 * used by Milestone 1 (Dashboard) — StatusBadge and SectionHeader are
 * defined now since they belong in this same consolidated file, ready
 * for Content Library / Upload Content in later milestones.
 */

export function AdminCard({ icon, label, value, subtitle, accent, className }) {
  return (
    <div className={`admin-card${className ? ` ${className}` : ''}`}>
      {icon && (
        <span
          className={`admin-card-icon${accent ? ` admin-card-icon--${accent}` : ''}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <div className="admin-card-body">
        {label && <p className="admin-card-label">{label}</p>}
        {value !== undefined && value !== null && <p className="admin-card-value">{value}</p>}
        {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export function StatusBadge({ status, children }) {
  return <span className={`admin-status-badge admin-status-badge--${status}`}>{children}</span>;
}

export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="admin-section-header">
      <div>
        {title && <h2 className="admin-section-header-title">{title}</h2>}
        {subtitle && <p className="admin-section-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-section-header-actions">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="admin-empty-state">
      {title && <p className="admin-empty-state-title">{title}</p>}
      {message && <p className="admin-empty-state-message">{message}</p>}
    </div>
  );
}

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="admin-loading-state" role="status">
      <span className="admin-loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="admin-error-state" role="alert">
      <p>{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" className="admin-error-state-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

const Display = { AdminCard, StatusBadge, SectionHeader, EmptyState, LoadingState, ErrorState };
export default Display;