import React from 'react';
import ADMIN_NAV_ITEMS from '../constants/adminNavItems';
import ADMIN_PAGES from '../navigation/adminPages';
import './AdminBottomNav.css';

function AdminBottomNav({ currentPage, onNavigate }) {
  return (
    <nav className="admin-bottom-nav">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = item.page === currentPage;
        const isUpload = item.page === ADMIN_PAGES.UPLOAD_CONTENT;

        return (
          <button
            key={item.page}
            type="button"
            className={`admin-bottom-nav-item${isActive ? ' admin-bottom-nav-item--active' : ''}${
              isUpload ? ' admin-bottom-nav-item--upload' : ''
            }`}
            onClick={() => onNavigate(item.page)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="admin-bottom-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="admin-bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default AdminBottomNav;