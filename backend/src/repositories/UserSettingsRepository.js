const BaseRepository = require('./BaseRepository');

class UserSettingsRepository extends BaseRepository {
  constructor() {
    super('user_settings');
  }

  /**
   * Find settings for a specific user.
   * Returns null if no settings row exists.
   */
  async findByUserId(userId) {
    const result = await this.query(
      `SELECT * FROM user_settings WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Upsert settings for a user (insert if not exists, update if exists).
   */
  async upsert(userId, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setColumns = columns.map((col, i) => `"${col}" = $${i + 2}`).join(', ');
    const insertCols = ['user_id', ...columns].map(c => `"${c}"`).join(', ');
    const insertPlaceholders = ['$1', ...columns.map((_, i) => `$${i + 2}`)].join(', ');

    const result = await this.query(
      `INSERT INTO user_settings (${insertCols})
       VALUES (${insertPlaceholders})
       ON CONFLICT (user_id)
       DO UPDATE SET ${setColumns}
       RETURNING *`,
      [userId, ...values]
    );
    return result.rows[0];
  }
}

module.exports = new UserSettingsRepository();