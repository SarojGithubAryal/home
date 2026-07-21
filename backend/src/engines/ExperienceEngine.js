/**
 * ExperienceEngine
 * 
 * Assembles a complete Experience object from domain objects.
 * Performs NO database queries.
 */

class ExperienceEngine {

  /**
   * Assemble a Home experience.
   */
  assembleHome({ greeting, theme, recommendation, rooms, dailyMessage, recommendedRoom, homeConfig }) {
    return {
      type: 'home',
      greeting,
      theme,
      recommendation,
      rooms,
      dailyMessage: dailyMessage || null,
      recommendedRoom: recommendedRoom || null,
      hero: {
        subtitle: homeConfig?.heroSubtitle || null,
      },
      footer: {
        text: homeConfig?.footerText || null,
        icon: homeConfig?.footerIcon || null,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Assemble a complete Room experience from generic section data.
   * The database now stores content generically; this method maps it
   * back to the stable API contract (hero, featured, actions, highlights, footer).
   */
  assembleRoom({ room, theme, greeting, recommendation, contents, roomConfig, sections }) {
    const hero = {
      title: room.name,
      subtitle: roomConfig?.hero_subtitle || null,
      backgroundAssetKey: roomConfig?.hero_background_asset_key || null,
      lastUpdatedLabel: roomConfig?.last_updated_label || null,
    };

    const footer = roomConfig ? {
      icon: roomConfig.footer_icon || null,
      decorativeAsset: roomConfig.footer_decorative_asset || null,
      text: roomConfig.footer_text || null,
    } : null;

    // Map generic sections to stable API contract
    let featured = null;
    let actions = [];
    let highlights = null;

    if (sections) {
      for (const section of sections) {
        const items = (section.items || []).map(item => ({
          title: item.title,
          subtitle: item.subtitle,
          thumbnailAssetKey: item.thumbnail_asset_key || null,
          durationLabel: item.duration_label || null,
          badgeText: item.badge_text || null,
          role: item.role,
          navigation: item.navigation_experience ? {
            experience: item.navigation_experience,
            params: item.navigation_params,
          } : null,
        }));

        switch (section.section_type) {
          case 'featured': {
            const primary = items.find(i => i.role === 'primary') || items[0];
            const secondary = items.find(i => i.role === 'secondary') || null;
            featured = {
              badgeText: primary?.badgeText || null,
              badgeIcon: section.icon_key || null,
              title: primary?.title || null,
              subtitle: primary?.subtitle || null,
              imageVariant: primary?.thumbnailAssetKey || null,
              primaryAction: primary?.navigation ? {
                navigation: primary.navigation,
              } : null,
              secondaryAction: secondary?.navigation ? {
                navigation: secondary.navigation,
              } : null,
            };
            break;
          }
          case 'actions':
            actions = items.map(item => ({
              title: item.title,
              subtitle: item.subtitle,
              icon: section.icon_key || null,
              imageVariant: item.thumbnailAssetKey || null,
              navigation: item.navigation,
            }));
            break;
          case 'highlights':
            highlights = {
              title: section.title,
              subtitle: section.subtitle,
              items: items.map(item => ({
                title: item.title,
                subtitle: item.subtitle,
                thumbnailVariant: item.thumbnailAssetKey,
                duration: item.durationLabel,
                badge: item.badgeText,
                navigation: item.navigation,
              })),
            };
            break;
          default:
            // Future section types can be added here without schema change
        }
      }
    }

    return {
      type: 'room',
      room: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        description: room.description,
        icon: room.icon,
      },
      hero,
      featured,
      actions,
      highlights,
      footer,
      greeting,
      theme,
      recommendation,
      contents,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  assembleHear({ room, theme, audioList, recommendation, capabilities }) {
    return {
      type: 'hear',
      room,
      theme,
      audioQueue: audioList,
      recommendation,
      capabilities,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  assembleRead({ room, theme, readingItems, recommendation }) {
    return {
      type: 'read',
      room,
      theme,
      readingItems,
      recommendation,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  assembleSee({ room, theme, visualItems, recommendation, capabilities }) {
    return {
      type: 'see',
      room,
      theme,
      visualItems,
      recommendation,
      capabilities,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  assembleMemory({ room, theme, timeline, recommendation, highlights }) {
    return {
      type: 'memory',
      room,
      theme,
      timeline,
      recommendation,
      highlights,
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Assemble a room sub-experience (hear, read, see, memory).
   * Determines the logical experience state so the frontend never
   * inspects array lengths.
   */
  assembleRoomExperience({
    room, experienceType, config, tabs, featured, items,
    theme, greeting, activeTabId, searchTerm, page, limit,
    pagination
  }) {
    const hasItems = Array.isArray(items) && items.length > 0;
    const hasFeatured = Array.isArray(featured) && featured.length > 0;
    const state = (hasItems || hasFeatured) ? 'POPULATED' : 'EMPTY';

    return {
      state,
      type: experienceType,
      room: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        icon: room.icon,
      },
      config: {
        title: config.title,
        subtitle: config.subtitle,
        emptyStateText: config.empty_state_text,
        backgroundAssetKey: config.background_asset_key,
        themeKey: config.theme_key,
        sortOrder: config.sort_order,
        searchEnabled: config.search_enabled,
        filterEnabled: config.filter_enabled,
        bookmarksEnabled: config.bookmarks_enabled,
        showFeatured: config.show_featured,
        showRecent: config.show_recent,
        showTabs: config.show_tabs,
      },
      tabs: (tabs || []).map(tab => ({
        id: tab.id,
        title: tab.title,
        contentTypeSlug: tab.content_type_slug,
      })),
      activeTabId: activeTabId || null,
      featured: (featured || []).map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.excerpt || item.subtitle || null,
        thumbnailAssetKey: item.metadata?.thumbnail_asset_key || null,
        badge: item.metadata?.badge || null,
        navigation: {
          experience: experienceType.toUpperCase(),
          params: { contentId: item.id },
        },
      })),
      items: (items || []).map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.excerpt || null,
        thumbnailAssetKey: item.metadata?.thumbnail_asset_key || null,
        durationLabel: item.metadata?.duration_label || null,
        badge: item.metadata?.badge || null,
        navigation: {
          experience: experienceType.toUpperCase(),
          params: { contentId: item.id },
        },
      })),
      theme,
      greeting,
      metadata: {
        generatedAt: new Date().toISOString(),
        pagination: pagination ? {
          page: pagination.page,
          pageSize: pagination.limit,
          totalItems: pagination.total,
          totalPages: pagination.totalPages,
          hasNext: pagination.page < pagination.totalPages,
          hasPrevious: pagination.page > 1,
        } : null,
        searchTerm: searchTerm || null,
      },
    };
  }
  
  /**
   * Assemble a complete Mood Landing experience.
   */
  assembleMoodLanding({ mood, greeting, theme, landingContent, rooms }) {
    return {
      type: 'mood_landing',
      hero: {
        badgeEmoji: landingContent?.badge_emoji || null,
        badgeText: landingContent?.badge_text || null,
        headline: landingContent?.headline || null,
        paragraph: landingContent?.paragraph || null,
        backgroundVariant: landingContent?.background_variant || null,
        themeOverride: landingContent?.theme_override || null,
      },
      section: landingContent ? {
        title: landingContent.section_title || null,
        subtitle: landingContent.section_subtitle || null,
      } : null,
      rooms: (rooms || []).map(room => ({
        id: room.room_id,
        title: room.title,
        subtitle: room.subtitle,
        emoji: room.emoji,
        thumbnailAssetKey: room.imageVariant,
        navigation: {
          experience: 'ROOM',
          params: { roomSlug: room.room_slug },
        },
      })),
      alternativeOption: landingContent ? {
        text: landingContent.alternative_text || null,
        icon: landingContent.alternative_icon || null,
      } : null,
      greeting,
      theme,
      mood: {
        title: mood.title,
        icon: mood.icon,
        slug: mood.slug,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Assemble a generic content detail object.
   * Common fields are always present; `detail` contains the type‑specific payload.
   */
  assembleContentDetail(content) {
    const common = {
      id: content.id,
      roomId: content.room_id,
      contentType: content.content_type ? {
        id: content.content_type.id,
        name: content.content_type.name,
        slug: content.content_type.slug,
      } : null,
      title: content.title || null,
      excerpt: content.excerpt || null,
      author: content.author || null,
      recordedAt: content.recorded_at || null,
      isFeatured: content.is_featured || false,
      metadata: content.metadata || {},
      media: content.media || [],
    };

    // Build the type‑specific detail section
    const detail = {};

    if (common.contentType) {
      switch (common.contentType.slug) {
        case 'audio':
          detail.audioUrl = (content.media && content.media.length > 0) ? content.media[0].url : null;
          detail.durationSeconds = (content.media && content.media.length > 0) ? content.media[0].duration_seconds : null;
          detail.transcript = content.body || null;
          break;
        case 'letter':
        case 'note':
        case 'quote':
        case 'story':
        case 'journal':
          detail.body = content.body || null;
          detail.readingTimeLabel = content.metadata?.duration_label || null;
          break;
        case 'photo':
          detail.images = content.media.map(m => ({
            url: m.url,
            width: m.width,
            height: m.height,
            alt: m.alt_text || '',
          }));
          break;
        case 'memory':
          detail.body = content.body || null;
          detail.timelineLabel = content.metadata?.duration_label || null;
          break;
        default:
          // For any future type, expose body as generic content
          detail.body = content.body || null;
      }
    }

    return {
      ...common,
      detail,
    };
  }
}

module.exports = new ExperienceEngine();