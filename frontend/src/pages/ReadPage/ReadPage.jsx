/**
 * ReadPage.jsx — mirrors HearPage.jsx exactly, adapted for the Read
 * Experience (GET /api/rooms/:roomSlug/read). Internal helper
 * components only (ReadHeader, TabBar, FeaturedLetterCard, LetterListItem).
 */

import React, { useMemo, useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useRead } from '../../hooks/useRead';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath, classNames } from '../../utils/helpers';
import './ReadPage.css';
import EmptyExperience from '../../components/common/EmptyExperience';


function isValidNavigation(navigation) {
  return Boolean(navigation) && typeof navigation === 'object' && navigation.experience;
}

function ReadHeader({ title, onBack, onBookmark, onMore }) {
  return (
    <div className="read-header">
      <IconButton icon="←" ariaLabel="Go back" onClick={onBack} />
      <h1 className="read-header-title">
        {title}
        <span className="read-header-icon" aria-hidden="true">📖</span>
      </h1>
      <div className="read-header-actions">
        <IconButton icon="🔖" ariaLabel="Bookmark" onClick={onBookmark} />
        <IconButton icon="⋯" ariaLabel="More options" onClick={onMore} />
      </div>
    </div>
  );
}

function TabBar({ tabs, activeTabId, onSelectTab }) {
  if (!Array.isArray(tabs) || tabs.length === 0) return null;
  return (
    <div className="read-tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTabId}
          className={classNames('read-tab', tab.id === activeTabId && 'read-tab--active')}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}

function LetterListItem({ item, roomSlug, onNavigate }) {
  // NOTE: AssetRegistry v1 has no per-section thumbnail resolver;
  // renders without a background image rather than calling the
  // removed resolveRoomSectionArtwork method.
  const thumbnail = null;
  return (
    <button type="button" className="read-list-item" onClick={() => onNavigate(item.navigation)}>
      <span
        className="read-list-item-thumbnail"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
        aria-hidden="true"
      />
      <span className="read-list-item-body">
        <span className="read-list-item-title">{item.title}</span>
        {item.subtitle && <span className="read-list-item-subtitle">{item.subtitle}</span>}
        <span className="read-list-item-meta">
          {item.durationLabel}
        </span>
      </span>
    </button>
  );
}

function ReadPage({ roomSlug, onBack, onNavigation }) {
  const [activeTabId, setActiveTabId] = useState(null);
  const { data, loading, error, refetch } = useRead(roomSlug, { tabId: activeTabId });

  const configTitle = getPath(data, 'config.title', null);
  const configSubtitle = getPath(data, 'config.subtitle', null);
  const emptyStateText = getPath(data, 'config.emptyStateText', null);
  const showTabs = getPath(data, 'config.showTabs', false);

  const tabs = getPath(data, 'tabs', []);
  const tabList = Array.isArray(tabs) ? tabs : [];
  const resolvedActiveTabId = activeTabId || getPath(data, 'activeTabId', null);

  const items = getPath(data, 'items', []);
  const itemList = Array.isArray(items) ? items : [];

  const experienceState = getPath(data, 'state', 'EMPTY');
  const readLayoutImage = AssetRegistry.getExperienceLayout('read');

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
      <div
        className="read-canvas"
        style={readLayoutImage ? { backgroundImage: `url(${readLayoutImage})` } : undefined}
      >
        <ReadHeader
          title={configTitle}
          onBack={() => onBack && onBack()}
          onBookmark={() => console.log('Bookmark (pending feature)')}
          onMore={() => console.log('More options (pending feature)')}
        />

{experienceState === 'EMPTY' ? (
  <EmptyExperience
    icon="📖"
    title={emptyStateText || 'No letters yet.'}
    subtitle={configSubtitle}
  />
) : (
  <>
    {configSubtitle && (
      <p className="read-subtitle">{configSubtitle}</p>
    )}

    {showTabs && (
      <TabBar
        tabs={tabList}
        activeTabId={resolvedActiveTabId}
        onSelectTab={setActiveTabId}
      />
    )}

    <div className="read-list">
      {itemList.map((item) => (
        <LetterListItem
          key={item.id}
          item={item}
          roomSlug={roomSlug}
          onNavigate={handleNavigate}
        />
      ))}
    </div>
  </>
)}      
</div>
    </PageContainer>
  );
}

export default ReadPage;