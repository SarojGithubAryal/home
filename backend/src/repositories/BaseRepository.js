const pool = require('../config/database');
const logger = require('../config/logger');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * Execute a parameterized query and return rows.
   */
  async query(text, params) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug(`Executed query on ${this.tableName}`, { duration, rows: result.rowCount });
      return result;
    } catch (err) {
      logger.error(`Query error on ${this.tableName}:`, err);
      throw err;
    }
  }

  /**
   * Find a single row by id (uuid).
   */
  async findById(id) {
    const result = await this.query(
      `SELECT * FROM "${this.tableName}" WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all rows (with optional limit and offset).
   */
  async findAll(limit = 100, offset = 0) {
    const result = await this.query(
      `SELECT * FROM "${this.tableName}" ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  /**
   * Insert a row and return the created record.
   * @param {Object} data - column-value pairs
   * @param {string} returning - columns to return (default '*')
   */
  async insert(data, returning = '*') {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const quotedColumns = columns.map(col => `"${col}"`).join(', ');

    const result = await this.query(
      `INSERT INTO "${this.tableName}" (${quotedColumns}) VALUES (${placeholders}) RETURNING ${returning}`,
      values
    );
    return result.rows[0] || null;
  }

  /**
   * Update a row by id and return the updated record.
   */
  async update(id, data, returning = '*') {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `"${col}" = $${i + 2}`).join(', ');

    const result = await this.query(
      `UPDATE "${this.tableName}" SET ${setClause} WHERE id = $1 RETURNING ${returning}`,
      [id, ...values]
    );
    return result.rows[0] || null;
  }

  /**
   * Delete a row by id. Returns the deleted record (if returning is specified).
   */
  async delete(id, returning = '*') {
    const result = await this.query(
      `DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING ${returning}`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Count rows with an optional WHERE clause.
   */
  async count(whereClause = '', params = []) {
    const result = await this.query(
      `SELECT COUNT(*) FROM "${this.tableName}" ${whereClause}`,
      params
    );
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Pagination helper: returns { rows, total, page, limit }.
   */
  async paginate({ page = 1, limit = 20, orderBy = 'created_at DESC', whereClause = '', params = [] }) {
    const offset = (page - 1) * limit;
    const countResult = await this.query(
      `SELECT COUNT(*) FROM "${this.tableName}" ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await this.query(
      `SELECT * FROM "${this.tableName}" ${whereClause} ORDER BY ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return {
      rows: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get a new database client from the pool (for transactions).
   */
  async getClient() {
    return this.pool.connect();
  }
}

module.exports = BaseRepository;