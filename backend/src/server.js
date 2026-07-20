const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const pool = require('./config/database');
const migrate = require('./config/migrate');

const start = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    logger.info('Database connection established');
    client.release();

    // Run migrations (idempotent)
    await migrate();

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();