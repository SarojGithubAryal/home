const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Find a user by email.
   */
  async findByEmail(email) {
    const result = await this.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all active users.
   */
  async findAllActive() {
    const result = await this.query(
      `SELECT * FROM users WHERE is_active = TRUE ORDER BY created_at DESC`
    );
    return result.rows;
  }
  /**
   * Return the first active user (single‑owner v1).
   * @returns {Promise<Object|null>}
   */
  async findFirstActiveUser() {
    const result = await this.query(
      `SELECT * FROM users WHERE is_active = TRUE ORDER BY created_at ASC LIMIT 1`
    );
    return result.rows[0] || null;
  }
}

module.exports = new UserRepository();