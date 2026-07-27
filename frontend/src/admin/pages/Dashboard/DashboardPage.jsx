/**
 * DashboardPage.jsx
 *
 * Renders ONLY fields the backend actually returns from
 * GET /admin/dashboard: totalContents, totalGreetings, totalQuotes,
 * activeSchedules, recentUploads (title + created_at only).
 *
 * Deliberately omitted (present in the reference image, absent from
 * the documented backend response): "Released Today", "Active
 * Greetings" detail list, "Rooms" list, "Drafts" count, "Upcoming
 * Releases" (dated list), "Recent Activity" (typed/iconed feed),
 * "Content by Type" chart, "Storage Usage". Adding any of these would
 * require fabricating data the backend doesn't provide — explicitly
 * disallowed. Remove this comment once/if the backend adds the
 * corresponding fields.
 */

import React from 'react';
import AdminTopBar from '../../layout/AdminTopBar';
import { AdminCard, LoadingState, ErrorState, EmptyState } from '../../components/Display';
import { useDashboard } from '../../hooks/useDashboard';
import { formatAdminDate, getTimeOfDayGreeting, formatAdminTime, formatAdminDateLong } from '../../utils/adminHelpers';
import './DashboardPage.css';

function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const now = new Date();

  return (
    <div className="admin-dashboard">
      <AdminTopBar
        icon="☰"
        title="Dashboard"
        actions={
          <button type="button" className="admin-notification-btn" aria-label="Notifications">
            🔔
          </button>
        }
      />

      <div className="admin-dashboard-body">
        <div className="admin-dashboard-greeting">
          <div>
            <h2 className="admin-dashboard-greeting-title">{getTimeOfDayGreeting(now)}</h2>
            <p className="admin-dashboard-greeting-subtitle">Here's what's happening in your Home.</p>
          </div>
          <div className="admin-dashboard-clock">
            <span>{formatAdminTime(now)}</span>
            <span className="admin-dashboard-clock-date">{formatAdminDateLong(now)}</span>
          </div>
        </div>

        {loading && <LoadingState message="Loading dashboard…" />}

        {!loading && error && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            <div className="admin-dashboard-stats">
              <AdminCard icon="📄" label="Total Contents" value={data?.totalContents ?? 0} />
              <AdminCard icon="💬" label="Total Greetings" value={data?.totalGreetings ?? 0} />
              <AdminCard icon="❝" label="Total Quotes" value={data?.totalQuotes ?? 0} />
              <AdminCard icon="📅" label="Active Schedules" value={data?.activeSchedules ?? 0} />
            </div>

            <section className="admin-dashboard-section">
              <h3 className="admin-dashboard-section-title">Recent Uploads</h3>

              {Array.isArray(data?.recentUploads) && data.recentUploads.length > 0 ? (
                <div className="admin-dashboard-uploads">
                  {data.recentUploads.map((upload) => (
                    <div key={upload.id} className="admin-dashboard-upload-row">
                      <span className="admin-dashboard-upload-title">{upload.title}</span>
                      <span className="admin-dashboard-upload-date">
                        {formatAdminDate(upload.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No recent uploads" message="New content will appear here." />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;