const BaseRepository = require('./BaseRepository');

class RoomPageRepository extends BaseRepository {
  constructor() {
    super('room_config');
  }

  /**
   * Fetch room configuration (hero, footer).
   */
  async findConfigByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM room_config WHERE room_id = $1 AND is_active = TRUE`,
      [roomId]
    );
    return result.rows[0] || null;
  }

  /**
   * Fetch all active sections for a room, ordered by display_order.
   */
  async findSectionsByRoomId(roomId) {
    const result = await this.query(
      `SELECT * FROM room_sections WHERE room_id = $1 AND is_active = TRUE ORDER BY display_order ASC`,
      [roomId]
    );
    return result.rows;
  }

  /**
   * Fetch active items for a section, ordered by display_order.
   */
  async findItemsBySectionId(sectionId) {
    const result = await this.query(
      `SELECT * FROM room_section_items WHERE section_id = $1 AND is_active = TRUE ORDER BY display_order ASC`,
      [sectionId]
    );
    return result.rows;
  }
}

module.exports = new RoomPageRepository();