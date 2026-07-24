const BaseRepository = require('./BaseRepository');

class StatisticsDefinitionRepository extends BaseRepository {
  constructor() {
    super('statistics_definitions');
  }

  /**
   * Fetch active definitions for an experience type, ordered by sort_order.
   */
  async findActiveByExperience(experienceType) {
    const result = await this.query(
      `SELECT * FROM statistics_definitions WHERE experience_type = $1 AND is_active = TRUE ORDER BY sort_order ASC`,
      [experienceType]
    );
    return result.rows;
  }
}

module.exports = new StatisticsDefinitionRepository();