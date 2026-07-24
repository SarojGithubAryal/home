/**
 * MemoryPage.jsx — mirrors HearPage.jsx's finalized structure, adapted
 * for the Memory Experience (GET /api/rooms/:roomSlug/memory). This
 * page never had empty-state gating in the original implementation,
 * so none is introduced here — only header/subtitle/quote/stats
 * structure and spacing are brought in line with HearPage.
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useMemory } from '../../hooks/useMemory';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath, classNames } from '../../utils/helpers';
import './MemoryPage.css';

function isValidNavigation(navigation) {
  return Boolean(navigation) && typeof navigation === 'object' && navigation.experience;
}

function MemoryHeader({ title, onBack, onBookmark, onMore }) {
  const memoryIconImage = AssetRegistry.getExperienceIcon('memory');

  return (
    <div className="memory-header">
      <div className="memory-header-left">
        <IconButton icon="←" ariaLabel="Go back" onClick={onBack} />

        <h1 className="memory-header-title">
          {title}

          {memoryIconImage ? (
            <img
              src={memoryIconImage}
              alt=""
              className="memory-header-icon"
              aria-hidden="true"
            />
          ) : (
            <span className="memory-header-icon" aria-hidden="true">
              🌸
            </span>
          )}
        </h1>
      </div>

      <div className="memory-header-actions">
        <IconButton icon="🔖" ariaLabel="Bookmark" onClick={onBookmark} />
        <IconButton icon="⋯" ariaLabel="More options" onClick={onMore} />
      </div>
    </div>
  );
}

function TabBar({ tabs, activeTabId, onSelectTab }) {
  if (!Array.isArray(tabs) || tabs.length === 0) return null;
  return (
    <div className="memory-tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTabId}
          className={classNames('memory-tab', tab.id === activeTabId && 'memory-tab--active')}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}

function MemoryListItem({ item, onNavigate }) {
  // NOTE: AssetRegistry v1 has no per-section thumbnail resolver;
  // renders without a background image rather than calling the
  // removed resolveRoomSectionArtwork method.
  const thumbnail = null;
  return (
    <button type="button" className="memory-list-item" onClick={() => onNavigate(item.navigation)}>
      <span
        className="memory-list-item-thumbnail"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
        aria-hidden="true"
      />
      <span className="memory-list-item-body">
        <span className="memory-list-item-title">{item.title}</span>
        {item.subtitle && <span className="memory-list-item-subtitle">{item.subtitle}</span>}
        {item.durationLabel && <span className="memory-list-item-meta">{item.durationLabel}</span>}
      </span>
    </button>
  );
}

function MemoryPage({ roomSlug, onBack, onNavigation }) {
  const [activeTabId, setActiveTabId] = useState(null);
  const { data, loading, error, refetch } = useMemory(roomSlug, { tabId: activeTabId });

  const configTitle = getPath(data, 'config.title', null);
  const configSubtitle = getPath(data, 'config.subtitle', null);

  const pageQuote = getPath(data, 'pageQuote', null);
  const stats = getPath(data, 'stats', []);

  const emptyStateText = getPath(data, 'config.emptyStateText', null);
  const showTabs = getPath(data, 'config.showTabs', false);

  const tabs = getPath(data, 'tabs', []);
  const tabList = Array.isArray(tabs) ? tabs : [];
  const resolvedActiveTabId = activeTabId || getPath(data, 'activeTabId', null);

  const items = getPath(data, 'items', []);
  const itemList = Array.isArray(items) ? items : [];

  const handleNavigate = (navigation) => {
    if (!isValidNavigation(navigation)) return;
    if (onNavigation) onNavigation({ success: true, navigation, data: {} });
  };

  return (
    <PageContainer
      loading={loading}
      error={error}
      data={data}
      onRetry={refetch}
      emptyTitle="Nothing here yet"
      emptyMessage={emptyStateText || 'Check back soon.'}
    >
      <div className="memory-canvas">
        <div className="memory-content">
          <MemoryHeader
            title={configTitle}
            onBack={() => onBack && onBack()}
            onBookmark={() => {}}
            onMore={() => {}}
          />

          {configSubtitle && (
            <div className="memory-subtitle">{configSubtitle}</div>
          )}

          {pageQuote?.text && (
            <div className="memory-page-quote">{pageQuote.text}</div>
          )}

          {Array.isArray(stats) && stats.length > 0 && (
            <div className="memory-stats">
              {stats.map((stat) => (
                <div key={stat.id} className="memory-stat">
                  <div className="memory-stat-value">{stat.value}</div>
                  <div className="memory-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {showTabs && (
            <TabBar
              tabs={tabList}
              activeTabId={resolvedActiveTabId}
              onSelectTab={setActiveTabId}
            />
          )}

          <div className="memory-list">
            {itemList.map((item) => (
              <MemoryListItem key={item.id} item={item} onNavigate={handleNavigate} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default MemoryPage;