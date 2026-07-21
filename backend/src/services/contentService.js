const contentRepository = require('../repositories/ContentRepository');
const mediaRepository = require('../repositories/MediaRepository');
const contentTypeRepository = require('../repositories/ContentTypeRepository');

class ContentService {
  /**
   * Get content items for a room, optionally filtered by content type slug.
   * (existing method – unchanged)
   */
  async getRoomContents(roomId, contentTypeSlug = null) {
    let contents;
    if (contentTypeSlug) {
      const contentType = await contentTypeRepository.findBySlug(contentTypeSlug);
      if (!contentType) return [];
      contents = await contentRepository.findByRoomAndType(roomId, contentType.id);
    } else {
      contents = await contentRepository.findByRoomId(roomId);
    }

    return Promise.all(
      contents.map(async (content) => {
        const media = await mediaRepository.findByContentId(content.id);
        return { ...content, media };
      })
    );
  }

  /**
   * Get a single content item by id with its media.
   */
  async getContentById(contentId) {
    const content = await contentRepository.findById(contentId);
    if (!content) return null;
    const media = await mediaRepository.findByContentId(content.id);
    return { ...content, media };
  }

  /**
   * Get featured content for a room (with media).
   */
  async getFeaturedContents(roomId) {
    const contents = await contentRepository.findFeaturedByRoomId(roomId);
    return Promise.all(
      contents.map(async (content) => {
        const media = await mediaRepository.findByContentId(content.id);
        return { ...content, media };
      })
    );
  }

  /**
   * NEW: Retrieve room contents filtered by multiple content type slugs,
   * with sorting, search, and pagination.
   */
  async getRoomContentsByTypes(roomId, contentTypeSlugs, sortOrder = 'newest', searchTerm = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Convert slugs to IDs if necessary
    let contentTypeIds = [];
    if (contentTypeSlugs && contentTypeSlugs.length) {
      const types = await Promise.all(contentTypeSlugs.map(slug => contentTypeRepository.findBySlug(slug)));
      contentTypeIds = types.filter(Boolean).map(t => t.id);
    }

    const { rows, total } = await contentRepository.findPaginated({
      roomId,
      contentTypeIds: contentTypeIds.length ? contentTypeIds : null,
      sortOrder,
      searchTerm,
      limit,
      offset,
    });

    // Attach media to each row
    const contentIds = rows.map(r => r.id);
    const mediaMap = {};
    if (contentIds.length) {
      const allMedia = await mediaRepository.findAllByContentIds(contentIds);
      for (const m of allMedia) {
        if (!mediaMap[m.content_id]) mediaMap[m.content_id] = [];
        mediaMap[m.content_id].push(m);
      }
    }

    const items = rows.map(content => ({
      ...content,
      media: mediaMap[content.id] || [],
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * NEW: Fetch multiple contents by their IDs (used for featured items).
   */
  async getContentsByIds(ids) {
    if (!ids.length) return [];
    const contents = await contentRepository.findByIds(ids);
    const contentIds = contents.map(c => c.id);
    const allMedia = await mediaRepository.findAllByContentIds(contentIds);
    const mediaMap = {};
    for (const m of allMedia) {
      if (!mediaMap[m.content_id]) mediaMap[m.content_id] = [];
      mediaMap[m.content_id].push(m);
    }

    return contents.map(content => ({
      ...content,
      media: mediaMap[content.id] || [],
    }));
  }
}

module.exports = new ContentService();