// migrate.js – Applies the single schema.sql file to Neon PostgreSQL (idempotent)
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL environment variable is required.');
    process.exit(1);
}

// Path to the single schema file (relative to project root)
const schemaFilePath = path.join(__dirname, '..', '..', 'database', 'schema', 'schema.sql');

(async () => {
    console.log('Checking database...');
    const client = new Client({ connectionString });
    await client.connect();
    console.log('Connected.');

    try {
        // Ensure migration history table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS migration_history (
                version VARCHAR(50) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        `);

        // Define a version for this schema (you can increment this when the schema changes)
        const currentVersion = '001_initial_schema';

        // Check if this version has already been applied
        const { rows } = await client.query(
            'SELECT 1 FROM migration_history WHERE version = $1',
            [currentVersion]
        );
        if (rows.length > 0) {
            console.log('Schema already up to date (version ' + currentVersion + ').');
        } else {
            console.log('Applying schema version ' + currentVersion + '...');
            const sql = fs.readFileSync(schemaFilePath, 'utf8');
            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query(
                    'INSERT INTO migration_history (version) VALUES ($1)',
                    [currentVersion]
                );
                await client.query('COMMIT');
                console.log('Schema applied successfully.');
            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Failed to apply schema:', err.message);
                throw err;
            }
        }

        console.log('Database is ready.');
    } finally {
        await client.end();
    }
})().catch(err => {
    console.error('Migration error:', err.message);
    process.exit(1);
});