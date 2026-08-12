/**
 * AdminApp.jsx
 *
 * Root of the Admin Panel — mounted by main.jsx only when the current
 * URL is /kanha. Owns a lightweight in-memory page-switch state,
 * mirroring the same pattern already established in the user app's
 * App.jsx (no React Router, single state variable + switch).
 *
 * All implemented pages are imported and rendered in the switch.
 * For pages that are not yet implemented (Experience, Settings),
 * we render a placeholder directly in the switch statement to avoid
 * build errors from missing files.
 *
 * When a new page is implemented:
 *   1. Import its default component
 *   2. Add a new case in renderPage() using the constant from adminPages.js
 *   3. (Optional) Update the bottom navigation to include the new page
 */

import React, { useCallback, useState } from 'react';
import AdminLayout from './layout/AdminLayout';
import ADMIN_PAGES from './navigation/adminPages';

// Import all implemented page components
import DashboardPage from './pages/Dashboard/DashboardPage';
import ContentLibraryPage from './pages/ContentLibrary/ContentLibraryPage';
import UploadContentPage from './pages/UploadContent/UploadContentPage';
import EditContentPage from './pages/EditContent/EditContentPage';
import ExperienceSettingsPage from './pages/ExperienceSettings/ExperienceSettingsPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Experience and Settings pages are not yet implemented;
// they are rendered as placeholders in the switch.

import './styles/admin.css';

function AdminApp() {
  const [currentPage, setCurrentPage] = useState(ADMIN_PAGES.DASHBOARD);

  const [editContentId, setEditContentId] = useState(null);

  const navigate = useCallback((page, data) => {
    setCurrentPage(page);
    if (page === ADMIN_PAGES.EDIT_CONTENT) {
      setEditContentId(data?.contentId || null);
    } else {
      setEditContentId(null);
    }
  }, []);

  function renderPage() {
    switch (currentPage) {
      case ADMIN_PAGES.DASHBOARD:
        return <DashboardPage />;

      case ADMIN_PAGES.CONTENT_LIBRARY:
        return <ContentLibraryPage onNavigate={navigate} />;

      case ADMIN_PAGES.UPLOAD_CONTENT:
        return <UploadContentPage />;

        case ADMIN_PAGES.EDIT_CONTENT:
        return <EditContentPage contentId={editContentId} onNavigate={navigate} />;

      case ADMIN_PAGES.EXPERIENCE_SETTINGS:
        return <ExperienceSettingsPage />;

      case ADMIN_PAGES.SETTINGS:
        return <SettingsPage />;

      default:
        // Fallback for any unknown page (should not happen)
        return (
          <div className="admin-placeholder">
            <p>This section will be implemented in a later milestone.</p>
          </div>
        );
    }
  }

  return (
    <AdminLayout currentPage={currentPage} onNavigate={navigate}>
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminApp;