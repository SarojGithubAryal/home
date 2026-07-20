const BaseRepository = require('./BaseRepository');

class RecommendationRepository extends BaseRepository {
  constructor() {
    super('recommendation_rules');
  }

  /**
   * Find all active recommendation rules, ordered by priority descending.
   */
  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM recommendation_rules WHERE is_active = TRUE ORDER BY priority DESC`
    );
    return result.rows;
  }

  /**
   * Find active rules that match a given mood (or have no mood constraint).
   */
  async findByMood(moodId) {
    const result = await this.query(
      `SELECT * FROM recommendation_rules
       WHERE is_active = TRUE
         AND (mood_id = $1 OR mood_id IS NULL)
       ORDER BY priority DESC`,
      [moodId]
    );
    return result.rows;
  }

  /**
   * Find active rules matching context: mood, content type, time of day, weather, season.
   * All filters are optional; nulls are ignored.
   */
  async findMatching({ moodId, contentTypeId, timeOfDay, weatherCondition, season } = {}) {
    const clauses = ['is_active = TRUE'];
    const params = [];
    let paramIndex = 1;

    if (moodId) {
      clauses.push(`(mood_id = $${paramIndex} OR mood_id IS NULL)`);
      params.push(moodId);
      paramIndex++;
    }
    if (contentTypeId) {
      clauses.push(`(content_type_id = $${paramIndex} OR content_type_id IS NULL)`);
      params.push(contentTypeId);
      paramIndex++;
    }
    if (timeOfDay) {
      clauses.push(`(time_of_day = $${paramIndex} OR time_of_day = 'any')`);
      params.push(timeOfDay);
      paramIndex++;
    }
    if (weatherCondition) {
      clauses.push(`(weather_condition = $${paramIndex} OR weather_condition IS NULL)`);
      params.push(weatherCondition);
      paramIndex++;
    }
    if (season) {
      clauses.push(`(season = $${paramIndex} OR season = 'any')`);
      params.push(season);
      paramIndex++;
    }

    const result = await this.query(
      `SELECT * FROM recommendation_rules WHERE ${clauses.join(' AND ')} ORDER BY priority DESC`,
      params
    );
    return result.rows;
  }
}

module.exports = new RecommendationRepository();