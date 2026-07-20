const BaseRepository = require('./BaseRepository');

class RoomRepository extends BaseRepository {
  constructor() {
    super('rooms');
  }

  /**
   * Find a room by its slug.
   */
  async findBySlug(slug) {
    const result = await this.query(
      `SELECT * FROM rooms WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all active rooms, ordered by display_order.
   */
  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM rooms WHERE is_active = TRUE ORDER BY display_order ASC`
    );
    return result.rows;
  }
}

module.exports = new RoomRepository();