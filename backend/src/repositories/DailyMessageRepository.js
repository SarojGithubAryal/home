const BaseRepository = require('./BaseRepository');

class DailyMessageRepository extends BaseRepository {
  constructor() {
    super('daily_messages');
  }

  /**
   * Find the message scheduled for a specific date.
   */
  async findByDate(date) {
    const result = await this.query(
      `SELECT * FROM daily_messages WHERE scheduled_date = $1 AND is_active = TRUE`,
      [date]
    );
    return result.rows[0] || null;
  }

  /**
   * Find the most recent active message (for today or fallback).
   */
  async findLatest() {
    const result = await this.query(
      `SELECT * FROM daily_messages WHERE is_active = TRUE ORDER BY scheduled_date DESC LIMIT 1`
    );
    return result.rows[0] || null;
  }
}

module.exports = new DailyMessageRepository();