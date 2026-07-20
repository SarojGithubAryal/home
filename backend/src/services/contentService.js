const contentRepository = require('../repositories/ContentRepository');
const mediaRepository = require('../repositories/MediaRepository');
const contentTypeRepository = require('../repositories/ContentTypeRepository');

class ContentService {
  /**
   * Get content items for a room, optionally filtered by content type slug.
   * Each content item includes its media and content type details.
   * @param {string} roomId
   * @param {string} [contentTypeSlug] - optional filter
   * @returns {Promise<Array>}
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
   * @param {string} contentId
   * @returns {Promise<Object|null>}
   */
  async getContentById(contentId) {
    const content = await contentRepository.findById(contentId);
    if (!content) return null;
    const media = await mediaRepository.findByContentId(content.id);
    return { ...content, media };
  }

  /**
   * Get featured content for a room (with media).
   * @param {string} roomId
   * @returns {Promise<Array>}
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
}

module.exports = new ContentService();