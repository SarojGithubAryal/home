const BaseRepository = require('./BaseRepository');

class MediaRepository extends BaseRepository {
  constructor() {
    super('media');
  }

  /**
   * Find all media attached to a specific content item.
   */
  async findByContentId(contentId) {
    const result = await this.query(
      `SELECT * FROM media WHERE content_id = $1 ORDER BY display_order ASC`,
      [contentId]
    );
    return result.rows;
  }

  /**
   * Find media by content and media type.
   */
  async findByContentAndType(contentId, mediaType) {
    const result = await this.query(
      `SELECT * FROM media WHERE content_id = $1 AND media_type = $2 ORDER BY display_order ASC`,
      [contentId, mediaType]
    );
    return result.rows;
  }

  /**
   * Fetch all media for a list of content IDs.
   */
  async findAllByContentIds(contentIds) {
    if (!contentIds.length) return [];
    const placeholders = contentIds.map((_, i) => `$${i + 1}`).join(', ');
    const result = await this.query(
      `SELECT * FROM media WHERE content_id IN (${placeholders}) ORDER BY display_order ASC`,
      contentIds
    );
    return result.rows;
  }
}

module.exports = new MediaRepository();