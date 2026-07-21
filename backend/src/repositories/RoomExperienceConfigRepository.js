const BaseRepository = require('./BaseRepository');

class RoomExperienceConfigRepository extends BaseRepository {
  constructor() {
    super('room_experience_config');
  }

  /**
   * Fetch the configuration for a given room and experience type.
   */
  async findByRoomIdAndType(roomId, experienceType) {
    const result = await this.query(
      `SELECT * FROM room_experience_config WHERE room_id = $1 AND experience_type = $2 AND is_active = TRUE`,
      [roomId, experienceType]
    );
    return result.rows[0] || null;
  }

  /**
   * Fetch all active tabs for a configuration, ordered by display_order.
   */
  async findTabsByConfigId(configId) {
    const result = await this.query(
      `SELECT * FROM room_experience_tabs WHERE config_id = $1 AND is_active = TRUE ORDER BY display_order ASC`,
      [configId]
    );
    return result.rows;
  }

  /**
   * Fetch active featured content IDs for a configuration, ordered by display_order.
   */
  async findFeaturedContentIdsByConfigId(configId) {
    const result = await this.query(
      `SELECT content_id FROM room_experience_featured_items WHERE config_id = $1 AND is_active = TRUE ORDER BY display_order ASC`,
      [configId]
    );
    return result.rows.map(row => row.content_id);
  }
}

module.exports = new RoomExperienceConfigRepository();