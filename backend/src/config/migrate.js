const fs = require('fs');
const path = require('path');
const pool = require('./database');
const logger = require('./logger');

const SCHEMA_PATH = path.resolve(__dirname, '../../../database/schema/schema.sql');

async function migrate() {
  const client = await pool.connect();
  try {
    // Ensure uuid extension exists (schema.sql also does this, but early safety)
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Add any emergency schema fixes before the main script
    await client.query(`ALTER TABLE moods ADD COLUMN IF NOT EXISTS subtitle TEXT;`);

    logger.info('Applying schema.sql...');
    const sql = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Execute the entire schema as one query
    await client.query(sql);

    logger.info('Schema is up to date.');
  } catch (err) {
    logger.error('Migration error:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = migrate;