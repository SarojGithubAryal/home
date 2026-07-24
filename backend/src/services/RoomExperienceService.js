const roomService = require('./RoomService');
const roomExperienceConfigService = require('./RoomExperienceConfigService');
const contentService = require('./ContentService');
const mediaService = require('./MediaService');
const greetingService = require('./GreetingService');
const themeService = require('./ThemeService');
const greetingEngine = require('../engines/GreetingEngine');
const themeEngine = require('../engines/ThemeEngine');
const experienceEngine = require('../engines/ExperienceEngine');


class RoomSubExperienceService {
  /**
   * Build a sub-experience page (hear, read, see, memory).
   * @param {string} roomSlug
   * @param {string} experienceType
   * @param {object} [options] - { tabId?, search?, page?, limit? }
   * @returns {Promise<Object|null>}
   */
  async build(roomSlug, experienceType, options = {}) {
    const room = await roomService.getRoomWithContents(roomSlug);
    if (!room) return null;

    // 1. Load config (with tabs and featured IDs)
    const fullConfig = await roomExperienceConfigService.getFullConfig(room.id, experienceType);
    if (!fullConfig) return null;   // no configuration for this experience type

    const { config, tabs, featuredContentIds } = fullConfig;

    // 2. Determine content type filter from selected tab, default tab, or first active tab
    let activeTabId = options.tabId || config.default_tab_id;

    // If no tab specified and no default, pick the first active tab (by display_order)
    if (!activeTabId && tabs.length > 0) {
      activeTabId = tabs[0].id;
    }

    let contentTypeSlugs = null;
    if (activeTabId) {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab && activeTab.content_type_slug) {
        contentTypeSlugs = [activeTab.content_type_slug];
      }
    }
    // If no tab or tab has no content_type_slug, contentTypeSlugs stays null => no filter

    // 3. Fetch contents with filtering, sorting, and pagination
    const sortOrder = config.sort_order || 'newest';
    const page = options.page || 1;
    const limit = options.limit || 20;
    const searchTerm = options.search || null;

    const { items: contentItems, pagination } = await contentService.getRoomContentsByTypes(
      room.id,
      contentTypeSlugs,
      sortOrder,
      searchTerm,
      page,
      limit
    );

    // 4. Attach media to each content item
    const contentIds = contentItems.map(c => c.id);
    const mediaMap = await mediaService.getMediaMapForContents(contentIds);
    const items = contentItems.map(content => ({
      ...content,
      media: mediaMap[content.id] || [],
    }));

    // 5. Build featured items (pinned content)
    let featuredItems = [];
    if (featuredContentIds.length && config.show_featured) {
      featuredItems = await contentService.getContentsByIds(featuredContentIds);
      for (const featured of featuredItems) {
        featured.media = mediaMap[featured.id] || [];
      }
    }

    // 6. Theme & greeting (optional)
    const themes = await themeService.getAllThemes();
    const theme = themeEngine.determine({ room, themes });

    const greetingCandidates = await greetingService.getMatchingGreetings({});
    const greeting = greetingEngine.select({ candidates: greetingCandidates, context: {} });

    // 7. Assemble via engine
    return experienceEngine.assembleRoomExperience({
      room,
      experienceType,
      config,
      tabs,
      featured: featuredItems,
      items,
      theme,
      greeting,
      activeTabId,
      searchTerm: searchTerm,
      page,
      limit,
      pagination,
    });
  }

  /**
   * Map experience type to default content type slugs.
   */
  _defaultContentTypes(experienceType) {
    const mapping = {
      hear: ['audio'],
      read: ['letter', 'note', 'quote', 'story', 'journal'],
      see: ['photo'],
      memory: ['memory'],
    };
    return mapping[experienceType] || [];
  }
}

module.exports = new RoomSubExperienceService();