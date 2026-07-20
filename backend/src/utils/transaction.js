const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * Execute a callback within a database transaction.
 *
 * Usage:
 *   await withTransaction(async (client) => {
 *     await client.query('INSERT INTO ...', [...]);
 *     await client.query('UPDATE ...', [...]);
 *   });
 *
 * If the callback throws, the transaction is rolled back.
 * Otherwise it is committed.
 * The client is released automatically.
 *
 * @param {Function} callback - async function receiving a connected client
 * @returns {Promise<any>} result of the callback
 */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { withTransaction };