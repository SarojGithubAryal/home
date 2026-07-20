const BaseRepository = require('./BaseRepository');

class DestinationRepository extends BaseRepository {
  constructor() {
    super('destinations');
  }

  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM destinations WHERE is_active = TRUE ORDER BY display_order ASC`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await this.query(
      `SELECT * FROM destinations WHERE id = $1 AND is_active = TRUE`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new DestinationRepository();