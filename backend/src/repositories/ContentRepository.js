const BaseRepository = require('./BaseRepository');

class ContentRepository extends BaseRepository {
  constructor() {
    super('contents');
  }

  /**
   * Find all contents belonging to a specific room.
   */
  async findByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId]
    );
    return result.rows;
  }

  /**
   * Find contents by room and content type.
   */
  async findByRoomAndType(roomId, contentTypeId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND content_type_id = $2 AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId, contentTypeId]
    );
    return result.rows;
  }

  /**
   * Find featured contents for a room.
   */
  async findFeaturedByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM contents WHERE room_id = $1 AND is_featured = TRUE AND is_published = TRUE ORDER BY display_order ASC`,
      [roomId]
    );
    return result.rows;
  }
}

module.exports = new ContentRepository();