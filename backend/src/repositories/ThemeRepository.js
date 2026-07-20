const BaseRepository = require('./BaseRepository');

class ThemeRepository extends BaseRepository {
  constructor() {
    super('themes');
  }

  /**
   * Find a theme by its slug.
   */
  async findBySlug(slug) {
    const result = await this.query(
      `SELECT * FROM themes WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all active themes.
   */
  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM themes WHERE is_active = TRUE ORDER BY name ASC`
    );
    return result.rows;
  }

  /**
   * Find themes associated with a specific room via the room_themes junction.
   */
  async findByRoomId(roomId) {
    const result = await this.query(
      `SELECT t.* FROM themes t
       INNER JOIN room_themes rt ON rt.theme_id = t.id
       WHERE rt.room_id = $1 AND t.is_active = TRUE`,
      [roomId]
    );
    return result.rows;
  }
}

module.exports = new ThemeRepository();