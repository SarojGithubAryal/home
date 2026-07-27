import React from 'react';
import AdminBottomNav from './AdminBottomNav';
import './AdminLayout.css';

/**
 * AdminLayout.jsx
 *
 * Minimal shell: content area + persistent bottom nav. Deliberately
 * does NOT enforce a shared top bar — reference images show each
 * section with a differently-shaped header (some with back arrows,
 * some without, some with filter/action buttons). Matching this
 * project's established "each page is the sole layout owner"
 * philosophy, every admin page composes its own header via the
 * reusable AdminTopBar component directly, rather than AdminLayout
 * forcing one fixed shape on every page.
 */

function AdminLayout({ currentPage, onNavigate, children }) {
  return (
    <div className="admin-layout">
      <main className="admin-layout-content">{children}</main>
      <AdminBottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}

export default AdminLayout;