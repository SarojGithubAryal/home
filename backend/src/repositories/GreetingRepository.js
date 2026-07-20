const BaseRepository = require('./BaseRepository');

class GreetingRepository extends BaseRepository {
  constructor() {
    super('greetings');
  }

  /**
   * Find all active greetings, optionally filtered by time_of_day.
   */
  async findActive(timeOfDay = null) {
    let query = 'SELECT * FROM greetings WHERE is_active = TRUE';
    const params = [];
    if (timeOfDay) {
      query += ' AND (time_of_day = $1 OR time_of_day = \'any\')';
      params.push(timeOfDay);
    }
    query += ' ORDER BY created_at DESC';
    const result = await this.query(query, params);
    return result.rows;
  }

  /**
   * Find greetings matching multiple context filters.
   * All parameters are optional; nulls are ignored.
   */
  async findMatching({ timeOfDay, weatherCondition, season, moodId, language } = {}) {
    const clauses = ['is_active = TRUE'];
    const params = [];
    let paramIndex = 1;

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
    if (moodId) {
      clauses.push(`(mood_id = $${paramIndex} OR mood_id IS NULL)`);
      params.push(moodId);
      paramIndex++;
    }
    if (language) {
      clauses.push(`language = $${paramIndex}`);
      params.push(language);
      paramIndex++;
    }

    const result = await this.query(
      `SELECT * FROM greetings WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC`,
      params
    );
    return result.rows;
  }
}

module.exports = new GreetingRepository();