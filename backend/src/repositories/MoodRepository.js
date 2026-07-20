const BaseRepository = require('./BaseRepository');

class MoodRepository extends BaseRepository {
  constructor() {
    super('moods');
  }

  /**
   * Find a mood by its slug.
   */
  async findBySlug(slug) {
    const result = await this.query(
      `SELECT * FROM moods WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all active moods, ordered by display_order.
   */
  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM moods WHERE is_active = TRUE ORDER BY display_order ASC`
    );
    return result.rows;
  }

  /**
   * Find a single active mood by its UUID.
   */
  async findById(id) {
    const result = await this.query(
      `SELECT * FROM moods WHERE id = $1 AND is_active = TRUE`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new MoodRepository();