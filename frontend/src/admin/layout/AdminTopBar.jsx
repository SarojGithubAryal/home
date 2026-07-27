import React from 'react';
import './AdminTopBar.css';

/**
 * AdminTopBar.jsx
 *
 * Generic reusable header: left icon + title/subtitle, right actions
 * slot. Each admin page supplies its own icon/title/subtitle/actions —
 * this component makes no assumptions about which page is using it.
 */

function AdminTopBar({ icon, title, subtitle, actions }) {
  return (
    <header className="admin-top-bar">
      <div className="admin-top-bar-left">
        {icon && (
          <span className="admin-top-bar-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="admin-top-bar-titles">
          {title && <h1 className="admin-top-bar-title">{title}</h1>}
          {subtitle && <p className="admin-top-bar-subtitle">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="admin-top-bar-actions">{actions}</div>}
    </header>
  );
}

export default AdminTopBar;