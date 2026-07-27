import React from 'react';
import { useContentLibrary } from '../../hooks/useContentLibrary';
import './ContentLibraryPage.css';

// Static sort options
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created' },
  { value: 'updated_at', label: 'Updated' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
];

// Filter chip mapping
const TYPE_CHIPS = [
  { label: 'All', value: null },
  { label: 'Letters', value: 'letter' },
  { label: 'Audio', value: 'audio' },
  { label: 'Photos', value: 'photo' },
  { label: 'Memories', value: 'memory' },
  { label: 'Videos', value: 'video' },
  { label: 'Stories', value: 'story' },
];

function ContentCard({ item }) {
  const badge = item.metadata?.badge;
  const durationLabel = item.metadata?.duration_label;
  const author = item.author;
  const formattedDate = new Date(item.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Map badge to icon (UI only, uses existing badge value)
  const getBadgeIcon = (b) => {
    const map = {
      letter: '📝',
      audio: '🎵',
      photo: '📷',
      memory: '💭',
      video: '🎬',
      story: '📖',
    };
    return map[b?.toLowerCase()] || '📄';
  };

  return (
    <div className="content-card">
      <div className="card-left">
        <div className="card-thumbnail" aria-hidden="true">
          {badge ? getBadgeIcon(badge) : '📄'}
        </div>
        <div className="card-body">
          <div className="card-header">
            {badge && <span className="card-badge">{badge}</span>}
            {item.is_featured && <span className="featured-star" aria-label="Featured">⭐</span>}
            <h3 className="card-title">{item.title}</h3>
          </div>
          {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
          <div className="card-footer">
            {author && <span className="card-author">by {author}</span>}
            {durationLabel && <span className="card-duration">{durationLabel}</span>}
          </div>
        </div>
      </div>
      <div className="card-right">
        <span className={`status-badge ${item.is_published ? 'published' : 'draft'}`}>
          {item.is_published ? 'Published' : 'Draft'}
        </span>
        <time className="card-date">{formattedDate}</time>
      </div>
    </div>
  );
}

export default function ContentLibraryPage() {
  const {
    items,
    pagination,
    loading,
    fetching,
    error,
    filters,
    availableFilters,
    searchInput,
    setSearchInput,
    updateFilter,
    clearAllFilters,
    refetch,
    isFiltered,
  } = useContentLibrary();

  // Show full‑page loading only on very first load
  if (loading && !fetching) {
    return <div className="admin-placeholder">Loading content…</div>;
  }

  return (
    <div className="content-library-page">
      <div className="page-header">
        <h2>Content Library</h2>
        <button className="btn btn-secondary" onClick={refetch} disabled={fetching}>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search content..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Filter row: chips + dropdowns */}
      <div className="filter-row">
        <div className="filter-chips">
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              className={`chip ${filters.type === chip.value ? 'active' : ''}`}
              onClick={() => updateFilter('type', chip.value)}
              disabled={fetching}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="filter-controls">
          {/* Room */}
          <select
            className="filter-select"
            value={filters.room || ''}
            onChange={(e) => updateFilter('room', e.target.value || null)}
            disabled={fetching}
          >
            <option value="">All Rooms</option>
            {availableFilters.availableRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          {/* Mood */}
          <select
            className="filter-select"
            value={filters.mood || ''}
            onChange={(e) => updateFilter('mood', e.target.value || null)}
            disabled={fetching}
          >
            <option value="">All Moods</option>
            {availableFilters.availableMoods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value || null)}
            disabled={fetching}
          >
            <option value="">All Statuses</option>
            {availableFilters.availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            disabled={fetching}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fetching overlay */}
      {fetching && <div className="loading-overlay">Refreshing…</div>}

      {/* Error state */}
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={refetch}>Retry</button>
        </div>
      )}

      {/* Empty state with clear filters */}
      {!error && items.length === 0 && !fetching && (
        <div className="empty">
          <p>{isFiltered ? 'No content matches your filters.' : 'No content found.'}</p>
          {isFiltered && (
            <button className="btn btn-primary" onClick={clearAllFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Content list */}
      {!error && items.length > 0 && (
        <>
          <div className="content-list">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() => updateFilter('page', filters.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={filters.page >= pagination.totalPages}
              onClick={() => updateFilter('page', filters.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}