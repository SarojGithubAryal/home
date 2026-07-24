const BaseRepository = require('./BaseRepository');

class PageHighlightRepository extends BaseRepository {
  constructor() {
    super('page_highlights');
  }

  /**
   * Fetch all active highlights for a page type (and optional room).
   * Ordered by priority desc, then random for equal priority.
   */
  async findActiveByPageType(pageType, roomSlug = null) {
    let query = `SELECT * FROM page_highlights WHERE page_type = $1 AND is_active = TRUE`;
    const params = [pageType];
    let paramIdx = 2;

    if (roomSlug) {
      query += ` AND (room_slug = $${paramIdx} OR room_slug IS NULL)`;
      params.push(roomSlug);
      paramIdx++;
    } else {
      query += ` AND room_slug IS NULL`;
    }

    query += ` ORDER BY priority DESC, RANDOM()`;
    const result = await this.query(query, params);
    return result.rows;
  }
}

module.exports = new PageHighlightRepository();