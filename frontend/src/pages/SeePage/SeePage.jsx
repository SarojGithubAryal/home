/**
 * SeePage.jsx — mirrors HearPage.jsx, adapted for the See Experience
 * (GET /api/rooms/:roomSlug/see). Grid layout per reference image.
 */

import React, { useState } from 'react';
import PageContainer from '../../layouts/PageContainer';
import IconButton from '../../components/common/IconButton';
import { useSee } from '../../hooks/useSee';
import AssetRegistry from '../../assets/AssetRegistry';
import { getPath, classNames } from '../../utils/helpers';
import './SeePage.css';
import EmptyExperience from '../../components/common/EmptyExperience';

function isValidNavigation(navigation) {
  return Boolean(navigation) && typeof navigation === 'object' && navigation.experience;
}

function SeeHeader({ title, onBack, onBookmark, onMore }) {
  return (
    <div className="see-header">
      <IconButton icon="←" ariaLabel="Go back" onClick={onBack} />
      <h1 className="see-header-title">
        {title}
        <span className="see-header-icon" aria-hidden="true">🖼️</span>
      </h1>
      <div className="see-header-actions">
        <IconButton icon="🔖" ariaLabel="Bookmark" onClick={onBookmark} />
        <IconButton icon="⋯" ariaLabel="More options" onClick={onMore} />
      </div>
    </div>
  );
}

function TabBar({ tabs, activeTabId, onSelectTab }) {
  if (!Array.isArray(tabs) || tabs.length === 0) return null;
  return (
    <div className="see-tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTabId}
          className={classNames('see-tab', tab.id === activeTabId && 'see-tab--active')}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}

function PhotoGridItem({ item, roomSlug, onNavigate }) {
  // NOTE: AssetRegistry v1 has no per-section thumbnail resolver;
  // renders without a background image rather than calling the
  // removed resolveRoomSectionArtwork method.
  const thumbnail = null;
  return (
    <button type="button" className="see-grid-item" onClick={() => onNavigate(item.navigation)}>
      <span
        className="see-grid-item-image"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
      />
      <span className="see-grid-item-body">
        <span className="see-grid-item-title">{item.title}</span>
        {item.subtitle && <span className="see-grid-item-subtitle">{item.subtitle}</span>}
      </span>
    </button>
  );
}

function SeePage({ roomSlug, onBack, onNavigation }) {
  const [activeTabId, setActiveTabId] = useState(null);
  const { data, loading, error, refetch } = useSee(roomSlug, { tabId: activeTabId });

  const configTitle = getPath(data, 'config.title', null);
  const configSubtitle = getPath(data, 'config.subtitle', null);
const emptyStateText = getPath(data, 'config.emptyStateText', null);
const showTabs = getPath(data, 'config.showTabs', false);
const experienceState = getPath(data, 'state', 'EMPTY');
  const seeLayoutImage = AssetRegistry.getExperienceLayout('see');

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
      <div
        className="see-canvas"
        style={seeLayoutImage ? { backgroundImage: `url(${seeLayoutImage})` } : undefined}
      >
        <SeeHeader
          title={configTitle}
          onBack={() => onBack && onBack()}
          onBookmark={() => console.log('Bookmark (pending feature)')}
          onMore={() => console.log('More options (pending feature)')}
        />

{experienceState === 'EMPTY' ? (
  <EmptyExperience
    icon="🖼️"
    title={emptyStateText || 'No photos yet.'}
    subtitle={configSubtitle}
  />
) : (
  <>
    {configSubtitle && (
      <p className="see-subtitle">{configSubtitle}</p>
    )}

    {showTabs && (
      <TabBar
        tabs={tabList}
        activeTabId={resolvedActiveTabId}
        onSelectTab={setActiveTabId}
      />
    )}

    <div className="see-grid">
      {itemList.map((item) => (
        <PhotoGridItem
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

export default SeePage;