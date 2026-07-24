/**
 * SeePage.jsx — mirrors HearPage.jsx's finalized structure, adapted
 * for the See Experience (GET /api/rooms/:roomSlug/see). Grid layout
 * per reference image; empty-state gating and grid rendering logic
 * are unchanged from the original file.
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
  const seeIconImage = AssetRegistry.getExperienceIcon('see');

  return (
    <div className="see-header">
      <div className="see-header-left">
        <IconButton icon="←" ariaLabel="Go back" onClick={onBack} />

        <h1 className="see-header-title">
          {title}

          {seeIconImage ? (
            <img
              src={seeIconImage}
              alt=""
              className="see-header-icon"
              aria-hidden="true"
            />
          ) : (
            <span className="see-header-icon" aria-hidden="true">
              🖼️
            </span>
          )}
        </h1>
      </div>

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

function PhotoGridItem({ item, onNavigate }) {
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

  const pageQuote = getPath(data, 'pageQuote', null);
  const stats = getPath(data, 'stats', []);

  const emptyStateText = getPath(data, 'config.emptyStateText', null);
  const showTabs = getPath(data, 'config.showTabs', false);
  const experienceState = getPath(data, 'state', 'EMPTY');
  const isEmptyExperience = experienceState === 'EMPTY';

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
      <div className="see-canvas">
        <div className="see-content">
          <SeeHeader
            title={configTitle}
            onBack={() => onBack && onBack()}
            onBookmark={() => {}}
            onMore={() => {}}
          />

          {!isEmptyExperience && (
            <>
              {configSubtitle && (
                <div className="see-subtitle">{configSubtitle}</div>
              )}

              {pageQuote?.text && (
                <div className="see-page-quote">{pageQuote.text}</div>
              )}

              {Array.isArray(stats) && stats.length > 0 && (
                <div className="see-stats">
                  {stats.map((stat) => (
                    <div key={stat.id} className="see-stat">
                      <div className="see-stat-value">{stat.value}</div>
                      <div className="see-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {isEmptyExperience ? (
            <EmptyExperience
              icon="🖼️"
              title={emptyStateText || 'No photos yet.'}
              subtitle={configSubtitle}
            />
          ) : (
            <>
              {showTabs && (
                <TabBar
                  tabs={tabList}
                  activeTabId={resolvedActiveTabId}
                  onSelectTab={setActiveTabId}
                />
              )}

              <div className="see-grid">
                {itemList.map((item) => (
                  <PhotoGridItem key={item.id} item={item} onNavigate={handleNavigate} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default SeePage;