const BaseRepository = require('./BaseRepository');

class ContentTypeRepository extends BaseRepository {
  constructor() {
    super('content_types');
  }

  /**
   * Find a content type by its slug.
   */
  async findBySlug(slug) {
    const result = await this.query(
      `SELECT * FROM content_types WHERE slug = $1`,
      [slug]
    );
    return result.rows[0] || null;
  }
}

module.exports = new ContentTypeRepository();