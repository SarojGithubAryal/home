const mediaRepository = require('../repositories/MediaRepository');

class MediaService {
  /**
   * Returns media objects attached to a specific content id.
   * Placeholder: currently just fetches from DB; future will resolve Dropbox/Drive URLs.
   */
  async getMediaForContent(contentId) {
    return mediaRepository.findByContentId(contentId);
  }

  /**
   * For a list of content IDs, returns a map: contentId -> media[].
   */
  async getMediaMapForContents(contentIds) {
    if (!contentIds.length) return {};

    const allMedia = await mediaRepository.findAllByContentIds(contentIds);   // we need to add this method
    const map = {};
    for (const media of allMedia) {
      if (!map[media.content_id]) map[media.content_id] = [];
      map[media.content_id].push(media);
    }
    return map;
  }
}

module.exports = new MediaService();